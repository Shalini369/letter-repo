import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import { db } from "../data/db.js";
import { toPublicUser } from "../models/User.js";
import { requireAuth, JWT_SECRET } from "../middleware/auth.js";

const router = Router();

const AVATAR_COLORS = ["#F4C95D", "#FFB5C6", "#AEDFF7", "#B8E8D4", "#C9B6E4", "#FFA69E"];

function signToken(user) {
  return jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: "30d",
  });
}

// GET /api/auth/check-username/:username -> { available: boolean }
router.get("/check-username/:username", async (req, res) => {
  await db.read();
  const username = req.params.username.toLowerCase().trim();
  const exists = db.data.users.some((u) => u.username === username);
  res.json({ available: !exists, username });
});

// POST /api/auth/signup { username, displayName, password }
router.post("/signup", async (req, res) => {
  const { username, displayName, password } = req.body;

  if (!username || !password || password.length < 6) {
    return res.status(400).json({
      error: "Pick a username and a password with at least 6 characters.",
    });
  }

  const cleanUsername = username.toLowerCase().trim();
  if (!/^[a-z0-9_]{3,20}$/.test(cleanUsername)) {
    return res.status(400).json({
      error: "Usernames are 3-20 characters: letters, numbers, and underscores only.",
    });
  }

  await db.read();
  if (db.data.users.some((u) => u.username === cleanUsername)) {
    return res.status(409).json({ error: "That username is already taken." });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    id: nanoid(),
    username: cleanUsername,
    displayName: displayName?.trim() || cleanUsername,
    passwordHash,
    avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
    createdAt: new Date().toISOString(),
  };

  db.data.users.push(user);
  await db.write();

  const token = signToken(user);
  res.status(201).json({ token, user: toPublicUser(user) });
});

// POST /api/auth/login { username, password }
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  await db.read();

  const user = db.data.users.find(
    (u) => u.username === username?.toLowerCase().trim()
  );
  if (!user) {
    return res.status(401).json({ error: "We couldn't find that username." });
  }

  const valid = await bcrypt.compare(password || "", user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: "That password doesn't match." });
  }

  const token = signToken(user);
  res.json({ token, user: toPublicUser(user) });
});

// GET /api/auth/me
router.get("/me", requireAuth, async (req, res) => {
  await db.read();
  const user = db.data.users.find((u) => u.id === req.userId);
  if (!user) return res.status(404).json({ error: "User not found." });
  res.json({ user: toPublicUser(user) });
});

export default router;
