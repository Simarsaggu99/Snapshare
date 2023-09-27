const createError = require("http-errors");
const { ObjectId } = require("mongoose").Types;

// import post model
const PostComment = require("../../models/Post-comment.model");
// const Post = require("../../models/Post.model");
const convertParams = require("../../helpers/convertParams");

const getComments = async (req, res, next) => {
  const { _id: userId } = req.user.data;
  try {
    const startIndex =
      (req.query.startIndex && parseInt(req.query.startIndex)) || 0;
    const viewSize = (req.query.viewSize && parseInt(req.query.viewSize)) || 10;
   
   //Getting all the comments along with user who commented
    const allComments = await PostComment.aggregate([
      { $match: { post_id: ObjectId(req.params.id) } },
      { $sort: { created_at: -1 } },
      { $skip: startIndex },
      { $limit: viewSize },
      {
        $lookup: {
          from: "user",
          localField: "user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user" } },
      {
        $lookup: {
          from: "post",
          localField: "post_id",
          foreignField: "_id",
          as: "post",
        },
      },
      { $unwind: { path: "$post" } },
      {
        $project: {
          _id: 1,
          post_id: 1,
          comment: 1,
          created_at: 1,
          updated_at: 1,
          user: {
            _id: 1,
            name: 1,
            user_handle: 1,
            avatar_url: 1,
          },
          post: {
            user: 1,
          },
        },
      },
    ]);
    const count = await PostComment.countDocuments({
      post_id: ObjectId(req.params.id),
    });
    res.json({
      message: "success",
      data: {
        comments: allComments,
        count: allComments?.length,
        total_count: count,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getComments;



