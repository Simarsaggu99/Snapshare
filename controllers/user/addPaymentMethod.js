const Payment = require("../../models/Payment");
const { ObjectId } = require("mongoose").Types;
const createError = require("http-errors");

const addPaymentMethod = async (req, res, next) => {
  try {
    const { _id: userId } = req.user.data;

    const { paymentMethod, paymentId } = req.body;
    const details = await Payment.findOne({
      user:ObjectId(userId)
    });

    if(details){
      throw createError.BadRequest("payment method for this user already exists!")
    }
    const payment = new Payment({
        paymentId,
        paymentMethod,
        user:userId
    })

    await payment.save()

    res.status(200).json({
        success:true,
        message:"payment method added successfully!",
        payment
    })
  } catch (error) {
    console.log(error);
    next(error);
  }
};
module.exports = addPaymentMethod;
