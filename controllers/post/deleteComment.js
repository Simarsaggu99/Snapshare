const createError = require("http-errors");
// import post model
const PostComment = require("../../models/Post-comment.model");
const Post = require("../../models/Post.model");
const Notification = require("../../models/Notification.model");
const User = require("../../models/User.model");
const { ObjectId } = require("mongoose").Types;

const deleteComment = async (req, res, next) => {
  const { _id: userId } = req.user.data;
  try {
    const checkComment = await PostComment.findOne({
      _id: ObjectId(req.params.commentId),
    });
    if (!checkComment) {
      throw createError.InternalServerError("This comment does not exist");
    }
    const comment = await PostComment.deleteOne({
      // post_id: req.params.id,
      // user: userId,
      _id: req.params.commentId,
    });
    const post = await Post.findOne({
      _id: checkComment.post_id,
    });

    await Post.findOneAndUpdate(
      {
        _id: ObjectId(checkComment.post_id),
      },
      {
        $inc: { comment_count: -1 },
      },
      {
        new: true,
      }
    );
    const notificationDetails = await Notification.findOne({
      subject: req.params.commentId,
      actor: ObjectId(userId),
      verb: "comment",
    });

    if (!notificationDetails?.isRead) {
      await User.findOneAndUpdate(
        {
          _id: ObjectId(post.user),
        },
        {
          $inc: { notificationCount: -1 },
        },
        {
          new: true,
        }
      );
    }
    await Notification.findOneAndDelete({
      subject: req.params.commentId,
      actor: userId,
      verb: "comment",
    });
    res.json({ message: "success" });
  } catch (error) {
    next(error);
  }
};

module.exports = deleteComment;
