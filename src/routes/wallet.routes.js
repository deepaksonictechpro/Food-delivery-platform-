const express = require("express");
const router = express.Router();

const walletController = require("../controllers/wallet.controller");
const {authUserMiddleware} = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const { paginationSchema } = require("../validations/pagination.validation");

// ----------------------- Get wallet -------------------------
router.get(
  "/get-wallet",
  authUserMiddleware,
  walletController.getWallet
);

// ----------------- Get transactions----------------
router.get(
  "/transactions",
  authUserMiddleware,
  validate(paginationSchema, "query"),
  walletController.getWalletTransactions
);

module.exports = router;