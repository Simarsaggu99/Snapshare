const createError = require("http-errors");
const dayjs = require("dayjs");
const formidable = require("formidable");
const Wallet = require("../../models/Wallet.model");
const User = require("../../models/User.model");
const { ObjectId } = require("mongoose").Types;

// import verify token model and user model
const uploadFiles = require("../../services/upload-files");
const Post = require("../../models/Post.model");
const newReshareNotification = require("../../services/notifications/post/newShareNotification");
const NotificationSettings = require("../../models/NotificationSetting.model");
const cruxLevel = require("../../services/notifications/post/cruxLevelNotification");
const syncCrux = require("../../services/crux/syncCrux");

const createPost = async (req, res, next) => {
  try {
    const { _id: userId } = req.user.data;

    const checkPosts = await Post.countDocuments({
      user: ObjectId(userId),
      date: dayjs().format("DD MM YYYY"),
    });

    if (checkPosts > 9) {
      throw createError.BadRequest("You have already posted 10 Posts!");
    }

    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(400);
        res.send(err);
      }

      try {
        let { description, repost, rePostedID, tag, isMemeContest, bounty } =
          fields;

        let meme;
        if (tag === undefined) {
          tag = [];
        } else {
          tag = JSON.parse(tag);
        }

        if (!repost) {
          // upload files to s3
          const filesArray = Object.values(files);
          const allFileUploadedArray = await Promise.all(
            filesArray?.map(async (item) => {
              let location = item.path;
              const originalFileName = item.name;
              const fileType = item.type;
              // uploads file.
              const data = await uploadFiles.upload(
                location,
                originalFileName,
                `users/${userId}/posts`,
                null
              );
              return {
                url: data.Location,
                type: fileType,
              };
            })
          );

          //!if repost then repost tag is true because repost is itself is a post

          meme = new Post({
            media: allFileUploadedArray,
            description,
            tags: tag,
            isMemeContest: isMemeContest === "true" ? true : false,
            user: userId,
            bounty: ObjectId(bounty),
          });
        } else {
          const userPost = await Post.findOne({
            _id: rePostedID,
          });
          meme = new Post({
            description: userPost?.description,
            tags: userPost?.tags,
            user: userId,
            isRePosted: repost,
            rePostedID,
          });
          const notification = await NotificationSettings.findOne({
            userId: userPost.user,
          });

          if (notification?.notifications?.post_reshare) {
            newReshareNotification(userId, userPost?.user, rePostedID, req.io);
          }
        }

        // Save post to DB
        const createdPost = await meme.save();
        if (!createdPost)
          throw createError.InternalServerError(
            "Your request could not be processed. Please contact support or try again after some time."
          );

        //syncing the crux and the associated earnings
        await syncCrux(userId, req.io);

        res.status(200).json({
          success: true,
          data: createdPost,
        });
      } catch (error) {
        console.error("error in create post: ", error);
      }
    });
  } catch (error) {
    console.log("error: ", error);
    next(error);
  }
};

module.exports = createPost;
