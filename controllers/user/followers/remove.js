const createError = require("http-errors");
const { ObjectId } = require("mongoose").Types;
// import verify token model and user model
const UserFollow = require("../../../models/UserFollow.model");
const User = require("../../../models/User.model");
const Notification = require("../../../models/Notification.model");
const cancelSubscriptionService = require("../../user/subscriptions/cancelSubscriptionService");
const removeAsFollowing = async (req, res, next) => {
  const { _id: userId } = req.user.data;
  try {
    const { _id: userId } = req.user.data;
    const { id } = req.params; ///jisse ubnfollow krna ha
    //todo paramId == followerId/to feild

    const userFollowers = await UserFollow.aggregate([
      {
        $match: {
          to: ObjectId(id),
        },
      },
    ]);

    if (userFollowers.length == 25) {
      await Wallet.findOneAndUpdate(
        { user: id },
        { $inc: { meme_coins: -3 } },
        { new: true }
      );
    }
    const userFollowDetails = await UserFollow.findOneAndDelete({
      to: id, //!follower
      from: userId, //!following
    });
    await UserFollow.findOneAndDelete({
      to: id, //!follower
      from: userId, //!following
    });
    const followerDecrement = await User.findOneAndUpdate(
      { _id: id },
      { $inc: { followers_count: -1 } },
      { new: true }
    );

    const folowingDecrement = await User.findOneAndUpdate(
      { _id: userId },
      { $inc: { following_count: -1 } },
      { new: true }
    );
    const userDetails = await User.findOne({
      _id: ObjectId(userId),
    });

    // console.log(req.params.id);
    // if subscription exist remove subscription too..
    // const userDetail = await User.findOne({ _id: userId });
    // console.log(userDetail);
    // if (userDetail?.subscribing?.includes(req.params.id)) {
    //   //unsubscribe the user...

    //   await cancelSubscriptionService(userId, req.params.id);
    // }
    const notificationDetails = await Notification.findOne({
      subject: userDetails.user_handle,
      actor: ObjectId(userId),
      verb: "new-follow",
    });

    if (!notificationDetails?.isRead) {
      await User.findOneAndUpdate(
        {
          _id: ObjectId(userFollowDetails.to),
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
      actor: userId,
      receiver: req.params.id,
      verb: "new-follow",
    });
    // await Notification.findOneAndDelete({
    //   actor: req.params.id,
    //   receiver: userId,
    //   verb: "follow-accept",
    // });
    res.json({ message: "success" });
  } catch (error) {
    next(error);
  }
};

module.exports = removeAsFollowing;
