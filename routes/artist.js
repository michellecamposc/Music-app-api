const express = require("express");
const router = express.Router();
const ArtistController = require("../controllers/artist");
const check = require("../middlewares/auth");

const multer = require("multer");
// Storage config multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/artists");
  },
  filename: (req, file, cb) => {
    const fileName = `artist_${Date.now()}_${file.originalname}`;
    cb(null, fileName);
  },
});

// Middleware
const uploads = multer({ storage });

// Define routes
router.get("/test", ArtistController.test);
router.post("/save", check.auth, ArtistController.saveArtist);
router.get("/one/:id", check.auth, ArtistController.oneArtist);
router.get("/list/:page?", check.auth, ArtistController.list);
router.put("/update/:id", check.auth, ArtistController.update);
router.delete("/delete/:id", check.auth, ArtistController.remove);
router.post(
  "/upload/:id",
  [check.auth, uploads.single("file0")],
  ArtistController.upload
);
router.get("/image/:file", ArtistController.image);

// Export router
module.exports = router;
