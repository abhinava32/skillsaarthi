const Trainee = require('../../DB/models/trainees');

module.exports.createProfile = async (req,res) => {
   if(req.user && req.user.type !== 'agent'){
      return res.status(401).json({
         message: "Unauthorsed Access"
      });
   }
   
   const newTrainee = req.body;
   newTrainee.password = 'random';
   newTrainee.photo = 'random'
   newTrainee.isEnrolled = false;
   var result;
   try{
    result = await Trainee.create(newTrainee);
   }
   catch(err){
    console.log("error on creating new trainee record ",err.message);
    return res.status(500).json({message:"Error while creating new trainee record"});
   }

   if(result){
    return res.status(200).json({message: "new record inserted!!"});
   }
   return res.status(400).json({message: "Can not resolve the request!!"});
   
   
}