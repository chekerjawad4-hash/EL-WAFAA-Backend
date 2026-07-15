const { getDB, saveDB } = require("./db");

function createDeposit(userId, currency, network, amount, txid, screenshot){

    const db = getDB();

    db.run(
        `INSERT INTO deposits
        (user_id,currency,network,amount,txid,screenshot,status)
        VALUES(?,?,?,?,?,?,'PENDING')`,
        [
            userId,
            currency,
            network,
            amount,
            txid,
            screenshot
        ]
    );

    saveDB();

    return {
        success:true,
        message:"Deposit request created"
    };
}

function getDeposits(){

    const db = getDB();

    const result = db.exec(
        "SELECT * FROM deposits ORDER BY id DESC"
    );

    if(!result.length){
        return {
            success:true,
            deposits:[]
        };
    }

    return {
        success:true,
        deposits:result[0].values
    };
}

module.exports = {
    createDeposit,
    getDeposits
};
