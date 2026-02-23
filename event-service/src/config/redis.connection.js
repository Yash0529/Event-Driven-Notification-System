import IORedis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();


const redisConnection=new IORedis(process.env.REDIS_URL,
    {
        maxRetriesPerRequest:null
    }
);


redisConnection.on("connect",()=>{
    console.log("Redis connected successfully");
})


redisConnection.on("error",(error)=>{
    console.error("Redis connection error:",error);
})

export default redisConnection;

