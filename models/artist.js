const { Schema, model } = require("mongoose");

const ArtistSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: String,
    default: "default.png"
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// Export module
module.exports = model("Artist", ArtistSchema, "artists");
