const createError = require("http-errors");

const PostShare = require("../../models/PostShare");
const Post = require("../../models/Post.model");

const postShare = async (req, res, next) => {
  const { _id: userId } = req.user.data;
  try {
    const postId = req.params.id; //!paramId == postId
    if (!postId) {
      throw createError.BadRequest("Post id is required");
    }
    let postUser = await Post.findOne({ _id: req.params.id });

    await PostShare.create({
      post_id: postId,
      postUser: postUser.user,
      user: userId,
    });

    res.json({
      message: "success",
    });
  } catch (error) {
    next(error);
  }
};
module.exports = postShare;
