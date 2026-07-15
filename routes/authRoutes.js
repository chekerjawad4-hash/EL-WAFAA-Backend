const express = require("express");
const router = express.Router();

const { createSecurityLog } = require("../database/securityLogs");


const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message:{
        success:false,
        error:"Too many login attempts. Try again later."
    }
});

const {
    createUser,
    loginUser
} = require("../database/users");

router.post("/register", (req, res) => {

    const { username, email, password } = req.body;

    const result = createUser(
        username,
        email,
        password
    );

    res.json(result);

});

router.post("/login", loginLimiter, (req, res) => {

    const { email, password } = req.body;

    const result = loginUser(
        email,
        password
    );

    const ip = req.ip || "unknown";

    if(result.success){

        createSecurityLog(
            result.user.id,
            "LOGIN_SUCCESS",
            ip,
            "User logged in"
        );

    }else{

        createSecurityLog(
            null,
            "LOGIN_FAILED",
            ip,
            email
        );

    }

    res.json(result);

});

module.exports = router;
