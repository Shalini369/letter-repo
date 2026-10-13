import mongoose from "mongoose";

const letterSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      required: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    recipient: {
      type: String,
      required: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    stamp: {
      type: String,
      default: "heart",
    },
    paperColor: {
      type: String,
      default: "#FFF6EA",
    },
    read: {
      type: Boolean,
      default: false,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: false },
  }
);

export function toPublicLetter(letter) {
  if (!letter) return null;
  const doc = letter.toObject ? letter.toObject() : letter;
  const idStr = (doc._id || doc.id)?.toString();
  const time = doc.timestamp || doc.createdAt || new Date();
  return {
    id: idStr,
    _id: idStr,
    sender: doc.sender,
    fromUsername: doc.sender,
    recipient: doc.recipient,
    toUsername: doc.recipient,
    content: doc.content,
    body: doc.content,
    stamp: doc.stamp || "heart",
    paperColor: doc.paperColor || "#FFF6EA",
    read: !!doc.read,
    timestamp: time,
    createdAt: time,
  };
}

export const Letter = mongoose.models.Letter || mongoose.model("Letter", letterSchema);
export default Letter;
