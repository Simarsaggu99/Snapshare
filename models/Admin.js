const { Schema, model } = require("mongoose");

const adminSchema = new Schema(
  {
    //name: { type: String, required: true },
    name: { type: String, trim: true },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: { type: String, default: "admin", enum: ["admin"] },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const User = model("Admin", adminSchema, "Admin");

// make this available to our users in our Node applications
module.exports = User;
