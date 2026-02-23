import { Worker } from "bullmq";
import redisConnection from "../config/redis.connection.js";
import Event from "../models/event.model.js";
import deadLetterQueue from "../queue/dead.letter.queue.js";
import providerManager from "../providers/provider.manager.js";
import {renderTemplate} from '../services/template.service.js';
import channelManager from '../channels/channel.manager.js';
import metricsService from '../services/mertics.service.js'

const eventWorker = new Worker(
  "event-queue",
  async (job) => {
    const { idempotencyKey, eventId } = job.data;

    

    console.log("Processing event:", eventId, "Attempt:", job.attemptsMade + 1);

    const event = await Event.findOneAndUpdate(
      { idempotencyKey, status: "QUEUED" },
      { status: "PROCESSING" },
      { new: true },
    );

    if (!event) {
      console.log("Already processed or not in QUEUED state.");
      return;
    }

    try {

      const {subject,body}=await renderTemplate(
        event.category,
        event.payload
      );
      
      const notification = {
        to: event.userId,
        subject,
        body
      };

      const result = await channelManager.send(event.channel,notification);

      const updateResult = await Event.updateOne(
        { idempotencyKey, status: "PROCESSING" },
        {
          status: "COMPLETED",
          processedAt: new Date(),
          providerMessageId: result.messageId,
        },
      );


      if (updateResult.modifiedCount === 0) {
        console.log("Another worker already completed:", eventId);
        return;
      }

      console.log("Notification delivered:", notification);
      

    } catch (error) {

      console.log("Provider failed:", error.message);

      const isLastAttempt = job.attemptsMade + 1 >= job.opts.attempts;

      if (error.isRetryable === false) {
        console.log("Permanent failure — no retry.");

        await Event.updateOne(
          { idempotencyKey, status: "PROCESSING" },
          {
            status: "FAILED",
            failedAt: new Date(),
            failureReason: error.message,
          },
        );

        await deadLetterQueue.add("event-dlq", {
          eventId,
          idempotencyKey,
          reason: error.message,
          failedAt: new Date(),
        });

        return;
      }

      if (isLastAttempt) {
        await Event.updateOne(
          { idempotencyKey, status: "PROCESSING" },
          {
            status: "FAILED",
            failedAt: new Date(),
            failureReason: error.message,
          },
        );

        await deadLetterQueue.add("dead-event", {
          eventId,
          idempotencyKey,
          reason: error.message,
          failedAt: new Date(),
        });

        console.log("Marked permanently FAILED:", eventId);
      } else {
        await Event.updateOne(
          { idempotencyKey, status: "PROCESSING" },
          { status: "QUEUED" },
        );

        console.log("Retrying event:", eventId);
      }

      const jitter = Math.floor(Math.random() * 2000);
      await new Promise((r) => setTimeout(r, jitter));

      throw error;
    }
  },
  {
    connection: redisConnection,
    concurrency: 5,
    lockDuration: 30000,
    lockRenewTime: 20000,
    limiter: {
      max: 10,
      duration: 1000,
    }
  },
);

export default eventWorker;
