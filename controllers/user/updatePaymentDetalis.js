const Payment = require("../../models/Payment");
const { ObjectId } = require("mongoose").Types;
const createError = require("http-errors");

const updateDetails = async (req, res, next) => {
  try {
    const { _id: userId } = req.user.data;
    const payId = req.params.id;
    const { paymentMethod, paymentId } = req.body;

    const details = await Payment.findOne({
      user: ObjectId(userId),
      _id: ObjectId(payId),
    });

    if (!details) {
      throw createError.BadRequest("no details found for this user!");
    }
    const updateDetails = await Payment.findOneAndUpdate(
      {
        user: ObjectId(userId),
        _id: ObjectId(payId),
      },
      { paymentMethod, paymentId },
      {
        new: true,
      }
    );
    res.status(200).json({
      success: true,
      message: "payment details fetched successfully!",
      updateDetails,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
module.exports = updateDetails;
