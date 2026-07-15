const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", async (req,res)=>{

    try{

        const response = await axios.get(
            "https://api.binance.com/api/v3/exchangeInfo"
        );

        const markets = response.data.symbols
            .filter(s => s.status === "TRADING")
            .map(s => ({
                symbol: s.symbol,
                baseAsset: s.baseAsset,
                quoteAsset: s.quoteAsset
            }));

        res.json({
            success:true,
            count: markets.length,
            markets
        });

    }catch(error){

        res.status(500).json({
            success:false,
            error:"Failed to load Binance markets"
        });

    }

});

module.exports = router;
