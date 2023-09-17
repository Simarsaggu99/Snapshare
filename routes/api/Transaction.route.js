const router = require("express").Router();
const getTransaction = require("../../controllers/transaction/getTransaction");
const transactionStatus = require("../../controllers/transaction/transactionStatus");

// get transaction
router.get("/", getTransaction);
// update transaction
router.put("/:id", transactionStatus);

module.exports = router;
