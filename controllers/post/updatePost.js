const createError = require("http-errors");
// const createError = require("http-errors");
const formidable = require("formidable");

// import post model
const Post = require("../../models/Post.model");
const convertParams = require("../../helpers/convertParams");

const updatePost = async (req, res, next) => {
  const { _id: userId } = req.user.data;
  // const { tags, description } = req.body;
  // form.parse(req, async (err, fields, files) => {
  //   if (err) {
  //     res.status(400);
  //     res.send(err);
  //   }
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(400);
      res.send(err);
    }
    try {
      let { description, repost, rePostedID, tag } = fields;
      const post = await Post.findOne({ _id: req.params.id });
      if (!post) {
        throw createError.InternalServerError();
      }
      if (tag == undefined) tag = [];
      else {
        tag = JSON.parse(tag);
      }
      const updatePosts = await Post.findOneAndUpdate(
        { _id: req.params.id },
        { tags: tag, description: description },
        { new: true }
      );
      await updatePosts.save();
      res.json({ message: "success", data: updatePosts });
    } catch (error) {
      next(error);
    }
  });
};

module.exports = updatePost;
