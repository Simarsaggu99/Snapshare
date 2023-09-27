const createError = require("http-errors");
const Bounty = require("../../models/Bounty.model");
const Wallet = require("../../models/Wallet.model");
const User = require("../../models/User.model");
const { ObjectId } = require("mongoose").Types;
const dayjs = require("dayjs");
const sendLikeNotification = require("../../services/notifications/post/newLikeNotification");
const syncEarnings = require("../../services/earning/syncEarnings");
// import post model
const PostLike = require("../../models/Post-like.model");
const Post = require("../../models/Post.model");
const NotificationSettings = require("../../models/NotificationSetting.model");

const postLike = async (req, res, next) => {
  const { _id: userId } = req.user.data;
  try {
    const postId = req.params.id; //!paramId == postId
    if (!postId) {
      throw createError.BadRequest("Post id is required");
    }

    const post = await PostLike.findOne({
      post_id: postId,
      user: userId,
    });
    // not recomended way.. returning error if post is already liked.
    if (post) {
      throw createError.BadRequest("You cannot like multiple times");
    }

    let postUser = await Post.findOne({ _id: req.params.id });
    if (postUser.isMemeContest === true) {
      const bounty = await Bounty.findOne({
        _id: ObjectId(postUser.bounty),
      });
      if (dayjs() >= dayjs(bounty?.endDate)) {
        await Post.findByIdAndUpdate(
          {
            _id: ObjectId(req.params.id),
          },
          {
            $inc: { memeContestLikes: 1 },
          },
          {
            new: true,
          }
        );
      }
    }
    //Increment of like count in Post
    let result = await Post.findByIdAndUpdate(
      { _id: req.params.id },
      { $inc: { like_count: 1 } }
    );
    let record = await PostLike.create({
      post_id: postId,
      postUser: postUser.user, //!User which had posted the post so that we can fetch the likes analytics when are fetching the likes count over user post.
      user: userId,
    });
    if (userId.toString() !== postUser.user.toString()) {
      await User.findOneAndUpdate(
        {
          _id: ObjectId(postUser.user),
        },
        {
          $inc: { notificationCount: 1 },
        },
        {
          new: true,
        }
      );
      const notification = await NotificationSettings.findOne({
        userId: postUser.user,
      });
      if (notification?.notifications?.post_like) {
        sendLikeNotification(
          userId,
          postUser.user,
          req.params.id,
          // comment.comment,
          req.io
        );
      }
    }

    //sync up the the earnings
    syncEarnings({ userId: postUser.user, likesFlag: true });

    res.json({
      message: "success",
    });
  } catch (error) {
    next(error);
  }
};
module.exports = postLike;
