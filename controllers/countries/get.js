const countryCode = require("../../models/countryCode");

const getCountryCode = async function (req, res, next) {
  try {
    const code = await countryCode.find();
    if (!code) {
      return res.status(404).send({ message: "Not found" });
    }
    return res.status(200).send({
      status: true,
      result: code[0].data,
    });
  } catch (error) {
    return res.status(500).send({ message: "Internal error" });
  }
};
module.exports=getCountryCode