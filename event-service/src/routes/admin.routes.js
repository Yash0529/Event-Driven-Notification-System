import express from 'express';
import { replayDLQ } from '../services/admin.service.js';
import serverAdapter from '../monitoring/bullBoard.js'



const router=express.Router();


router.post("/replay-dlq",replayDLQ);

export default router;