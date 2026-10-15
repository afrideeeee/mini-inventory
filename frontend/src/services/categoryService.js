import { getToken } from "./authService";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path = "", options = {}) {
  const token = getToken();
  const response = await fetch(`${API_BASE}/categories${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "The category request failed.");
  return data;
}

export const categoryService = {
  async getAll() {
    const data = await request();
    return {
      categories: data.categories || [],
      unassignedProducts: data.stats?.unassignedProducts || 0,
    };
  },
  async getById(id) {
    const data = await request(`/${encodeURIComponent(id)}`);
    return data.category;
  },
  async create(input) {
    const data = await request("", { method: "POST", body: JSON.stringify(input) });
    return data.category;
  },
  async update(id, input) {
    const data = await request(`/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(input),
    });
    return data.category;
  },
  async remove(id) {
    await request(`/${encodeURIComponent(id)}`, { method: "DELETE" });
    return id;
  },
};
