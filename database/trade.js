const { getDB, saveDB } = require("./db");
const { getWallet } = require("./wallet");
const { getDZC } = require("../config/dzc");


function buyDZC(userId, amountDZC){

    const db = getDB();

    const walletResult = getWallet(userId);

    if(!walletResult.success){
        return walletResult;
    }


    const price = getDZC().coin.price;


    const cost = amountDZC * price;


    let usdt = walletResult.wallet.usdt;
    let dzc = walletResult.wallet.dzc;


    if(usdt < cost){

        return {
            success:false,
            error:"Insufficient USDT"
        };

    }


    usdt -= cost;
    dzc += amountDZC;


    db.run(
        `UPDATE wallets
         SET usdt=?, dzc=?
         WHERE user_id=?`,
        [
            Number(usdt.toFixed(2)),
            Number(dzc.toFixed(2)),
            userId
        ]
    );


    db.run(
        `INSERT INTO transactions
        (user_id,type,amount,currency)
        VALUES (?,?,?,?)`,
        [
            userId,
            "BUY",
            amountDZC,
            "DZC"
        ]
    );


    saveDB();


    return {
        success:true,
        purchase:{
            amount:amountDZC,
            cost:cost,
            price:price
        },
        wallet:{
            usdt:Number(usdt.toFixed(2)),
            dzc
        }
    };

}


module.exports = {
    buyDZC
};
