import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PixelButton from "../UI/PixelButton";
import ProfileDrawer from "./ProfileDrawer";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  if (!user) return null;

  return (
    <>
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto flex-wrap gap-3">
        <Link to="/compose" className="font-pixel text-sm text-ink flex items-center gap-2">
          <span>💌</span> letter.com
        </Link>
        <div className="flex items-center gap-3 flex-wrap">
          <Link to="/compose">
            <PixelButton variant="marigold">Write</PixelButton>
          </Link>
          <Link to="/inbox">
            <PixelButton variant="sky">Inbox</PixelButton>
          </Link>

          {/* User Profile Button */}
          <button
            type="button"
            onClick={() => setProfileOpen(true)}
            className="inline-flex items-center gap-2 px-3 py-2.5 border-[3px] border-ink bg-[#FFF6EA] hover:bg-[#FFB5C6] shadow-[4px_4px_0_0_#4a3b32] active:translate-x-1 active:translate-y-1 active:shadow-[1px_1px_0_0_#4a3b32] transition-all cursor-pointer select-none"
            title="Open user profile and history"
          >
            <span
              className="w-5 h-5 border-[2px] border-ink flex items-center justify-center font-pixel text-[10px] text-ink shrink-0"
              style={{ backgroundColor: user.avatarColor || "#F4C95D" }}
            >
              {(user.displayName || user.username || "?").charAt(0).toUpperCase()}
            </span>
            <span className="font-pixel text-[11px] text-ink max-w-[100px] truncate">
              @{user.username}
            </span>
          </button>

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

      {/* Slide-out Profile & History Drawer */}
      <ProfileDrawer isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  );
}
