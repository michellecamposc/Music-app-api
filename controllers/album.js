const fs = require("fs");
const path = require("path");
const mime = require("mime");

// Exporting model
const Album = require("../models/album");

// Just for testing
const test = (req, res) => {
  return res.status(200).send({
    status: "success",
    message: "Sent message from: controllers/album.js",
  });
};

// Save album
const save = async (req, res) => {
  const params = req.body;
  if (!params) {
    return res.status(400).send({
      status: "error",
      message: "You need to send the information",
    });
  }
  // Create and fill the model object
  let album = new Album(params);
  album.user = req.user.id;

  // Save the object in database
  try {
    const savedAlbum = await album.save();
    return res.status(200).send({
      status: "success",
      message: "Album was saved",
      title: savedAlbum.title,
      artist: savedAlbum.artist,
      description: savedAlbum.description,
      year: savedAlbum.year,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Error saving album",
    });
  }
};

// Show one album
const oneAlbum = async (req, res) => {
  const albumId = req.params.id;

  try {
    const album = await Album.findById(albumId).populate("artist");
    return res.status(200).send({
      status: "success",
      message: "Album details",
      album,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Album not found",
    });
  }
};

// Album list
const list = async (req, res) => {
  const albumId = req.params.id;

  if (!artistId) {
    return res.status(404).send({
      status: "error",
      message: "No artist found",
    });
  }

  try {
    const album = await Album.find({ artist: artistId }).populate("artist");
    return res.status(200).send({
      status: "success",
      message: "Album details",
      album,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Error retrieving album details",
    });
  }
};

// Update album in database
const update = async (req, res) => {
  const albumId = req.params.albumId;
  let data = req.body;

  try {
    // Find and update album
    const updatedAlbum = await Album.findByIdAndUpdate(albumId, data, {
      new: true,
    });

    // Response with success
    return res.status(200).json({
      status: "success",
      message: "Album updated successfully",
      albumId: updatedAlbum,
    });
  } catch (error) {
    // Response with error message and error object
    return res.status(500).json({
      status: "error",
      message: "Failed to update album",
      error: error.message,
    });
  }
};

// Upload an image
const upload = async (req, res) => {
  const albumId = req.params.id;
  // If an image has not been uploaded
  if (!req.file) {
    return res.status(400).json({
      status: "error",
      message: "The request doesn't include the image",
    });
  }

  // Know the file extension
  let fileName = req.file.originalname;
  const fileExtension = path.extname(fileName);

  //Verify the file extension is an image
  const isImage = mime.lookup(fileExtension).match(/^image\//);

  if (!isImage) {
    // Delete the file
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.log(err);
      }
    });

    return res.status(400).json({
      status: "error",
      message: "Only image files are allowed",
    });
  } else {
    // Find and update the album image
    let albumImageUpdated = await Album.findOneAndUpdate(
      { _id: albumId },
      { image: req.file.filename },
      { new: true }
    );
    try {
      if (!albumImageUpdated) {
        return res.status(404).send({
          status: "error",
          message: "Failed to update",
        });
      }
      return res.status(200).send({
        status: "success",
        album: albumImageUpdated,
        file: req.file,
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Something went wrong!",
      });
    }
  }
};

// Show an image
const image = async (req, res) => {
  const file = req.params.file;
  // Path of the image
  const filePath = path.resolve(`./uploads/albums/${file}`);

  // Check if exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).send({
      status: "error",
      message: "The image doesn't exist",
    });
  }

  // Return the file
  return res.status(200).sendFile(filePath);
};

module.exports = {
  test,
  save,
  oneAlbum,
  list,
  update,
  upload,
  image,
};
