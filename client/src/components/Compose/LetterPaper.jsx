import { motion } from "framer-motion";

/**
 * mode="peek"   -> small rectangle poking out of the open envelope, clickable
 * mode="editor" -> large writing surface, same layoutId so Framer Motion
 *                  animates the shared transition automatically
 */
export default function LetterPaper({ mode, body, setBody, onOpen, paperColor }) {
  if (mode === "peek") {
    return (
      <motion.div
        layoutId="paper"
        onClick={onOpen}
        className="letter-paper pixel-corners absolute left-1/2 cursor-pointer"
        style={{
          top: -34,
          width: 150,
          height: 60,
          translate: "-50% 0",
          background: paperColor,
        }}
        whileHover={{ y: -8 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
      >
        <p className="text-center text-[10px] text-inkLight mt-5 font-hand">
          tap to pull me out ✨
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      layoutId="paper"
      className="letter-paper pixel-corners w-full max-w-xl mx-auto p-6"
      style={{ height: 420, background: paperColor }}
      transition={{ type: "spring", stiffness: 140, damping: 20 }}
    >
      <textarea
        autoFocus
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Dear friend..."
        maxLength={2000}
      />
    </motion.div>
  );
}
