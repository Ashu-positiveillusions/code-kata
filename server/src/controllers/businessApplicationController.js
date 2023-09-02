const businessModel = require("../models/businessModel");

//api call to accounting provider to get balance sheet based on BIN number
const requestBalanceSheet = (BIN) => {
  return new Promise(function (resolve) {
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

const initiateApplication = async (req, res) => {
  try {
    req.body.applicationInitiated = true;
    const applicationInitiated = await businessModel.create(req.body);
    return res.status(201).send({
      status: true,
      message: "application initiated",
      data: applicationInitiated,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const fetchBalanceSheet = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBusinessApplication = req.body;
    // get balance sheet based on businessIdentificationNumber (BIN) from the selected accounting provider
    const balanceSheet = await requestBalanceSheet(
      updatedBusinessApplication.businessIdentificationNumber
    );
    if (!balanceSheet || !balanceSheet.length) {
      return res
        .status(400)
        .send({ status: false, message: "BalanceSheet Not Available" });
    }
    updatedBusinessApplication.balanceSheetRequested = true;
    updatedBusinessApplication.balanceSheet = balanceSheet;
    const updateBusinessApplicationSheet = await businessModel
      .findOneAndUpdate({ _id: id }, updatedBusinessApplication, { new: true })
      .lean();
    if (!updateBusinessApplicationSheet)
      return res
        .status(404)
        .send({ status: false, message: "no application found" });
    return res.status(200).send({
      status: true,
      message: "Balance Sheet Found",
      data: updateBusinessApplicationSheet,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const submitApplicationForLoan = async (req, res) => {
  try {
    const { id } = req.params;
    const applicationFromDb = await businessModel.findOne({ _id: id }).lean();
    let balanceSheet = applicationFromDb.balanceSheet;
    let totalProfitOrLoss = 0;
    let totalAssetValue = 0;
    let hasMadeProfitInLast12Months = false;

    for (let monthlyDetail of balanceSheet) {
      if (monthlyDetail.profitOrLoss > 0) {
        hasMadeProfitInLast12Months = true;
      }
      totalProfitOrLoss = totalProfitOrLoss + monthlyDetail.profitOrLoss;
      totalAssetValue = totalAssetValue + monthlyDetail.assetsValue;
    }

    const dataToDecisionEngine = {
      name: applicationFromDb.name,
      establishmentYear: applicationFromDb.establishmentYear,
      yearlyProfitOrLoss: totalProfitOrLoss,
    };
    if (
      applicationFromDb.balanceSheet.length === 12 &&
      totalAssetValue / 12 >= applicationFromDb.loanAmount
    ) {
      dataToDecisionEngine.preAssessment = 100;
    } else if (
      applicationFromDb.balanceSheet.length === 12 &&
      hasMadeProfitInLast12Months
    ) {
      dataToDecisionEngine.preAssessment = 60;
    } else {
      dataToDecisionEngine.preAssessment = 20;
    }

    // send data to decision engine
    const responseFromDataEngine = await dataEngineMimic(dataToDecisionEngine);
    applicationFromDb.approvedAmount =
      responseFromDataEngine * applicationFromDb.loanAmount;
    applicationFromDb.applicationReviewedAndSubmitted = true;

    let applicationFinalInDb = await businessModel.findOneAndUpdate(
      { _id: id },
      applicationFromDb,
      { new: true }
    );
    return res.status(200).send({
      status: true,
      message: `Your loan has been approved to the amount of ${applicationFinalInDb.approvedAmount}`,
      data: applicationFinalInDb,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = {
  fetchBalanceSheet,
  submitApplicationForLoan,
  initiateApplication,
};
