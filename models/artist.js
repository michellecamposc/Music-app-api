const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");


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

// Add pagination plugin to UserSchema
ArtistSchema.plugin(mongoosePaginate);

// Export module
module.exports = model("Artist", ArtistSchema, "artists");
