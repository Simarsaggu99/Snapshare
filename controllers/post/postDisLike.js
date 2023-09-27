const createError = require("http-errors");
const Notification = require("../../models/Notification.model");
const { ObjectId } = require("mongoose").Types;
const syncEarnings = require("../../services/earning/syncEarnings");
// import post model
const PostLike = require("../../models/Post-like.model");
const Post = require("../../models/Post.model");
const User = require("../../models/User.model");

const postDisLike = async (req, res, next) => {
  const { _id: userId } = req.user.data;
  try {
    const postId = req.params.id;
    if (!postId) {
      throw createError.BadRequest("Post id is required");
    }

    const post = await PostLike.findOne({
      post_id: postId,
      user: userId,
    });
    if (!post) {
      throw createError.BadRequest("You cannot disLike multiple times");
    }

    //Decrement of like count in Post
    const postObj = await Post.findByIdAndUpdate(req.params.id, {
      $inc: { like_count: -1 },
    });

    // await PostLike.deleteOne({ post_id: postId });
    await PostLike.findOneAndDelete({ post_id: postId, user: userId });

    res.json({
      message: "success",
    });
    const notificationDetails = await Notification.findOne({
      subject: req.params.id,
      actor: userId,
      verb: "Like",
    });
    if (!notificationDetails.isRead) {
      await User.findOneAndUpdate(
        {
          _id: ObjectId(post.postUser),
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
      subject: req.params.id,
      actor: userId,
      verb: "Like",
    });

    syncEarnings({ userId: postObj.user, dislikeFlag: true });
  } catch (error) {
    next(error);
  }
};

module.exports = postDisLike;
