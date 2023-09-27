const postViewModel = require("../../../models/Post-view.model");
const Post = require("../../../models/Post.model");
var ObjectId = require("mongodb").ObjectID;
// const User = require("../../models/User.model");
const syncPostViewCount = async (req, res, next) => {
  try {
    let postList = await Post.find();

    if (postList) {
      postList.forEach((post) => {
        postViewModel
          .find({
            post_id: ObjectId(post._id),
          })
          .count();

        Post.findOneAndUpdate(
          {
            _id: ObjectId(post._id),
          },
          {
            viewCount: postViewModel
              .find({
                post_id: ObjectId(post._id),
              })
              .count(),
          },
          { new: true }
        );
      });
    }

    res.json({
      message: "success",
    });
  } catch (error) {
    next(error);
  }
};
module.exports = syncPostViewCount;
