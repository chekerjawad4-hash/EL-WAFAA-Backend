let positions = [];

function openPosition(data){

    const position = {
        id: Date.now(),
        symbol: data.symbol,
        side: data.side,
        amount: data.amount,
        leverage: data.leverage,
        entryPrice: data.price,
        time: new Date()
    };

    positions.push(position);

    return {
        success:true,
        position
    };

}


function getPositions(){

    return {
        success:true,
        positions
    };

}


function closePosition(id){

    const index = positions.findIndex(p => p.id == id);

    if(index === -1){
        return {
            success:false,
            message:"Position not found"
        };
    }

    const position = positions[index];
    positions.splice(index,1);

    return {
        success:true,
        position
    };
}

module.exports = {
    openPosition,
    getPositions,
    closePosition
};
