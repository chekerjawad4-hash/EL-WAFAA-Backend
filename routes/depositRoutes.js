const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
    createDeposit,
    getDeposits
} = require("../database/deposits");

router.post("/deposit", auth, (req,res)=>{

    const {
        currency,
        network,
        amount,
        txid,
        screenshot
    } = req.body;

    const result = createDeposit(
        req.user.id,
        currency,
        network,
        amount,
        txid,
        screenshot
    );

    res.json(result);

});

router.get("/deposits",auth,(req,res)=>{

    const result = getDeposits();

    res.json(result);

});

module.exports = router;
