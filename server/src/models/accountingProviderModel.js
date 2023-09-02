const mongoose = require("mongoose");
const accountingProvider = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    officePhone: { type: String, required: true, unique: true, trim: true },
    country: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
module.exports = mongoose.model("AccountingProvider", accountingProvider);
