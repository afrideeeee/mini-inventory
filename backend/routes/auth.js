const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/login", authController.login);
router.get("/me", requireAuth, userController.getCurrentUser);

module.exports = router;
