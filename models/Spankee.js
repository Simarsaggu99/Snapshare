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
const SpankeeModel = mongoose.model("spankee", SpankeeSchema, "spankee");

module.exports = SpankeeModel;
