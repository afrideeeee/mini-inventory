const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 160 },
    sku: { type: String, required: true, unique: true, trim: true, uppercase: true, maxlength: 80 },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    unitCost: { type: Number, required: true, min: 0 },
    unitOfMeasure: { type: String, required: true, trim: true, default: "Piece (pc)" },
    description: { type: String, default: "", trim: true, maxlength: 1000 },
    minLevel: { type: Number, required: true, min: 0, default: 0 },
    bin: { type: String, default: "", trim: true, maxlength: 80 },
    onHand: { type: Number, min: 0, default: 0 },
    createdBy: { type: String, default: "", trim: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

module.exports = mongoose.model("Product", productSchema);
