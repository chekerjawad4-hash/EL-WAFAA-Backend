const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const { getDB } = require("../database/db");

router.get("/admin/dashboard",(req,res)=>{

    const db = getDB();

    const users =
        db.exec("SELECT COUNT(*) FROM users")[0].values[0][0];

    const wallets =
        db.exec("SELECT COUNT(*) FROM wallets")[0].values[0][0];

    const orders =
        db.exec("SELECT COUNT(*) FROM orders")[0].values[0][0];

    const trades =
        db.exec("SELECT COUNT(*) FROM trades")[0].values[0][0];

    res.json({
        success:true,
        users,
        wallets,
        orders,
        trades,
        server:"ONLINE"
    });

});


router.get("/admin/users", auth, (req,res)=>{

    const db = getDB();

    const result = db.exec(`
        SELECT
            users.id,
            users.username,
            users.email,
            users.uid,
            wallets.usdt,
            wallets.dzc
        FROM users
        LEFT JOIN wallets
        ON users.id = wallets.user_id
        ORDER BY users.id DESC
    `);

    res.json({
        success:true,
        users: result.length ? result[0].values : []
    });

});


router.get("/admin/user/:id", auth, (req,res)=>{

    const db = getDB();

    const result = db.exec(`
        SELECT
            users.id,
            users.username,
            users.email,
            users.uid,
            wallets.usdt,
            wallets.dzc
        FROM users
        LEFT JOIN wallets
        ON users.id = wallets.user_id
        WHERE users.id=?
    `,[req.params.id]);

    if(!result.length || !result[0].values.length){
        return res.status(404).json({
            success:false,
            error:"User not found"
        });
    }

    const u=result[0].values[0];

    res.json({
        success:true,
        user:{
            id:u[0],
            username:u[1],
            email:u[2],
            uid:u[3],
            usdt:u[4],
            dzc:u[5]
        }
    });

});


router.post("/admin/user/:id/balance", auth, (req,res)=>{

    const db = getDB();

    const { currency, amount, action } = req.body;

    const result = db.exec(
        "SELECT usdt,dzc FROM wallets WHERE user_id=?",
        [req.params.id]
    );

    if(!result.length || !result[0].values.length){
        return res.status(404).json({
            success:false,
            error:"Wallet not found"
        });
    }

    let usdt = Number(result[0].values[0][0]);
    let dzc  = Number(result[0].values[0][1]);
    const value = Number(amount);

    if(Number.isNaN(value) || value < 0){
        return res.status(400).json({
            success:false,
            error:"Invalid amount"
        });
    }

    if(currency === "USDT"){
        usdt = action === "add" ? usdt + value : usdt - value;
    }else if(currency === "DZC"){
        dzc = action === "add" ? dzc + value : dzc - value;
    }else{
        return res.status(400).json({
            success:false,
            error:"Invalid currency"
        });
    }

    if(usdt < 0 || dzc < 0){
        return res.status(400).json({
            success:false,
            error:"Insufficient balance"
        });
    }

    db.run(
        "UPDATE wallets SET usdt=?, dzc=? WHERE user_id=?",
        [usdt, dzc, req.params.id]
    );

    res.json({
        success:true,
        usdt,
        dzc
    });

});

module.exports = router;
