const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const rePortSchema = new Schema(
  {
    post_id: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reportedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
    },
    reason: {
      type: String,
      enum: [
        "spam",
        "bullying_or_harassment",
        "scams_or_fraud",
        "false_information",
        "nudity_or_sexual_activity",
        "hate_speech_or_symbols",
        "other",
      ],
      required: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// we need to create a model using it
const Report = mongoose.model("Report", rePortSchema, "report");

// make this available to our users in our Node applications
module.exports = Report;
