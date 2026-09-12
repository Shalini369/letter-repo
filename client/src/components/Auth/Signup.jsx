import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../../api";
import { useAuth } from "../../context/AuthContext";
import PixelButton from "../UI/PixelButton";
import PixelCard from "../UI/PixelCard";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [availability, setAvailability] = useState(null); // null | true | false
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (username.length < 3) {
      setAvailability(null);
      return;
    }
    const handle = setTimeout(async () => {
      try {
        const { available } = await api.checkUsername(username);
        setAvailability(available);
      } catch {
        setAvailability(null);
      }
    }, 350);
    return () => clearTimeout(handle);
  }, [username]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token, user } = await api.signup({ username, displayName, password });
      login(token, user);
      navigate("/compose");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <PixelCard className="w-[360px]">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">🪶</div>
            <h1 className="font-pixel text-sm text-ink mb-1">join letter.com</h1>
            <p className="text-inkLight text-sm">pick a mailbox name</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-bold text-ink block mb-1">username</label>
              <input
                className="pixel-input w-full"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                placeholder="mochi_mail"
                autoComplete="username"
                required
              />
              {availability === true && (
                <p className="text-xs text-green-700 mt-1">✓ available!</p>
              )}
              {availability === false && (
                <p className="text-xs text-red-600 mt-1">✗ already taken</p>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-ink block mb-1">display name</label>
              <input
                className="pixel-input w-full"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Mochi"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-ink block mb-1">password</label>
              <input
                type="password"
                className="pixel-input w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="at least 6 characters"
                autoComplete="new-password"
                required
              />
            </div>

            {error && (
              <p className="text-xs bg-coral/40 border-2 border-ink px-2 py-1">{error}</p>
            )}

            <PixelButton
              type="submit"
              variant="mint"
              disabled={loading || availability === false}
              className="w-full"
            >
              {loading ? "sealing envelope..." : "create account"}
            </PixelButton>
          </form>

          <p className="text-center text-sm text-inkLight mt-5">
            already have one?{" "}
            <Link to="/login" className="text-ink font-bold underline">
              log in
            </Link>
          </p>
        </PixelCard>
      </motion.div>
    </div>
  );
}
