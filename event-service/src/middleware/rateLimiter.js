import redisConnection from "../config/redis.connection.js";

const redis = redisConnection;

const RULES = {
  OTP: { limit: 3, window: 300 },          
  REMINDER: { limit: 10, window: 600 },    
  MARKETING: { limit: 50, window: 3600 },  
};

export default async function checkRateLimit(recipient, type) {

  const rule = RULES[type];
  if (!rule) return true;

  const key = `rate:${type}:${recipient}`;
  const now = Date.now();

  const windowStart = now - rule.window * 1000;

  
  await redis.zRemRangeByScore(key, 0, windowStart);

  const count = await redis.zCard(key);

  if (count >= rule.limit) {
    return false;
  }


  await redis.zAdd(key, [{ score: now, value: String(now) }]);


  await redis.expire(key, rule.window);

  return true;
}