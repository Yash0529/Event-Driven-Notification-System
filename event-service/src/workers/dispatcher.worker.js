import Event from "../models/event.model.js";
import eventQueue from "../queue/event.queue.js";
import PRIORITY from "../config/priorities.js";

const BATCH_SIZE = 50;

const dispatch = async () => {
  try {
    // 1. ATOMIC CLAIM: Find and update status to QUEUED in one go
    // This prevents the "Double Dispatch" race condition
    const events = await Event.find({ status: "RECEIVED" })
      .sort({ createdAt: 1 })
      .limit(BATCH_SIZE);

    if (events.length === 0) return;

    // Optional: Mark them all as QUEUED immediately to stop other dispatchers
    const eventIds = events.map(e => e._id);
    await Event.updateMany(
      { _id: { $in: eventIds } },
      { status: "QUEUED" }
    );

    for (const event of events) {
      await eventQueue.add(
        "process-event",
        {
          eventId: event.eventId,
          idempotencyKey: event.idempotencyKey,
          type: event.type,
          userId: event.userId,
          payload: event.payload,
          category:event.category,
          channel:event.channel
        },
        {
          jobId: event.idempotencyKey,
          priority: PRIORITY[event.category] || 5,
          attempts: 5,
          delay: event.scheduledFor ? Math.max(0, new Date(event.scheduledFor) - Date.now()) : 0,
          backoff: { type: "exponential", delay: 5000 },
          removeOnComplete: true,
          removeOnFail: false
        }
      );
    }

    console.log(`Dispatched ${events.length} events`);
  } catch (error) {
    console.error("Dispatch Error:", error);
  } finally {
    // 2. RECURSIVE TIMEOUT: Wait 1s AFTER finishing to start again
    setTimeout(dispatch, 1000);
  }
};

// Start the first one
dispatch();