const express = require("express");
const router = express.Router();
const {
  fetchBalanceSheet,
  submitApplicationForLoan,
  initiateApplication
} = require("../controllers/businessApplicationController");

//business Application routes
router.post("/initiateApplication", initiateApplication)
router.patch("/fetchBalanceSheet/:id", fetchBalanceSheet);
router.patch("/submitApplicationForLoan/:id", submitApplicationForLoan);

module.exports = router;
