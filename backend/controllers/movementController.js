const mongoose = require("mongoose");
const Movement = require("../models/Movement");
const Product = require("../models/Product");

function todayInPakistan() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Karachi",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function serialize(movement) {
  const value = movement.toJSON();
  return { ...value, id: `MOV-${String(value._id).toUpperCase()}` };
}

function movementInput(body) {
  const productId = String(body?.productId || "");
  const type = body?.type;
  const quantity = Number(body?.quantity);
  const reason = typeof body?.reason === "string" ? body.reason.trim() : "";
  const date = typeof body?.date === "string" ? body.date.trim() : "";

  if (!mongoose.isValidObjectId(productId)) throw Object.assign(new Error("Select a valid product."), { status: 400 });
  if (type !== "in" && type !== "out") throw Object.assign(new Error("Movement type must be stock-in or stock-out."), { status: 400 });
  if (!Number.isSafeInteger(quantity) || quantity <= 0) throw Object.assign(new Error("Quantity must be a positive whole number."), { status: 400 });
  if (!reason || reason.length > 120) throw Object.assign(new Error("Select a valid reason."), { status: 400 });
  const parsedDate = new Date(`${date}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== date) {
    throw Object.assign(new Error("Enter a valid movement date."), { status: 400 });
  }
  if (date > todayInPakistan()) {
    throw Object.assign(new Error("Movement date cannot be in the future."), { status: 400 });
  }
  return { productId, type, quantity, reason, date };
}

async function listMovements(req, res, next) {
  try {
    const movements = await Movement.find().sort({ createdAt: -1 }).lean();
    return res.json({
      success: true,
      movements: movements.map((movement) => ({ ...movement, id: `MOV-${String(movement._id).toUpperCase()}` })),
    });
  } catch (error) { return next(error); }
}

async function createMovement(req, res, next) {
  let session;
  try {
    const input = movementInput(req.body);
    session = await mongoose.startSession();
    let result;

    await session.withTransaction(async () => {
      const product = await Product.findById(input.productId).session(session);
      if (!product) throw Object.assign(new Error("Product not found."), { status: 404 });

      const balanceBefore = product.onHand;
      if (input.type === "out" && input.quantity > balanceBefore) {
        throw Object.assign(new Error(`Cannot remove ${input.quantity} units. Available stock is ${balanceBefore}.`), { status: 409 });
      }
      const balanceAfter = input.type === "in"
        ? balanceBefore + input.quantity
        : balanceBefore - input.quantity;
      if (!Number.isSafeInteger(balanceAfter)) {
        throw Object.assign(new Error("The resulting stock balance is too large."), { status: 400 });
      }

      const updatedProduct = await Product.findOneAndUpdate(
        { _id: product._id, onHand: balanceBefore },
        { $set: { onHand: balanceAfter } },
        { new: true, session, runValidators: true }
      );
      if (!updatedProduct) throw Object.assign(new Error("Stock changed during this request. Please try again."), { status: 409 });

      const [movement] = await Movement.create([{
        productId: product._id,
        productName: product.name,
        sku: product.sku,
        type: input.type,
        quantity: input.quantity,
        balanceBefore,
        balanceAfter,
        reason: input.reason,
        date: input.date,
        by: req.auth?.email || "Admin",
      }], { session });

      result = {
        product: { id: String(updatedProduct._id), onHand: updatedProduct.onHand },
        movement: serialize(movement),
      };
    });

    return res.status(201).json({ success: true, ...result });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ success: false, message: error.message });
    return next(error);
  } finally {
    if (session) await session.endSession();
  }
}

module.exports = { listMovements, createMovement };
