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
    to: { type: Schema.Types.ObjectId, ref: "User", required: true },
    from: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);
const ArchiveConversation = mongoose.model(
  "archive",
  ArchiveConversationSchema,
  "archive"
);

//  make this available to our users in our Node applications
module.exports = ArchiveConversation;
