const bcrypt = require("bcryptjs");
const { getDB, saveDB } = require("./db");
const { createToken } = require("../utils/jwt");


function createUser(username, email, password){

    const db = getDB();

    const hash = bcrypt.hashSync(password, 10);

    const uid = String(
        Math.floor(1000000000 + Math.random() * 9000000000)
    );

    try {

        const result = db.exec(
            `INSERT INTO users 
            (username,email,password,uid)
            VALUES (?,?,?,?)`,
            [username,email,hash,uid]
        );

        const userId = db.exec(
            "SELECT last_insert_rowid() AS id"
        )[0].values[0][0];


        db.run(
            `INSERT INTO wallets
            (user_id, usdt, dzc)
            VALUES (?,?,?)`,
            [userId,0,0]
        );


        saveDB();

        return {
            success:true,
            userId:userId
        };


    } catch(error){

        return {
            success:false,
            error:error.message
        };

    }
}



function loginUser(email,password){

    const db = getDB();

    const result = db.exec(
        "SELECT * FROM users WHERE email=?",
        [email]
    );


    if(!result.length){
        return {
            success:false,
            error:"User not found"
        };
    }


    const user = result[0].values[0];


    const valid = bcrypt.compareSync(
        password,
        user[3]
    );


    if(!valid){
        return {
            success:false,
            error:"Wrong password"
        };
    }


    const token = createToken({
        id:user[0],
        username:user[1],
        email:user[2],
        uid:user[5]
    });

    return {
        success:true,
        token,
        user:{
            id:user[0],
            username:user[1],
            email:user[2],
            uid:user[5]
        }
    };

}


module.exports={
    createUser,
    loginUser
};
