const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const businessLoanApplication = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    loanAmount: { type: Number, required: true, default: 0 },
    accountingProvider: {
      type: ObjectId,
      ref: "AccountingProvider",
      required: true,
    },
    businessIdentificationNumber: { type: String, required: true },
    initiatingUser: { type: ObjectId, required: true, ref: "User" },
    balanceSheet: [{
      year: { type: String, required: true },
      month: {
        type: String,
        required: true,
        enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      },
      profitOrLoss: { type: Number, required: true },
      assetsValue: { type: Number, required: true },
    }],
    // isSubmitted: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    appliedDate: { type: Date, required: true },
    approvedAmount: { type: Number, required: true, default: 0 },
    establishmentYear: {type: String, required:true},
  },
  { timestamps: true }
);
module.exports = mongoose.model(
  "BusinessLoanApplication",
  businessLoanApplication
);
