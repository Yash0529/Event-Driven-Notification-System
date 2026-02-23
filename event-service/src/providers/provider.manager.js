import MockProvider from "./mock.provider.js";
import SecondaryProvider from "./secondary.provider.js";
import providerHealth from "./provider.health.js";

class ProviderManager {
  constructor() {
    this.providers = [
      new MockProvider(),
      new SecondaryProvider(),
    ];
  }

  async send(notification) {
    let lastError = null;

    for (const provider of this.providers) {

      if (!providerHealth.isAvailable(provider.name)) {
        console.log(`Skipping ${provider.name} (circuit open)`);
        continue;
      }

      try {
        const result = await provider.send(notification);

        providerHealth.recordSuccess(provider.name);
        return result;

      } catch (err) {
        lastError = err;

        providerHealth.recordFailure(provider.name);

        console.log(`Provider ${provider.name} failed:`, err.message);

        if (err.isRetryable === false) {
          throw err;
        }
      }
    }

    throw lastError || new Error("All providers unavailable");
  }
}

export default new ProviderManager();