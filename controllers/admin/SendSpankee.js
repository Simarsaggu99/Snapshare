const createError = require("http-errors");
const User = require("../../models/User.model");
const Spankee = require("../../models/Spankee");
const NotificationSettings = require("../../models/NotificationSetting.model");
const sendSpankeeNotification = require("../../services/notifications/sendSpankee");
const sendCount = require("../../services/sendNotifcationCount");
const { ObjectId } = require("mongoose").Types;

const sendSpankee = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { _id: id } = req.user.data;
    // const { description } = req.body;

    const findUser = await User.findOne({
      _id: ObjectId(userId),
    });
    if (!findUser) {
      throw createError.BadRequest("User does not exists!");
    }

    const spankee = new Spankee({
      // description,
      user: userId,
    });
    await spankee.save();

    const spankeeCount = await Spankee.countDocuments({
      user: ObjectId(userId),
    });
    await User.findOneAndUpdate(
      {
        _id: ObjectId(userId),
      },
      {
        $inc: { spankeeCount: 1 },
      },
      {
        new: true,
      }
    );

    if (spankeeCount === 3) {
      await User.findOneAndUpdate(
        {
          _id: ObjectId(userId),
        },
        {
          isSuspended: true,
        },
        {
          new: true,
        }
      );
    }
    await User.findOneAndUpdate(
      {
        _id: ObjectId(userId),
      },
      {
        $inc: { notificationCount: 1 },
      },
      {
        new: true,
      }
    );
    const notification = await NotificationSettings.findOne({
      userId: ObjectId(userId),
    });
    // sendCount(userId, req.io);

    if (notification?.notifications?.spanke) {
      sendSpankeeNotification(id, userId, req.io);
    }

    res.status(200).json({
      success: true,
      spankee,
      message: `spankee sent successfully to ${findUser.user_handle}`,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
module.exports = sendSpankee;
