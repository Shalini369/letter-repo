import { motion } from "framer-motion";

/**
 * Pure presentational envelope built from layered divs (see pixel.css).
 * `flapOpen`  – true once the user has cracked the envelope open
 * `sealed`    – true once the wax seal should pop back in
 */
export default function Envelope({ flapOpen, sealed, paperColor }) {
  return (
    <div className="envelope-scene" style={{ perspective: 900 }}>
      <div className="envelope-back pixel-corners" style={{ background: "#ffe1ee" }} />
      <div className="envelope-pocket" />

      <motion.div
        className="envelope-flap"
        style={{ transformOrigin: "top center" }}
        animate={{ rotateX: flapOpen ? 165 : 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 14 }}
      />

      {sealed && (
        <motion.div
          className="envelope-seal"
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 12 }}
        >
          💌
        </motion.div>
      )}
    </div>
  );
}
