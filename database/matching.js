const { getDB, saveDB } = require("./db");
const { updateWalletBalance, getWallet } = require("./wallet");


function matchOrders(symbol){

    const db = getDB();

    const buys = db.exec(
        `SELECT * FROM orders
         WHERE symbol=? 
         AND side='BUY'
         AND status='OPEN'
         ORDER BY price DESC`,
        [symbol]
    );

    const sells = db.exec(
        `SELECT * FROM orders
         WHERE symbol=? 
         AND side='SELL'
         AND status='OPEN'
         ORDER BY price ASC`,
        [symbol]
    );


    if(!buys.length || !sells.length){
        return {
            success:false,
            message:"No match"
        };
    }


    const buy = buys[0].values[0];
    const sell = sells[0].values[0];


    if(buy[1] === sell[1]){
        return {
            success:false,
            message:"Self trade prevented"
        };
    }


    if(buy[5] < sell[5]){
        return {
            success:false,
            message:"Price mismatch"
        };
    }


    const amount = Math.min(
        buy[6],
        sell[6]
    );


    const total = Number((sell[5] * amount).toFixed(2));


    const buyerWallet = getWallet(buy[1]);
    const sellerWallet = getWallet(sell[1]);


    if(!buyerWallet.success || !sellerWallet.success){
        return {
            success:false,
            message:"Wallet not found"
        };
    }


    if(buyerWallet.wallet.usdt < total){
        return {
            success:false,
            message:"Buyer insufficient USDT"
        };
    }


    if(sellerWallet.wallet.dzc < amount){
        return {
            success:false,
            message:"Seller insufficient DZC"
        };
    }


    db.run(
        `INSERT INTO trades
        (buy_order_id,sell_order_id,symbol,price,amount)
        VALUES (?,?,?,?,?)`,
        [
            buy[0],
            sell[0],
            symbol,
            sell[5],
            amount
        ]
    );


    db.run(
        `UPDATE orders SET status='FILLED'
         WHERE id=? OR id=?`,
        [
            buy[0],
            sell[0]
        ]
    );


    const buyerUpdate = updateWalletBalance(
        buy[1],
        -total,
        amount
    );


    const sellerUpdate = updateWalletBalance(
        sell[1],
        total,
        -amount
    );


    if(!buyerUpdate.success || !sellerUpdate.success){
        return {
            success:false,
            message:"Balance update failed"
        };
    }


    saveDB();


    return {
        success:true,
        message:"Trade matched"
    };

}


module.exports={
    matchOrders
};
