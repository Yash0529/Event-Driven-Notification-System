import { Worker } from 'bullmq';
import redisConnection from '../config/redis.connection.js';
import Event from '../models/event.model.js';


const deadLetterWorker = new Worker(
  "event-dlq",
  async (job) => {
    console.log("DLQ received job:", job.data.idempotencyKey);

    // DLQ jobs are NOT auto-retried
    await Event.updateOne(
      { idempotencyKey: job.data.idempotencyKey },
      {
        status: "FAILED",
        inDLQ: true,
        dlqAt: new Date(),
      }
    );

    console.log("Event marked as FAILED and parked in DLQ");
  },
  { connection: redisConnection }
);



export default deadLetterWorker;