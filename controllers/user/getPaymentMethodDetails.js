const Payment = require("../../models/Payment");
const { ObjectId } = require("mongoose").Types;
const createError = require("http-errors");

const getPaymentDetails = async (req, res, next) => {
  try {
    const { _id: userId } = req.user.data;

    const details = await Payment.findOne({
      user: ObjectId(userId),
    });

    res.status(200).json({
      success: true,
      message: "payment details fetched successfully!",
      details,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
module.exports = getPaymentDetails;
