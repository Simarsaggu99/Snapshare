const dayjs = require("dayjs");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserBountySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bountyProgramId: {
      type: Schema.Types.ObjectId,
      ref: "Bounty",
      required: true,
    },
    userAnswer: {
      type: String,
    },
    correctAnswer: { type: String },
    result: { type: String, enum: ["win", "lose"] },
    date: { type: String, default: dayjs().format("DD MM YYYY") },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const UserBountyModel = mongoose.model("userBounty", UserBountySchema);

module.exports = UserBountyModel;
