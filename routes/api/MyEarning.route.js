const router = require("express").Router();
const validateAccessToken = require("../../middlewares/jwt_validation");
const getUserStatics = require("../../controllers/earning/getUserStatics");
const getEarnings = require("../../controllers/earning/earningStats");
const getTotalEarnings = require("../../controllers/earning/earningStats");

router.get("/statics", validateAccessToken, getUserStatics);
router.get("/summary", validateAccessToken, getEarnings);
router.get("/totals", validateAccessToken, getTotalEarnings);
module.exports = router;
