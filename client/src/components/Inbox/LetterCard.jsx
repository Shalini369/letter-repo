import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../api";

const STAMP_EMOJI = { heart: "💌", star: "⭐", cat: "🐾", flower: "🌷" };

export default function LetterCard({ letter, onRead, onDelete }) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleOpen() {
    setOpen((v) => !v);
    if (!letter.read && !open) {
      try {
        await api.markRead(letter.id);
        onRead?.(letter.id);
      } catch {
        /* non-critical */
      }
    }
  }

  async function handleDelete(e) {
    e.stopPropagation();
    if (!window.confirm("Delete this letter?")) return;
    setDeleting(true);
    try {
      await api.deleteLetter(letter.id);
      onDelete?.(letter.id);
    } catch (err) {
      alert(err.message || "Failed to delete letter.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <motion.div
      layout
      className="pixel-card !animate-none overflow-hidden cursor-pointer"
      onClick={handleOpen}
      whileHover={{ y: -3 }}
    >
      <div className="flex items-center gap-3 px-4 py-3" style={{ background: "#FFE1EE" }}>
        <span className="text-2xl">{STAMP_EMOJI[letter.stamp] || "💌"}</span>
        <div className="flex-1">
          <p className="text-sm font-bold text-ink">
            from @{letter.fromUsername || letter.sender}
            {!letter.read && (
              <span className="ml-2 text-[10px] bg-marigold border border-ink px-1.5 py-0.5">
                new
              </span>
            )}
          </p>
          <p className="text-xs text-inkLight">
            {new Date(letter.timestamp || letter.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onDelete && (
            <button
              type="button"
              disabled={deleting}
              onClick={handleDelete}
              className="px-2 py-1 border-[2px] border-ink bg-[#FFF6EA] hover:bg-[#FFA69E] active:translate-x-0.5 active:translate-y-0.5 text-[10px] font-pixel text-ink shadow-[2px_2px_0_0_#4a3b32] transition-colors"
              title="Delete letter"
            >
              {deleting ? "..." : "🗑️"}
            </button>
          )}
          <span className="text-ink">{open ? "▲" : "▼"}</span>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div
              className="p-5 font-hand text-lg leading-8 whitespace-pre-wrap"
              style={{ background: letter.paperColor }}
            >
              {letter.body || letter.content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
