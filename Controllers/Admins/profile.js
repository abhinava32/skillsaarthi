const Admin = require('../../DB/models/admins');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

module.exports.logout = async (req,res) => {
    if(!req.user){
        return res.status(400).json({
            message: "User is not logged in!!"
        })
    }

    res.cookie('auth',"",{maxAge:1});
    return res.status(200).json({message:"Logged out Successfully!!"});

}

module.exports.signIn = async (req, res) => {
    if(req.user){
        return res.status(400).json({
            message: "User already logged in. Please logout first"
        })
    }

    const admin = await Admin.findOne({
        where:{
            email: req.body.email
        }
    })

    if(!admin){
        return res.status(501).json({
            message: "Wrong Credentials"
        })
    }

    const isPasswordMatched = await bcrypt.compare(req.body.password, admin.password);
    if(!isPasswordMatched){
        return res.status(501).json({
            message: "Incorrect Credentials"
        })
    }

    else if(isPasswordMatched){

        var token = jwt.sign({user_type:"admin", name: admin.name, id: admin.admin_id}, process.env.JWT_SECRET);
        res.cookie('auth', token, {
            httpOnly: true, // Prevents JavaScript access to the cookie
            secure: process.env.NODE_ENV === 'production', // Use Secure in production (requires HTTPS)
            sameSite: 'Strict', // Adjust based on your needs
            maxAge: 36000000 // 10 hour in milliseconds
        });

        return res.status(200).json({
            message: "Admin Login successfull",
            admin_name: admin.name,
        })
    }
    
}

module.exports.createProfile = async (req, res) => {
    if(req.user){
        return res.status(400).json({
            message: "User already logged in. Please logout first"
        })
    }

    const hashed = await bcrypt.hash(req.body.password, saltRounds);

    console.log(req.body.password);

    const admin = await Admin.create({
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        password: hashed,
        accesslevel:req.body.accesslevel
    });

    if(admin){
        return res.status(200).json({
            message: "Admin Created Successfully !!",
            data: admin
        });
    }

    res.status(500).json({
        message: "Oops !! Some internal server error"
    })
}