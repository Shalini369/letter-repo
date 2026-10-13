import { Router } from "express";
import { User, toPublicUser } from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// GET /api/users/:username -> confirms a recipient exists before composing
router.get("/:username", requireAuth, async (req, res) => {
  try {
    const username = req.params.username.toLowerCase().trim();
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "No one is registered under that username." });
    }
    if (user.username === req.username) {
      return res.status(400).json({ error: "You can't mail a letter to yourself... yet." });
    }

    res.json({ user: toPublicUser(user) });
  } catch (err) {
    console.error("User lookup error:", err);
    res.status(500).json({ error: "Could not look up user." });
  }
});

export default router;
