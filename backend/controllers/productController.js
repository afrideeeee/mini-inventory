const mongoose = require("mongoose");
const Product = require("../models/Product");
const Category = require("../models/Category");

function respondWithError(error, res, next) {
  if (error.code === 11000) return res.status(409).json({ success: false, message: "A product with this SKU already exists." });
  if (error.name === "ValidationError" || error.name === "CastError") return res.status(400).json({ success: false, message: error.message });
  return next(error);
}

function validId(id, res) {
  if (mongoose.isValidObjectId(id)) return true;
  res.status(400).json({ success: false, message: "Invalid product ID." });
  return false;
}

function serialize(product) {
  const value = product.toJSON();
  const category = value.categoryId;
  return {
    ...value,
    id: String(value._id),
    categoryId: category?._id ? String(category._id) : String(category || ""),
    category: category?.name || "",
  };
}

async function withCategory(query) {
  return (await query.populate("categoryId", "name")).map(serialize);
}

async function listProducts(req, res, next) {
  try {
    const products = await withCategory(Product.find().sort({ createdAt: 1 }));
    return res.json({ success: true, products });
  } catch (error) { return respondWithError(error, res, next); }
}

async function getProduct(req, res, next) {
  if (!validId(req.params.id, res)) return;
  try {
    const product = await Product.findById(req.params.id).populate("categoryId", "name");
    if (!product) return res.status(404).json({ success: false, message: "Product not found." });
    return res.json({ success: true, product: serialize(product) });
  } catch (error) { return respondWithError(error, res, next); }
}

function productInput(body, requireAll = true) {
  const input = {};
  const fields = ["name", "sku", "categoryId", "unitCost", "unitOfMeasure", "description", "minLevel", "bin"];
  for (const field of fields) {
    if (requireAll || Object.hasOwn(body || {}, field)) {
      if (field === "categoryId") input[field] = body[field];
      else input[field] = body[field];
    }
  }
  if (typeof input.name === "string") input.name = input.name.trim();
  if (typeof input.sku === "string") input.sku = input.sku.trim().toUpperCase();
  if (typeof input.categoryId === "string" && mongoose.isValidObjectId(input.categoryId)) input.categoryId = new mongoose.Types.ObjectId(input.categoryId);
  if (!input.name) throw Object.assign(new Error("Product name is required."), { name: "ValidationError" });
  if (!input.sku) throw Object.assign(new Error("SKU is required."), { name: "ValidationError" });
  if (!mongoose.isValidObjectId(input.categoryId)) throw Object.assign(new Error("A valid category is required."), { name: "ValidationError" });
  for (const field of ["unitCost", "minLevel"]) {
    if (input[field] === undefined || input[field] === "" || !Number.isFinite(Number(input[field])) || Number(input[field]) < 0) {
      throw Object.assign(new Error(`${field === "unitCost" ? "Unit cost" : "Minimum stock level"} must be a non-negative number.`), { name: "ValidationError" });
    }
    input[field] = Number(input[field]);
  }
  return input;
}

async function ensureCategory(id) {
  if (!await Category.exists({ _id: id })) throw Object.assign(new Error("Selected category was not found."), { name: "ValidationError" });
}

async function createProduct(req, res, next) {
  try {
    const input = productInput(req.body);
    await ensureCategory(input.categoryId);
    const product = await Product.create({ ...input, createdBy: req.auth?.email || "" });
    await product.populate("categoryId", "name");
    return res.status(201).json({ success: true, product: serialize(product) });
  } catch (error) { return respondWithError(error, res, next); }
}

async function updateProduct(req, res, next) {
  if (!validId(req.params.id, res)) return;
  try {
    const updates = productInput(req.body, false);
    await ensureCategory(updates.categoryId);
    const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).populate("categoryId", "name");
    if (!product) return res.status(404).json({ success: false, message: "Product not found." });
    return res.json({ success: true, product: serialize(product) });
  } catch (error) { return respondWithError(error, res, next); }
}

async function deleteProduct(req, res, next) {
  if (!validId(req.params.id, res)) return;
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found." });
    if (product.onHand > 0) return res.status(409).json({ success: false, message: `Cannot delete product with ${product.onHand} units on hand. Stock it out first.` });
    await product.deleteOne();
    return res.json({ success: true, message: "Product deleted." });
  } catch (error) { return respondWithError(error, res, next); }
}

module.exports = { listProducts, getProduct, createProduct, updateProduct, deleteProduct };
