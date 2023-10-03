const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// create a schema
const MemeContestWinner = new Schema(
  {
    end_time: { type: Date },
    endDate: { type: Date },
    meme_coins: { type: Number, required: true },
    meme_contest_like: { type: Number, required: true },

    userId: { type: Schema.Types.ObjectId, ref: "User" },
    postId: { type: Schema.Types.ObjectId, ref: "Post" },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);
// we need to create a model using it
const MemeContestWinnerModel = mongoose.model(
  "contestWinner",
  MemeContestWinner,
  "contestWinner"
);

// make this  available to our users in our Node applications
module.exports = MemeContestWinnerModel;
