import { mockMovements } from "../data/mockMovements";
import { appConfig } from "../config/appConfig";
import { formatTime } from "../utils/format";

let store = mockMovements.map((m) => ({ ...m }));

const delay = (ms = 100) => new Promise((resolve) => setTimeout(resolve, ms));

export const movementService = {
  async getAll() {
    await delay();
    return store.map((m) => ({ ...m }));
  },

  async create({
    productId,
    productName,
    sku,
    type,
    quantity,
    reason,
    date,
    reference = "",
    balanceBefore = 0,
    balanceAfter,
    by = appConfig.user.name,
  }) {
    await delay();
    const highestNum = store.reduce((max, item) => {
      const match = item.id.match(/MOV-(\d+)/);
      return match ? Math.max(max, parseInt(match[1], 10)) : max;
    }, 108);

    const nextId = `MOV-${String(highestNum + 1).padStart(4, "0")}`;
    const now = new Date();

    const newMovement = {
      id: nextId,
      productId,
      productName,
      sku,
      type,
      quantity: Number(quantity),
      balanceBefore,
      balanceAfter,
      reason,
      date: date || "13 Oct 2026",
      time: formatTime(now),
      reference: reference.trim() || "—",
      by,
      createdAt: now.toISOString(),
    };

    store = [newMovement, ...store];
    return { ...newMovement };
  },
};
