// Just for testing
const test = (req, res) => {
  return res.status(200).send({
    status: "success",
    message: "Sent message from: controllers/album.js",
  });
};


module.exports = {
  test
}