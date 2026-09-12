import { motion } from "framer-motion";

export default function PixelButton({
  children,
  onClick,
  type = "button",
  variant = "",
  disabled = false,
  className = "",
  icon = false,
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ x: 4, y: 4, boxShadow: "1px 1px 0 0 #4A3B32" }}
      className={`pixel-btn ${variant ? `pixel-btn-${variant}` : ""} ${
        icon ? "pixel-btn-icon" : ""
      } ${className}`}
    >
      {children}
    </motion.button>
  );
}
