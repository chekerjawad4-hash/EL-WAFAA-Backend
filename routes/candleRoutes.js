const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/candles/:symbol", async (req, res) => {

    const symbol = req.params.symbol;
    const interval = req.query.interval || "1h";
    console.log("CANDLES:", symbol, interval);

    if (symbol === "DZCUSDT") {
        return res.json({
            success: true,
            symbol,
            candles: [
                { time:"2026-07-10", open:0.10, high:0.13, low:0.09, close:0.12 },
                { time:"2026-07-11", open:0.12, high:0.15, low:0.11, close:0.14 },
                { time:"2026-07-12", open:0.14, high:0.16, low:0.13, close:0.15 }
            ]
        });
    }

    try {

        const response = await axios.get(
            "https://api.binance.com/api/v3/klines",
            {
                params: {
                    symbol,
                    interval,
                    limit: 100
                }
            }
        );

        const candles = response.data.map(c => ({
            time: Math.floor(c[0] / 1000),
            open: Number(c[1]),
            high: Number(c[2]),
            low: Number(c[3]),
            close: Number(c[4])
        }));

        res.json({
            success: true,
            symbol,
            candles
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: "Failed to load candles"
        });

    }

});

module.exports = router;
