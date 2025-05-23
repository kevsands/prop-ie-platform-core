// services/customization/CustomizationService.ts
import { BaseService } from '../base/BaseService';
import verifyAuth from '../../lib/auth';
import { ObjectId } from 'mongodb';
import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../types/express';
import { KafkaClient, Consumer } from 'kafka-node';
// Define missing types
import { CustomizationOption as BaseCustomizationOption } from '../../types/customization';

// Extended version of CustomizationOption with additional properties
interface CustomizationOption extends BaseCustomizationOption {
  supplierItemId?: string;
  inStock?: boolean;
  leadTime?: number;
}

// Define missing interfaces
interface KafkaMessage {
  topic: string;
  value: string | Buffer;
  offset?: number;
  partition?: number;
  highWaterOffset?: number;
  key?: string;
}

interface CustomizationData extends Record<string, any> {
  customizationId?: string;
  propertyId: string;
  userId: string;
  selectedOptions?: Record<string, any>;
  totalCost?: number;
  status?: string;
  version?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface StockData {
  [supplierItemId: string]: {
    available: boolean;
    leadTime: number;
  };
}

interface CustomizationEventData {
  userId: string;
  customizationId: string | object;
  propertyId: string;
  status?: string;
  totalCost?: number;
  contractAddendumId?: string;
  timestamp: Date;
}

interface PropertyUpdateEvent {
  propertyId: string;
  status: string;
  updatedBy?: string;
  timestamp?: Date;
}

export class CustomizationService extends BaseService {
  constructor() {
    super('customization-service', parseInt(process.env.PORT || '3001'));
    this.setupKafkaConsumers();
  }

  protected setupRoutes(): void {
    // Authentication middleware
    this.router.use(async (req: Request, res: Response, next: NextFunction) => {
      try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
          return res.status(401).json({ error: 'Missing authentication token' });
        }

        const user = await new verifyAuth({ headers: new Headers({ 'Authorization': `Bearer ${token}` }) } as any);
        if (!user) {
          return res.status(401).json({ error: 'Invalid authentication token' });
        }

        // Ensure user object has the required properties including role
        (req as AuthenticatedRequest).user = {
          id: user.id || '',
          email: user.email || '',
          role: user.role || 'user' // Default role if not present
        } as {
          id: string;
          email: string;
          role: string;
        };
        next();
      } catch (error) {
        next(error);
      }
    });

    // Get all customizations for a user
    this.router.get('/customizations', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        const { propertyId, status } = req.query;

        const query: Record<string, any> = { userId: req.user?.id };
        if (propertyId) query.propertyId = propertyId;
        if (status) query.status = status;

        const customizations = await this.db.collection('customizations')
          .find(query)
          .sort({ updatedAt: -1 })
          .toArray();

        res.json(customizations);
      } catch (error) {
        next(error);
      }
    });

    // Get customization by id
    this.router.get('/customizations/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        const { id } = req.params;

        let customizationId;
        try {
          customizationId = new ObjectId(id);
        } catch (e) {
          customizationId = id;
        }

        const customization = await this.db.collection('customizations').findOne({
          $or: [
            { _id: customizationId },
            { customizationId: id }
          ],
          userId: req.user?.id
        });

        if (!customization) {
          return res.status(404).json({ error: 'Customization not found' });
        }

        res.json(customization);
      } catch (error) {
        next(error);
      }
    });

    // Create/update customization
    this.router.post('/customizations', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        const customizationData: Partial<CustomizationData> = req.body;

        // Validate basic data
        if (!customizationData.propertyId) {
          return res.status(400).json({ error: 'Property ID is required' });
        }

        // Add metadata
        const enrichedData: CustomizationData = {
          ...customizationData as CustomizationData,
          userId: req.user?.id || '',
          propertyId: customizationData.propertyId || '',
          createdAt: new Date(),
          updatedAt: new Date(),
          status: customizationData.status || 'draft',
        };

        // Check if this is an update to existing customization
        let result;
        if (customizationData.customizationId) {
          result = await this.db.collection('customizations').updateOne(
            { customizationId: customizationData.customizationId, userId: req.user?.id },
            {
              $set: {
                ...enrichedData,
                updatedAt: new Date()
              },
              $inc: { version: 1 }
            }
          );

          if (result.matchedCount === 0) {
            // If no match, create new document
            result = await this.db.collection('customizations').insertOne(enrichedData);
          }
        } else {
          // New customization
          enrichedData.version = 1;
          result = await this.db.collection('customizations').insertOne(enrichedData);
        }

        // Publish event
        this.publishEvent('customization.updated', {
          userId: req.user?.id || '',
          customizationId: customizationData.customizationId || result.insertedId,
          propertyId: customizationData.propertyId || '',
          status: enrichedData.status,
          totalCost: customizationData.totalCost,
          timestamp: new Date()
        } as CustomizationEventData);

        res.json({
          success: true,
          customizationId: result.insertedId || customizationData.customizationId
        });
      } catch (error) {
        next(error);
      }
    });

    // Finalize customization (submit for processing)
    this.router.post('/customizations/:id/finalize', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        const { id } = req.params;

        let customizationId;
        try {
          customizationId = new ObjectId(id);
        } catch (e) {
          customizationId = id;
        }

        // Get the customization
        const customization = await this.db.collection('customizations').findOne({
          $or: [
            { _id: customizationId },
            { customizationId: id }
          ],
          userId: req.user?.id
        });

        if (!customization) {
          return res.status(404).json({ error: 'Customization not found' });
        }

        // Validate customization is complete
        if (Object.keys(customization.selectedOptions || {}).length === 0) {
          return res.status(400).json({ error: 'Customization must include at least one selection' });
        }

        // Update status
        const result = await this.db.collection('customizations').updateOne(
          { _id: customization._id },
          {
            $set: {
              status: 'finalized',
              finalizedAt: new Date(),
              updatedAt: new Date()
            },
            $inc: { version: 1 }
          }
        );

        // Generate contract addendum
        try {
          const contractData: Record<string, any> = {
            customizationId: customization._id.toString(),
            propertyId: customization.propertyId,
            userId: customization.userId,
            selections: customization.selectedOptions,
            totalCost: customization.totalCost
          };

          const contractResponse = await axios.post(
            `${process.env.CONTRACT_SERVICE_URL}/api/contracts/addendum`,
            contractData,
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.SERVICE_API_KEY}`
              }
            }
          );

          // Publish finalization event
          this.publishEvent('customization.finalized', {
            customizationId: customization._id.toString(),
            propertyId: customization.propertyId,
            userId: customization.userId,
            totalCost: customization.totalCost,
            contractAddendumId: contractResponse.data.addendumId,
            timestamp: new Date()
          } as CustomizationEventData);
        } catch (error) {
          this.logger.error('Failed to generate contract addendum', error);
          // Continue anyway - we'll handle this through the event system retry logic
        }

        res.json({
          success: true,
          status: 'finalized'
        });
      } catch (error) {
        next(error);
      }
    });

    // Get customization options
    this.router.get('/options', async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { room, category, propertyId } = req.query;

        // Build query
        const query: Record<string, any> = { active: true };
        if (room) query.room = room;
        if (category) query.category = category;

        // Get property type if propertyId is provided
        if (propertyId) {
          const property = await this.db.collection('properties').findOne({ _id: new ObjectId(propertyId as string) });
          if (property && property.type) {
            query.applicablePropertyTypes = property.type;
          }
        }

        // Fetch options
        const options: CustomizationOption[] = await this.db.collection('customizationOptions')
          .find(query)
          .sort({ displayOrder: 1 })
          .toArray();

        // Check stock levels if configured
        if (options.length > 0 && process.env.CHECK_STOCK_LEVELS === 'true') {
          try {
            // Get supplier item IDs that have them
            const supplierItemIds = options
              .filter((opt: CustomizationOption) => !!opt.supplierItemId)
              .map((opt: CustomizationOption) => opt.supplierItemId as string);

            if (supplierItemIds.length > 0) {
              // Call supplier service
              const stockResponse = await axios.post(
                `${process.env.SUPPLIER_SERVICE_URL}/api/stock/check`,
                { items: supplierItemIds },
                {
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.SERVICE_API_KEY}`
                  }
                }
              );

              const stockData: StockData = stockResponse.data;

              // Update options with stock info
              options.forEach((option: CustomizationOption) => {
                if (option.supplierItemId && stockData[option.supplierItemId]) {
                  option.inStock = stockData[option.supplierItemId].available;
                  option.leadTime = stockData[option.supplierItemId].leadTime;
                }
              });
            }
          } catch (error) {
            this.logger.error('Failed to get stock levels', error);
            // Continue without stock data
          }
        }

        res.json(options);
      } catch (error) {
        next(error);
      }
    });
  }

  private setupKafkaConsumers(): void {
    if (!process.env.USE_KAFKA || process.env.USE_KAFKA !== 'true') {
      return;
    }

    const client = new KafkaClient({ kafkaHost: process.env.KAFKA_HOSTS });

    // Listen for property updates
    const propertyConsumer = new Consumer(
      client,
      [{ topic: 'property.updated', partition: 0 }],
      { autoCommit: true }
    );

    propertyConsumer.on('message', async (message: KafkaMessage) => {
      try {
        const data: PropertyUpdateEvent = JSON.parse(message.value as string);
        this.logger.info(`Received property update for ${data.propertyId}`);

        // Handle property updates that might affect customizations
        if (data.status === 'sold' || data.status === 'reserved') {
          // Lock associated customizations
          await this.db.collection('customizations').updateMany(
            { propertyId: data.propertyId, status: { $nin: ['finalized', 'cancelled'] } },
            {
              $set: {
                status: 'locked',
                lockedReason: `Property status changed to ${data.status}`,
                updatedAt: new Date()
              }
            }
          );
        }

        // More handling of property events...
      } catch (error) {
        this.logger.error('Error processing property update message', error);
      }
    });

    propertyConsumer.on('error', (err: Error) => {
      this.logger.error('Property consumer error', err);
    });
  }
}