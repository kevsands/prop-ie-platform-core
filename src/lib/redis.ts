import { Redis } from 'ioredis';

let redis: Redis | null = null;

if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL);

  redis.on('error', (err: any) => {

  });

  redis.on('connect', () => {

  });
}

export { redis };