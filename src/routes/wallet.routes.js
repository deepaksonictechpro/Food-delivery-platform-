const express = require("express");
const router = express.Router();

const walletController = require("../controllers/wallet.controller");
const {authUserMiddleware} = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const { paginationSchema } = require("../validations/pagination.validation");
const { addMoney} = require("../controllers/wallet.controller");
const { addMoneySchema} = require("../validations/wallet.validation");
const {payWithWallet} = require("../controllers/wallet.controller");
const {payWithWalletSchema} = require("../validations/wallet.validation");

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

// ----------------- Add money----------------
router.post( "/add-money", authUserMiddleware, validate(addMoneySchema), addMoney);

//----------------- Pay with wallet----------------
router.post(
  "/pay-with-wallet",
  authUserMiddleware,
  validate(payWithWalletSchema),
  payWithWallet
);


module.exports = router;