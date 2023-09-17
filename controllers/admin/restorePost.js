const createError = require("http-errors");
const Post = require("../../models/Post.model");
const Wallet = require("../../models/Wallet.model");
const Report = require("../../models/Report.model");
const restorePostNotification = require("../../services/notifications/post/restorePostNotification");
const { ObjectId } = require("mongoose").Types;

const restorePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const { _id: id } = req.user.data;
    if (!postId) {
      throw createError.BadRequest("Post id is required");
    }
    const postUser = await Post.findOneAndUpdate(
      {
        _id: ObjectId(postId),
      },
      {
        reportExceed: false,
      },
      {
        new: true,
      }
    );

    const report = await Report.find({
      post_id: ObjectId(postId),
    });

    report?.map(async (item) => {
      await Wallet.findOneAndUpdate(
        {
          user: ObjectId(item?.reportedBy),
        },
        {
          $inc: { meme_coins: -1 },
        },
        {
          new: true,
        }
      );
    });

    report?.map(async (item) => {
      await Report.findOneAndDelete({
        _id: item._id,
      });
    });
    restorePostNotification(id, report?.[0]?.userId, postId, req.io);

    res.json({
      message: "post restored successfully!",
    });
  } catch (error) {
    next(error);
  }
};
module.exports = restorePost;
