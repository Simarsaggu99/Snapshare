const createError = require("http-errors");
// import post model
const Post = require("../../models/Post.model");
const { ObjectId } = require("mongoose").Types;
const Report = require("../../models/Report.model");
const PostLike = require("../../models/Post-like.model");
const PostComment = require("../../models/Post-comment.model");
const PostView = require("../../models/Post-view.model");

const deletePost = async (req, res, next) => {
  const { _id: userId } = req.user.data;
  const postId = req.params.id;
  try {
    //const post = await Post.deleteOne({ _id: req.params.id, user: userId });

    const post = await Post.findById({ _id: postId });
    if (!post) {
      throw createError.InternalServerError();
    }
    await Post.findOneAndDelete({ _id: ObjectId(postId) });
    await PostLike.deleteMany({ postUser: post?.user, post_id: postId });
    await PostComment.deleteMany({ post_id: postId });
    await PostView.deleteMany({ postUser: post?.user, post_id: postId });
    const reposts = await Post.find({ rePostedID: postId });
    if (reposts) {
      await Post.deleteMany({ rePostedID: ObjectId(postId) });
    }
    await Report.deleteMany({
      post_id: ObjectId(postId),
    });
    // await User.findOneAndUpdate(
    //   { _id: userId },
    //   { $pull: { posts: req.params.id } }
    // );

    // await PostRating.deleteMany({
    //   post_id: req.params.id,
    // });
    // await PostComment.deleteMany({
    //   post_id: req.params.id,
    // });
    // await Notification.deleteMany({
    //   subject: req.params.id,
    // });

    res.json({ message: "success" });
  } catch (error) {
    next(error);
  }
};

module.exports = deletePost;
