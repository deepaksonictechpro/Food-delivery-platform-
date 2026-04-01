const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate.middleware");
const {getWallet, getTransactions} = require("../controllers/deliveryPartnerWallet.controller");
const {walletSchema, transactionSchema} = require("../validations/deliveryPartnerWallet.validation");
const {authUserMiddleware, authRoleMiddleware} = require("../middlewares/auth.middleware");

// ---------------- GET WALLET ----------------
router.get(
  "/wallet",
  authUserMiddleware,
  authRoleMiddleware(["delivery_partner"]),
  validate(walletSchema, "query"),
  getWallet
);

// ---------------- GET TRANSACTIONS ----------------
router.get(
  "/wallet/transactions",
  authUserMiddleware,
  authRoleMiddleware(["delivery_partner"]),
  validate(transactionSchema, "query"),
  getTransactions
);

module.exports = router;
