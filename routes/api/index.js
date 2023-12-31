const router = require("express").Router();

// import routes and middlewares
const authRoutes = require("./Auth.route");
const getPosts = require("../../controllers/post/getPosts");
const folderRoutes = require("./Folder.route");
const meRoutes = require("./Me.route");
const stripeRoutes = require("./Stripe.route");
const postRoutes = require("./Post.route");
const userRoutes = require("./User.route");
const BountyRoutes = require("./Bounty.route");
const settingRoutes = require("./Setting.route");
const messageRoutes = require("./Message.route");
const notificationRoutes = require("./Notification.route");
const giftRoutes = require("./Gift.route");
const walletRoutes = require("./Wallet.route");
const feedRoutes = require("./Feed.route");
const tipRoutes = require("./tip.route");
const dashboardRoutes = require("./Dashboard.route");
const creatorRoutes = require("./Creator.route");
const webHookRoutes = require("./webHook.route");
const checkUserHandle = require("../../controllers/user/checkUserHandle");
const validateAccessToken = require("../../middlewares/jwt_validation");
const myEarning = require("./MyEarning.route");
const countryRoutes = require("./County.route");
const transaction = require("./Transaction.route");
const cruxRoute = require("./Crux.route");
const searchFilter = require("../../controllers/post/searchPostAndTags");
// const searchFilter = require("../../controllers/post/searchPostAndTags");

router.get("/post/search/filterUser", searchFilter);
router.get("/posts", getPosts);
router.get("/userHandle", checkUserHandle);
router.use("/country", countryRoutes);
router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/post", validateAccessToken, postRoutes);
router.use("/folder", validateAccessToken, folderRoutes);
router.use("/bounty", validateAccessToken, BountyRoutes);
router.use("/me", validateAccessToken, meRoutes);
router.use("/setting", validateAccessToken, settingRoutes);
router.use("/crux", validateAccessToken, cruxRoute);
router.use("/dashboard", dashboardRoutes);

//!-----------------------------------------------
//get all posts without validation--------------

//checkUser Handle api
// transaction
router.use("/transaction", transaction);
//!----------------------------------------------

// router.use("/stripe/hooks", webHookRoutes);
// router.use("/stripe", validateAccessToken, stripeRoutes);
router.use("/message", validateAccessToken, messageRoutes);
router.use("/notifications", validateAccessToken, notificationRoutes);
// router.use("/gift", validateAccessToken, giftRoutes);
// router.use("/wallet", validateAccessToken, walletRoutes);
router.use("/wallet", validateAccessToken, walletRoutes);
router.use("/feed", validateAccessToken, feedRoutes);
// router.use("/tip", validateAccessToken, tipRoutes);
// router.use("/dashboard", validateAccessToken, dashboardRoutes);
// router.use("/creators", validateAccessToken, creatorRoutes);
router.use("/earning", validateAccessToken, myEarning);

// test route
router.get("/test", validateAccessToken, (req, res) => {
  res.status(200).json({
    message: "success",
  });
});

router.get("/ping", (req, res) => {
  res.json({ success: "true", message: "successful request" });
});

module.exports = router;
