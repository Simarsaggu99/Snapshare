const dayjs = require("dayjs");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PostShareSchema = new Schema(
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

const PostShare = mongoose.model("PostShare", PostShareSchema, "PostShare");

module.exports = PostShare;
