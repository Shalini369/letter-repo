import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/letter-com";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(MONGO_URI, opts)
      .then((mongooseInstance) => {
        const maskedUri = MONGO_URI.includes("@")
          ? MONGO_URI.replace(/:([^:@]+)@/, ":****@")
          : MONGO_URI;
        console.log(`🍃 Connected to MongoDB (${maskedUri})`);
        return mongooseInstance;
      })
      .catch((err) => {
        cached.promise = null;
        console.error("❌ MongoDB connection error:", err.message);
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export const initDB = connectDB;
