const RedeemRequest = require("../../models/RedeemRequest");
const { ObjectId } = require("mongoose").Types;

const getTransaction = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const viewSize = parseInt(req.query.viewSize) || 10;
    const { type, userId } = req.query;
    let searchCriteria = {};
    if (type) {
      searchCriteria = {
        status: type,
      };
    }
    if (userId) {
      searchCriteria = {
        userId: ObjectId(userId),
      };
    }

    const transaction = await RedeemRequest.aggregate([
      {
        $match: searchCriteria,
      },
      {
        $lookup: {
          from: "user",
          let: { userId: "$userId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$_id", "$$userId"] }],
                },
              },
            },
            {
              $project: {
                name: 1,
                _id: 1,
                country: 1,
                email: 1,
              },
            },
          ],
          as: "user",
        },
      },
      {
        $unwind: { path: "$user", preserveNullAndEmptyArrays: true },
      },
      // {
      //   $match: {
      //     "user.isDeleted": {
      //       $ne: true,
      //     },
      //     "user.isSuspended": {
      //       $ne: true,
      //     },
      //   },
      // },

      {
        $sort: {
          created_at: -1,
        },
      },
      { $skip: startIndex },
      { $limit: viewSize },
    ]);

    if (!transaction) {
      return res.status(404).send({ messege: "transaction not found" });
    }
    const totalCount = await RedeemRequest.countDocuments({
      ...searchCriteria,
    });
    console.log(totalCount);
    res.json({
      success: true,
      message: "transaction fetched successfully",
      transaction: transaction,
      count: transaction?.length,
      totalCount: totalCount,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getTransaction;
