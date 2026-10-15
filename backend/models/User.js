const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    singletonKey: { type: String, required: true, unique: true, default: "admin", enum: ["admin"] },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    name: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
