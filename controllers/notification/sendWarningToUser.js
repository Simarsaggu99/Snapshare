// const Notification = require("../../models/Notification.model");
const User = require("../../models/User.model");

const sendWarning = require("../../services/notifications/sendWarning");
const sendCount = require("../../services/sendNotifcationCount");
const { ObjectId } = require("mongoose").Types;

// const sendWarning = require("../../services/notifications/sendWarning");

const sendWarningToUser = async (req, res, next) => {
  const { _id: sender } = req.user.data;
  const receiverId = req.params.id;
  try {
    await sendWarning(sender, receiverId, req.io);
    await User.findOneAndUpdate(
      {
        _id: ObjectId(receiverId),
      },
      {
        $inc: { notificationCount: 1, warningCount: 1 },
      },
      {
        new: true,
      }
    );
    // sendCount(receiverId, req.io);
    res.json({ message: "success" });
  } catch (error) {
    console.log("get notifications list error: ", error);
    next(error);
  }
};

module.exports = sendWarningToUser;
