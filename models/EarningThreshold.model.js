const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// create a schema
const EarningThresholdSchema = new Schema(
  {
    type: { type: String, required: true, enum: ["LIKE", "VIEW", "INVITE"] },
    limit: { type: Number, required: true, default: 1 },
    rewardCoins: { type: Number, required: true, default: 1 },
    ratioPerUnit: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);
// we need to create a model using it
const EarningThreshold = mongoose.model(
  "EarningThreshold",
  EarningThresholdSchema,
  "earningThreshold"
);

// make this available to our users in our Node applications
module.exports = EarningThreshold;
