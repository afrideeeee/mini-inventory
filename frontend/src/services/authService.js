const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const TOKEN_KEY = "register.authToken";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}/auth${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Could not connect to the server.");
  return data;
}

export const authService = {
  async login(email, password, remember) {
    const data = await request("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    clearToken();
    (remember ? localStorage : sessionStorage).setItem(TOKEN_KEY, data.token);
    return data.user;
  },
  async me() {
    const token = getToken();
    if (!token) return null;
    try {
      const data = await request("/me", { headers: { Authorization: `Bearer ${token}` } });
      return data.user;
    } catch {
      clearToken();
      return null;
    }
  },
  logout: clearToken,
};
