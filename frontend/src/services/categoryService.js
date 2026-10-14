import { mockCategories } from "../data/mockCategories";

// In-memory store standing in for the backend. Every function is async and
// returns copies, so swapping in real fetch/axios calls later won't change
// anything for the callers.
let store = mockCategories.map((c) => ({ ...c }));

const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms));

const normalise = (value) => value.trim().toLowerCase();

function validate({ name }, ignoreId) {
  const trimmed = (name ?? "").trim();
  if (!trimmed) throw new Error("Category name is required.");
  const clash = store.some(
    (c) => c.id !== ignoreId && normalise(c.name) === normalise(trimmed)
  );
  if (clash) throw new Error("A category with this name already exists.");
  return trimmed;
}

function nextCode() {
  const highest = store.reduce(
    (max, c) => Math.max(max, Number(c.code.replace("CAT-", "")) || 0),
    0
  );
  return `CAT-${String(highest + 1).padStart(2, "0")}`;
}

export const categoryService = {
  async getAll() {
    await delay();
    return store.map((c) => ({ ...c }));
  },

  async create({ name, description = "" }) {
    await delay();
    const cleanName = validate({ name });
    const code = nextCode();
    const category = {
      id: code.toLowerCase(),
      code,
      name: cleanName,
      description: description.trim(),
      skus: [],
      productCount: 0,
      units: 0,
      value: 0,
    };
    store = [...store, category];
    return { ...category };
  },

  async update(id, { name, description = "" }) {
    await delay();
    const cleanName = validate({ name }, id);
    const existing = store.find((c) => c.id === id);
    if (!existing) throw new Error("Category not found.");
    const updated = { ...existing, name: cleanName, description: description.trim() };
    store = store.map((c) => (c.id === id ? updated : c));
    return { ...updated };
  },

  async remove(id) {
    await delay();
    const existing = store.find((c) => c.id === id);
    if (!existing) throw new Error("Category not found.");
    if (existing.productCount > 0) {
      throw new Error("Move this category's products to another category first.");
    }
    store = store.filter((c) => c.id !== id);
    return id;
  },
};
