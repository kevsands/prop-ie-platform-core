// services/supplychain/SupplyChainService.ts
import { BaseService } from '../base/BaseService';
import verifyServiceToken from '../../lib/auth';
import { ObjectId } from 'mongodb';
import axios, { AxiosResponse } from 'axios';
import { Request, Response, NextFunction } from 'express';
import { KafkaClient, Consumer } from 'kafka-node';

// Define interfaces for type safety
interface ServiceRequest extends Request {
  service?: any;
  headers: { [key: string]: any };
  body: any;
  query: { [key: string]: any };
}

interface SupplierItem {
  itemId: string;
  supplierId: string;
  supplierItemCode: string;
}

interface Supplier {
  _id: ObjectId;
  name: string;
  apiEndpoint?: string;
  apiKey?: string;
}

interface StockLevel {
  available: boolean;
  leadTime: number | null;
  supplier?: string;
  lastUpdated?: Date;
  assumed?: boolean;
}

interface OrderItem {
  supplierItemId: string;
  quantity: number;
  notes?: string;
  supplierItemCode?: string;
  name?: string;
  category?: string;
  room?: string;
}

interface PurchaseOrder {
  _id?: ObjectId;
  supplierId: string;
  supplierName: string;
  customizationId: string;
  propertyId: string;
  items: OrderItem[];
  status: string;
  requestedDeliveryDate: Date;
  createdAt: Date;
  updatedAt: Date;
  orderNumber: string;
  deliveryId?: ObjectId;
  supplierOrderNumber?: string;
  supplierStatus?: string;
  supplierResponse?: any;
}

interface Delivery {
  purchaseOrderIds: ObjectId[];
  status: string;
  deliveryDate: Date;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Customization {
  _id: ObjectId;
  selectedOptions: Record<string, CustomizationSelection>
  );
}

interface CustomizationSelection {
  option: {
    supplierItemId?: string;
    name: string;
    category: string;
    room: string;
  };
  quantity?: number;
}

interface PropertyAddress {
  line1: string;
  line2: string;
  city: string;
  postcode: string;
  country: string;
  attention: string;
  notes: string;
}

interface PropertyContact {
  name: string;
  phone: string;
  email: string;
}

export class SupplyChainService extends BaseService {
  constructor() {
    super('supplychain-service', parseInt(process.env.PORT || '3002'));
    this.setupKafkaConsumers();
  }

  protected setupRoutes(): void {
    // Service authentication middleware
    this.router.use(async (req: ServiceRequest, res: Response, next: NextFunction) => {
      try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
          return res.status(401).json({ error: 'Missing authentication token' });
        }

        const auth = new verifyServiceToken();
        const service = await auth.verify(token);
        if (!service) {
          return res.status(401).json({ error: 'Invalid service token' });
        }

        req.service = service;
        next();
      } catch (error) {
        next(error);
      }
    });

    // Check stock levels
    this.router.post('/stock/check', async (req: ServiceRequest, res: Response, next: NextFunction) => {
      try {
        const { items } = req.body;

        if (!Array.isArray(items) || items.length === 0) {
          return res.status(400).json({ error: 'Items array is required' });
        }

        // Query supplier APIs or database
        const stockLevels = await this.getStockLevels(items);

        res.json(stockLevels);
      } catch (error) {
        next(error);
      }
    });

    // Create purchase order
    this.router.post('/orders', async (req: ServiceRequest, res: Response, next: NextFunction) => {
      try {
        const { customizationId, propertyId, items, deliveryDate } = req.body;

        if (!customizationId || !propertyId || !Array.isArray(items) || items.length === 0) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        // Group items by supplier
        const supplierItems: Record<string, OrderItem[]> = {};
        for (const item of items as OrderItem[]) {
          if (!item.supplierItemId || !item.quantity) {
            return res.status(400).json({ error: 'Each item must have supplierItemId and quantity' });
          }

          // Get supplier info
          const supplierItem = await this.db.collection('supplierItems').findOne({
            itemId: item.supplierItemId
          }) as SupplierItem | null;

          if (!supplierItem) {
            return res.status(400).json({ error: `Supplier item not found: ${item.supplierItemId}` });
          }

          const supplierId = supplierItem.supplierId;

          if (!supplierItems[supplierId]) {
            supplierItems[supplierId] = [];
          }

          supplierItems[supplierId].push({
            ...item,
            supplierItemCode: supplierItem.supplierItemCode
          });
        }

        // Create purchase orders for each supplier
        const purchaseOrders: PurchaseOrder[] = [];

        for (const [supplierIditems] of Object.entries(supplierItems)) {
          const supplier = await this.db.collection('suppliers').findOne({
            _id: new ObjectId(supplierId)
          }) as Supplier | null;

          if (!supplier) {
            this.logger.error(`Supplier not found: ${supplierId}`);
            continue;
          }

          const purchaseOrder: PurchaseOrder = {
            supplierId,
            supplierName: supplier.name,
            customizationId,
            propertyId,
            items,
            status: 'pending',
            requestedDeliveryDate: new Date(deliveryDate),
            createdAt: new Date(),
            updatedAt: new Date(),
            orderNumber: this.generateOrderNumber(supplierId)
          };

          const result = await this.db.collection('purchaseOrders').insertOne(purchaseOrder);
          purchaseOrders.push({ ...purchaseOrder, _id: result.insertedId });

          // Send to supplier if they have an API
          if (supplier.apiEndpoint) {
            try {
              await this.sendOrderToSupplier(supplier, { ...purchaseOrder, _id: result.insertedId });
            } catch (error) {
              this.logger.error(`Failed to send order to supplier ${supplier.name}`, error);
            }
          }
        }

        // Publish event
        this.publishEvent('order.created', {
          customizationId,
          propertyId,
          purchaseOrderIds: purchaseOrders.map(po => po._id?.toString()),
          timestamp: new Date()
        });

        res.json({
          success: true,
          purchaseOrders: purchaseOrders.map(po => ({
            id: po._id,
            supplierName: po.supplierName,
            orderNumber: po.orderNumber,
            status: po.status
          }))
        });
      } catch (error) {
        next(error);
      }
    });

    // Get orders for a property/customization
    this.router.get('/orders', async (req: ServiceRequest, res: Response, next: NextFunction) => {
      try {
        const { customizationId, propertyId, status } = req.query;

        if (!customizationId && !propertyId) {
          return res.status(400).json({ error: 'Either customizationId or propertyId is required' });
        }

        const query: Record<string, any> = {};
        if (customizationId) query.customizationId = customizationId;
        if (propertyId) query.propertyId = propertyId;
        if (status) query.status = status;

        const orders = await this.db.collection('purchaseOrders')
          .find(query)
          .sort({ createdAt: -1 })
          .toArray();

        res.json(orders);
      } catch (error) {
        next(error);
      }
    });

    // Schedule delivery
    this.router.post('/deliveries', async (req: ServiceRequest, res: Response, next: NextFunction) => {
      try {
        const { purchaseOrderIds, deliveryDate, deliveryNotes } = req.body;

        if (!Array.isArray(purchaseOrderIds) || purchaseOrderIds.length === 0 || !deliveryDate) {
          return res.status(400).json({ error: 'Invalid request data' });
        }

        // Create delivery
        const delivery: Delivery = {
          purchaseOrderIds: purchaseOrderIds.map(id => new ObjectId(id)),
          status: 'scheduled',
          deliveryDate: new Date(deliveryDate),
          notes: deliveryNotes || '',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const result = await this.db.collection('deliveries').insertOne(delivery);

        // Update purchase orders
        await this.db.collection('purchaseOrders').updateMany(
          { _id: { $in: purchaseOrderIds.map(id => new ObjectId(id)) } },
          {
            $set: {
              deliveryId: result.insertedId,
              status: 'scheduled_delivery',
              updatedAt: new Date()
            }
          }
        );

        // Get property info for this delivery
        const purchaseOrder = await this.db.collection('purchaseOrders').findOne({
          _id: new ObjectId(purchaseOrderIds[0])
        }) as PurchaseOrder | null;

        if (purchaseOrder) {
          // Publish event
          this.publishEvent('delivery.scheduled', {
            deliveryId: result.insertedId.toString(),
            propertyId: purchaseOrder.propertyId,
            customizationId: purchaseOrder.customizationId,
            deliveryDate,
            timestamp: new Date()
          });
        }

        res.json({
          success: true,
          deliveryId: result.insertedId,
          deliveryDate,
          status: 'scheduled'
        });
      } catch (error) {
        next(error);
      }
    });
  }

  private async getStockLevels(items: string[]): Promise<Record<string, StockLevel>> {
    const result: Record<string, StockLevel> = {};

    // Get supplier item mappings
    const supplierItems = await this.db.collection('supplierItems')
      .find({ itemId: { $in: items } })
      .toArray() as SupplierItem[];

    // Group items by supplier
    const supplierItemMap: Record<string, { itemId: string; supplierItemCode: string }[]> = {};
    supplierItems.forEach(item => {
      if (!supplierItemMap[item.supplierId]) {
        supplierItemMap[item.supplierId] = [];
      }
      supplierItemMap[item.supplierId].push({
        itemId: item.itemId,
        supplierItemCode: item.supplierItemCode
      });
    });

    // Query each supplier
    for (const [supplierIdsupplierItems] of Object.entries(supplierItemMap)) {
      const supplier = await this.db.collection('suppliers').findOne({
        _id: new ObjectId(supplierId)
      }) as Supplier | null;

      if (!supplier) continue;

      try {
        if (supplier.apiEndpoint) {
          // Query supplier API
          const response = await axios.post(
            `${supplier.apiEndpoint}/stock`,
            {
              items: supplierItems.map(item => item.supplierItemCode)
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${supplier.apiKey}`
              },
              timeout: 5000
            }
          );

          const stockData = response.data as Record<string, { available: boolean; leadTime?: number }>
  );
          // Map supplier codes back to our item IDs
          supplierItems.forEach(item => {
            if (stockData[item.supplierItemCode]) {
              result[item.itemId] = {
                available: stockData[item.supplierItemCode].available,
                leadTime: stockData[item.supplierItemCode].leadTime || null,
                supplier: supplier.name
              };
            }
          });
        } else {
          // Use cached stock levels in our database
          const stockItems = await this.db.collection('supplierStockLevels')
            .find({
              supplierId: new ObjectId(supplierId),
              supplierItemCode: { $in: supplierItems.map(item => item.supplierItemCode) }
            })
            .toArray() as Array<{
              supplierItemCode: string;
              available: boolean;
              leadTime?: number;
              updatedAt: Date;
            }>
  );
          const stockMap: Record<string, any> = {};
          stockItems.forEach(item => {
            stockMap[item.supplierItemCode] = item;
          });

          supplierItems.forEach(item => {
            if (stockMap[item.supplierItemCode]) {
              result[item.itemId] = {
                available: stockMap[item.supplierItemCode].available,
                leadTime: stockMap[item.supplierItemCode].leadTime || null,
                supplier: supplier.name,
                lastUpdated: stockMap[item.supplierItemCode].updatedAt
              };
            }
          });
        }
      } catch (error) {
        this.logger.error(`Failed to get stock levels from supplier ${supplier.name}`, error);
      }
    }

    // For any items we couldn't get stock data for, assume they're in stock
    items.forEach(itemId => {
      if (!result[itemId]) {
        result[itemId] = {
          available: true,
          leadTime: null,
          assumed: true
        };
      }
    });

    return result;
  }

  private generateOrderNumber(supplierId: string): string {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2); // Last 2 digits of year
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');

    return `PO-${year}${month}${day}-${supplierId.slice(0)}-${random}`;
  }

  private async sendOrderToSupplier(supplier: Supplier, purchaseOrder: PurchaseOrder): Promise<void> {
    const supplierData = {
      orderNumber: purchaseOrder.orderNumber,
      requestedDeliveryDate: purchaseOrder.requestedDeliveryDate,
      items: purchaseOrder.items.map(item => ({
        itemCode: item.supplierItemCode,
        quantity: item.quantity,
        notes: item.notes || ''
      })),
      deliveryAddress: await this.getPropertyAddress(purchaseOrder.propertyId),
      contactDetails: await this.getPropertyContactDetails(purchaseOrder.propertyId)
    };

    const response = await axios.post(
      `${supplier.apiEndpoint}/orders`,
      supplierData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supplier.apiKey}`
        },
        timeout: 10000
      }
    );

    // Update with supplier response
    await this.db.collection('purchaseOrders').updateOne(
      { _id: purchaseOrder._id },
      {
        $set: {
          supplierOrderNumber: response.data.orderNumber || null,
          supplierStatus: response.data.status || 'received',
          supplierResponse: response.data,
          updatedAt: new Date()
        }
      }
    );
  }

  private async getPropertyAddress(propertyId: string): Promise<PropertyAddress> {
    // Get property address from property service
    try {
      const response = await axios.get(
        `${process.env.PROPERTY_SERVICE_URL}/api/properties/${propertyId}/address`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.SERVICE_API_KEY}`
          }
        }
      );

      return response.data as PropertyAddress;
    } catch (error) {
      this.logger.error(`Failed to get property address for ${propertyId}`, error instanceof Error ? error.message : String(error));

      // Return a placeholder if unable to get real address
      return {
        line1: "Property Development",
        line2: "",
        city: "",
        postcode: "",
        country: "",
        attention: "Site Manager",
        notes: `For property ID: ${propertyId} - REQUIRES VERIFICATION`
      };
    }
  }

  private async getPropertyContactDetails(propertyId: string): Promise<PropertyContact> {
    // Get property contact details from property service
    try {
      const response = await axios.get(
        `${process.env.PROPERTY_SERVICE_URL}/api/properties/${propertyId}/contacts`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.SERVICE_API_KEY}`
          }
        }
      );

      return response.data as PropertyContact;
    } catch (error) {
      this.logger.error(`Failed to get property contacts for ${propertyId}`, error instanceof Error ? error.message : String(error));

      // Return a placeholder
      return {
        name: "Site Manager",
        phone: process.env.DEFAULT_SITE_PHONE || "",
        email: process.env.DEFAULT_SITE_EMAIL || ""
      };
    }
  }

  private setupKafkaConsumers(): void {
    if (!process.env.USE_KAFKA || process.env.USE_KAFKA !== 'true') {
      this.logger.info('Kafka consumers disabled by configuration');
      return;
    }

    const kafkaHost = process.env.KAFKA_HOSTS;
    if (!kafkaHost) {
      this.logger.error('Kafka hosts not configured, cannot set up consumers');
      return;
    }

    try {
      const client = new KafkaClient({ kafkaHost });

      // Listen for customization finalization
      const customizationConsumer = new Consumer(
        client,
        [{ topic: 'customization.finalized', partition: 0 }],
        { autoCommit: true }
      );

      customizationConsumer.on('message', async (message: { value: any }) => {
        try {
          const data = JSON.parse(message.value as string);
          this.logger.info(`Received customization finalization for ${data.customizationId}`);

          // Get customization details
          const customization = await this.db.collection('customizations').findOne({
            _id: new ObjectId(data.customizationId)
          }) as Customization | null;

          if (!customization) {
            this.logger.error(`Customization not found for ID: ${data.customizationId}`);
            return;
          }

          // Extract items to order
          const itemsToOrder: OrderItem[] = [];

          if (customization.selectedOptions) {
            for (const [optionIdselection] of Object.entries(customization.selectedOptions)) {
              const option = selection.option;

              if (option.supplierItemId) {
                itemsToOrder.push({
                  supplierItemId: option.supplierItemId,
                  quantity: selection.quantity || 1,
                  name: option.name,
                  category: option.category,
                  room: option.room
                });
              }
            }
          }

          if (itemsToOrder.length === 0) {
            this.logger.info(`No items to order for customization ${data.customizationId}`);
            return;
          }

          // Create purchase orders
          try {
            // Use our own API to create the orders
            await axios.post(
              `${process.env.INTERNAL_API_URL}/api/orders`,
              {
                customizationId: data.customizationId,
                propertyId: data.propertyId,
                items: itemsToOrder,
                // Set delivery date 2 weeks before expected completion
                deliveryDate: await this.calculateDeliveryDate(data.propertyId)
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${process.env.SERVICE_API_KEY}`
                }
              }
            );

            this.logger.info(`Created purchase orders for customization ${data.customizationId}`);
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.logger.error(`Failed to create purchase orders for customization ${data.customizationId}`, errorMessage);

            // Add to retry queue
            await this.db.collection('orderRetryQueue').insertOne({
              customizationId: data.customizationId,
              propertyId: data.propertyId,
              items: itemsToOrder,
              attempts: 1,
              lastAttempt: new Date(),
              error: errorMessage,
              createdAt: new Date()
            });
          }
        } catch (error) {
          this.logger.error('Error processing customization finalization message', error instanceof Error ? error.message : String(error));
        }
      });

      customizationConsumer.on('error', (err: Error) => {
        this.logger.error('Customization consumer error', err.message);
      });

      this.logger.info('Kafka consumers set up successfully');
    } catch (error) {
      this.logger.error('Failed to set up Kafka consumers', error instanceof Error ? error.message : String(error));
    }
  }

  private async calculateDeliveryDate(propertyId: string): Promise<Date> {
    try {
      // Get property completion date from property service
      const response = await axios.get(
        `${process.env.PROPERTY_SERVICE_URL}/api/properties/${propertyId}`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.SERVICE_API_KEY}`
          }
        }
      );

      if (response.data.estimatedCompletionDate) {
        const completionDate = new Date(response.data.estimatedCompletionDate);
        // Set delivery date 2 weeks before completion
        completionDate.setDate(completionDate.getDate() - 14);
        return completionDate;
      }
    } catch (error) {
      this.logger.error(`Failed to get property completion date for ${propertyId}`, error instanceof Error ? error.message : String(error));
    }

    // Default to 3 months from now if unable to get actual date
    const defaultDate = new Date();
    defaultDate.setMonth(defaultDate.getMonth() + 3);
    return defaultDate;
  }
}