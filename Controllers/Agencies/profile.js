const Agency = require("../../DB/models/agencies");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 15;
const { createClient } = require("ioredis");
const redis = createClient();

module.exports.logout = async (req, res) => {
  if (!req.user) {
    return res.status(400).json({
      message: "User is not logged in!!",
    });
  }

  res.cookie("auth", "", {
    httpOnly: true, // Prevents JavaScript access to the cookie
    secure: false, //process.env.NODE_ENV==='production', // Use Secure in production (requires HTTPS)
    sameSite: "Strict", // Adjust based on your needs
    maxAge: 1,
    path: "/",
  });
  return res.status(200).json({ message: "Logged out Successfully!!" });
};

module.exports.signIn = async (req, res) => {
  if (req.user) {
    return res.status(200).json({
      message: "User already logged in. Please logout first",
      name: req.user.name,
    });
  }

  console.log("got a request");
  try {
    const agency = await Agency.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!agency) {
      return res.status(401).json({
        message: "Wrong Credentials 1",
      });
    }

    const isPasswordMatched = await bcrypt.compare(
      req.body.password,
      agency.password
    );
    if (!isPasswordMatched) {
      return res.status(401).json({
        message: "Incorrect Credentials",
      });
    } else if (isPasswordMatched) {
      var token = jwt.sign(
        { user_type: "agency", name: agency.name, id: agency.agency_id },
        process.env.JWT_SECRET
      );
      res.cookie("auth", token, {
        httpOnly: true, // Prevents JavaScript access to the cookie
        secure: false, //process.env.NODE_ENV==='production', // Use Secure in production (requires HTTPS)
        sameSite: "Strict", // Adjust based on your needs
        maxAge: 36000000, // 10 hour in milliseconds
        path: "/",
      });

      return res.status(200).json({
        message: "Agency Login successfull",
        name: agency.name,
        user_type: "agency",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports.register = async (req, res) => {
  if (req.user) {
    return res.status(401).json({
      message: "User already logged in. Unauthorised !!",
    });
  }

  const id = req.query.id;
  const email = req.query.email;

  const storedId = await redis.get(`link:${email}`);
  var token = jwt.sign({ email }, process.env.JWT_SECRET);
  if (storedId === id) {
    await redis.del(`link:${email}`); // Delete Link after successful validation
    res.cookie("agencyregistration", token, {
      httpOnly: true, // Prevents JavaScript access to the cookie
      secure: process.env.NODE_ENV === "production", // Use Secure in production (requires HTTPS)
      sameSite: "Strict", // Adjust based on your needs
      maxAge: 36000000, // 10 hour in milliseconds
    });
    return res.redirect("localhost:3000/");
  }
  return false;

  console.log("id is", id, "and email is", email);
  // console.log("reqest parameters: ",req.params);
  return res.status(200).json({
    message: "Agency registered Successfully!!",
  });
};

module.exports.signUp = async (req, res) => {
  if (req.user) {
    return res.status(400).json({
      message: "User already logged in. Please logout first",
    });
  }

  const hashed = await bcrypt.hash(req.body.password, saltRounds);

  const agency = await Agency.create({
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    password: hashed,
  });

  if (agency) {
    return res.status(200).json({
      message: "Agency Created Successfully !!",
    });
  }

  res.status(500).json({
    message: "Oops !! Some internal server error",
  });
};
