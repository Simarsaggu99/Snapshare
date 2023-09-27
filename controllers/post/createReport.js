const ReportModel = require("../../models/Report.model");
const PostModel = require("../../models/Post.model");
const { ObjectId } = require("mongoose").Types;
const reportedPostNotification = require("../../services/notifications/post/reportedPostNotification");

const createReport = async (req, res, next) => {
  const { _id: userId } = req.user.data;
  try {
    const { id: postId } = req.params;
    const { description, reason } = req.body;

    // if (!description) {
    //   res
    //     .status(400)
    //     .send({ status: false, message: "description is mandatory feild" });
    // }
    const checkPostExceeded = await PostModel.findOne({
      _id: ObjectId(postId),
    });

    if (checkPostExceeded.reportExceed === false) {
      const checkCount = await ReportModel.countDocuments({
        post_id: ObjectId(postId),
      });
      if (checkCount >= 10) {
        await PostModel.findOneAndUpdate(
          {
            _id: ObjectId(postId),
          },
          {
            reportExceed: true,
          },
          {
            new: true,
          }
        );
      }
    }

    const userIdObject = await PostModel.findById({ _id: postId }).select({
      user: 1,
      _id: 0,
    });
    const postUser = userIdObject.user;
    //console.log(userId)

    let reportExist = await ReportModel.findOne({
      post_id: postId,
      reportedBy: userId,
      userId: postUser,
    });

    if (reportExist) {
      return res
        .status(400)
        .send({ status: false, message: "You had already reported this post" });
    }

    const createRePort = await ReportModel.create({
      post_id: postId,
      // category:category,
      reportedBy: userId,
      userId: postUser,
      description: description,
      reason,
    });

    reportedPostNotification(userId, postUser, postId, req.io);

    res.status(201).send({ message: "success", data: createRePort });
  } catch (error) {
    next(error);
  }
};

module.exports = createReport;
