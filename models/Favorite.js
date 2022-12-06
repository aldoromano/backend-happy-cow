const mongoose = require("mongoose");

const Favorite = mongoose.model("Favorite", {
  placeId: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = Favorite;
