import app from './app.js';
import connectDB from './config/db.js'
import './workers/event.worker.js';
import './workers/dead.letter.queue.worker.js'
import './workers/dispatcher.worker.js'


const PORT=process.env.PORT || 5000;

app.listen(PORT,()=>{

    connectDB();
    console.log("Server is running on port", PORT)
})