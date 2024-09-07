const nodemailer = require('../Config/nodemailer');
const path = require('path');

module.exports.newLink = (data) => {
    let htmlString = nodemailer.renderTemplate({data}, 'link.ejs');
    
    nodemailer.transporter.sendMail({
        from: process.env.MAIL_USER,
        to: data.email,
        subject: "Registraion link "+data.reason,
        html: htmlString
    }, (err,info) => {
        if(err){ console.log("error in sending mail", err); return;}
        return;
    });
}