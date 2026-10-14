import { mockMovements } from "../data/mockMovements";

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
    balanceAfter,
  }) {
    await delay();
    const newMovement = {
      id: `mov-${String(store.length + 1).padStart(2, "0")}`,
      productId,
      productName,
      sku,
      type,
      quantity: Number(quantity),
      reason,
      date,
      reference: reference.trim(),
      balanceAfter,
      createdAt: new Date().toISOString(),
    };
    store = [newMovement, ...store];
    return { ...newMovement };
  },
};
