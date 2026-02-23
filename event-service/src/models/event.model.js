import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({

  eventId: {
    type: String,
    required: true,
    unique: true
  },

  idempotencyKey: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  type: {
    type: String,
    required: true
  },

  userId: {
    type: String,
    required: true
  },

  payload: {
    type: Object,
    required: true
  },

  status: {
    type:String,
    enum:["RECEIVED","QUEUED","PROCESSING","COMPLETED","FAILED"],
    default:"RECEIVED"
  },

  attempts: {
    type: Number,
    default: 0
  },

  lastError: {
    type:String,
    default:null
  },
  inDLQ:{
   type:Boolean,
   default:false
  },
  priority: {
    type: Number, 
    default: 5 
  },
  scheduledFor: Date,                     
  expiresAt: Date,                        
  dlQAt:Date,
  processedAt: Date,
  category:{
    type:String,
    enum:["OTP","TRANSACTIONAL","SYSTEM","MARKETING"],
    default:"SYSTEM"
  },
  channel:{
    type:String,
    enum:["EMAIL","SMS","PUSH"],
    default:"EMAIL"
  }

}, { timestamps: true });

const Event = mongoose.model("Event", eventSchema);
export default Event;
