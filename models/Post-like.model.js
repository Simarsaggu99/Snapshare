const dayjs = require("dayjs");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostLikeSchema = new Schema(
  {
    post_id: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    postUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, default: dayjs().format("DD MM YYYY") },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// we need to create a model using it
PostLikeSchema.index({post_id: 1, user: 1}, {unique: true});
const PostLike = mongoose.model("PostLike", PostLikeSchema, "postlike");

// make this available to our users in our Node applications
module.exports = PostLike;
