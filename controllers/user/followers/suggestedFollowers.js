const createError = require("http-errors");
const { ObjectId } = require("mongoose").Types;
const UserFollow = require("../../../models/UserFollow.model");
const User = require("../../../models/User.model");
const { start } = require("agenda/dist/agenda/start");

const suggestedFollowers = async (req, res, next) => {
  try {
    const { _id: userId } = req.user.data;
    const startIndex =
      (req.query.startIndex && parseInt(req.query.startIndex)) || 0;
    const viewSize = (req.query.viewSize && parseInt(req.query.viewSize)) || 10;
    if (!userId) {
      throw createError.Unauthorized("Please login First!");
    }
    const getFollowers = await UserFollow.aggregate([
      {
        $match: {
          from: ObjectId(userId),
        },
      },
      {
        $limit: 10,
      },
    ]);
    let suggestedFollowers = [];
    if (getFollowers.length === 0) {
      suggestedFollowers = await User.aggregate([
        {
          $match: {
            isDeleted: {
              $ne: true,
            },
            isSuspended: {
              $ne: true,
            },
            _id: {
              $ne: ObjectId(userId),
            },
          },
        },
        {
          $limit: 500,
        },
        {
          $sort: {
            followers_count: -1,
          },
        },
        {
          $skip: startIndex,
        },
        {
          $limit: viewSize,
        },
        {
          $project: {
            _id: 1,
            name: 1,
            user_handle: 1,
            avatar_url: 1,
          },
        },
      ]);
    } else {
      suggestedFollowers = await UserFollow.aggregate([
        {
          $match: {
            from: ObjectId(userId),
          },
        },
        {
          $limit: 20,
        },
        {
          $lookup: {
            from: "userfollows",
            let: { id: "$to" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$from", "$$id"] },
                      // { $eq: ["$from", ObjectId(userId)] },
                    ],
                  },
                },
              },
              {
                $lookup: {
                  from: "user",
                  // localField: "to",
                  // foreignField: "_id",
                  let: { id: "$to" },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [
                            { $eq: ["$_id", "$$id"] },
                            { $ne: ["$_id", ObjectId(userId)] },
                            { $ne: ["$isDeleted", true] },
                          ],
                        },
                      },
                    },
                    {
                      $lookup: {
                        from: "userfollows",
                        // localField: "",
                        // foreignField: "",
                        let: { id: "$_id" },
                        pipeline: [
                          {
                            $match: {
                              $expr: {
                                $and: [
                                  { $eq: ["$to", "$$id"] },
                                  { $eq: ["$from", ObjectId(userId)] },
                                ],
                              },
                            },
                          },
                          {
                            $addFields: {
                              loginUserFollow: true,
                            },
                          },
                        ],
                        as: "isFollow",
                      },
                    },
                    {
                      $unwind: {
                        path: "$isFollow",
                        preserveNullAndEmptyArrays: true,
                      },
                    },
                  ],
                  as: "user",
                },
              },
              {
                $unwind: {
                  path: "$user",
                },
              },
            ],
            as: "myFollwing",
          },
        },
        {
          $unwind: {
            path: "$myFollwing",
          },
        },
        {
          $match: {
            "myFollwing.user.isFollow.loginUserFollow": {
              $ne: true,
            },
          },
        },
        {
          $addFields: {
            id: "$myFollwing.user._id",
            name: "$myFollwing.user.name",
            user_handle: "$myFollwing.user.user_handle",
            avatar_url: "$myFollwing.user.avatar_url",
          },
        },
        {
          $project: {
            id: 1,
            name: 1,
            user_handle: 1,
            avatar_url: 1,
          },
        },
        {
          $group: {
            _id: "$id",
            name: {
              $first: "$name",
            },
            user_handle: {
              $first: "$user_handle",
            },
            avatar_url: {
              $first: "$avatar_url",
            },
          },
        },
        {
          $skip: startIndex,
        },
        {
          $limit: viewSize,
        },
      ]);
    }
    res.status(200).json({
      success: true,
      data: suggestedFollowers,
    });
  } catch (error) {
    console.log("err in suggested in suggested followers:", error);
    next(error);
  }
};
module.exports = suggestedFollowers;
