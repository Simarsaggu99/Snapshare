const createError = require("http-errors");
const { ObjectId } = require("mongoose").Types;
const PostModel = require("../../models/Post.model");

const getPopularTags = async (req, res, next) => {
  try {
    const searchCriteria = {};
    searchCriteria.isDeleted = false;
    searchCriteria.reportExceed = false;

    const startIndex = (req.query.startIndex && parseInt(req.query.startIndex)) || 0;
    const viewSize = (req.query.viewSize && parseInt(req.query.viewSize)) || 10;

    const tags = await PostModel.aggregate([
      {
        $match: searchCriteria,
      },
      {
        $unwind: {
          path: "$tags",
        },
      },
      {
        $group: {
          _id: "$tags",
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
      { $skip: startIndex },
      { $limit: viewSize },
    ]);

    res.status(200).json({
      tags,
    });
  } catch (error) {
    console.log(error, "error");
    next(error);
  }
};

module.exports = getPopularTags;
