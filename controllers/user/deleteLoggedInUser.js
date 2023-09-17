const User = require("../../models/User.model");
const Post = require("../../models/Post.model");
const PostLike = require("../../models/Post-like.model");
const PostComment = require("../../models/Post-comment.model");
const UserFollow = require("../../models/UserFollow.model");
const PostView = require("../../models/Post-view.model");
const Wallet = require("../../models/Wallet.model");
const Folder = require("../../models/folder.model");
const Blacklist = require("../../models/TokenBlackList");
const ObjectId = require("mongodb").ObjectID;
const createError = require("http-errors");

const deleteUser = async (req, res, next) => {
  try {
    const { _id: userId } = req.user.data;
    // const { accessToken } = req.cookies;
    const { authorization } = req.headers;

    if (authorization) {
      const user = await User.findOne({
        _id: ObjectId(userId),
      });

      await User.findOneAndUpdate(
        {
          _id: ObjectId(userId),
        },
        {
          isDeleted: true,
          name: "deleted_user",
          email: "deleted_user_" + `${user.email}_` + `${userId}`,
          OAuth: "deleted_user_" + `${user.OAuth}_` + `${userId}`,
        },
        {
          new: true,
        }
      );

      const token =
        authorization?.split(" ")[0] === "Bearer"
          ? authorization.split(" ")[1]
          : authorization;
      const blackListToken = new Blacklist({
        token: token,
        userId: userId,
      });

      await blackListToken.save();
      // res.clearCookie("accessToken");

      await Post.deleteMany({
        user: ObjectId(userId),
      });
      await Post.deleteMany({
        post: {
          user: ObjectId(userId),
        },
      });
      await Folder.deleteMany({
        user: ObjectId(userId),
      });

      await PostLike.deleteMany({
        likedBy: ObjectId(userId),
      });

      await Wallet.deleteMany({
        user: ObjectId(userId),
      });
      await PostView.deleteMany({
        user: ObjectId(userId),
      });
      await PostComment.deleteMany({
        user_id: ObjectId(userId),
      });
      // await RedeemRequest.deleteMany({
      //   userId: ObjectId(userId),
      // });

      const find = await UserFollow.find(
        {
          to: ObjectId(userId),
        },
        {
          from: 1,
          _id: 0,
        }
      ).distinct("from");
      await User.updateMany(
        {
          _id: {
            $in: find,
          },
        },
        {
          $inc: { following_count: -1 },
        },
        {
          new: true,
        }
      );
      const find1 = await UserFollow.find(
        {
          from: ObjectId(userId),
        },
        {
          to: 1,
          _id: 0,
        }
      ).distinct("to");
      await User.updateMany(
        {
          _id: {
            $in: find1,
          },
        },
        {
          $inc: { followers_count: -1 },
        },
        {
          new: true,
        }
      );
      await UserFollow.deleteMany({
        to: ObjectId(userId),
      });
      await UserFollow.deleteMany({
        from: ObjectId(userId),
      });
      res.status(200).json({
        message: "user deleted successfully!",
      });
    } else {
      throw createError.Unauthorized("Please login first!");
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};
module.exports = deleteUser;
