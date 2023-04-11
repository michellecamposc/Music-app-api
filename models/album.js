const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const AlbumSchema = Schema({
  artist: {
    type: Schema.ObjectId,
    ref: "Artist",
  },
  title: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  description: String,
  image: {
    type: String,
    default: "default.png",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// Add pagination plugin to AlbumSchema
AlbumSchema.plugin(mongoosePaginate);

// Export module
module.exports = model("Album", AlbumSchema, "albums");
