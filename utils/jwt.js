require("dotenv").config();
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET;

function createToken(user){

    return jwt.sign(
        {
            id: user.id,
            uid: user.uid,
            username: user.username
        },
        SECRET,
        {
            expiresIn: "24h"
        }
    );

}

function verifyToken(token){

    return jwt.verify(token, SECRET);

}

module.exports = {
    createToken,
    verifyToken
};
