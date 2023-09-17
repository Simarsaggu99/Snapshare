const router = require("express").Router();

const checkBountyCompletion = require("../../controllers/BountyProgram/checkBountyCompletion");
const createBounty = require("../../controllers/BountyProgram/createBounty");
const performBounty = require("../../controllers/BountyProgram/createUserBounty");
const getAllBounty = require("../../controllers/BountyProgram/getAllBounty");
const getBountyHistory = require("../../controllers/BountyProgram/getBountyHistory");
const getContestWinner = require("../../controllers/BountyProgram/getContestWinnerList");
const getBountyTakers = require("../../controllers/BountyProgram/getSingleBounty");
const getUserBounty = require("../../controllers/BountyProgram/getUserBounty");

const createBountyQuestion = require("../../controllers/bountyQuestion/createBountyQuestion");
const validateAccessToken = require("../../middlewares/jwt_validation");

// add post in created Folder

router.post("/create", createBounty);
router.get("/", getAllBounty);
router.get("/:id", getBountyTakers);

router.post("/:id", createBountyQuestion);

//creating bounty for user
router.post("/perform/user", validateAccessToken, performBounty);

router.get("/user/bounty", validateAccessToken, getUserBounty);

router.get("/user/bounty/:id", validateAccessToken, checkBountyCompletion);
router.get("/user/history", validateAccessToken, getBountyHistory);
router.get("/contest/winner", validateAccessToken, getContestWinner);

module.exports = router;
