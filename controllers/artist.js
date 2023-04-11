const fs = require("fs");
const path = require("path");
const mime = require("mime");

//Importing models
const Artist = require("../models/artist");
const Album = require("../models/album");
const Song = require("../models/song");

// Just for testing
const test = (req, res) => {
  return res.status(200).send({
    status: "success",
    message: "Sent message from: controllers/artists.js",
  });
};

// Save artist
const saveArtist = async (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) {
    return res.status(400).send({
      status: "error",
      message: "You need to send the artist information",
    });
  }

  // Create and fill the model object
  let newArtist = new Artist({ name: name, description: description });
  newArtist.user = req.user.id;

  // Save the object in database
  try {
    const savedArtist = await newArtist.save();
    return res.status(200).send({
      status: "success",
      message: "Artist was saved",
      artist: savedArtist,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Error saving Artist",
    });
  }
};

// Show artist
const oneArtist = async (req, res) => {
  const artistId = req.params.id;

  try {
    const artist = await Artist.findById(artistId);
    return res.status(200).send({
      status: "success",
      message: "Artist details",
      artist,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Error retrieving artist details",
    });
  }
};

// List of artist
const list = async (req, res) => {
  let page = 1;
  if (req.params.page) {
    page = req.params.page;
  }
  const itemsPerPage = 5;

  try {
    const listArtists = await Artist.paginate(
      {},
      {
        page: page,
        limit: itemsPerPage,
        sort: "name",
      }
    );

    return res.status(200).send({
      status: "success",
      Artists: listArtists.docs,
      totalPages: listArtists.totalPages,
      totalArtists: listArtists.totalDocs,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

// Update artist in database
const update = async (req, res) => {
  const artistId = req.params.id;
  let data = req.body;

  try {
    // Find and update artist
    const updatedArtist = await Artist.findByIdAndUpdate(artistId, data, {
      new: true,
    });

    // Response with success
    return res.status(200).json({
      status: "success",
      message: "Artist updated successfully",
      artistId: updatedArtist,
    });
  } catch (error) {
    // Response with error message and error object
    return res.status(500).json({
      status: "error",
      message: "Failed to update artist",
      error: error.message,
    });
  }
};

// Delete an artist
const remove = async (req, res) => {
  const artistId = req.params.id;
  try {
    // Find and delete the artist
    const artistRemoved = await Artist.findByIdAndDelete(artistId);

    // Find and delete the albums
    const albumsRemoved = await Album.find({ artist: artistId });
    for (const album of albumsRemoved) {
      // Find and delete the songs for this album
      await Song.deleteMany({ album: album._id });
      await album.remove();
    }


    // If artist doesn't exist
    if (artistRemoved.deletedCount === 0) {
      return res.status(404).send({
        status: "error",
        message: "Artist not found",
      });
    }
    // Return the result
    return res.status(200).send({
      status: "success",
      message: "Artist was deleted",
      artistRemoved,
      albumsRemoved,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Error deleting artist",
    });
  }
};

// Upload an image
const upload = async (req, res) => {
  const artistId = req.params.id;
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
    // Find and update the artist image
    let artistImageUpdated = await Artist.findOneAndUpdate(
      { _id: artistId },
      { image: req.file.filename },
      { new: true }
    );
    try {
      if (!artistImageUpdated) {
        return res.status(404).send({
          status: "error",
          message: "Failed to update",
        });
      }
      return res.status(200).send({
        status: "success",
        artist: artistImageUpdated,
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
  const filePath = path.resolve(`./uploads/artists/${file}`);

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
  saveArtist,
  oneArtist,
  list,
  update,
  remove,
  upload,
  image,
};
