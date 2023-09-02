const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/userController");
const {
  createAccountingProvider,
  getAccountingProviderList,
} = require("../controllers/accountingProviderController");
const {
  fetchBalanceSheet,
  submitApplicationForLoan,
} = require("../controllers/businessApplicationController");

//user routes
router.post("/registerUser", registerUser);
router.post("/loginUser", loginUser);

//accounting provider routes
router.post("/createAccountingProvider", createAccountingProvider);
router.get("/getAccountingProviderList", getAccountingProviderList);

//business Application routes
router.get("/fetchBalanceSheet", fetchBalanceSheet);
router.post("/submitApplicationForLoan", submitApplicationForLoan);

module.exports = router;
