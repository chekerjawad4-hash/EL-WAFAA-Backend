const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", async (req,res)=>{

try{

const response = await axios.get(
"https://api.binance.com/api/v3/ticker/24hr"
);

const prices = response.data
.filter(item => item.symbol.endsWith("USDT"))
.map(item=>({
symbol:item.symbol,
price:Number(item.lastPrice),
change:Number(item.priceChangePercent)
}));

res.json(prices);

}catch(error){

res.status(500).json({
error:"Failed to load prices"
});

}

});

module.exports = router;
