async function postTwentyInParallel() {
  const url = 'http://localhost:5000/api/v1/events';

  // We generate the promises inside the loop to ensure unique IDs
  const promises = Array.from({ length: 10 }).map((_, i) => {
    const requestBody = {
      // 1. UNIQUE KEY: Appending index so the server treats them as unique events
      "idempotencyKey": `reminder173737-batch-${i+"kdgd1kkk1dkd"}`, 
      "type": "WELCOME",
      "userId": "u1",
      "payload": { "email": `test-${i}@gmail.com` },
      "scheduleAt": "2026-02-18T13:56:28.208Z", // Ensure this is in the future!
      "priority": 1,
      "category":"OTP"
    };

    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
    .then(async (response) => {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(`Status ${response.status}: ${data.error || response.statusText}`);
      }
      return data;
    })
    .catch(error => {
      console.error(`Request ${i + 1} failed:`, error.message);
      return { error: error.message, index: i };
    });
  });

  try {
    const results = await Promise.all(promises);
    console.log('Results of all 20 parallel requests:');
    console.table(results); // Cleaner way to view parallel results
  } catch (error) {
    console.error('An unexpected fatal error occurred:', error);
  }
}

postTwentyInParallel();