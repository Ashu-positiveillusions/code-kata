const accountingProviderModel = require("../models/accountingProviderModel");

const createAccountingProvider = async (req, res) => {
  try {
    const { name, officePhone, country } = req.body;
    if (!Object.keys(req.body).length)
      return res.status(400).send({ status: false, message: "bad request" });
    if (!name)
      return res
        .status(400)
        .send({ status: false, message: "name is required" });
    if (!officePhone)
      return res
        .status(400)
        .send({ status: false, message: "officePhone is required" });
    if (!country)
      return res
        .status(400)
        .send({ status: false, message: "country is required" });

    const accountingProvider = await accountingProviderModel.create(req.body);
    return res.status(201).send({
      status: true,
      message: "accounting provider created",
      data: accountingProvider,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const getAccountingProviderList = async (req, res) => {
  try {
    const accountingProviders = await accountingProviderModel.find({
      isDeleted: false,
    });
    if (!accountingProviders.length)
      return res
        .status(404)
        .send({ status: false, message: "no accounting providers available" });
    return res.status(200).send({
      status: true,
      message: "accounting providers found",
      data: accountingProviders,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { createAccountingProvider, getAccountingProviderList };
