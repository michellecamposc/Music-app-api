const Artist = require("../models/artist");

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

    // Find and delete song

    // Find and delete albums

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
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Error deleting artist",
    });
  }
};

module.exports = {
  test,
  saveArtist,
  oneArtist,
  list,
  update,
  remove,
};
