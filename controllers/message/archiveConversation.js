const createError = require("http-errors");
const ArchiveConversation = require("../../models/ArchiveConversation");

// const {
//   createMessageGroupValidation,
// } = require("../../services/validation_schema");

/**
 * Create a messaging group
 * @param {Array<ObjectId>} users - users _id list
 */
const archiveConversation = async (req, res, next) => {
  const { _id: userId } = req.user.data;

  const { conversationId, archvieUser } = req.body;
  try {
    const archiveUser = await ArchiveConversation.create({
      conversationId: conversationId,
      to: archvieUser,
      from: userId,
    });
    return res.status(200).json({
      message: "success",
      data: archiveUser,
    });
  } catch (error) {
    console.log("create group error: ", error);
    next(error);
  }
};

module.exports = archiveConversation;
