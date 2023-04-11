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
        sort: "name"
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

module.exports = {
  test,
  saveArtist,
  oneArtist,
  list,
};
