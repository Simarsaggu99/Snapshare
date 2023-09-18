const router = require("express").Router();
const authRoutes = require("./Auth.route");
const folderRoutes = require("./Folder.route");
const meRoutes = require("./Me.route");
const settingRoutes = require("./Setting.route");
const checkUserHandle = require("../../controllers/user/checkUserHandle");
const validateAccessToken = require("../../middlewares/jwt_validation");
router.get("/userHandle", checkUserHandle);
router.use("/auth", authRoutes);
router.use("/folder", validateAccessToken, folderRoutes);
router.use("/me", validateAccessToken, meRoutes);
router.use("/setting", validateAccessToken, settingRoutes);
router.get("/test", validateAccessToken, (req, res) => {
  res.status(200).json({
    message: "success",
  });
});

router.get("/ping", (req, res) => {
  res.json({ success: "true", message: "successful request" });
});

module.exports = router;
