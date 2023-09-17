const router = require("express").Router();

const getCountryCode = require("../../controllers/countries/get");

router.get("/get", getCountryCode);

module.exports = router;