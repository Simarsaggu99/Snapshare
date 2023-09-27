const createError = require("http-errors");
const sendCommentNotification = require("../../services/notifications/post/newLikeNotification");
// import post model
const postViewModel = require("../../models/Post-view.model");
const Post = require("../../models/Post.model");
const User = require("../../models/User.model");
const cruxLevel = require("../../services/notifications/post/cruxLevelNotification");
const Wallet = require("../../models/Wallet.model");
var ObjectId = require("mongodb").ObjectID;
const syncEarnings = require("../../services/earning/syncEarnings");
const syncCrux = require("../../services/crux/syncCrux");
// const User = require("../../models/User.model");
const postView = async (req, res, next) => {
  const { _id: userId } = req.user.data;
  try {
    const postId = req.params.id;
    const postViewObj = await postViewModel.findOne({
      post_id: postId,
      user: userId,
    });
    if (!postViewObj) {
      let post = await Post.findOne({ _id: postId }).select({
        _id: 0,
        user: 1,
        viewCount: 1,
      });
      const query = { post_id: postId, user: userId };
      const update = {
        $set: {
          post_id: postId,
          postUser: post.user, //!User which had posted the post so that we can fetch the likes analytics when are fetching the likes count over user post.
          user: userId,
        },
      };
      const options = { upsert: true };
      let record = await postViewModel.updateOne(query, update, options);

      if (post) {
        await Post.findOneAndUpdate(
          {
            _id: postId,
          },
          {
            $inc: { viewCount: 1 },
          },
          { new: true }
        );
      }

      await syncEarnings({ userId: post.user, viewFlag: true });

      //syncing the crux and the associated earnings
      await syncCrux(post.user, req.io);
    }
    res.json({
      message: "success",
    });
  } catch (error) {
    next(error);
  }
};
module.exports = postView;
//{ $inc: { like_count : 1}},{new : true }
