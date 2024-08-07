const  Agency  = require('../DB/models/agencies');

module.exports.createDoc = async (req, res)=> {

    const doc = req.body;

    try{
        const agency = await Agency.create(req.body);
        if(!agency){
            return res.status(500).json({
                message: "Internal SERVER ERROR"
            });
        }

        res.status(200).json({
            message: "successfully inserted data"
        })
    }
    catch(error){
        console.log(error);
        res.send("Problem occured!!");
    }
}

