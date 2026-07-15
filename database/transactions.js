const { getDB, saveDB } = require("./db");


function createTransaction(userId, type, amount, currency){

    const db = getDB();

    db.run(
        `INSERT INTO transactions
        (user_id,type,amount,currency)
        VALUES (?,?,?,?)`,
        [
            userId,
            type,
            amount,
            currency
        ]
    );


    saveDB();


    return {
        success:true
    };
}



function getTransactions(userId){

    const db = getDB();


    const result = db.exec(
        `SELECT * FROM transactions 
         WHERE user_id=? 
         ORDER BY id DESC`,
        [userId]
    );


    if(!result.length){

        return {
            success:true,
            transactions:[]
        };
    }


    const rows = result[0].values;


    return {
        success:true,
        transactions: rows.map(row=>({
            id:row[0],
            user_id:row[1],
            type:row[2],
            amount:row[3],
            currency:row[4],
            created_at:row[5]
        }))
    };
}



module.exports = {
    createTransaction,
    getTransactions
};
