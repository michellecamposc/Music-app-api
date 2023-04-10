const connection = require("./database/connection");
const express = require("express");
const cors = require("cors");

//Database connection
console.log("Node API for music App initialized");
connection();

// Create node server
const app = express();
const port = 3910;

// Cors config
app.use(cors());

// Convert the data of the body to json objects
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Load routes
const userRoute = require("./routes/user");
const artistRoute = require("./routes/artist");
const albumRoute = require("./routes/album");
const songRoute = require("./routes/song");

app.use("/api/user", userRoute);
app.use("/api/artist", artistRoute);
app.use("/api/album", albumRoute);
app.use("/api/song", songRoute);

// Listening to http requests
app.listen(port, () => {
  console.log("Node server", port);
});
