const express = require("express");
const router = express.Router();
const AlbumController = require("../controllers/album");

// Define routes
router.get("/test", AlbumController.test);

// Export router
module.exports = router;