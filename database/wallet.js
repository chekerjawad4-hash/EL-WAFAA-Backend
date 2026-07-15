const { getDB, saveDB } = require("./db");


function getWallet(userId){

    const db = getDB();

    const result = db.exec(
        "SELECT * FROM wallets WHERE user_id=?",
        [userId]
    );

    if(!result.length){
        return {
            success:false,
            error:"Wallet not found"
        };
    }

    const wallet = result[0].values[0];

    return {
        success:true,
        wallet:{
            id:wallet[0],
            user_id:wallet[1],
            usdt:Number((wallet[2] || 0).toFixed(2)),
            dzc:Number((wallet[3] || 0).toFixed(2))
        }
    };
}



function depositWallet(userId, amount, currency){

    const db = getDB();

    const wallet = getWallet(userId);

    if(!wallet.success){
        return wallet;
    }


    let usdt = wallet.wallet.usdt;
    let dzc = wallet.wallet.dzc;


    if(currency === "USDT"){
        usdt += amount;
    }

    if(currency === "DZC"){
        dzc += amount;
    }


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


    saveDB();


    return {
        success:true,
        wallet:{
            usdt:Number(usdt.toFixed(2)),
            dzc
        }
    };
}



function updateWalletBalance(userId, usdtChange, dzcChange){

    const db = getDB();

    const wallet = getWallet(userId);

    if(!wallet.success){
        return wallet;
    }


    let usdt = wallet.wallet.usdt + usdtChange;
    let dzc = wallet.wallet.dzc + dzcChange;


    if(usdt < 0 || dzc < 0){
        return {
            success:false,
            error:"Insufficient balance"
        };
    }


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


    saveDB();


    return {
        success:true,
        usdt,
        dzc
    };

}


module.exports = {
    getWallet,
    depositWallet,
    updateWalletBalance
};
