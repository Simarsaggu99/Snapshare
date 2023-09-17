const dayjs = require("dayjs");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// create a schema
const ArchiveConversationSchema = new Schema(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "conversationCategory",
      required: true,
    },
    to: { type: Schema.Types.ObjectId, ref: "User", required: true }, // kinu kiti aa
    from: { type: Schema.Types.ObjectId, ref: "User", required: true }, // kine kiti aa
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);
// the schema is useless so far
// we need to create a model using it
const ArchiveConversation = mongoose.model(
  "archive",
  ArchiveConversationSchema,
  "archive"
);

// make this available to our users in our Node applications
module.exports = ArchiveConversation;
