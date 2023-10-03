const { Schema, model } = require("mongoose");

const userFollowSchema = new Schema(
  {
    from: { type: Schema.Types.ObjectId, ref: "User" },  //!following inc
    to: { type: Schema.Types.ObjectId, ref: "User" },  ///!follower inc
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const UserFollow = model("UserFollow", userFollowSchema, "userfollows");

module.exports = UserFollow;
