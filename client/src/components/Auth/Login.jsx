import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../../api";
import { useAuth } from "../../context/AuthContext";
import PixelButton from "../UI/PixelButton";
import PixelCard from "../UI/PixelCard";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token, user } = await api.login({ username, password });
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
        <PixelCard className="w-[340px]">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">✉️</div>
            <h1 className="font-pixel text-sm text-ink mb-1">letter.com</h1>
            <p className="text-inkLight text-sm">welcome back, pen pal</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-bold text-ink block mb-1">username</label>
              <input
                className="pixel-input w-full"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="mochi_mail"
                autoComplete="username"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-ink block mb-1">password</label>
              <input
                type="password"
                className="pixel-input w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <p className="text-xs bg-coral/40 border-2 border-ink px-2 py-1">{error}</p>
            )}

            <PixelButton type="submit" variant="marigold" disabled={loading} className="w-full">
              {loading ? "opening the gate..." : "log in"}
            </PixelButton>
          </form>

          <p className="text-center text-sm text-inkLight mt-5">
            new here?{" "}
            <Link to="/signup" className="text-ink font-bold underline">
              make an account
            </Link>
          </p>
        </PixelCard>
      </motion.div>
    </div>
  );
}
