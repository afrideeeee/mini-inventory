require("dotenv").config();

const app = require("./app");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!MONGODB_URI || !process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error("Set MONGO_URI (or MONGODB_URI) and a JWT_SECRET of at least 32 characters.");
}

mongoose.connect(MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Inventory API running on port ${PORT}`));
  })
  .catch((error) => {
    console.error("Could not connect to MongoDB:", error.message);
    process.exit(1);
  });
