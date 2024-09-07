const Agency = require('../../DB/models/agencies');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 15;

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

    const agency = await Agency.findOne({
        where:{
            email: req.body.email
        }
    })

    if(!agency){
        return res.status(501).json({
            message: "Wrong Credentials 1"
        })
    }

    const isPasswordMatched = await bcrypt.compare(req.body.password, agency.password);
    if(!isPasswordMatched){
        return res.status(501).json({
            message: "Incorrect Credentials"
        })
    }

    else if(isPasswordMatched){

        var token = jwt.sign({user_type:"agency", name: agency.name, id: agency.agency_id}, process.env.JWT_SECRET);
        res.cookie('auth', token, {
            httpOnly: true, // Prevents JavaScript access to the cookie
            secure: process.env.NODE_ENV === 'production', // Use Secure in production (requires HTTPS)
            sameSite: 'Strict', // Adjust based on your needs
            maxAge: 36000000 // 10 hour in milliseconds
        });

        return res.status(200).json({
            message: "Agency Login successfull",
            agency_name: agency.name,
        })
    }
    
}

module.exports.signUp = async (req, res) => {
    if(req.user){
        return res.status(400).json({
            message: "User already logged in. Please logout first"
        })
    }

    const hashed = await bcrypt.hash(req.body.password, saltRounds);

    console.log(req.body.password);

    const agency = await Agency.create({
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        password: hashed
    });

    if(agency){
        return res.status(200).json({
            message: "Agency Created Successfully !!",
            data: agency
        });
    }

    res.status(500).json({
        message: "Oops !! Some internal server error"
    })
}