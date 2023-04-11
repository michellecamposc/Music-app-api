const express = require("express");
const router = express.Router();
const AlbumController = require("../controllers/album");
const check = require("../middlewares/auth");

// Define routes
router.get("/test", AlbumController.test);
router.post("/save", check.auth, AlbumController.save);

// Export router
module.exports = router;
