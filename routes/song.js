const express = require("express");
const router = express.Router();
const SongController = require("../controllers/song");

// Define routes
router.get("/test", SongController.test);

// Export router
module.exports = router;