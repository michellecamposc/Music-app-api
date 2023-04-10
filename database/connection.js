const mongoose = require("mongoose");

// Connection to database with mongoose
const connection = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27019/musicApp");

    console.log("Connected successfully to database musicApp");

  } catch (err) {
    console.log(err);
    throw new Error("Failed to connect to the database");
  }
};

module.exports = connection;