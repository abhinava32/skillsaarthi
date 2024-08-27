const Trainee = require('../../DB/models/trainees');

module.exports.createProfile = (req,res) => {
   const newTrainee = req.body;
   newTrainee.password = 'random';
   var result;
   try{
    result = Trainee.create(newTrainee);
   }
   catch(err){
    console.log("error on creating new trainee record ",err);
    return res.status(500).json({message:"Error while creating new trainee record"});
   }

   if(result){
    return res.status(200).json({message: "new record inserted!!", data: result});
   }
   return res.status(400).json({message: "Can not resolve the request!!"});
   
   
}