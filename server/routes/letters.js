import { Router } from "express";
import { nanoid } from "nanoid";
import { db } from "../data/db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// POST /api/letters { toUsername, body, stamp, paperColor }
router.post("/", requireAuth, async (req, res) => {
  const { toUsername, body, stamp, paperColor } = req.body;

  if (!toUsername || !body?.trim()) {
    return res.status(400).json({ error: "Every letter needs a recipient and a message." });
  }

  await db.read();
  const recipient = db.data.users.find(
    (u) => u.username === toUsername.toLowerCase().trim()
  );
  if (!recipient) {
    return res.status(404).json({ error: "That recipient doesn't exist." });
  }

  const letter = {
    id: nanoid(),
    fromUsername: req.username,
    toUsername: recipient.username,
    body: body.trim(),
    stamp: stamp || "heart",
    paperColor: paperColor || "#FFF6EA",
    read: false,
    createdAt: new Date().toISOString(),
  };

  db.data.letters.push(letter);
  await db.write();

  res.status(201).json({ letter });
});

// GET /api/letters/inbox
router.get("/inbox", requireAuth, async (req, res) => {
  await db.read();
  const letters = db.data.letters
    .filter((l) => l.toUsername === req.username)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ letters });
});

// GET /api/letters/sent
router.get("/sent", requireAuth, async (req, res) => {
  await db.read();
  const letters = db.data.letters
    .filter((l) => l.fromUsername === req.username)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ letters });
});

// PATCH /api/letters/:id/read
router.patch("/:id/read", requireAuth, async (req, res) => {
  await db.read();
  const letter = db.data.letters.find((l) => l.id === req.params.id);
  if (!letter || letter.toUsername !== req.username) {
    return res.status(404).json({ error: "Letter not found." });
  }
  letter.read = true;
  await db.write();
  res.json({ letter });
});

export default router;
