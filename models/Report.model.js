const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// create a schema
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
    // category:{
    // type :String ,
    // enum:["Repost","Telegram","Instagram","Pintrest","Tumbller","Twitter","Whatsapp","Facebook"],
    // required:true}
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);
// we need to create a model using it
//rePostSchema.index({post_id: 1, user: 1}, {unique: true});
const Report = mongoose.model("Report", rePortSchema, "report");

// make this available to our users in our Node applications
module.exports = Report;
