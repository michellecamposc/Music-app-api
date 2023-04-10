const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");

// Define routes
router.get("/test", UserController.test);

// Export router
module.exports = router;