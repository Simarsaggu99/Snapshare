const { Schema, model } = require("mongoose");
const dayjs = require("dayjs");

const userSchema = new Schema(
  {
    //name: { type: String, required: true },
    OAuth: {
      type: String,
      unique: true,
      required: true,
    },
    description: { type: String },
    name: { type: String, trim: true },
    email: {
      type: String,
      unique: true,
    },
    user_handle: { type: String, required: true, unique: true, trim: true },
    avatar_url: { type: String },
    cover_url: { type: String },
    gender: { type: String, trim: true },
    bio: { type: String, trim: true },
    country: { type: String, trim: true },
    city: { type: String, trim: true },
    role: { type: String, default: "user", enum: ["user", "admin"] },
    dob: { type: String, trim: true },
    onBoarding: { type: Boolean, default: false },
    isDeleted: { type: Boolean },
    isSuspended: { type: Boolean, default: false },
    date: { type: String, default: dayjs().format("DD MM YYYY") },
    followers_count: { type: Number, default: 0 },
    following_count: { type: Number, default: 0 },
    spankeeCount: { type: Number, default: 0 },
    warningCount: { type: Number, default: 0 },
    cruxLevel: { type: Number, default: 0 },
    cruxAwardedMemeCoins: { type: Number, default: 0 },
    redeem: { type: Boolean, default: false },
    notificationCount: { type: Number, default: 0 },
    messageCount: { type: Number, default: 0 },
    status: { type: String, enum: ["online", "offline"], default: "offline" },
    socketId: { type: String, default: "" },
    lastTransaction: { type: String },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const User = model("User", userSchema, "user");

// make this available to our users in our Node applications
module.exports = User;
