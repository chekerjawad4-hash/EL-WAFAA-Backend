const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", async (req, res) => {
    try {

        const response = await axios.get(
            "https://api.coingecko.com/api/v3/coins/markets",
            {
                params: {
                    vs_currency: "usd",
                    order: "market_cap_desc",
                    per_page: 250,
                    page: 1,
                    sparkline: false,
                    price_change_percentage: "24h"
                }
            }
        );

        const markets = response.data.map(c => ({
            symbol: `${c.symbol.toUpperCase()}/USDT`,
            name: c.name,
            price: c.current_price,
            change24h: c.price_change_percentage_24h ?? 0,
            volume: c.total_volume,
            marketCap: c.market_cap,
            image: c.image
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
