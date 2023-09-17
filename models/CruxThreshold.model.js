const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create a schema
const CruxThresholdSchema = new Schema(
  {
    label: { type: String, required: true },
    description: { type: String, required: true },
    serviceLabel: { type: String, required: true },
    service: { type: String, required: true },
    level: { type: Number, required: true },
    rewardCoins: { type: Number, required: true, default: 1 },
    levelTriggerThreshold: { type: Number, required: true },
    cruxTrigger: {
      type: String,
      required: true,
      enum: ["PROFILE_COMPLETE", "POST", "FOLLOWER", "VIEW"],
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);
// we need to create a model using it
const CruxThreshold = mongoose.model(
  "CruxThreshold",
  CruxThresholdSchema,
  "cruxThreshold"
);

// make this available to our users in our Node applications
module.exports = CruxThreshold;
