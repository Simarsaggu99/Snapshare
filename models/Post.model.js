const dayjs = require("dayjs");
const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    description: { type: String },
    media: [
      {
        url: { type: String },
        type: { type: String, default: "image" },
      },
    ],
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isRePosted: { type: Boolean, default: false },
    repostedBy: { type: Schema.Types.ObjectId, ref: "User" },
    rePostedID: { type: Schema.Types.ObjectId, ref: "Post" },
    like_count: { type: Number, default: 0 },
    tags: [{ type: String }],
    comment_count: { type: Number, default: 0 },
    date: { type: String, default: dayjs().format("DD MM YYYY") },
    reportExceed: { type: Boolean, default: false },
    isMemeContest: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    bounty: { type: Schema.Types.ObjectId, ref: "bounty" },
    memeContestLikes: { type: Number, default: 0 },
    postReach: { type: Number, default: 0 },
    postPopularity: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// we need to create a model using it
const Post = model("Post", postSchema, "post");

// make this available to our users in our Node applications
module.exports = Post;
