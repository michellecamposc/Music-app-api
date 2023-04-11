const express = require("express");
const router = express.Router();
const SongController = require("../controllers/song");
const check = require("../middlewares/auth");

// Define routes
router.get("/test", SongController.test);
router.post("/save", check.auth, SongController.saveSong);

// Export router
module.exports = router;