const { Schema, model } = require("mongoose");

const stripeCustomerSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    stripe_customer_id: { type: String, required: true, unique: true },
    default_payment_method: { type: String },
    payment_methods: [{ type: String }],
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const StripeCustomer = model(
  "StripeCustomer",
  stripeCustomerSchema,
  "stripecustomer"
);

module.exports = StripeCustomer;
