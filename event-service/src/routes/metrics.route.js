import express from 'express';
import Event from '../models/event.model.js'

const router=express.Router();


router.get("/",async(req,res)=>{
    
    const queued=await Event.countDocuments({status:"QUEUED"});
    const processing=await Event.countDocuments({status:"PROCESSING"});
    const completed=await Event.countDocuments({status:"COMPLETED"});
    const failed=await Event.countDocuments({status:"FAILED"});

    


    res.json({
        queued,
        processing,
        completed,
        failed,
        timestamp:new Date()
    });
});


export default router;