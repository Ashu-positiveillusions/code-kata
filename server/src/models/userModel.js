const mongoose = require("mongoose");
const user = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      enum: ["Mr", "Mrs", "Miss"],
      trim: true,
    },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, minlength: 8, maxlength: 15 },
    isDeleted: { type: Boolean, default: true },
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", user);
