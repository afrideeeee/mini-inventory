const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const productController = require("../controllers/productController");

const router = express.Router();
router.use(requireAuth);
router.get("/", productController.listProducts);
router.get("/:id", productController.getProduct);
router.post("/", productController.createProduct);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

module.exports = router;
