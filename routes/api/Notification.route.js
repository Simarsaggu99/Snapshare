const router = require("express").Router();

// bring in models and controllers
const getNotificationSeting = require("../../controllers/notification/getNotificationSetting");
const updateNotification = require("../../controllers/notification/updateNotificationSetting");
const markNotificationsRead = require("../../controllers/notification/markNotificationsRead");
const getNotifications = require("../../controllers/notification/getNotifications");
const sendWarningToUser = require("../../controllers/notification/sendWarningToUser");
const sendSpankee = require("../../controllers/admin/SendSpankee");
const markSingleNotificationsRead = require("../../controllers/notification/markSingleNotificationRead");

// fetch list of notifications
router.get("/", getNotifications);

router.put("", updateNotification);

//get notification preference
router.get("/:id", getNotificationSeting);

// mark all notifications as read
router.post("/read", markNotificationsRead);
router.post("/read/:id", markSingleNotificationsRead);

// send notification to user from admin
router.post("/user/:id/warning", sendWarningToUser);

router.post("/user/:id/spankee", sendSpankee);

module.exports = router;
