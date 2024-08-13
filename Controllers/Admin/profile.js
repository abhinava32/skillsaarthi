const Admin = require('../../DB/models/admins');

module.exports.createProfile = async (req,res) => {
    try{
        const {name, email, password, phone, accesslevel} = req.body;
        const newAdmin = await Admin.create({
            name,
            email,
            password,
            phone,
            accesslevel
        });
        return res.status(200).json(newAdmin);
    }
    catch(error){
        console.log(error.message);
        return res.status(500).json({message: "Internal server Error"});
    }
}