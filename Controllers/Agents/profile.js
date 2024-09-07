const Agent = require('../../DB/models/agents');
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

    const agent = await Agent.findOne({
        where:{
            email: req.body.email
        }
    })

    if(!agent){
        return res.status(401).json({
            message: "Wrong Credentials"
        })
    }
    const isPasswordMatched = await bcrypt.compare(req.body.password, agent.password);
    if(!isPasswordMatched){
        return res.status(401).json({
            message: "Incorrect Credentials"
        })
    }

    else if(isPasswordMatched){

        var token = jwt.sign({user_type:"agent", name: agent.name, id: agent.agent_id}, process.env.JWT_SECRET);
        res.cookie('auth', token, {
            httpOnly: true, // Prevents JavaScript access to the cookie
            secure: process.env.NODE_ENV === 'production', // Use Secure in production (requires HTTPS)
            sameSite: 'Strict', // Adjust based on your needs
            maxAge: 36000000 // 10 hour in milliseconds
        });

        return res.status(200).json({
            message: "Admin Login successfull",
            agent_name: agent.name,
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
    const body = req.body;
    body.password = hashed;

    console.log(req.body.password);

    const agent = await Agent.create(body);

    if(agent){
        return res.status(200).json({
            message: "Agent Created Successfully !!",
        });
    }

    res.status(500).json({
        message: "Oops !! Some internal server error"
    })
}