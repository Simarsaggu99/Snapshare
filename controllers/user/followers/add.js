const createError = require("http-errors");
var ObjectId = require("mongodb").ObjectID;
// import verify token model and user model
const UserFollow = require("../../../models/UserFollow.model");
const User = require("../../../models/User.model");
const newFollowNotification = require("../../../services/notifications/follow/newFollowNotification");
const Wallet = require("../../../models/Wallet.model");
const NotificationSettings = require("../../../models/NotificationSetting.model");
const Post = require("../../../models/Post.model");
const sendCount = require("../../../services/sendNotifcationCount");
const syncCrux = require("../../../services/crux/syncCrux");

const addAsFollowing = async (req, res, next) => {
  try {
    const { _id: userId } = req.user.data;
    const { id } = req.params; ///!path params should be used to increase the following or from failed

    const user = await User.findOne({ _id: id });
    if (!user) throw createError.BadRequest("User does not exist!");

    const follow = await UserFollow.findOne({
      to: id, //!follower
      from: userId, //!following
    });
    if (follow) {
      throw createError.Conflict(
        "You are already following or have sent follow request to this user"
      );
    }
    const followerIncrement = await User.findOneAndUpdate(
      { _id: id },
      { $inc: { followers_count: 1 } },
      { new: true }
    );

    const folowingIncrement = await User.findOneAndUpdate(
      { _id: userId },
      { $inc: { following_count: 1 } },
      { new: true }
    );

    const createFollowing = await UserFollow.create({
      to: id,
      from: userId,
    });
    //TODO
    // let postUser = await Post.findOne({ _id: req.params.id });
    const notification = await NotificationSettings.findOne({
      userId: id,
    });

    if (notification?.notifications?.follower) {
      // if (userId != UsersPost)
      newFollowNotification(userId, id, req.io);
    }

    await User.findOneAndUpdate(
      {
        _id: ObjectId(id),
      },
      {
        $inc: { notificationCount: 1 },
      },
      {
        new: true,
      }
    );

    // sendCount(id, req.io);

    //syncing the crux and the associated earnings
    await syncCrux(id, req.io);

    res.status(200).json({
      message: "success",
      data: createFollowing,
    });
  } catch (error) {
    console.log("error: ", error);
    next(error);
  }
};

module.exports = addAsFollowing;
