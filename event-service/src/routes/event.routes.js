import express from 'express';
const router =express.Router();
import {createEventController} from '../controller/event.controller.js'


router.post("/events",createEventController);


export default router;