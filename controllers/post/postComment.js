const createError = require("http-errors");
const NotificationSettings = require("../../models/NotificationSetting.model");
// import post model
const PostComment = require("../../models/Post-comment.model");
const { ObjectId } = require("mongoose").Types;
const Post = require("../../models/Post.model");
const User = require("../../models/User.model");
const sendCommentNotification = require("../../services/notifications/post/newCommentNotification");
const sendCount = require("../../services/sendNotifcationCount");

const postComment = async (req, res, next) => {
  const { _id: userId } = req.user.data;
  try {
    if (!req.body.comment) {
      throw createError.BadRequest("Comment data is required");
    }
    if (!req.params.id) {
      throw createError.BadRequest("Post id is required");
    }
    const post = await Post.findOne({ _id: req.params.id });
    if (!post) {
      throw createError.BadRequest("Post does not exist");
    }
    const comment = await PostComment.create({
      post_id: req.params.id,
      user_id: userId,
      comment: req.body.comment,
    });
    if (userId.toString() !== post.user.toString()) {
      await Post.findByIdAndUpdate(req.params.id, {
        $inc: { comment_count: 1 },
      });
      const notification = await NotificationSettings.findOne({
        userId: post.user,
      });

      if (notification?.notifications?.post_comment) {
        if (userId != post.user)
          sendCommentNotification(
            userId,
            post.user,
            req.params.id,
            comment.comment,
            req.io
          );
      }
      await User.findOneAndUpdate(
        {
          _id: ObjectId(post.user),
        },
        {
          $inc: { notificationCount: 1 },
        },
        {
          new: true,
        }
      );
    }
    // sendCount(post.user, req.io);
    res.json({ message: "success", data: comment });
  } catch (error) {
    next(error);
  }
};

module.exports = postComment;
