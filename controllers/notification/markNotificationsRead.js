const Notification = require("../../models/Notification.model");
const User = require("../../models/User.model");
const { ObjectId } = require("mongoose").Types;

const markNotificationsRead = async (req, res, next) => {
  const { _id: userId } = req.user.data;
  try {
    await Notification.updateMany({ receiver: userId }, { isRead: true });
    await User.findOneAndUpdate(
      {
        _id: ObjectId(userId),
      },
      {
        notificationCount: 0,
      },
      {
        new: true,
      }
    );
    res.status(200).json({
      message: "success",
    });
  } catch (error) {
    console.log("get notifications list error: ", error);
    next(error);
  }
};

module.exports = markNotificationsRead;
