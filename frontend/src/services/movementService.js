import { getToken } from "./authService";
import { formatDateLong, formatTime } from "../utils/format";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path = "", options = {}) {
  const token = getToken();
  const response = await fetch(`${API_BASE}/movements${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "The movement request failed.");
  return data;
}

function toMovement(entry) {
  const createdAt = new Date(entry.createdAt);
  const movementDate = new Date(`${entry.date}T12:00:00`);
  return {
    ...entry,
    dateKey: entry.date,
    date: formatDateLong(movementDate),
    time: formatTime(createdAt),
  };
}

export const movementService = {
  async getAll() {
    const data = await request();
    return (data.movements || []).map(toMovement);
  },
  async create(input) {
    const data = await request("", { method: "POST", body: JSON.stringify(input) });
    return {
      product: data.product,
      movement: toMovement(data.movement),
    };
  },
};
