import app from './app.js';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

dotenv.config();

const PORT=process.env.PORT || 3000;

const startServer=async()=>{

    try {
        connectDB();
        app.listen(PORT,()=>{

            console.log(`Server is running on ${PORT}`);
        });
    } catch (error) {
        console.log("Start up error: ",error);
        process.exit(1);
        
    }
}

startServer();



