const { Schema, model } = require("mongoose");

const blacklist = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  token: {
    type: String,
    required: true,
  },
});

const blacklistToken = model("blacklist", blacklist, "blacklist");

module.exports = blacklistToken;
