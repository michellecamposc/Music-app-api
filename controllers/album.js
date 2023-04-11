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
      year: savedAlbum.year
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Error saving album",
    });
  }
};

module.exports = {
  test,
  save
}