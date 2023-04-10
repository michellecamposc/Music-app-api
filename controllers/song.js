// Just for testing
const test = (req, res) => {
  return res.status(200).send({
    status: "success",
    message: "Sent message from: controllers/song.js",
  });
};


module.exports = {
  test
}