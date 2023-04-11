const express = require("express");
const router = express.Router();
const check = require("../middlewares/auth");
const SongController = require("../controllers/song");

const multer = require("multer");
// Storage config multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/songs/");
  },
  filename: (req, file, cb) => {
    const fileName = `song_${Date.now()}_${file.originalname}`;
    cb(null, fileName);
  },
});

// Middleware
const uploads = multer({ storage });


// Define routes
router.get("/test", SongController.test);
router.post("/save", check.auth, SongController.saveSong);
router.get("/one/:id", check.auth, SongController.oneSong);
router.get("/list/albumId", check.auth, SongController.list);
router.put("/update/:id", check.auth, SongController.update);
router.delete("/remove/:id", check.auth, SongController.remove);
router.post(
  "/upload/:id",
  [check.auth, uploads.single("file0")],
  SongController.upload
);
router.get("/audio/:file", SongController.audio);


// Export router
module.exports = router;
