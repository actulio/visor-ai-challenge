import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  body: { type: String, required: true },
  userId: { type: String, required: true },
  date: { type: Date, required: true },
  isResponse: { type: Boolean, required: true },
});

export const MessageModel = mongoose.model('Message', MessageSchema);
