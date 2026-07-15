const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
    openPosition,
    getPositions,
    closePosition
} = require("../database/futures");


router.post("/futures/open", auth, (req,res)=>{

    const result = openPosition({
        ...req.body,
        userId:req.user.id
    });

    res.json(result);

});


router.get("/futures/positions",auth,(req,res)=>{

    res.json(getPositions());

});

router.post("/futures/close",auth,(req,res)=>{

    const result = closePosition(req.body.id);

    res.json(result);

});


module.exports = router;
