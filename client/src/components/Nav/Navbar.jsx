import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PixelButton from "../UI/PixelButton";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
      <Link to="/compose" className="font-pixel text-sm text-ink flex items-center gap-2">
        <span>💌</span> letter.com
      </Link>
      <div className="flex items-center gap-3">
        <Link to="/compose">
          <PixelButton variant="marigold">Write</PixelButton>
        </Link>
        <Link to="/inbox">
          <PixelButton variant="sky">Inbox</PixelButton>
        </Link>
        <PixelButton
          variant="ghost"
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          Log out
        </PixelButton>
      </div>
    </nav>
  );
}
