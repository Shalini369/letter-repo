import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, toPublicUser } from "../models/User.js";
import { requireAuth, JWT_SECRET } from "../middleware/auth.js";

const router = Router();

const AVATAR_COLORS = ["#F4C95D", "#FFB5C6", "#AEDFF7", "#B8E8D4", "#C9B6E4", "#FFA69E"];

function signToken(user) {
  const idStr = (user._id || user.id).toString();
  return jwt.sign({ userId: idStr, username: user.username }, JWT_SECRET, {
    expiresIn: "30d",
  });
}

// GET /api/auth/check-username/:username -> { available: boolean }
router.get("/check-username/:username", async (req, res) => {
  try {
    const cleanUsername = req.params.username.toLowerCase().trim();
    const exists = await User.exists({ username: cleanUsername });
    res.json({ available: !exists, username: cleanUsername });
  } catch (err) {
    res.status(500).json({ error: "Failed to check username." });
  }
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

  try {
    const existing = await User.findOne({ username: cleanUsername });
    if (existing) {
      return res.status(409).json({ error: "That username is already taken." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      username: cleanUsername,
      displayName: displayName?.trim() || cleanUsername,
      password: passwordHash,
      avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
    });

    const token = signToken(user);
    res.status(201).json({ token, user: toPublicUser(user) });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Could not create account. Please try again." });
  }
});

// POST /api/auth/login { username, password }
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Please enter both username and password." });
  }

  try {
    const cleanUsername = username.toLowerCase().trim();
    const user = await User.findOne({ username: cleanUsername });

    if (!user) {
      return res.status(401).json({ error: "We couldn't find that username." });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "That password doesn't match." });
    }

    const token = signToken(user);
    res.json({ token, user: toPublicUser(user) });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed. Please try again." });
  }
});

// GET /api/auth/me
router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    res.json({ user: toPublicUser(user) });
  } catch (err) {
    console.error("Get me error:", err);
    res.status(500).json({ error: "Could not fetch user profile." });
  }
});

export default router;
