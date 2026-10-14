import { mockProducts } from "../data/mockProducts";
import { movementService } from "./movementService";

let store = mockProducts.map((p) => ({ ...p }));

const delay = (ms = 100) => new Promise((resolve) => setTimeout(resolve, ms));

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

  async create(data) {
    await delay();
    const name = (data.name || "").trim();
    const sku = (data.sku || "").trim().toUpperCase();

    if (!name) throw new Error("Product name is required.");
    if (!sku) throw new Error("SKU is required.");

    const existingSku = store.some((p) => p.sku.toLowerCase() === sku.toLowerCase());
    if (existingSku) throw new Error(`A product with SKU "${sku}" already exists.`);

    const newProduct = {
      id: `prod-${String(store.length + 1).padStart(2, "0")}`,
      name,
      sku,
      category: data.category || "Stationery",
      categoryId: data.categoryId || "cat-01",
      unitCost: Number(data.unitCost) || 0,
      unitOfMeasure: data.unitOfMeasure || "Piece (pc)",
      description: (data.description || "").trim(),
      minLevel: Number(data.minLevel) || 0,
      bin: (data.bin || "A-01").trim(),
      onHand: 0,
      createdAt: "14 Oct 2026",
      createdBy: "Alex Lee",
    };

    store = [...store, newProduct];
    return { ...newProduct };
  },

  async update(id, data) {
    await delay();
    const index = store.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Product not found.");

    const current = store[index];
    const name = (data.name || current.name).trim();
    const sku = (data.sku || current.sku).trim().toUpperCase();

    if (!name) throw new Error("Product name is required.");
    if (!sku) throw new Error("SKU is required.");

    const clash = store.some(
      (p) => p.id !== id && p.sku.toLowerCase() === sku.toLowerCase()
    );
    if (clash) throw new Error(`Another product with SKU "${sku}" already exists.`);

    const updated = {
      ...current,
      name,
      sku,
      category: data.category !== undefined ? data.category : current.category,
      categoryId: data.categoryId !== undefined ? data.categoryId : current.categoryId,
      unitCost: data.unitCost !== undefined ? Number(data.unitCost) : current.unitCost,
      unitOfMeasure: data.unitOfMeasure || current.unitOfMeasure,
      description: data.description !== undefined ? data.description.trim() : current.description,
      minLevel: data.minLevel !== undefined ? Number(data.minLevel) : current.minLevel,
      bin: data.bin !== undefined ? data.bin.trim() : current.bin,
    };

    store = store.map((p, i) => (i === index ? updated : p));
    return { ...updated };
  },

  async delete(id) {
    await delay();
    const item = store.find((p) => p.id === id);
    if (!item) throw new Error("Product not found.");
    if (item.onHand > 0) {
      throw new Error(`Cannot delete product with ${item.onHand} units on hand. Stock it out first.`);
    }
    store = store.filter((p) => p.id !== id);
    return id;
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
      balanceBefore: current.onHand,
      balanceAfter: newOnHand,
    });

    return { product: { ...updated }, movement };
  },
};
