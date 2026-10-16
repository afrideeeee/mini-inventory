const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const movementRoutes = require("./routes/movementRoutes");
const requireAuth = require("./middleware/requireAuth");

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/movements", movementRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Inventory Management API is running."
  });
});

// Mount inventory API routers below this line so every business route requires a JWT.
app.use("/api", requireAuth);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: "An unexpected server error occurred." });
});

module.exports = app;
