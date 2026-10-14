import { mockProducts } from "../data/mockProducts";
import { movementService } from "./movementService";

let store = mockProducts.map((p) => ({ ...p }));

const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms));

export const productService = {
  async getAll() {
    await delay();
    return store.map((p) => ({ ...p }));
  },

  async getById(id) {
    await delay();
    const item = store.find((p) => p.id === id);
    if (!item) throw new Error("Product not found.");
    return { ...item };
  },

  async recordMovement({ productId, type, quantity, reason, date, reference }) {
    await delay();
    const numQty = Number(quantity);
    if (!numQty || numQty <= 0) {
      throw new Error("Quantity must be a positive number.");
    }

    const index = store.findIndex((p) => p.id === productId);
    if (index === -1) {
      throw new Error("Selected product not found.");
    }

    const current = store[index];
    if (type === "out" && numQty > current.onHand) {
      throw new Error(
        `Cannot remove ${numQty} units. Available stock is ${current.onHand}.`
      );
    }

    const newOnHand = type === "in" ? current.onHand + numQty : current.onHand - numQty;
    const updated = {
      ...current,
      onHand: newOnHand,
    };

    store = store.map((p, i) => (i === index ? updated : p));

    const movement = await movementService.create({
      productId: updated.id,
      productName: updated.name,
      sku: updated.sku,
      type,
      quantity: numQty,
      reason,
      date,
      reference,
      balanceAfter: newOnHand,
    });

    return { product: { ...updated }, movement };
  },
};
