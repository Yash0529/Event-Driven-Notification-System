import {Queue} from 'bullmq';
import redisConnection from '../config/redis.connection.js'

const deadLetterQueue=new Queue("event-dlq",{connection:redisConnection});

export default deadLetterQueue;