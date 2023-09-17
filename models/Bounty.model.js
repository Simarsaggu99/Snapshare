const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// create a schema
const BountySchema = new Schema(
  {
    description: { type: String, required: true, trim: true },
    start_time: { type: Date },
    end_time: { type: Date },
    endDate: { type: Date },
    startDate: { type: Date },
    meme_coins: { type: Number, required: true },
    totalAttempts: { type: Number },
    totalQuestions: { type: Number, required: true },
    status: {
      type: String,
      enum: ["completed", "not_completed"],
      default: "not_completed",
    },
    type: { type: String, required: true },
    question: { type: String },
    correctAnswer: { type: String },
    options: { type: Array },
    answerType: { type: String, enum: ["MCQ", "Text"] },
    bountyType: {
      type: String,
      default: "pending",
      enum: ["live", "expire", "pending"],
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);
// we need to create a model using it
const BountyModel = mongoose.model("bounty", BountySchema, "bounty");

// make this available to our users in our Node applications
module.exports = BountyModel;
