const BASE = import.meta.env.VITE_API_URL || "/api";

export function getToken() {
  try {
    return sessionStorage.getItem("letter_token") || localStorage.getItem("letter_token");
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    sessionStorage.setItem("letter_token", token);
    // Remove from localStorage to prevent cross-tab leaks
    localStorage.removeItem("letter_token");
  } catch {
    /* ignore */
  }
}

export function clearToken() {
  try {
    sessionStorage.removeItem("letter_token");
    localStorage.removeItem("letter_token");
  } catch {
    /* ignore */
  }
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...(options.headers || {}),
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Something went wrong.");
  }
  return data;
}

export const api = {
  signup: (payload) => request("/auth/signup", { method: "POST", body: JSON.stringify(payload) }),
  login: (payload) => request("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  me: () => request("/auth/me"),
  checkUsername: (username) => request(`/auth/check-username/${encodeURIComponent(username)}`),
  findUser: (username) => request(`/users/${encodeURIComponent(username)}`),
  sendLetter: (payload) => request("/letters", { method: "POST", body: JSON.stringify(payload) }),
  inbox: () => request("/letters/inbox"),
  sent: () => request("/letters/sent"),
  markRead: (id) => request(`/letters/${id}/read`, { method: "PATCH" }),
  deleteLetter: (id) => request(`/letters/${id}`, { method: "DELETE" }),
};
