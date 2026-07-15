const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const {
    createOrder,
    getOrders
} = require("../database/orders");

const {
    matchOrders
} = require("../database/matching");


router.post("/trade/order", auth, (req,res)=>{

    const {
        symbol,
        side,
        type,
        price,
        amount
    } = req.body;


    const result = createOrder(
        req.user.id,
        symbol,
        side,
        type,
        price,
        amount
    );


    const match = matchOrders(symbol);


    res.json({
        ...result,
        match
    });

});


router.get("/trade/orders", auth, (req,res)=>{

    const result = getOrders(
        req.user.id
    );

    res.json(result);

});


module.exports = router;
