import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutGroup } from "framer-motion";
import { api } from "../../api";
import PixelButton from "../UI/PixelButton";
import PixelCard from "../UI/PixelCard";
import Envelope from "./Envelope";
import LetterPaper from "./LetterPaper";

const PAPER_COLORS = ["#FFF6EA", "#FFE8F0", "#E7F6EE", "#E7F1FB", "#F3ECFB"];
const STAMPS = [
  { id: "heart", emoji: "💌" },
  { id: "star", emoji: "⭐" },
  { id: "cat", emoji: "🐾" },
  { id: "flower", emoji: "🌷" },
];

export default function Compose() {
  // 'recipient' | 'closed' | 'open' | 'writing' | 'closing' | 'sealed' | 'flying' | 'sent'
  const [stage, setStage] = useState("recipient");
  const [recipientInput, setRecipientInput] = useState("");
  const [recipient, setRecipient] = useState(null);
  const [recipientError, setRecipientError] = useState("");
  const [checking, setChecking] = useState(false);

  const [body, setBody] = useState("");
  const [paperColor, setPaperColor] = useState(PAPER_COLORS[0]);
  const [stamp, setStamp] = useState(STAMPS[0].id);
  const [sendError, setSendError] = useState("");

  async function handleFindRecipient(e) {
    e.preventDefault();
    setRecipientError("");
    setChecking(true);
    try {
      const { user } = await api.findUser(recipientInput.trim());
      setRecipient(user);
      setStage("closed");
    } catch (err) {
      setRecipientError(err.message);
    } finally {
      setChecking(false);
    }
  }

  function handleOpenEnvelope() {
    setStage("open");
  }

  function handlePullOutPaper() {
    setStage("writing");
  }

  async function handleSend() {
    if (!body.trim()) return;
    setSendError("");

    // Animation 2: paper folds back down into the envelope
    setStage("closing");

    // Animation 3: flap seals shut
    setTimeout(() => setStage("sealed"), 550);

    // Animation 4: envelope takes flight
    setTimeout(() => setStage("flying"), 1250);

    // fire the actual request in parallel with the flight animation
    try {
      await api.sendLetter({ toUsername: recipient.username, body, stamp, paperColor });
    } catch (err) {
      setSendError(err.message);
    }

    setTimeout(() => setStage("sent"), 2200);
  }

  function resetCompose() {
    setStage("recipient");
    setRecipientInput("");
    setRecipient(null);
    setBody("");
    setSendError("");
  }

  return (
    <div className="max-w-3xl mx-auto px-4 pb-20">
      <AnimatePresence mode="wait">
        {stage === "recipient" && (
          <motion.div
            key="recipient"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex justify-center pt-16"
          >
            <PixelCard className="w-[340px]" floaty={false}>
              <div className="text-center mb-5">
                <div className="text-4xl mb-2">📬</div>
                <h2 className="font-pixel text-xs text-ink mb-1">who's this for?</h2>
                <p className="text-inkLight text-sm">enter their letter.com username</p>
              </div>
              <form onSubmit={handleFindRecipient} className="flex flex-col gap-3">
                <input
                  className="pixel-input w-full"
                  value={recipientInput}
                  onChange={(e) => setRecipientInput(e.target.value)}
                  placeholder="best_friend_99"
                  required
                />
                {recipientError && (
                  <p className="text-xs bg-coral/40 border-2 border-ink px-2 py-1">
                    {recipientError}
                  </p>
                )}
                <PixelButton type="submit" variant="marigold" disabled={checking} className="w-full">
                  {checking ? "checking mailbox..." : "find them"}
                </PixelButton>
              </form>
            </PixelCard>
          </motion.div>
        )}

        {stage !== "recipient" && stage !== "sent" && (
          <motion.div
            key="envelope-flow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-10"
          >
            <p className="text-center text-inkLight text-sm mb-6">
              writing to <span className="font-bold text-ink">@{recipient?.username}</span>
            </p>

            <LayoutGroup>
              {/* Envelope + peeking paper (closed / open stages, and again while closing/sealed/flying) */}
              {(stage === "closed" || stage === "open" || stage === "closing" || stage === "sealed") && (
                <div className="relative flex justify-center">
                  <Envelope
                    flapOpen={stage === "open" || stage === "closing"}
                    sealed={stage === "sealed"}
                    paperColor={paperColor}
                  />
                  {(stage === "open" || stage === "closing") && (
                    <LetterPaper mode="peek" onOpen={handlePullOutPaper} paperColor={paperColor} />
                  )}
                </div>
              )}

              {stage === "flying" && (
                <motion.div
                  className="flex justify-center text-6xl"
                  initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                  animate={{ x: 500, y: -260, rotate: 25, opacity: 0 }}
                  transition={{ duration: 1.1, ease: "easeIn" }}
                >
                  <span className="paper-plane">✈️</span>
                </motion.div>
              )}

              {stage === "writing" && (
                <div className="flex flex-col items-center gap-5">
                  <LetterPaper
                    mode="editor"
                    body={body}
                    setBody={setBody}
                    paperColor={paperColor}
                  />

                  <div className="flex flex-wrap items-center justify-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-inkLight">paper:</span>
                      {PAPER_COLORS.map((c) => (
                        <button
                          key={c}
                          onClick={() => setPaperColor(c)}
                          className="w-6 h-6 border-2 border-ink"
                          style={{
                            background: c,
                            outline: paperColor === c ? "2px solid #4A3B32" : "none",
                            outlineOffset: 2,
                          }}
                          aria-label={`paper color ${c}`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-inkLight">stamp:</span>
                      {STAMPS.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => setStamp(s.id)}
                          className={`pixel-btn pixel-btn-icon ${
                            stamp === s.id ? "pixel-btn-sky" : "pixel-btn-ghost"
                          }`}
                        >
                          {s.emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  {sendError && (
                    <p className="text-xs bg-coral/40 border-2 border-ink px-2 py-1">{sendError}</p>
                  )}

                  <PixelButton
                    variant="marigold"
                    disabled={!body.trim()}
                    onClick={handleSend}
                    className="text-sm"
                  >
                    send letter 💌
                  </PixelButton>
                </div>
              )}
            </LayoutGroup>

            {stage === "closed" && (
              <div className="flex justify-center mt-8">
                <PixelButton variant="pink" onClick={handleOpenEnvelope}>
                  open envelope
                </PixelButton>
              </div>
            )}
          </motion.div>
        )}

        {stage === "sent" && (
          <motion.div
            key="sent"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center pt-24"
          >
            <PixelCard className="w-[320px] text-center" floaty={false}>
              <div className="text-5xl mb-3">🎉</div>
              <h2 className="font-pixel text-xs text-ink mb-2">letter sent!</h2>
              <p className="text-inkLight text-sm mb-5">
                it's on its way to @{recipient?.username}
              </p>
              <PixelButton variant="mint" onClick={resetCompose}>
                write another
              </PixelButton>
            </PixelCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
