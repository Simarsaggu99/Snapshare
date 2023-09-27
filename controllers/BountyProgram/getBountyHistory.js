const dayjs = require("dayjs");
const createError = require("http-errors");
const { ObjectId } = require("mongoose").Types;

const Bounty = require("../../models/Bounty.model");
const Post = require("../../models/Post.model");
const UserBountyModel = require("../../models/UserBountyModel");

const getBountyHistory = async (req, res, next) => {
  const searchCriteria = {};

  const { _id: userId } = req.user.data;

  try {
    const userBounty = await UserBountyModel.aggregate([
      {
        $match: {
          userId: ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "bounty",
          localField: "bountyProgramId",
          foreignField: "_id",
          as: "bounty",
        },
      },
      {
        $unwind: {
          path: "$bounty",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          userId: 1,
          created_at: 1,
          bounty: {
            description: 1,
            meme_coins: 1,
            type: 1,
          },
        },
      },
    ]);

    res.status(200).json({
      data: userBounty,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getBountyHistory;
