const createError = require("http-errors");
const { ObjectId } = require("mongoose").Types;
const ReportModel = require("../../models/Report.model");

const getAllReportPost = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const viewSize = parseInt(req.query.viewSize) || 10;

    const searchCriteria = {};

    if (req.query.post === "deleted") {
      searchCriteria["post.isDeleted"] = true;
    } else {
      searchCriteria["post.isDeleted"] = false;
    }

    const allReportedPosts = await ReportModel.aggregate([
      {
        $sort: {
          created_at: -1,
        },
      },
      {
        $lookup: {
          from: "post",
          localField: "post_id",
          foreignField: "_id",
          as: "post",
        },
      },
      {
        $unwind: {
          path: "$post",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: searchCriteria,
      },
      {
        $group: {
          _id: "$post_id",
          userId: {
            $first: "$userId",
          },
          latestReported: {
            $first: "$created_at",
          },
          firstReported: {
            $last: "$created_at",
          },
          count: { $count: {} },
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
      {
        $lookup: {
          from: "post",
          localField: "_id",
          foreignField: "_id",
          as: "post",
        },
      },
      {
        $unwind: {
          path: "$post",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$post.media",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          userId: 1,
          latestReported: 1,
          firstReported: 1,
          count: 1,
          user: {
            user_handle: 1,
            avatar_url: 1,
            name: 1,
            spankeeCount: 1,
            warningCount: 1,
          },
          post: {
            media: 1,
            _id: 1,
          },
        },
      },
      {
        $sort: {
          latestReported: -1,
        },
      },
      { $skip: startIndex },
      { $limit: viewSize },
    ]);

    const count = await ReportModel.countDocuments();
    res.json({
      message: "success",
      data: {
        reported: allReportedPosts,
        totalCount: count,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getAllReportPost;
