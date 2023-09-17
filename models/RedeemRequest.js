const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// create a schema
const redeemRequestSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    memeCoins: {
      type: Number,
    },
    paymentId: {
      type: String,
    },
    paymentMethod: {
      type: String,
    },
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Accepted", "Reject", "Complete"],
    },
    reason: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);
// we need to create a model using it
//rePostSchema.index({post_id: 1, user: 1}, {unique: true});
const RedeemRequest = mongoose.model(
  "redeem",
  redeemRequestSchema,
  "redeemRequest"
);

// make this available to our users in our Node applications
module.exports = RedeemRequest;
