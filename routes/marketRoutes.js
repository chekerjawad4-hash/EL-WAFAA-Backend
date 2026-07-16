const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", async (req,res)=>{

    try{

        const [exchangeInfo,tickers] = await Promise.all([
            axios.get("https://api.binance.com/api/v3/exchangeInfo"),
            axios.get("https://api.binance.com/api/v3/ticker/24hr")
        ]);

        const tickerMap = {};

        tickers.data.forEach(t=>{
            tickerMap[t.symbol]=t;
        });

        const markets = exchangeInfo.data.symbols
            .filter(s=>s.status==="TRADING")
            .map(s=>{

                const t=tickerMap[s.symbol]||{};

                return{
                    symbol:s.symbol,
                    baseAsset:s.baseAsset,
                    quoteAsset:s.quoteAsset,
                    price:t.lastPrice||"0",
                    change24h:t.priceChangePercent||"0",
                    volume:t.volume||"0"
                };

            });

        res.json({
            success:true,
            count:markets.length,
            markets
        });

    }catch(error){
        console.error("BINANCE ERROR:", error.response?.status, error.response?.data || error.message);


        res.status(500).json({
            success:false,
            error:error.message
        });

    }

});

module.exports = router;
