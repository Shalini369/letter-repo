import { Router } from "express";
import mongoose from "mongoose";
import { Letter, toPublicLetter } from "../models/Letter.js";
import { User } from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// POST /api/letters { toUsername, body, stamp, paperColor }
router.post("/", requireAuth, async (req, res) => {
  const { toUsername, recipient: recipientField, body, content, stamp, paperColor } = req.body;
  const targetRecipient = (toUsername || recipientField)?.toLowerCase().trim();
  const textContent = (body || content)?.trim();

  if (!targetRecipient || !textContent) {
    return res.status(400).json({ error: "Every letter needs a recipient and a message." });
  }

  try {
    const recipient = await User.findOne({ username: targetRecipient });
    if (!recipient) {
      return res.status(404).json({ error: "That recipient doesn't exist." });
    }

    const letter = await Letter.create({
      sender: req.username,
      recipient: recipient.username,
      content: textContent,
      stamp: stamp || "heart",
      paperColor: paperColor || "#FFF6EA",
      read: false,
      timestamp: new Date(),
    });

    res.status(201).json({ letter: toPublicLetter(letter) });
  } catch (err) {
    console.error("Create letter error:", err);
    res.status(500).json({ error: "Could not send letter. Please try again." });
  }
});

// GET /api/letters/inbox -> Received letters
router.get("/inbox", requireAuth, async (req, res) => {
  try {
    const letters = await Letter.find({ recipient: req.username }).sort({
      timestamp: -1,
      createdAt: -1,
    });
    res.json({ letters: letters.map(toPublicLetter) });
  } catch (err) {
    console.error("Inbox fetch error:", err);
    res.status(500).json({ error: "Could not fetch inbox." });
  }
});

// GET /api/letters/sent -> Sent letters history
router.get("/sent", requireAuth, async (req, res) => {
  try {
    const letters = await Letter.find({ sender: req.username }).sort({
      timestamp: -1,
      createdAt: -1,
    });
    res.json({ letters: letters.map(toPublicLetter) });
  } catch (err) {
    console.error("Sent letters fetch error:", err);
    res.status(500).json({ error: "Could not fetch sent letters." });
  }
});

// PATCH /api/letters/:id/read -> Mark letter read
router.patch("/:id/read", requireAuth, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ error: "Letter not found." });
  }

  try {
    const letter = await Letter.findOne({
      _id: req.params.id,
      recipient: req.username,
    });

    if (!letter) {
      return res.status(404).json({ error: "Letter not found." });
    }

    letter.read = true;
    await letter.save();

    res.json({ letter: toPublicLetter(letter) });
  } catch (err) {
    console.error("Mark read error:", err);
    res.status(500).json({ error: "Could not update letter status." });
  }
});

// DELETE /api/letters/:id -> Delete letter from database
router.delete("/:id", requireAuth, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ error: "Letter not found." });
  }

  try {
    const letter = await Letter.findOne({
      _id: req.params.id,
      $or: [{ recipient: req.username }, { sender: req.username }],
    });

    if (!letter) {
      return res.status(404).json({ error: "Letter not found or unauthorized." });
    }

    await Letter.deleteOne({ _id: letter._id });

    res.json({ success: true, message: "Letter deleted successfully.", id: req.params.id });
  } catch (err) {
    console.error("Delete letter error:", err);
    res.status(500).json({ error: "Could not delete letter." });
  }
});

export default router;
