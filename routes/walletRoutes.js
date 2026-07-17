const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
    getWallet,
    depositWallet
} = require("../database/wallet");

const {
    createTransaction,
    getTransactions
} = require("../database/transactions");

router.get("/wallet", auth, (req, res) => {

    console.log("TOKEN USER ID =", req.user.id);
const result = getWallet(req.user.id);

    res.json(result);

});

router.post("/transaction", auth, (req, res) => {

    const { type, amount, currency } = req.body;
    const userId = req.user.id;

    if (type === "DEPOSIT") {

        const walletResult = depositWallet(
            userId,
            amount
        );

        if (!walletResult.success) {
            return res.json(walletResult);
        }
    }

    const result = createTransaction(
        userId,
        type,
        amount,
        currency
    );

    res.json(result);

});

router.get("/transactions", auth, (req, res) => {

    const result = getTransactions(req.user.id);

    res.json(result);

});

module.exports = router;
