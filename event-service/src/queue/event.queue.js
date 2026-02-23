import { Queue } from 'bullmq';
import redisConnection from '../config/redis.connection.js';

const eventQueue = new Queue("event-queue", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
  },
});

export default eventQueue;