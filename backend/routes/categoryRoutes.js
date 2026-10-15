const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const categoryController = require("../controllers/categoryController");

const router = express.Router();

router.use(requireAuth);
router.get("/", categoryController.listCategories);
router.get("/:id", categoryController.getCategory);
router.post("/", categoryController.createCategory);
router.put("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
