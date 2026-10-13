import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./data/db.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import letterRoutes from "./routes/letters.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Middleware to ensure DB is connected before handling requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("Database connection failure:", err.message);
    return res.status(503).json({
      error: "Database unavailable. Please check MONGO_URI and try again.",
    });
  }
});

app.use("/api/auth", authRoutes);
app.use("/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/users", userRoutes);
app.use("/api/letters", letterRoutes);
app.use("/letters", letterRoutes);

app.get(["/api/health", "/health"], (req, res) => res.json({ ok: true, status: "healthy" }));

if (!process.env.VERCEL) {
  try {
    await connectDB();
  } catch (e) {
    console.warn("MongoDB initial connection notice:", e.message);
  }
  app.listen(PORT, () => {
    console.log(`💌 Letter.com API running on http://localhost:${PORT}`);
  });
}

export default app;
