const fs = require("fs");
const path = require("path");
const mime = require("mime");

const Song = require("../models/song");

// Just for testing
const test = (req, res) => {
  return res.status(200).send({
    status: "success",
    message: "Sent message from: controllers/song.js",
  });
};

// Save song
const saveSong = async (req, res) => {
  const params = req.body;
  console.log(params);
  if (!params) {
    return res.status(400).send({
      status: "error",
      message: "You need to send the song information",
    });
  }

  // Create and fill the model object
  let song = new Song(params);

  // Save the object in database
  try {
    const savedSong = await song.save();
    return res.status(200).send({
      status: "success",
      message: "song was saved",
      song: savedSong,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Error saving song",
    });
  }
};

// Show a song
const oneSong = async (req, res) => {
  const songId = req.params.id;

  try {
    const song = await Song.findById(songId).populate("album");
    return res.status(200).send({
      status: "success",
      message: "Song details",
      song,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Error retrieving song details",
    });
  }
};

// List of songs on an album
const list = async (req, res) => {
  const albumId = req.params.albumId;

  try {
    const listSongs = await Song.find({ album: albumId })
      .sort("track")
      .populate({
        path: "album",
        populate: { path: "artist", model: "Artist" },
      });

    return res.status(200).send({
      status: "success",
      listSongs,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

// Update song in database
const update = async (req, res) => {
  const songId = req.params.id;
  let data = req.body;

  try {
    // Find and update song
    const updatedsong = await Song.findByIdAndUpdate(songId, data, {
      new: true,
    });

    // Response with success
    return res.status(200).json({
      status: "success",
      message: "Song updated successfully",
      updatedsong,
    });
  } catch (error) {
    // Response with error message and error object
    return res.status(500).json({
      status: "error",
      message: "Failed to update song",
      error: error.message,
    });
  }
};

// Delete an song
const remove = async (req, res) => {
  const songId = req.params.id;

  try {
    // Find and delete the song
    const songRemoved = await Song.findByIdAndRemove(songId);

    // If song doesn't exist
    if (songRemoved.deletedCount === 0) {
      return res.status(404).send({
        status: "error",
        message: "Song not found",
      });
    }
    // Return the result
    return res.status(200).send({
      status: "success",
      message: "Song was deleted",
      songRemoved,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Error deleting song",
    });
  }
};

// Upload an audio
const upload = async (req, res) => {
  const songId = req.params.id;
  // If an image has not been uploaded
  if (!req.file) {
    return res.status(400).json({
      status: "error",
      message: "The request doesn't include the file",
    });
  }

  // Know the file extension
  let fileName = req.file.originalname;
  const fileExtension = path.extname(fileName);

  //Verify the file extension is mp3
  const audioFile = mime.lookup(fileExtension).match(/^audio\//);

  if (!audioFile) {
    // Delete the file
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.log(err);
      }
    });

    return res.status(400).json({
      status: "error",
      message: "Only files are allowed",
    });
  } else {
    // Find and update the file
    let songUpdated = await Song.findOneAndUpdate(
      { _id: songId },
      { file: req.file.filename },
      { new: true }
    );
    try {
      if (!songUpdated) {
        return res.status(404).send({
          status: "error",
          message: "Failed to update",
        });
      }
      return res.status(200).send({
        status: "success",
        Song: songUpdated,
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

// Show a file
const audio = async (req, res) => {
  const file = req.params.file;
  // Path of the file
  const filePath = path.resolve(`./uploads/songs/${file}`);

  // Check if exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).send({
      status: "error",
      message: "The file doesn't exist",
    });
  }

  // Return the file
  return res.status(200).sendFile(filePath);
};


module.exports = {
  test,
  saveSong,
  oneSong,
  list,
  update,
  remove,
  upload,
  audio
};
