const nodemailer = require('../Config/nodemailer');
const path = require('path');

module.exports.newOTP = (data) => {
    let htmlString = nodemailer.renderTemplate({data}, 'otp.ejs');
    
    nodemailer.transporter.sendMail({
        from: process.env.MAIL_USER,
        to: data.email,
        subject: "OTP to "+data.reason,
        html: htmlString
    }, (err,info) => {
        if(err){ console.log("error in sending mail", err); return;}
        return;
    });
}