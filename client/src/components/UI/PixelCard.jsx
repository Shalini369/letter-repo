export default function PixelCard({ children, className = "", floaty = true }) {
  return (
    <div className={`pixel-card ${floaty ? "" : "!animate-none"} p-6 ${className}`}>
      {children}
    </div>
  );
}
