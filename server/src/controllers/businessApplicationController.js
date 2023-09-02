const businessModel = require("../models/businessModel");

//api call to accounting provider to get balance sheet based on BIN number
const requestBalanceSheet = (BIN) => {
  return new Promise(function (resolve) {
    console.log(BIN);
    setTimeout(function () {
      const myArray = (sheet = [
        {
          year: 2020,
          month: 12,
          profitOrLoss: 250000,
          assetsValue: 1234,
        },
        {
          year: 2020,
          month: 11,
          profitOrLoss: 1150,
          assetsValue: 5789,
        },
        {
          year: 2020,
          month: 10,
          profitOrLoss: 2500,
          assetsValue: 22345,
        },
        {
          year: 2020,
          month: 9,
          profitOrLoss: -187000,
          assetsValue: 223452,
        },
        {
          year: 2020,
          month: 8,
          profitOrLoss: -187000,
          assetsValue: 223452,
        },
        {
          year: 2020,
          month: 7,
          profitOrLoss: -187000,
          assetsValue: 223452,
        },
        {
          year: 2020,
          month: 6,
          profitOrLoss: -187000,
          assetsValue: 223452,
        },
        {
          year: 2020,
          month: 5,
          profitOrLoss: -187000,
          assetsValue: 223452,
        },
        {
          year: 2020,
          month: 4,
          profitOrLoss: -187000,
          assetsValue: 223452,
        },
        {
          year: 2020,
          month: 3,
          profitOrLoss: -187000,
          assetsValue: 223452,
        },
        {
          year: 2020,
          month: 2,
          profitOrLoss: -187000,
          assetsValue: 223452,
        },
        {
          year: 2020,
          month: 1,
          profitOrLoss: -187000,
          assetsValue: 223452,
        },
      ]);
      resolve(myArray);
    }, 2000); // 2000 milliseconds (2 seconds)
  });
};

//api call to mimic data engine
const dataEngineMimic = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data.preAssessment / 100);
    }, 2000);
  });
};

const fetchBalanceSheet = async (req, res) => {
  try {
    const { businessIdentificationNumber } = req.query;
    // get balance sheet based on businessIdentificationNumber (BIN) from the selected accounting provider
    const balanceSheet = await requestBalanceSheet(
      businessIdentificationNumber
    );
    if (!balanceSheet || !balanceSheet.length) {
      return res
        .status(400)
        .send({ status: false, message: "BalanceSheet Not Available" });
    }
    return res.status(200).send({
      status: true,
      message: "Balance Sheet Found",
      sheet: balanceSheet,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const submitApplicationForLoan = async (req, res) => {
  try {
    const loanApplicationDetails = req.body;
    loanApplicationDetails.appliedDate = Date.now();
    let totalProfitOrLoss = 0;
    let totalAssetValue = 0;
    let hasMadeProfitInLast12Months = false;
    for (let monthlyDetail of loanApplicationDetails.balanceSheet) {
      if (monthlyDetail.profitOrLoss > 0) {
        hasMadeProfitInLast12Months = true;
      }
      totalProfitOrLoss = totalProfitOrLoss + monthlyDetail.profitOrLoss;
      totalAssetValue = totalAssetValue + monthlyDetail.assetsValue;
    }

    const dataToDecisionEngine = {
      name: loanApplicationDetails.name,
      establishmentYear: loanApplicationDetails.establishmentYear,
      yearlyProfitOrLoss: totalProfitOrLoss,
    };
    if (
      loanApplicationDetails.balanceSheet.length === 12 &&
      totalAssetValue / 12 >= loanApplicationDetails.loanAmount
    ) {
      dataToDecisionEngine.preAssessment = 100;
    } else if (
      loanApplicationDetails.balanceSheet.length === 12 &&
      hasMadeProfitInLast12Months
    ) {
      dataToDecisionEngine.preAssessment = 60;
    } else {
      dataToDecisionEngine.preAssessment = 20;
    }

    // send data to decision engine
    const responseFromDataEngine = await dataEngineMimic(dataToDecisionEngine);

    // need to add it in DB
    loanApplicationDetails.approvedAmount =
      responseFromDataEngine * loanApplicationDetails.loanAmount;

    let applicationFinalInDb = await businessModel.create(
      loanApplicationDetails
    );
    return res.status(200).send({
      status: true,
      message: `Your loan has been approved to the amount of ${
        responseFromDataEngine * loanApplicationDetails.loanAmount
      }`,
      data: applicationFinalInDb,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { fetchBalanceSheet, submitApplicationForLoan };
