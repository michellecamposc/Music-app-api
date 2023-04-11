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

module.exports = {
  test,
  saveSong,
};
