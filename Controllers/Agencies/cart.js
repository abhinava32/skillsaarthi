const Agency = require('../../DB/models/agencies');
const Cart = require('../../DB/models/carts');
const Bought = require('../../DB/models/boughts');
const Transaction = require('../../DB/models/transactions');
const agencies = require('../../DB/models/agencies');


module.exports.addItem = async (req, res) => {
    if(!req.user || req.user.user_type !=='agency'){
        return res.status(401).json({
            message: "Unauthorised Request"
        });
    }
    let cart;
    const trainee_id = req.body.trainee_id;
    
    try{
        cart = await Cart.create({
            trainee_id,
            agency_id : req.user.id
        });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal Server Error!"})
    }
    

    if(cart){
        return res.status(200).json({
            message: "Added cart item successfully!!"
        })
    }
    
    return res.status(500).json({
        message: "Internal Server Error"
    });
}

module.exports.deleteItem = (req, res) => {

}

module.exports.getItems = (req, res) => {

}

module.exports.deleteAll = (req, res) => {

}

module.exports.checkout = (req, res) => {

}