const { getDB, saveDB } = require("./db");

function createSecurityLog(userId,event,ip,details){

    const db = getDB();

    db.run(
        `INSERT INTO security_logs
        (user_id,event,ip,details)
        VALUES (?,?,?,?)`,
        [
            userId,
            event,
            ip,
            details
        ]
    );

    saveDB();

}


function getSecurityLogs(){

    const db = getDB();

    const result = db.exec(
        "SELECT * FROM security_logs ORDER BY id DESC"
    );

    if(!result.length){
        return [];
    }

    return result[0].values;

}


module.exports = {
    createSecurityLog,
    getSecurityLogs
};
