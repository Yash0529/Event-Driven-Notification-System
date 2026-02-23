import deadLetterQueue from "../queue/dead.letter.queue.js";
import eventQueue from "../queue/event.queue.js";

export const replayDLQ = async (req, res) => {
  try {
    const jobs = deadLetterQueue.getJobs(["waiting", "COMPLETED", "failed"]);

    let replayed = 0;

    for (const job of jobs) {
      const data = job.data.originalJob;

      if (!data) continue;

      await eventQueue.add("process-event", data, {
        attempts: 5,
        backoff: {
          type: "exponential",
          delay: 5000,
        },
      });

      await job.remove();

      replayed++;
    }

    res.json({
      message: "DLQ replayed",
      totalReplayed: replayed,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
