const { getDB, saveDB } = require("./db");

const { getWallet, updateWalletBalance } = require("./wallet");
function createOrder(userId, symbol, side, type, price, amount){

    const db = getDB();

    const wallet = getWallet(userId);

    if(!wallet.success){
        return wallet;
    }

    if(side === "BUY"){
        const total = Number(price) * Number(amount);

        if(wallet.wallet.usdt < total){
            return {
                success:false,
                message:"Insufficient USDT balance"
            };
        }
    }

    if(side === "SELL"){
        if(wallet.wallet.dzc < Number(amount)){
            return {
                success:false,
                message:"Insufficient DZC balance"
            };
        }
    }

      let walletUpdate;

      if(side === "BUY"){
          const total = Number(price) * Number(amount);
          walletUpdate = updateWalletBalance(userId, -total, Number(amount));
      }

      if(side === "SELL"){
          const total = Number(price) * Number(amount);
          walletUpdate = updateWalletBalance(userId, total, -Number(amount));
      }

      if(!walletUpdate.success){
          return walletUpdate;
      }


    db.run(
        `INSERT INTO orders
        (user_id,symbol,side,type,price,amount)
        VALUES (?,?,?,?,?,?)`,
        [
            userId,
            symbol,
            side,
            type,
            price,
            amount
        ]
    );

    saveDB();

    return {
        success:true,
        message:"Order created"
    };

}
function getOrders(userId){

    const db = getDB();

    const result = db.exec(
        "SELECT * FROM orders WHERE user_id=? ORDER BY id DESC",
        [userId]
    );

    if(!result.length){
        return [];
    }

    return result[0].values;
}


module.exports={
    createOrder,
    getOrders
};
