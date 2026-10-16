const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const movementController = require("../controllers/movementController");

const router = express.Router();
router.use(requireAuth);
router.get("/", movementController.listMovements);
router.post("/", movementController.createMovement);

module.exports = router;
