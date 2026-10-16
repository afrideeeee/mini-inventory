const mongoose = require("mongoose");

const movementSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    productName: { type: String, required: true, trim: true },
    sku: { type: String, required: true, trim: true },
    type: { type: String, enum: ["in", "out"], required: true },
    quantity: { type: Number, required: true, min: 1 },
    balanceBefore: { type: Number, required: true, min: 0 },
    balanceAfter: { type: Number, required: true, min: 0 },
    reason: { type: String, required: true, trim: true, maxlength: 120 },
    date: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
    by: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

movementSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Movement", movementSchema);
