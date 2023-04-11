const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const SongSchema = Schema({
  album: {
    type: Schema.ObjectId,
    ref: "Album",
  },
  track: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  file: {
    type: String,
    default: "default.mp3"
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// Add pagination plugin to Schema
SongSchema.plugin(mongoosePaginate);

// Export module
module.exports = model("Song", SongSchema, "songs");
