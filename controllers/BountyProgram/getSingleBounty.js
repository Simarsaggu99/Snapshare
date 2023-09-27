const dayjs = require("dayjs");
const createError = require("http-errors");
const UserBountyModel = require("../../models/UserBountyModel");
const { ObjectId } = require("mongoose").Types;

const getBountyTakers = async (req, res, next) => {
  try {
    const { role: role } = req.user.data;
    if (role !== "admin") {
      throw createError.Unauthorized(
        "You do not have permission for this action!"
      );
    }
    const startIndex =
      (req.query.startIndex && parseInt(req.query.startIndex)) || 0;
    const viewSize =
      (req.query.viewSize && parseInt(req.query.viewSize)) || 1000;
    const searchCriteria = {};
    searchCriteria["user.isDeleted"] = {
      $ne: true,
    };
    const bountyId = req.params.id;
    const data = await UserBountyModel.aggregate([
      {
        $match: {
          bountyProgramId: ObjectId(bountyId),
        },
      },
      {
        $lookup: {
          from: "user",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
      // {
      //   $lookup: {
      //     from: "userbounties",
      //     // localField: "userId",
      //     // foreignField: "_id",
      //     let: { bountyId: "$_id" },
      //     pipeline: [
      //       {
      //         $match: {
      //           $expr: {
      //             $and: [
      //               { $eq: ["$bountyProgramId", "$$bountyId"] },
      //               { $eq: ["$userId", "$$user._id"] },
      //             ],
      //           },
      //         },
      //       },
      //     ],
      //     as: "userBounty",
      //   },
      // },

      {
        $match: searchCriteria,
      },
      {
        $skip: startIndex,
      },
      {
        $limit: viewSize,
      },
      {
        $addFields: {
          _id: "$user._id",
          name: "$user.name",
          user_handle: "$user.user_handle",
          avatar_url: "$user.avatar_url",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          user_handle: 1,
          avatar_url: 1,
          userAnswer: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getBountyTakers;
