require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

async function seedAdmin() {
  const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
  const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME = "Admin" } = process.env;
  if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error("Set MONGO_URI (or MONGODB_URI), ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env before seeding.");
  }
  if (ADMIN_PASSWORD.length < 8) throw new Error("ADMIN_PASSWORD must be at least 8 characters.");

  const normalizedEmail = ADMIN_EMAIL.trim().toLowerCase();

  await mongoose.connect(MONGODB_URI);
  await User.init();
  const existing = await User.findOne();
  if (existing) throw new Error("An admin user already exists; seed only runs for an empty user collection.");

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await User.create({ singletonKey: "admin", email: normalizedEmail, name: ADMIN_NAME, passwordHash });
  console.log(`Created the single admin account for ${normalizedEmail}.`);
}

seedAdmin()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (mongoose.connection.readyState) await mongoose.disconnect();
  });
