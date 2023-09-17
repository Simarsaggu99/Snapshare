const User = require("../models/User.model");
const Notification = require("../models/Notification.model");
const { ObjectId } = require("mongoose").Types;
// const { io } = require("../../../index");

/**
 *  Saves new comment notification and emits a socket event
 * @param {String} actor - user that is generating the action
 * @param {String} receiver - user that is receiving the notification
 * @param {String} post - post id for which the notification is being sent
 * @param {String} comment - comment text for which the notification is being sent
 * @param {Object} io - socket object
 */
const sendCount = async (receiver, io) => {
  try {
    const user = await User.findOne({
      _id: ObjectId(receiver),
    });

    const notification = new Notification({
      count: user.notificationCount,
      verb: "count",
      receiver,
    });
    await notification.save();
    io.to(receiver.toString()).emit("new-notification", {
      count: user.notificationCount,
      verb: "count",
      receiver,
    });
  } catch (err) {
    console.log("err in new Like notification service: ", err);
    return err;
  }
};

module.exports = sendCount;
