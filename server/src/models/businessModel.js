const mongoose = require("mongoose");

const businessLoanApplication = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    loanAmount: { type: Number },
    accountingProvider: { type: String },
    businessIdentificationNumber: { type: String },
    establishmentYear: { type: String },
    applicationInitiated: { type: Boolean, default: false },
    balanceSheetRequested: { type: Boolean, default: false },
    applicationReviewedAndSubmitted: { type: Boolean, default: false },
    balanceSheet: [
      {
        year: { type: String },
        month: {
          type: String,
          enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        },
        profitOrLoss: { type: Number },
        assetsValue: { type: Number },
      },
    ],
    // isSubmitted: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    approvedAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);
module.exports = mongoose.model(
  "BusinessLoanApplication",
  businessLoanApplication
);
