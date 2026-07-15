const DZC = {
    name: "DZC Coin",
    symbol: "DZC",
    price: 0.12,
    currency: "USDT"
};


function getDZC(){

    return {
        success:true,
        coin:DZC
    };

}


module.exports = {
    getDZC
};
