import express from 'express';
import connectDB from './config/db.js';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';



const app=express();


app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));


app.get("/health",(req,res)=>{

    res.status(200).json({
        status:"OK",
        service:"job-queue-api"
    })
});


export default app;