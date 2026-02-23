import eventSchema from "../validator/event.validator.js";
import { createEvent } from "../services/event.service.js";
import checkRateLimit from "../middleware/rateLimiter.js";

export const createEventController = async (req, res) => {
  try {
    const allowed = await checkRateLimit(req.userId, req.catergory);

    if (!allowed) {
      return res.status(429).json({
        error: "Rate limit exceeded. Try again later.",
      });
    }

    const data = req.body;

    const validatedData = eventSchema.parse(data);

    return createEvent(validatedData, res);
  } catch (error) {
    res.status(429).json({
      message: error.message,
    });
  }
};
