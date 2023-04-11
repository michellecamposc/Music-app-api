const express = require("express");
const router = express.Router();
const ArtistController = require("../controllers/artist");
const check = require("../middlewares/auth");


// Define routes
router.get("/test", ArtistController.test);
router.post("/save", check.auth, ArtistController.saveArtist);
router.get("/one/:id", check.auth, ArtistController.oneArtist);
router.get("/list/:page?", check.auth, ArtistController.list);
router.put("/update/:id", check.auth, ArtistController.update);
router.delete("/delete/:id", check.auth, ArtistController.remove);


// Export router
module.exports = router;