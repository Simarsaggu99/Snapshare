const createError = require("http-errors");
const { ObjectId } = require("mongoose").Types;
const ReportModel = require("../../models/Report.model");

const getSingleReports = async (req, res, next) => {
  const { _id: userId } = req.user.data;
  const postId = req.params.id;

  try {
    const reports = await ReportModel.aggregate([
      { $match: { post_id: ObjectId(postId) } },
      {
        $sort: {
          created_at: -1,
        },
      },
      {
        $lookup: {
          from: "post",
          let: { id: "$post_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$_id", "$$id"] }],
                },
              },
            },
            {
              $lookup: {
                from: "user",
                localField: "user",
                foreignField: "_id",
                as: "user",
              },
            },
            { $unwind: { path: "$user" } },
            { $unwind: { path: "$media" } },
          ],
          as: "postDetail",
        },
      },
      {
        $lookup: {
          from: "user",
          let: { repored_by: "$reportedBy" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$_id", "$$repored_by"] }],
                },
              },
            },

            {
              $project: {
                name: 1,
                _id: 1,
                avatar_url: 1,
                user_handle: 1,
                email: 1,
              },
            },
          ],
          as: "reportedUser",
        },
      },
      { $unwind: { path: "$reportedUser" } },
      { $unwind: { path: "$postDetail" } },
      {
        $group: {
          _id: "$post_id",
          postDetail: { $first: "$postDetail" },
          userId: { $first: "$userId" },
          created_at: { $first: "$created_at" },
          reportBy: {
            $addToSet: {
              description: "$description",
              reportedUser: "$reportedUser",
            },
          },
          count: { $count: {} },
        },
      },
      {
        $project: {
          _id: 1,
          postDetail: {
            _id: 1,
            media: 1,
            user: 1,
            like_count: 1,
            comment_count: 1,
            tags: 1,
            description: 1,
            created_at: 1,
            user: {
              _id: 1,
              name: 1,
              email: 1,
              avatar_url: 1,
            },
          },
          reportBy: 1,
          count: 1,
        },
      },

      { $unset: ["updated_at", "__v"] },
    ]);

    res.json({
      message: "success",
      data: { reports: reports[0] },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getSingleReports;
