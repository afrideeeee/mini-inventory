const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, unique: true, trim: true, maxlength: 100 },
    description: { type: String, default: "", trim: true, maxlength: 500 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("Category", categorySchema);
