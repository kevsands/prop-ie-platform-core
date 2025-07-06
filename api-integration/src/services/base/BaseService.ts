// services/base/BaseService.ts
// Using require for maximum compatibility
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const winston = require('winston');
const { MongoClient } = require('mongodb');
const { EventEmitter } = require('events');
const { KafkaClient, Producer } = require('kafka-node');

// Define custom Error type with status
interface ServiceError extends Error {
  status?: number;
}

// Define error handler type
type ErrorHandler = (
  err: ServiceError,
  req: any,
  res: any,
  next: Function
) => void;

// ProduceRequest interface for Kafka
interface ProduceRequest {
  topic: string;
  messages: string | string[];
  key?: string;
  partition?: number;
  attributes?: number;
}

export abstract class BaseService {
  protected app: any;
  protected router: any;
  protected port: number;
  protected serviceName: string;
  protected logger: any;
  protected db: any = null;
  protected eventBus: any;
  protected kafkaProducer?: any;
  protected kafkaConsumer?: any;

  constructor(serviceName: string, port: number) {
    this.serviceName = serviceName;
    this.port = port;
    this.app = express();
    this.router = express.Router();
    this.eventBus = new EventEmitter();
    
    // Setup logger
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      defaultMeta: { service: this.serviceName },
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: `logs/${this.serviceName}-error.log`, level: 'error' }),
        new winston.transports.File({ filename: `logs/${this.serviceName}-combined.log` })
      ]
    });
    
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }
  
  private setupMiddleware(): void {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use('/api', this.router);
    
    // Request logging
    this.app.use((req: any, res: any, next: Function) => {
      this.logger.info(`${req.method} ${req.path}`);
      next();
    });
  }
  
  protected abstract setupRoutes(): void;
  
  private setupErrorHandling(): void {
    // Error handling middleware
    const errorHandler: ErrorHandler = (err: ServiceError, req: any, res: any, next: Function) => {
      this.logger.error({
        message: err.message,
        stack: err.stack,
        path: req.path
      });
      
      res.status(err.status || 500).json({
        error: {
          message: err.message || 'Internal Server Error',
          status: err.status || 500
        }
      });
    };
    
    this.app.use(errorHandler);
  }
  
  protected async connectToDatabase(): Promise<void> {
    try {
      const mongoUri = process.env.MONGODB_URI;
      const dbName = process.env.MONGODB_DB_NAME;
      
      if (!mongoUri) {
        throw new Error("MONGODB_URI environment variable is not set");
      }
      
      if (!dbName) {
        throw new Error("MONGODB_DB_NAME environment variable is not set");
      }
      
      // Use static connect method
      const client = await MongoClient.connect(mongoUri);
      this.db = client.db(dbName);
      this.logger.info('Connected to MongoDB');
    } catch (error) {
      this.logger.error('Failed to connect to MongoDB', error);
      throw error;
    }
  }
  
  protected setupKafka(): void {
    if (process.env.USE_KAFKA === 'true') {
      const kafkaHosts = process.env.KAFKA_HOSTS;
      
      if (!kafkaHosts) {
        this.logger.error('KAFKA_HOSTS environment variable is not set');
        return;
      }
      
      const client = new KafkaClient({ kafkaHost: kafkaHosts });
      
      // Setup producer
      this.kafkaProducer = new Producer(client);
      this.kafkaProducer.on('ready', () => {
        this.logger.info('Kafka producer ready');
      });
      this.kafkaProducer.on('error', (err: Error) => {
        this.logger.error('Kafka producer error', err);
      });
      
      // Setup specific consumers in child classes as needed
    }
  }
  
  protected publishEvent(topic: string, message: Record<string, any>): void {
    if (this.kafkaProducer) {
      const payloads: ProduceRequest[] = [
        { 
          topic, 
          messages: JSON.stringify({
            ...message,
            _meta: {
              timestamp: new Date().toISOString(),
              service: this.serviceName
            }
          }) 
        }
      ];
      
      this.kafkaProducer.send(payloads, (err: Error | null, data: any) => {
        if (err) {
          this.logger.error(`Failed to publish event to ${topic}`, err);
        } else {
          this.logger.debug(`Published event to ${topic}`, data);
        }
      });
    } else {
      // Fallback to local event emitter
      this.eventBus.emit(topic, message);
    }
  }
  
  public async start(): Promise<void> {
    await this.connectToDatabase();
    this.setupKafka();
    
    this.app.listen(this.port, () => {
      this.logger.info(`${this.serviceName} listening on port ${this.port}`);
    });
  }
}