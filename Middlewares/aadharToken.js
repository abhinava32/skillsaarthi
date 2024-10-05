const { createClient } = require('ioredis');
const redis = createClient();
const { authenticateApi, authorizeApi } = require('../Config/aadhar');

module.exports.aadharToken = async (req, res, next) => {
    // authenticateApi();                       //Uncomment and Call this function once just after the server setup
    // console.log("Called authenticate Api")   //optional to uncomment
    if(!redis.get('SANDBOX_JWT') || redis.get('SANDBOX_JWT_EXPIRY_PERM') >= Date.now()){
        authenticateApi();
    }
    else if(redis.get('SANDBOX_JWT_EXPIRY_TEMP') >= Date.now()){
        authorizeApi();
    }
    next();
}