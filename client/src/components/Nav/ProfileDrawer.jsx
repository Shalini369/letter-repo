import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../api";
import { useAuth } from "../../context/AuthContext";
import PixelButton from "../UI/PixelButton";

const STAMP_EMOJI = { heart: "💌", star: "⭐", cat: "🐾", flower: "🌷" };

export default function ProfileDrawer({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("inbox"); // "inbox" | "sent"
  const [inboxLetters, setInboxLetters] = useState([]);
  const [sentLetters, setSentLetters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (isOpen && user) {
      loadAllLetters();
    }
  }, [isOpen, user]);

  async function loadAllLetters() {
    setLoading(true);
    setError("");
    try {
      const [inboxRes, sentRes] = await Promise.all([api.inbox(), api.sent()]);
      setInboxLetters(inboxRes.letters || []);
      setSentLetters(sentRes.letters || []);
    } catch (err) {
      setError(err.message || "Failed to load history.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id, e) {
    e.stopPropagation();
    if (!window.confirm("Delete this letter from your history?")) return;

    setDeletingId(id);
    try {
      await api.deleteLetter(id);
      setInboxLetters((prev) => prev.filter((l) => (l.id || l._id) !== id));
      setSentLetters((prev) => prev.filter((l) => (l.id || l._id) !== id));
    } catch (err) {
      alert(err.message || "Failed to delete letter.");
    } finally {
      setDeletingId(null);
    }
  }

  function toggleExpand(id) {
    setExpandedId((curr) => (curr === id ? null : id));
  }

  if (!isOpen) return null;

  const currentLetters = activeTab === "inbox" ? inboxLetters : sentLetters;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#4a3b32]/40 backdrop-blur-sm"
        />

        {/* Drawer panel */}
        <motion.aside
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 220 }}
          className="relative w-full sm:w-[440px] max-w-full bg-[#FFF0DC] border-l-[3px] border-ink h-full flex flex-col shadow-[-6px_0_0_0_#4a3b32] z-10 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b-[3px] border-ink bg-[#FFF6EA]">
            <div className="flex items-center gap-2">
              <span className="text-xl">📜</span>
              <h2 className="font-pixel text-xs text-ink tracking-wide">profile & history</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 border-2 border-ink bg-[#FFF6EA] hover:bg-[#FFB5C6] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center font-pixel text-xs text-ink cursor-pointer shadow-[2px_2px_0_0_#4a3b32]"
              title="Close drawer"
            >
              ✕
            </button>
          </div>

          {/* User Details */}
          {user && (
            <div className="p-4 border-b-[3px] border-ink bg-[#FFF6EA]">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-none border-[3px] border-ink flex items-center justify-center font-pixel text-sm text-ink shadow-[3px_3px_0_0_#4a3b32]"
                  style={{ backgroundColor: user.avatarColor || "#F4C95D" }}
                >
                  {(user.displayName || user.username || "?").charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-ink text-base truncate">
                    {user.displayName || user.username}
                  </h3>
                  <p className="text-xs text-inkLight font-semibold">@{user.username}</p>
                  {user.createdAt && (
                    <p className="text-[11px] text-[#8C7A6B] mt-0.5">
                      Member since{" "}
                      {new Date(user.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex border-b-[3px] border-ink bg-[#FFF6EA]">
            <button
              onClick={() => setActiveTab("inbox")}
              className={`flex-1 py-2.5 font-pixel text-[11px] text-ink flex items-center justify-center gap-1.5 transition-colors border-r-[2px] border-ink ${
                activeTab === "inbox"
                  ? "bg-[#AEDFF7] font-bold shadow-inner"
                  : "bg-[#FFF6EA] hover:bg-[#E7F1FB]"
              }`}
            >
              <span>📥</span> Inbox ({inboxLetters.length})
            </button>
            <button
              onClick={() => setActiveTab("sent")}
              className={`flex-1 py-2.5 font-pixel text-[11px] text-ink flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === "sent"
                  ? "bg-[#F4C95D] font-bold shadow-inner"
                  : "bg-[#FFF6EA] hover:bg-[#FFF2D0]"
              }`}
            >
              <span>📤</span> Sent ({sentLetters.length})
            </button>
          </div>

          {/* Letters Content Area */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {loading && (
              <div className="flex justify-center py-12">
                <div className="pixel-loader">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}

            {error && (
              <p className="text-xs bg-[#FFA69E]/40 border-2 border-ink px-3 py-2 text-center text-ink">
                {error}
              </p>
            )}

            {!loading && !error && currentLetters.length === 0 && (
              <div className="text-center text-inkLight py-12">
                <div className="text-4xl mb-2">{activeTab === "inbox" ? "📭" : "✉️"}</div>
                <p className="text-xs font-semibold">
                  {activeTab === "inbox"
                    ? "No letters received yet."
                    : "No sent letters history yet."}
                </p>
              </div>
            )}

            {!loading &&
              currentLetters.map((letter) => {
                const id = letter.id || letter._id;
                const isExpanded = expandedId === id;
                const isDeleting = deletingId === id;
                const stampEmoji = STAMP_EMOJI[letter.stamp] || "💌";
                const isInbox = activeTab === "inbox";
                const dateLabel = new Date(
                  letter.timestamp || letter.createdAt
                ).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });

                return (
                  <div
                    key={id}
                    onClick={() => toggleExpand(id)}
                    className="border-[3px] border-ink bg-[#FFF6EA] shadow-[4px_4px_0_0_#4a3b32] transition-transform cursor-pointer"
                  >
                    {/* Header item */}
                    <div
                      className="p-3 flex items-center justify-between gap-2"
                      style={{ backgroundColor: isInbox ? "#FFE1EE" : "#E7F6EE" }}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-xl shrink-0">{stampEmoji}</span>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-ink truncate">
                            {isInbox ? `from @${letter.fromUsername || letter.sender}` : `to @${letter.toUsername || letter.recipient}`}
                            {isInbox && !letter.read && (
                              <span className="ml-1.5 text-[9px] bg-[#F4C95D] border border-ink px-1 py-0.2 font-pixel">
                                new
                              </span>
                            )}
                          </p>
                          <p className="text-[10px] text-inkLight">{dateLabel}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {/* Delete button */}
                        <button
                          type="button"
                          disabled={isDeleting}
                          onClick={(e) => handleDelete(id, e)}
                          className="px-2 py-1 border-[2px] border-ink bg-[#FFF6EA] hover:bg-[#FFA69E] active:translate-x-0.5 active:translate-y-0.5 text-[10px] font-pixel text-ink shadow-[2px_2px_0_0_#4a3b32] transition-colors"
                          title="Delete letter"
                        >
                          {isDeleting ? "..." : "🗑️"}
                        </button>
                        <span className="text-xs text-ink">{isExpanded ? "▲" : "▼"}</span>
                      </div>
                    </div>

                    {/* Expandable letter message */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden border-t-[2px] border-ink"
                        >
                          <div
                            className="p-4 font-hand text-base leading-7 whitespace-pre-wrap border-b border-ink/20"
                            style={{ backgroundColor: letter.paperColor || "#FFF6EA" }}
                          >
                            {letter.body || letter.content}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t-[3px] border-ink bg-[#FFF6EA] flex items-center justify-between">
            <PixelButton
              variant="ghost"
              onClick={() => {
                onClose();
                logout();
              }}
              className="text-[10px] py-2 px-3"
            >
              Log out
            </PixelButton>
            <PixelButton
              variant="marigold"
              onClick={loadAllLetters}
              className="text-[10px] py-2 px-3"
            >
              🔄 Refresh
            </PixelButton>
          </div>
        </motion.aside>
      </div>
    </AnimatePresence>
  );
}
