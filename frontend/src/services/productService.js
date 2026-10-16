import { getToken } from "./authService";
import { movementService } from "./movementService";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path = "", options = {}) {
  const token = getToken();
  const response = await fetch(`${API_BASE}/products${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "The product request failed.");
  return data;
}

export const productService = {
  async getAll() {
    const data = await request();
    return data.products || [];
  },
  async getById(id) {
    const data = await request(`/${encodeURIComponent(id)}`);
    return data.product;
  },
  async create(input) {
    const data = await request("", { method: "POST", body: JSON.stringify(input) });
    return data.product;
  },
  async update(id, input) {
    const data = await request(`/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(input),
    });
    return data.product;
  },
  async delete(id) {
    await request(`/${encodeURIComponent(id)}`, { method: "DELETE" });
    return id;
  },
  async recordMovement(input) {
    return movementService.create(input);
  },
};
