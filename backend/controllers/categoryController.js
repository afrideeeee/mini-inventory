const mongoose = require("mongoose");
const Category = require("../models/Category");

function respondWithError(error, res, next) {
  if (error.code === 11000) {
    return res.status(409).json({ success: false, message: "A category with this name already exists." });
  }
  if (error.name === "ValidationError" || error.name === "CastError") {
    return res.status(400).json({ success: false, message: error.message });
  }
  return next(error);
}

function validateId(id, res) {
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({ success: false, message: "Invalid category ID." });
    return false;
  }
  return true;
}

function parseCodeNumber(code) {
  const match = /^CAT-(\d+)$/i.exec(code || "");
  return match ? Number(match[1]) : 0;
}

async function makeNextCode() {
  const existing = await Category.find({}, { code: 1 }).lean();
  const highest = existing.reduce((max, category) => Math.max(max, parseCodeNumber(category.code)), 0);
  return `CAT-${String(highest + 1).padStart(2, "0")}`;
}

function idString(value) {
  if (!value) return "";
  if (typeof value === "object") return String(value._id || value.id || value);
  return String(value);
}

async function addProductStats(categories) {
  const products = await Category.db.collection("products").find({}, {
    projection: { categoryId: 1, category: 1, categoryName: 1, sku: 1, onHand: 1, unitCost: 1 },
  }).toArray();
  if (!categories.length) return { categories: [], unassignedProducts: products.length };

  const summaries = new Map(categories.map((category) => [String(category._id), {
    productCount: 0,
    units: 0,
    value: 0,
    skus: [],
  }]));
  const byName = new Map(categories.map((category) => [category.name.trim().toLowerCase(), String(category._id)]));
  let unassignedProducts = 0;

  for (const product of products) {
    const references = [product.categoryId, product.category, product.categoryName]
      .filter(Boolean)
      .map(idString);
    const categoryId = references.find((reference) => summaries.has(reference))
      || references.map((reference) => byName.get(reference.trim().toLowerCase())).find(Boolean);
    if (!categoryId) {
      unassignedProducts += 1;
      continue;
    }

    const summary = summaries.get(categoryId);
    const units = Number(product.onHand) || 0;
    summary.productCount += 1;
    summary.units += units;
    summary.value += units * (Number(product.unitCost) || 0);
    if (product.sku && !summary.skus.includes(product.sku)) summary.skus.push(product.sku);
  }

  return {
    categories: categories.map((category) => ({
      ...category.toJSON(),
      ...summaries.get(String(category._id)),
    })),
    unassignedProducts,
  };
}

async function listCategories(req, res, next) {
  try {
    const categories = await Category.find().sort({ code: 1 });
    const result = await addProductStats(categories);
    return res.json({
      success: true,
      categories: result.categories,
      stats: { unassignedProducts: result.unassignedProducts },
    });
  } catch (error) {
    return respondWithError(error, res, next);
  }
}

async function getCategory(req, res, next) {
  if (!validateId(req.params.id, res)) return;
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: "Category not found." });
    const result = await addProductStats([category]);
    return res.json({ success: true, category: result.categories[0] });
  } catch (error) {
    return respondWithError(error, res, next);
  }
}

async function createCategory(req, res, next) {
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const description = typeof req.body?.description === "string" ? req.body.description.trim() : "";
  if (!name) return res.status(400).json({ success: false, message: "Category name is required." });

  try {
    const category = await Category.create({ code: await makeNextCode(), name, description });
    const result = await addProductStats([category]);
    return res.status(201).json({ success: true, category: result.categories[0] });
  } catch (error) {
    return respondWithError(error, res, next);
  }
}

async function updateCategory(req, res, next) {
  if (!validateId(req.params.id, res)) return;
  const updates = {};
  if (Object.hasOwn(req.body || {}, "name")) {
    updates.name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    if (!updates.name) return res.status(400).json({ success: false, message: "Category name is required." });
  }
  if (Object.hasOwn(req.body || {}, "description")) {
    if (typeof req.body.description !== "string") {
      return res.status(400).json({ success: false, message: "Category description must be text." });
    }
    updates.description = req.body.description.trim();
  }
  if (!Object.keys(updates).length) {
    return res.status(400).json({ success: false, message: "Provide a category name or description to update." });
  }

  try {
    const category = await Category.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!category) return res.status(404).json({ success: false, message: "Category not found." });
    const result = await addProductStats([category]);
    return res.json({ success: true, category: result.categories[0] });
  } catch (error) {
    return respondWithError(error, res, next);
  }
}

async function deleteCategory(req, res, next) {
  if (!validateId(req.params.id, res)) return;
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: "Category not found." });

    const categoryId = category._id;
    const product = await Category.db.collection("products").findOne(
      {
        $or: [
          { categoryId },
          { categoryId: categoryId.toString() },
          { category: categoryId },
          { category: categoryId.toString() },
          { category: category.name },
          { categoryName: category.name },
        ],
      },
      { projection: { _id: 1 } }
    );

    if (product) {
      return res.status(409).json({
        success: false,
        message: "Cannot delete a category while products belong to it.",
      });
    }

    await category.deleteOne();
    return res.json({ success: true, message: "Category deleted." });
  } catch (error) {
    return respondWithError(error, res, next);
  }
}

module.exports = { listCategories, getCategory, createCategory, updateCategory, deleteCategory };
