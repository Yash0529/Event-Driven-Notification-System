import { v4 as uuidv4 } from "uuid";
import Event from "../models/event.model.js";
import eventQueue from "../queue/event.queue.js";

const MAX_QUEUE_SIZE = 5000;

export const createEvent = async (data, res) => {


  try {
    const {
      idempotencyKey,
      type,
      userId,
      payload,
      scheduledFor: rawScheduledFor, 
      priority,
      ttlSeconds,
      category,
      channel
    } = data;


    const waiting = await eventQueue.getWaitingCount();
    const delayed = await eventQueue.getDelayedCount();
    const totalLoad = waiting + delayed;

    if (totalLoad > MAX_QUEUE_SIZE) {
      return res.status(503).json({ error: "System busy. Please retry later" });
    }

    const existing = await Event.findOne({ idempotencyKey });
    if (existing) {
      return res.status(200).json({
        message: "Duplicate request ignored",
        eventId: existing.eventId,
        status: existing.status
      });
    }

    let delay = 0;
    let scheduledDate = null;
    
    if (rawScheduledFor) {
      scheduledDate = new Date(rawScheduledFor);
      
      if (!isNaN(scheduledDate.getTime())) {
        delay = Math.max(scheduledDate.getTime() - Date.now(), 0);
      }
    }

    let expiresAt = ttlSeconds 
      ? new Date(Date.now() + ttlSeconds * 1000) 
      : null;

    const eventId = uuidv4();

    const event = await Event.create({
      eventId,
      idempotencyKey,
      type,
      userId,
      payload,
      priority: priority || 5,
      scheduledFor: scheduledDate,
      expiresAt,
      category,
      channel:channel || "EMAIL"
    });

   

    return res.status(201).json({
      message: delay > 0 ? "Event scheduled" : "Event accepted",
      eventId: event.eventId,
      delay,
      scheduledFor: scheduledDate
    });

  } catch (err) {
    console.error("Create Event Error:", err);
    return res.status(500).json({ error: "Failed to create event" });
  }
};