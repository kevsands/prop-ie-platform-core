// MongoDB Schema

// Customization Options Collection
db.createCollection("customizationOptions", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["id", "name", "price", "category", "room", "active"],
        properties: {
          id: {
            bsonType: "string",
            description: "Unique identifier for the option"
          },
          name: {
            bsonType: "string",
            description: "Name of the customization option"
          },
          price: {
            bsonType: "number",
            description: "Price of the option"
          },
          unit: {
            bsonType: "string",
            description: "Unit of measurement (e.g., 'per sqm', 'package')"
          },
          category: {
            bsonType: "string",
            description: "Category of the option (e.g., 'flooring', 'paint')"
          },
          room: {
            bsonType: "string",
            description: "Room this option applies to"
          },
          image: {
            bsonType: "string",
            description: "Path to the option image"
          },
          modelPath: {
            bsonType: "string",
            description: "Path to 3D model for visualization"
          },
          materialPath: {
            bsonType: "string",
            description: "Path to material texture for 3D visualization"
          },
          supplierItemId: {
            bsonType: "string",
            description: "Reference to supplier item ID"
          },
          active: {
            bsonType: "bool",
            description: "Whether this option is active and available"
          },
          displayOrder: {
            bsonType: "int",
            description: "Order in which to display the option"
          },
          customData: {
            bsonType: "object",
            description: "Additional custom data for this option"
          },
          applicablePropertyTypes: {
            bsonType: "array",
            description: "Property types this option applies to",
            items: {
              bsonType: "string"
            }
          },
          createdAt: {
            bsonType: "date",
            description: "Timestamp when the option was created"
          },
          updatedAt: {
            bsonType: "date",
            description: "Timestamp when the option was last updated"
          }
        }
      }
    }
  });
  
  // Customizations Collection
  db.createCollection("customizations", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["userId", "propertyId", "selectedOptions", "totalCost", "status"],
        properties: {
          userId: {
            bsonType: "string",
            description: "ID of the user who created this customization"
          },
          propertyId: {
            bsonType: "string",
            description: "ID of the property being customized"
          },
          customizationId: {
            bsonType: "string",
            description: "Custom identifier for the customization"
          },
          selectedOptions: {
            bsonType: "object",
            description: "Selected customization options"
          },
          totalCost: {
            bsonType: "number",
            description: "Total cost of all selected options"
          },
          status: {
            bsonType: "string",
            description: "Status of the customization (draft, finalized, etc.)"
          },
          version: {
            bsonType: "int",
            description: "Version number of the customization"
          },
          lastSaved: {
            bsonType: "date",
            description: "Timestamp when the customization was last saved"
          },
          userPreferences: {
            bsonType: "object",
            description: "User preferences for customization"
          },
          createdAt: {
            bsonType: "date",
            description: "Timestamp when the customization was created"
          },
          updatedAt: {
            bsonType: "date",
            description: "Timestamp when the customization was last updated"
          }
        }
      }
    }
  });
  
  // Purchase Orders Collection
  db.createCollection("purchaseOrders", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["supplierId", "customizationId", "propertyId", "items", "status"],
        properties: {
          supplierId: {
            bsonType: "string",
            description: "ID of the supplier"
          },
          supplierName: {
            bsonType: "string",
            description: "Name of the supplier"
          },
          customizationId: {
            bsonType: "string",
            description: "ID of the customization this order is for"
          },
          propertyId: {
            bsonType: "string",
            description: "ID of the property this order is for"
          },
          orderNumber: {
            bsonType: "string",
            description: "Purchase order number"
          },
          supplierOrderNumber: {
            bsonType: "string",
            description: "Order number in supplier's system"
          },
          items: {
            bsonType: "array",
            description: "Items in the purchase order",
            items: {
              bsonType: "object",
              required: ["supplierItemId", "quantity"],
              properties: {
                supplierItemId: {
                  bsonType: "string",
                  description: "ID of the supplier item"
                },
                supplierItemCode: {
                  bsonType: "string",
                  description: "Supplier's item code"
                },
                quantity: {
                  bsonType: "int",
                  description: "Quantity of the item"
                },
                name: {
                  bsonType: "string",
                  description: "Name of the item"
                },
                notes: {
                  bsonType: "string",
                  description: "Additional notes for this item"
                }
              }
            }
          },
          status: {
            bsonType: "string",
            description: "Status of the purchase order"
          },
          supplierStatus: {
            bsonType: "string",
            description: "Status reported by the supplier"
          },
          requestedDeliveryDate: {
            bsonType: "date",
            description: "Requested delivery date"
          },
          estimatedDeliveryDate: {
            bsonType: "date",
            description: "Estimated delivery date provided by supplier"
          },
          deliveryId: {
            bsonType: "objectId",
            description: "ID of the associated delivery"
          },
          supplierResponse: {
            bsonType: "object",
            description: "Raw response from supplier API"
          },
          createdAt: {
            bsonType: "date",
            description: "Timestamp when the order was created"
          },
          updatedAt: {
            bsonType: "date",
            description: "Timestamp when the order was last updated"
          }
        }
      }
    }
  });
  
  // Suppliers Collection
  db.createCollection("suppliers", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["name", "status"],
        properties: {
          name: {
            bsonType: "string",
            description: "Name of the supplier"
          },
          contactName: {
            bsonType: "string",
            description: "Name of the contact person"
          },
          email: {
            bsonType: "string",
            description: "Email of the supplier"
          },
          phone: {
            bsonType: "string",
            description: "Phone number of the supplier"
          },
          address: {
            bsonType: "object",
            description: "Address of the supplier"
          },
          apiEndpoint: {
            bsonType: "string",
            description: "API endpoint for the supplier's system"
          },
          apiKey: {
            bsonType: "string",
            description: "API key for the supplier's system"
          },
          status: {
            bsonType: "string",
            description: "Status of the supplier (active, inactive)"
          },
          categories: {
            bsonType: "array",
            description: "Categories of products supplied",
            items: {
              bsonType: "string"
            }
          },
          leadTime: {
            bsonType: "int",
            description: "Default lead time in days"
          },
          createdAt: {
            bsonType: "date",
            description: "Timestamp when the supplier was created"
          },
          updatedAt: {
            bsonType: "date",
            description: "Timestamp when the supplier was last updated"
          }
        }
      }
    }
  });
  
  // Supplier Items Collection
  db.createCollection("supplierItems", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["supplierId", "itemId", "supplierItemCode"],
        properties: {
          supplierId: {
            bsonType: "objectId",
            description: "ID of the supplier"
          },
          itemId: {
            bsonType: "string",
            description: "ID of the customization option"
          },
          supplierItemCode: {
            bsonType: "string",
            description: "Supplier's item code"
          },
          description: {
            bsonType: "string",
            description: "Description of the item"
          },
          unitPrice: {
            bsonType: "number",
            description: "Unit price from supplier"
          },
          minOrderQuantity: {
            bsonType: "int",
            description: "Minimum order quantity"
          },
          leadTime: {
            bsonType: "int",
            description: "Lead time in days"
          },
          active: {
            bsonType: "bool",
            description: "Whether this item is active"
          },
          createdAt: {
            bsonType: "date",
            description: "Timestamp when the item was created"
          },
          updatedAt: {
            bsonType: "date",
            description: "Timestamp when the item was last updated"
          }
        }
      }
    }
  });
  
  // Contract Addendums Collection
  db.createCollection("contractAddendums", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["customizationId", "propertyId", "userId", "selections", "totalCost", "status"],
        properties: {
          customizationId: {
            bsonType: "string",
            description: "ID of the customization"
          },
          propertyId: {
            bsonType: "string",
            description: "ID of the property"
          },
          userId: {
            bsonType: "string",
            description: "ID of the user"
          },
          selections: {
            bsonType: "object",
            description: "Selected customization options"
          },
          totalCost: {
            bsonType: "number",
            description: "Total cost of all selected options"
          },
          status: {
            bsonType: "string",
            description: "Status of the addendum (draft, generated, signed, etc.)"
          },
          documentPath: {
            bsonType: "string",
            description: "Path to the generated document"
          },
          finalDocumentPath: {
            bsonType: "string",
            description: "Path to the finalized document with signatures"
          },
          signatures: {
            bsonType: "array",
            description: "Signatures on the addendum",
            items: {
              bsonType: "object",
              properties: {
                signature: {
                  bsonType: "string",
                  description: "Signature data"
                },
                signedBy: {
                  bsonType: "string",
                  description: "Name of the person who signed"
                },
                signatureType: {
                  bsonType: "string",
                  description: "Type of signature (buyer, developer)"
                },
                timestamp: {
                  bsonType: "date",
                  description: "Timestamp when the signature was added"
                }
              }
            }
          },
          property: {
            bsonType: "object",
            description: "Property details at time of addendum creation"
          },
          user: {
            bsonType: "object",
            description: "User details at time of addendum creation"
          },
          createdAt: {
            bsonType: "date",
            description: "Timestamp when the addendum was created"
          },
          updatedAt: {
            bsonType: "date",
            description: "Timestamp when the addendum was last updated"
          }
        }
      }
    }
  });
  
  // Deliveries Collection
  db.createCollection("deliveries", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["purchaseOrderIds", "status", "deliveryDate"],
        properties: {
          purchaseOrderIds: {
            bsonType: "array",
            description: "IDs of the purchase orders in this delivery",
            items: {
              bsonType: "objectId"
            }
          },
          status: {
            bsonType: "string",
            description: "Status of the delivery"
          },
          deliveryDate: {
            bsonType: "date",
            description: "Scheduled delivery date"
          },
          actualDeliveryDate: {
            bsonType: "date",
            description: "Actual delivery date"
          },
          carrier: {
            bsonType: "string",
            description: "Delivery carrier"
          },
          trackingNumber: {
            bsonType: "string",
            description: "Tracking number"
          },
          notes: {
            bsonType: "string",
            description: "Delivery notes"
          },
          receivedBy: {
            bsonType: "string",
            description: "Person who received the delivery"
          },
          createdAt: {
            bsonType: "date",
            description: "Timestamp when the delivery was created"
          },
          updatedAt: {
            bsonType: "date",
            description: "Timestamp when the delivery was last updated"
          }
        }
      }
    }
  });
  
  // Create indexes for performance
  db.customizationOptions.createIndex({ room: 1, category: 1, active: 1 });
  db.customizationOptions.createIndex({ applicablePropertyTypes: 1 });
  db.customizationOptions.createIndex({ supplierItemId: 1 });
  
  db.customizations.createIndex({ userId: 1 });
  db.customizations.createIndex({ propertyId: 1 });
  db.customizations.createIndex({ customizationId: 1 }, { unique: true, sparse: true });
  db.customizations.createIndex({ status: 1 });
  db.customizations.createIndex({ updatedAt: -1 });
  
  db.purchaseOrders.createIndex({ customizationId: 1 });
  db.purchaseOrders.createIndex({ propertyId: 1 });
  db.purchaseOrders.createIndex({ supplierId: 1 });
  db.purchaseOrders.createIndex({ orderNumber: 1 }, { unique: true });
  db.purchaseOrders.createIndex({ status: 1 });
  
  db.contractAddendums.createIndex({ customizationId: 1 });
  db.contractAddendums.createIndex({ propertyId: 1 });
  db.contractAddendums.createIndex({ userId: 1 });
  db.contractAddendums.createIndex({ status: 1 });
  
  db.deliveries.createIndex({ purchaseOrderIds: 1 });
  db.deliveries.createIndex({ deliveryDate: 1 });
  db.deliveries.createIndex({ status: 1 });