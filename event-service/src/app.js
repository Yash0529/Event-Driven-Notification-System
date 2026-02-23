import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import eventRoutes from './routes/event.routes.js'
import adminRoutes from './routes/admin.routes.js'
import serverAdapter from './monitoring/bullBoard.js';
import metricsRoute from './routes/metrics.route.js'

dotenv.config();


const app=express();


app.use(express.json());
app.use(cors());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "default-src": ["'self'"],
        // BullBoard needs these to render the UI
        "script-src": ["'self'", "'unsafe-inline'"],
        "style-src": ["'self'", "'unsafe-inline'"],
        // This fixes your "localhost:5000" blocked error
        "connect-src": ["'self'", "http://localhost:5000", "ws://localhost:5000"],
        "img-src": ["'self'", "data:", "https://bullmq.io"],
      },
    },
  })
);


app.use("/api/v1",eventRoutes);
app.use("/admin/queues",serverAdapter.getRouter());
app.use("/admin",adminRoutes);
app.use("/metrics",metricsRoute);


app.get("/health",(req,res)=>{
    res.json({
        status:"Ok",
        service:"event-service"
    })
});


export default app;