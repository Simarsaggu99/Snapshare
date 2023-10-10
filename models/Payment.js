const { Schema, model } = require("mongoose");

const PaymentSchema = new Schema(
  {
    paymentMethod: {
      type: String,
      required: true,
      enum:["googlepay", "paypal"]
    },
    paymentId:{
        type:String,
        required:true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const Payment = model("Payment", PaymentSchema, "Payment");

// make this available to our users in our Node applications
module.exports = Payment;
