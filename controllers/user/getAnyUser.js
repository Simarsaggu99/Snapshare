// import user model
const User = require("../../models/User.model");
const BlockedUser = require("../../models/blockUser.model");
const UserFollow = require("../../models/UserFollow.model");
const Report = require("../../models/Report.model");
const Post = require("../../models/Post.model");
const Wallet = require("../../models/Wallet.model");
// const PostGift = require("../../models/PostGift.model");
const { ObjectId } = require("mongoose").Types;

const getUser = async (req, res, next) => {
  try {
    const { _id: userId } = req.user.data;

    if (req.user.data.role === "admin") {
      const user = await User.findById({ _id: req.params.id }).lean();

      const reportedPostByUser = await Report.countDocuments({
        userId: ObjectId(req.params.id),
      });

      const reportedPostOfUser = await Report.countDocuments({
        reportedBy: ObjectId(req.params.id),
      });

      const reposted = await Post.countDocuments({
        user: ObjectId(req.params.id),
        isRePosted: true,
      });

      const totalPosts = await Post.countDocuments({
        user: ObjectId(req.params.id),
      });
      const coins = await Wallet.findOne({
        user: ObjectId(req.params.id),
      });

      const latestPost = await Post.find({
        user: ObjectId(req.params.id),
      })
        .sort({ created_at: -1 })
        .limit(1);

      return res.status(200).json({
        status: "success",
        data: user,
        reportedPostByUser: reportedPostByUser,
        reportedPostOfUser: reportedPostOfUser,
        latestPost: latestPost[0]?.created_at,
        reposted: reposted,
        totalPosts: totalPosts,
        coins: coins?.meme_coins,
      });
    }
    const user = await User.findById({ _id: req.params.id }).lean();

    const following = await UserFollow.findOne({
      to: ObjectId(req.params.id),
      from: ObjectId(userId),
    });
    const follower = await UserFollow.findOne({
      from: ObjectId(req.params.id),
      to: ObjectId(userId),
    });
    const blocked = await BlockedUser.findOne({
      blockedBy: ObjectId(userId),
      blockedUser: ObjectId(req.params.id),
    });

    if (following)
      user.isfollowing = true; //kya me samne vale ko follow karta hu
    else user.isfollowing = false;

    if (follower) user.isfollower = true; //kya samne vala mujhe follow krta ha
    else user.isfollower = false;

    if (blocked) user.isblocked = true;
    else user.isblocked = false;

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error while fetching user",
      error: err,
    });
  }
};
module.exports = getUser;
