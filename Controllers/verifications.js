const {generateOtp, validateOtp} = require('./otp');
const {smsQueue} = require('../Config/bullmq');
const axios = require('axios');
const { createClient } = require('ioredis');
const redis = createClient();
const jwt = require('jsonwebtoken');

const addSmsJob = async (data) => {
    await smsQueue.add('send-otp',data);
}

module.exports.verifyOtp = async (req, res) => {
    const token = await jwt.verify(req.cookies.phoneOtp, process.env.JWT_SECRET);
    if(validateOtp(token.phone, req.body.otp, res) && token.generated && !token.validated){
        const newToken = await jwt.sign({phone: token.phone, generated: true, validated: true}, process.env.JWT_SECRET);
        res.cookie('phoneOtp', newToken, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'Strict', 
            maxAge: 1000*60*20 // 20 Minutes in milliseconds;
        });

        return res.status(200).json({
            message: "OTP verified Successfully!!"
        })
    }
    return res.status(200).json({
        message: "OTP Not Matched"
    })
}

module.exports.sendOtp = (req, res) => {
    const phoneNumber = req.params.phone;
    generateOtp(phoneNumber).then(otpReceived => {
        otp = otpReceived;
        
        const data = {
            otp,
            reason: "to register your phone number",
            phone:phoneNumber
        };
        try{
            addSmsJob(data);
        }
        catch(err){
            console.log(err);
            return res.status(403).json({
                message: "Error in sending OTP!!"
            });
        }
        
        
        const token = jwt.sign({phone: phoneNumber, generated: true, validated: false}, process.env.JWT_SECRET);
        res.cookie('phoneOtp', token, {
            httpOnly: true, // Prevents JavaScript access to the cookie
            secure: process.env.NODE_ENV === 'production', // Use Secure in production (requires HTTPS)
            sameSite: 'Strict', // Adjust based on your needs
            maxAge: 36000000 // 10 hour in milliseconds);
        });

        return res.status(200).json({message: "OTP Send Successfully!!"});
    
    });
}


module.exports.sendAadharOtp = (aadhar) => {
    const options = {
        method: 'POST',
        url: 'https://api.sandbox.co.in/kyc/aadhaar/okyc/otp',
        headers: {
            accept: 'application/json',
            authorization: `${redis.get('SANDBOX_JWT')}`, 
            'x-api-key': process.env.SANDBOX_API_KEY,
            'x-api-version': '1.0',
            'content-type': 'application/json'
        },
        data: {
            '@entity': 'in.co.sandbox.kyc.aadhaar.okyc.otp.request',
            aadhaar_number: aadhar,
            consent: 'y',
            reason: 'For KYC'
        }
    };

    axios
        .request(options)
        .then(function (response) {
            console.log(response.data);
            redis.set(``)
        })
        .catch(function (error) {
            console.error(error);
        });
}


module.exports.verifyAadharOtp = (aadhar, otp, reference_number, user_name, dob, pincode, district, gender ) => {

}
