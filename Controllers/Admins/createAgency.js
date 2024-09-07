const Admin = require('../../DB/models/admins');
const {newLink} = require('../../Mailer/linkMailer');
const {emailQueue} = require('../../Config/bullmq');
const { v4: uuidv4 } = require('uuid');
const { createClient } = require('ioredis');
const redis = createClient();


const addLink = async (data)=> {
    await emailQueue.add('send-link',data);
}

module.exports.sendRegistrationLink = async (req, res) => {
    if(!req.user || req.user.user_type !== 'admin'){
        return res.status(403).json({
            message: "Unauthorised Access!"
        })
    }
    const uuid = uuidv4();

    try{
        const admin = await Admin.findByPk(req.user.id);
        const link = process.env.DOMAIN_NAME+"/agency/register?id="+uuid+"&email="+req.body.email;
        console.log(link);
        await redis.set(`link:${req.body.email}`, uuid, 'EX', 60*60*24*20); //expires in 10 days
        const data = {
            email: req.body.email,
            name:req.body.name,
            link,
            reason: "to register your agency"
        }
        addLink(data);
        return res.status(200).json({
            message:`link generated and sent to agency`
        });
        // data = {
        //     email: admin.email,
        //     link: process.env.DOMAIN_NAME+"/create-agency/id="+uuid+"&email="+admin.email
        // }
    }
    catch(err){
        console.log(err);
    }
    return res.status(200);

}