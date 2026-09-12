import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initDB } from "./data/db.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import letterRoutes from "./routes/letters.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/users", userRoutes);
app.use("/api/letters", letterRoutes);
app.use("/letters", letterRoutes);

app.get(["/api/health", "/health"], (req, res) => res.json({ ok: true }));

await initDB();

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`💌 Letter.com API running on http://localhost:${PORT}`);
  });
}

export default app;
