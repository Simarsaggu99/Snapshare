const router = require("express").Router();
const getCruxLevels = require("../../controllers/crux/getCruxLevels");

// get crux levels information
router.get("/", getCruxLevels);

module.exports = router;
