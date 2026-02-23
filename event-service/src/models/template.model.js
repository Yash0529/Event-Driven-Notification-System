import mongoose from "mongoose";

const templateSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  subject: { type: String, required: true },
  body: { type: String, required: true },
  variables: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Template", templateSchema);