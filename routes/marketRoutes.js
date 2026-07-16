const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", async (req, res) => {

    try {

        const response = await axios.get(
            "https://api.mexc.com/api/v3/ticker/24hr"
        );

        const markets = response.data
            .filter(c => c.symbol.endsWith("USDT"))
            .map(c => ({
                symbol: c.symbol,
                price: Number(c.lastPrice),
                change24h: Number(c.priceChangePercent),
                volume: Number(c.volume)
            }));

        res.json({
            success: true,
            count: markets.length,
            markets
        });

    } catch (error) {

        console.error(error.response?.data || error.message);

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});

module.exports = router;
