const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WalletSchema = new Schema(
  {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
      },
      meme_coins: { type: Number, required: true, default: 0 },
  },
  {
      timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const Wallet = mongoose.model("Wallet", WalletSchema, "wallet");

module.exports = Wallet;
