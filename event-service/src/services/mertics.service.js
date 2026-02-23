class MetricsService {
  constructor() {
    this.totalEvents = 0;
    this.successEvents = 0;
    this.failedEvents = 0;
    this.startTime = Date.now();
  }

  incrementTotal() {
    this.totalEvents++;
  }

  incrementSuccess() {
    this.successEvents++;
  }

  incrementFailure() {
    this.failedEvents++;
  }

  getStats() {
    const uptimeSeconds = (Date.now() - this.startTime) / 1000;

    return {
      totalEvents: this.totalEvents,
      successEvents: this.successEvents,
      failedEvents: this.failedEvents,
      successRate:
        this.totalEvents === 0
          ? 0
          : ((this.successEvents / this.totalEvents) * 100).toFixed(2),
      eventsPerSecond:
        this.totalEvents === 0
          ? 0
          : (this.totalEvents / uptimeSeconds).toFixed(2),
      uptimeSeconds: uptimeSeconds.toFixed(2)
    };
  }
}

export default new MetricsService();