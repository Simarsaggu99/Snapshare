const createError = require("http-errors");
// const { ObjectId } = require("mongoose").Types;
const PostModel = require("../../models/Post.model");
const User = require("../../models/User.model");

const searchFilter = async (req, res, next) => {
  try {
    const searchCriteria = {};
    const searchCriteria1 = {};
    if (req.query.keyword) {
      searchCriteria["$or"] = [
        {
          tags: { $regex: `${req.query.keyword.trim()}`, $options: "i" },
        },
      ];
      searchCriteria1["$or"] = [
        {
          name: { $regex: `${req.query.keyword.trim()}`, $options: "i" },
        },
        {
          email: { $regex: `${req.query.keyword.trim()}`, $options: "i" },
        },
        {
          user_handle: { $regex: `${req.query.keyword.trim()}`, $options: "i" },
        },
      ];
    }
    if (req.query.postType) {
      if (req.query.postType === "meme") {
        searchCriteria["media.type"] = {
          $ne: "image/gif",
        };
      }
      if (req.query.postType === "gif") {
        searchCriteria["media.type"] = {
          $eq: "image/gif",
        };
      }
    }

    const post = await PostModel.aggregate([
      {
        $unwind: {
          path: "$tags",
        },
      },
      {
        $unwind: {
          path: "$media",
        },
      },
      {
        $match: searchCriteria,
      },
      {
        $group: {
          _id: "$_id",
          like_count: {
            $first: "$like_count",
          },
          comment_count: {
            $first: "$comment_count",
          },
          media: {
            $first: "$media",
          },
          user: {
            $first: "$user",
          },
          created_at: {
            $first: "$created_at",
          },
          description: {
            $first: "$description",
          },
          tags: {
            $push: "$tags",
          },
        },
      },
    ]);

    const user = await User.aggregate([
      {
        $match: {
          ...searchCriteria1,
          isDeleted: {
            $ne: true,
          },
        },
      },
    ]);
    res.status(200).json({
      success: true,
      post,
      user,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = searchFilter;
