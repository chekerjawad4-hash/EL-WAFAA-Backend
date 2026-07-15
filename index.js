const express = require("express");
const path = require("path");
const cors = require("cors");
const { connectDB } = require("./database/db");
const { createUser, loginUser } = require("./database/users");
const { getWallet, updateWallet, depositWallet } = require("./database/wallet");
const { createTransaction, getTransactions } = require("./database/transactions");
const { getDZC } = require("./config/dzc");
const { buyDZC } = require("./database/trade");
const priceRoutes = require("./routes/priceRoutes");
const marketRoutes = require("./routes/marketRoutes");
const authRoutes = require("./routes/authRoutes");
const walletRoutes = require("./routes/walletRoutes");
const futuresRoutes = require("./routes/futuresRoutes");
const depositRoutes = require("./routes/depositRoutes");
const candleRoutes = require("./routes/candleRoutes");
const adminRoutes = require("./routes/adminRoutes");
const tradeRoutes = require("./routes/tradeRoutes");
const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/api/status", (req, res) => {
  res.json({
    success: true,
    name: "EL WAFAA",
    version: "1.0.0",
    status: "running"
  });
});

const PORT = process.env.PORT || 3001;
connectDB();





app.get("/api/dzc", (req,res)=>{

    const result = getDZC();

    res.json(result);

});


app.post("/api/buy-dzc", (req,res)=>{

    const {userId, amount} = req.body;


    const result = buyDZC(
        userId,
        amount
    );


    res.json(result);

});

app.use("/api/markets", marketRoutes);
app.use("/api/prices", priceRoutes);

app.use("/api", authRoutes);

app.use("/api", walletRoutes);
app.use("/api", depositRoutes);
app.use("/api", futuresRoutes);
app.use("/api", candleRoutes);
app.use("/api", adminRoutes);
app.use("/api", tradeRoutes);



app.listen(PORT, () => {
  console.log("=================================");
  console.log(" EL WAFAA Server Started");
  console.log(" http://127.0.0.1:" + PORT);
  console.log("=================================");
});
