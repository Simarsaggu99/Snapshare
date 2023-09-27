const createError = require("http-errors");
const { ObjectId } = require("mongoose").Types;

const UserBountyModel = require("../../models/UserBountyModel");
const Bounty = require("../../models/Bounty.model");
const dayjs = require("dayjs");

const checkBountyCompletion = async (req, res, next) => {
  const searchCriteria = {};

  const { _id: userId } = req.user.data;

  try {
    bountyProgramId = req.params.id;
    const bounty = await Bounty.findOne({
      _id: ObjectId(bountyProgramId),
    });
    if (dayjs() >= dayjs(bounty?.endDate)) {
      throw createError.BadRequest("This bounty has been expired");
    }

    const check = await UserBountyModel.findOne({
      userId: ObjectId(userId),
      bountyProgramId: ObjectId(bountyProgramId),
    });

    if (check) {
      return res.status(200).json({
        message: "success",
        isCompleted: true,
      });
      // throw createError.BadRequest({
      //   isCompleted: true,
      //   message: "you have already completed this bounty program",
      // });
    }

    return res.status(200).json({
      message: "success",
      isCompleted: false,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = checkBountyCompletion;
