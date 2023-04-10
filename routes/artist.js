const express = require("express");
const router = express.Router();
const ArtistController = require("../controllers/artist");

// Define routes
router.get("/test", ArtistController.test);

// Export router
module.exports = router;