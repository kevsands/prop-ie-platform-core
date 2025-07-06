// src/lib/eventBus.ts
import { KafkaClient as KafkaNodeClient, Producer, Consumer } from 'kafka-node';
import { EventEmitter } from 'events';

/**
 * Topic configuration interface
 */
interface TopicConfiguration {
  topic: string;
  partitions: number;
  replicationFactor: number;
}

/**
 * Topic creation result interface
 */
interface TopicCreationResult {
  topics: string[];
  errors: string[];
}

/**
 * Event metadata interface
 */
interface EventMetadata {
  timestamp: string;
  service: string;
  correlationId?: string;
  userId?: string;
}

/**
 * Event payload interface
 */
interface EventPayload<T = unknown> {
  data: T;
  _meta: EventMetadata;
}

/**
 * Extended KafkaClient type with createTopics method
 */
type KafkaClient = KafkaNodeClient & {
  createTopics(
    topics: TopicConfiguration[],
    callback: (error: Error | null, result: TopicCreationResult) => void
  ): void;
};

/**
 * Event handler type
 */
type EventHandler<T = unknown> = (data: T) => void | Promise<void>;

/**
 * Event publishing options
 */
interface EventPublishOptions {
  useKafka?: boolean;
  correlationId?: string;
  userId?: string;
}

// Singleton event emitter for local events
const localEventEmitter = new EventEmitter();
localEventEmitter.setMaxListeners(50); // Increase from default 10

/**
 * All event topics with strong typing for topic names
 */
export const EventTopics = {
  // Customization events
  CUSTOMIZATION_CREATED: 'customization.created',
  CUSTOMIZATION_UPDATED: 'customization.updated',
  CUSTOMIZATION_FINALIZED: 'customization.finalized',

  // Supply chain events
  ORDER_CREATED: 'order.created',
  ORDER_UPDATED: 'order.updated',
  ORDER_FULFILLED: 'order.fulfilled',
  DELIVERY_SCHEDULED: 'delivery.scheduled',
  DELIVERY_COMPLETED: 'delivery.completed',

  // Contract events
  CONTRACT_ADDENDUM_GENERATED: 'contract.addendum.generated',
  CONTRACT_ADDENDUM_SIGNED: 'contract.addendum.signed',

  // Financial events
  PROPERTY_PRICE_UPDATED: 'property.price.updated',
  INVOICE_GENERATED: 'invoice.generated',
  PAYMENT_RECEIVED: 'payment.received',

  // Property events
  PROPERTY_CREATED: 'property.created',
  PROPERTY_UPDATED: 'property.updated',
  PROPERTY_STATUS_CHANGED: 'property.status.changed',

  // User events
  USER_PREFERENCES_UPDATED: 'user.preferences.updated'
} as const;

/**
 * Topic type derived from EventTopics
 */
export type EventTopic = typeof EventTopics[keyof typeof EventTopics];

// Kafka producer singleton
let kafkaProducer: Producer | null = null;

/**
 * Initialize Kafka producer
 */
async function initKafkaProducer(): Promise<Producer> {
  if (kafkaProducer) return kafkaProducer;

  return new Promise((resolve, reject) => {
    // Create client and cast it to our augmented type
    const client = new KafkaNodeClient({
      kafkaHost: process.env.KAFKA_HOSTS || 'localhost:9092'
    }) as unknown as KafkaClient;

    const producer = new Producer(client);

    producer.on('ready', () => {
      console.log('Kafka producer ready');
      kafkaProducer = producer;
      resolve(producer);
    });

    producer.on('error', (err: Error) => {
      console.error('Kafka producer error', err);
      reject(err);
    });
  });
}

/**
 * Publish an event to the event bus
 * 
 * @param topic - The event topic
 * @param data - The event data
 * @param options - Publishing options
 */
export async function publishEvent<T>(
  topic: EventTopic | string,
  data: T,
  options: EventPublishOptions = {}
): Promise<void> {
  // Always emit locally first
  localEventEmitter.emit(topic, data);

  // Use Kafka if enabled
  const useKafka = options.useKafka ?? (process.env.USE_KAFKA === 'true');

  if (useKafka) {
    try {
      const producer = await initKafkaProducer();

      const eventPayload: EventPayload<T> = {
        data,
        _meta: {
          timestamp: new Date().toISOString(),
          service: process.env.SERVICE_NAME || 'unknown',
          correlationId: options.correlationId,
          userId: options.userId
        }
      };

      const payloads = [
        {
          topic,
          messages: JSON.stringify(eventPayload)
        }
      ];

      return new Promise((resolve, reject) => {
        producer.send(payloads, (err: Error | undefined) => {
          if (err) {
            console.error(`Failed to publish event to ${topic}`, err);
            reject(err);
          } else {
            resolve();
          }
        });
      });
    } catch (error) {
      console.error(`Failed to publish Kafka event to ${topic}`, error);
      // Continue using local events as fallback
    }
  }
}

/**
 * Subscribe to an event
 * 
 * @param topic - The event topic
 * @param handler - The event handler function
 * @returns Unsubscribe function
 */
export function subscribeToEvent<T>(
  topic: EventTopic | string,
  handler: EventHandler<T>
): () => void {
  // Only subscribe locally - Kafka consumers are set up in services
  localEventEmitter.on(topic, handler);

  // Return unsubscribe function
  return () => {
    localEventEmitter.off(topic, handler);
  };
}

/**
 * Create all required Kafka topics (run during setup)
 */
export async function createKafkaTopics(): Promise<void> {
  if (process.env.USE_KAFKA !== 'true') return;

  // Create client and cast it to our augmented type
  const client = new KafkaNodeClient({
    kafkaHost: process.env.KAFKA_HOSTS || 'localhost:9092'
  }) as unknown as KafkaClient;

  // Create properly typed topic configurations
  const topics: TopicConfiguration[] = Object.values(EventTopics).map(topic => ({
    topic,
    partitions: 1,
    replicationFactor: 3
  }));

  return new Promise((resolve, reject) => {
    client.createTopics(topics, (err: Error | null, result: TopicCreationResult) => {
      if (err) {
        console.error('Failed to create Kafka topics', err);
        reject(err);
      } else {
        console.log('Kafka topics created successfully', result);
        resolve();
      }
    });
  });
}

/**
 * EventBus API
 */
export default {
  publishEvent,
  subscribeToEvent,
  createKafkaTopics,
  EventTopics
};

/**
 * Module augmentation to tell TypeScript about our extended kafka-node types
 */
declare module 'kafka-node' {
  interface KafkaClient {
    createTopics(
      topics: TopicConfiguration[],
      callback: (error: Error | null, result: TopicCreationResult) => void
    ): void;
  }
}