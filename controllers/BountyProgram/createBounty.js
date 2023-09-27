const BountyModel = require("../../models/Bounty.model");
const { bountyValidation } = require("../../services/validation_schema");
const dayjs = require("dayjs");
const scheduleJob = require("../../index");
const createError = require("http-errors");

const createBounty = async (req, res, next) => {
  // const { _id: userId } = req.user.data;
  try {
    const {
      description,
      start_time,
      end_time,
      meme_coins,
      totalAttempts,
      totalQuestions,
      status,
      question,
      type,
      correctAnswer,
      options,
      answerType,
      startDate,
      endDate,
    } = req.body;

    const startDateDiff = dayjs(startDate);
    const checkEndDate = dayjs(endDate);

    if (checkEndDate < dayjs()) {
      throw checkEndDate.BadRequest("End date and time is required!");
    }
    const total_time = checkEndDate.diff(startDateDiff, "Minute", true);

    const bountyCreated = new BountyModel({
      description,
      start_time,
      end_time,
      meme_coins,
      totalAttempts,
      totalQuestions,
      status,
      question,
      type,
      correctAnswer,
      options,
      answerType,
      startDate,
      endDate,
    });
    scheduleJob.startSchedule(new Date(new Date(startDate).getTime() + 5000));
    await bountyCreated.save();
    if (endDate) {
      scheduleJob.schedule(dayjs(endDate));
    }
    res.status(201).send({ message: "success", data: bountyCreated });
  } catch (error) {
    next(error);
  }
};

module.exports = createBounty;
