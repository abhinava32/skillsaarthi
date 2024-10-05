const { createClient } = require('ioredis');
const redis = createClient();

// Generate OTP and store it in Redis
module.exports.returnuser = (req, res) => {
    if(req.user){
        return res.status(200).json({isLoggedIn:true, name:req.user.name ,user_type: req.user.user_type ,message:`user logged in as ${req.user.user_type}`});
    }
    else{
        return res.status(200).json({isLoggedIn: false, user:req.user});
    }
}