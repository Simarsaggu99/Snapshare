const createError = require("http-errors");
const Post = require('../../models/Post.model');
const { ObjectId } = require("mongoose").Types;
const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const checkPost = await Post.findOne({
        _id: ObjectId(id)
    })

    if(!checkPost){
        return next(createError(404, "post not found"));
    }
    
    await Post.findOneAndUpdate(
        {
            _id: ObjectId(id)
        },
        {
            isDeleted:true
        },
        {
            new: true
        }
    ) 
    res.json({
      success: true,
      message: "Deleted post successfully!", 
    });
  } catch (error) {
    next(error);
  }
};

module.exports = deletePost;
