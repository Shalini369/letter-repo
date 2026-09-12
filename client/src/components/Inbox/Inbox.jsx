import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "../../api";
import LetterCard from "./LetterCard";

export default function Inbox() {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .inbox()
      .then(({ letters }) => setLetters(letters))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function markLocalRead(id) {
    setLetters((prev) => prev.map((l) => (l.id === id ? { ...l, read: true } : l)));
  }

  return (
    <div className="max-w-2xl mx-auto px-4 pb-20 pt-6">
      <h1 className="font-pixel text-sm text-ink mb-6 text-center">your mailbox 📮</h1>

      {loading && (
        <div className="flex justify-center py-16">
          <div className="pixel-loader">
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs bg-coral/40 border-2 border-ink px-3 py-2 text-center">{error}</p>
      )}

      {!loading && !error && letters.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-inkLight pt-12"
        >
          <div className="text-5xl mb-3">📭</div>
          <p>nothing here yet — your mailbox is waiting for its first letter.</p>
        </motion.div>
      )}

      <div className="flex flex-col gap-4">
        {letters.map((letter) => (
          <LetterCard key={letter.id} letter={letter} onRead={markLocalRead} />
        ))}
      </div>
    </div>
  );
}
