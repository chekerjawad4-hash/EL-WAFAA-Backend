const { verifyToken } = require("../utils/jwt");

function auth(req,res,next){

    const header = req.headers.authorization;

    if(!header){
        return res.status(401).json({
            success:false,
            error:"Unauthorized"
        });
    }

    const token = header.replace("Bearer ","");

    try{

        req.user = verifyToken(token);

        next();

    }catch(err){

        return res.status(401).json({
            success:false,
            error:"Invalid Token"
        });

    }

}

module.exports = auth;
