import Template from "../models/template.model.js"; 
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const seedData = [
  {
    name: "OTP",
    subject: "Your OTP Code",
    body: "Hi {{name}}, your OTP is {{otp}}. It expires in {{minutes}} minutes.",
    variables: ["name", "otp", "minutes"],
  },

  {
    name: "PAYMENT_SUCCESS",
    subject: "Payment Successful",
    body: "Hi {{name}}, payment of ₹{{amount}} was successful. Transaction ID: {{txnId}}.",
    variables: ["name", "amount", "txnId"],
  },
];

const seedDB = async () => {
  try {

    console.log(process.env.MONGODB_URL);

    await mongoose.connect(process.env.MONGODB_URL);

    await Template.deleteMany({});
    await Template.insertMany(seedData);

    console.log("Template Database Seeded! 🌱");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
