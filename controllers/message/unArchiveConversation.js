const createError = require("http-errors");
const ArchiveConversation = require("../../models/ArchiveConversation");
const { ObjectId } = require("mongoose").Types;

/**
 * Create a messaging group
 * @param {Array<ObjectId>} users - users _id list
 */
const unArchiveConversation = async (req, res, next) => {
  const { _id: userId } = req.user.data;
  const { id } = req.params;
  try {
    const unarchiveUser = await ArchiveConversation.findOneAndDelete({
      $and: [{ conversationId: id }, { from: userId }],
      //   conversation: id,
    });
    return res.status(200).json({
      message: "success",
      data: unarchiveUser,
    });
  } catch (error) {
    console.log("create group error: ", error);
    next(error);
  }
};

module.exports = unArchiveConversation;
