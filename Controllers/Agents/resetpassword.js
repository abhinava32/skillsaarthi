const Agent = require('../../DB/models/agents');
const { emailQueue } = require('../../Config/bullmq');
const {generateOtp, validateOtp} = require('../otp');

const addEmailJob = async (data) => {
    await emailQueue.add('sendEmail', data);
}

module.exports.createOtp = async (req, res)=>{
    let otp;
    const email = req.body.email;
    const agent = await Agent.findOne({
        attributes: ['email','agent_id'],
        where: {
            email: email
        }
    });

    if(!agent){
        return res.status(400).json({messge:"Email does not exists"});
    }
   

    generateOtp(agent.agent_id).then(otpReceived => {
        otp = otpReceived;
        
        const data = {
            otp,
            reason: "Reset Password",
            email:agent.email
        };
        addEmailJob(data);
        return res.status(200).json({
            message: "OTP Sent to the mail"
        });
    });
}

module.exports.verifyOtp = async (req, res)=>{
    const email = req.body.email;
    const agent = await Agent.findOne({
        attributes: ['email','agent_id'],
        where: {
            email: email
        }
    });

    if(!agent){
        return res.status(400).json({messge:"Email does not exists"});
    }

    validateOtp(agent.agent_id, req.body.otp.toString()).then(isValid => {
        if(isValid){
            return res.status(200).json({
                message: "OTP IS VALID"
            });
        }
        return res.status(501).json({
            message: "OTP is invalid"
        })
        
    });
}
    


