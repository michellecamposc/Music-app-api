const express = require("express");
const router = express.Router();
const ArtistController = require("../controllers/artist");
const check = require("../middlewares/auth");


// Define routes
router.get("/test", ArtistController.test);
router.post("/save", check.auth, ArtistController.saveArtist);
router.get("/one/:id", check.auth, ArtistController.oneArtist);
router.get("/list/:page?", check.auth, ArtistController.list);



// Export router
module.exports = router;