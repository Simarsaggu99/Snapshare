const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// create a schema
const SpankeeSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: { type: String },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);
// we need to create a model using it
const SpankeeModel = mongoose.model("spankee", SpankeeSchema, "spankee");

// make this available to our users in our Node applications
module.exports = SpankeeModel;
