const Notification = require("../../models/Notification.model");
const User = require("../../models/User.model");
const { ObjectId } = require("mongoose").Types;

const markSingleNotificationsRead = async (req, res, next) => {
  const { _id: userId } = req.user.data;
  const notificationId = req.params.id;
  console.log(notificationId, "fsdfs");
  try {
    await Notification.findOneAndUpdate(
      { receiver: userId, _id: ObjectId(notificationId) },
      { isRead: true }
    );
    const singleUser = await User.findOne({ _id: ObjectId(userId) });
    console.log(singleUser);
    await User.findOneAndUpdate(
      {
        _id: ObjectId(userId),
      },
      {
        notificationCount:
          singleUser.notificationCount > 0 && singleUser.notificationCount - 1,
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

module.exports = markSingleNotificationsRead;
