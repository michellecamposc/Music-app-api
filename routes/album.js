const express = require("express");
const router = express.Router();
const AlbumController = require("../controllers/album");
const check = require("../middlewares/auth");

const multer = require("multer");
// Storage config multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/albums");
  },
  filename: (req, file, cb) => {
    const fileName = `album_${Date.now()}_${file.originalname}`;
    cb(null, fileName);
  },
});

// Middleware
const uploads = multer({ storage });

// Define routes
router.get("/test", AlbumController.test);
router.post("/save", check.auth, AlbumController.save);
router.get("/one/:id", check.auth, AlbumController.oneAlbum);
router.get("/list/:id", check.auth, AlbumController.list);
router.put("/update/:albumId", check.auth, AlbumController.update);
router.post(
  "/upload/:id",
  [check.auth, uploads.single("file0")],
  AlbumController.upload
);
router.get("/image/:file", AlbumController.image);

// Export router
module.exports = router;
