const { getDB, saveDB } = require("./db");


function createOrder(userId, symbol, side, type, price, amount){

    const db = getDB();

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
