const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");

// Define routes
router.get("/test", UserController.test);
router.post("/register", UserController.register);
router.post("/login", UserController.login);



// Export router
module.exports = router;