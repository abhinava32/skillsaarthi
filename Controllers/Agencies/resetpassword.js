const Agencies = require("../../DB/models/agencies");
const bcrypt = require("bcrypt");
const { emailQueue, smsQueue } = require("../../Config/bullmq");
const { generateOtp, validateOtp } = require("../otp");
const jwt = require("jsonwebtoken");
const saltRounds = 10;

const addEmailJob = async (data) => {
  await emailQueue.add("send-otp", data);
};

const addSmsJob = async (data) => {
  await smsQueue.add("send-otp", data);
};

module.exports.createOtpPhone = async (req, res) => {
  let otp;
  const phone = req.params.phone;
  const agency = await Agencies.findOne({
    attributes: ["phone", "agency_id"],
    where: {
      phone: phone,
    },
  });

  if (!agency) {
    return res
      .status(200)
      .json({ message: "OTP Sent to the mobile if registered" });
  }

  const token = jwt.sign(
    { phone, generated: true, validated: false },
    process.env.JWT_SECRET
  );
  res.cookie("phoneOtp", token, {
    httpOnly: true, // Prevents JavaScript access to the cookie
    secure: false, //process.env.NODE_ENV==='production', // Use Secure in production (requires HTTPS)
    sameSite: "Strict", // Adjust based on your needs
    maxAge: 36000000, // 10 hour in milliseconds
    path: "/",
  });

  generateOtp(agency.agency_id).then((otpReceived) => {
    otp = otpReceived;

    const data = {
      otp,
      reason: "Reset Password",
      phone: agency.phone,
    };
    addSmsJob(data);
    return res.status(200).json({
      message: "OTP Sent to the mobile if registered",
    });
  });
};

module.exports.createOtpEmail = async (req, res) => {
  let otp;
  const email = req.params.email;
  const agency = await Agencies.findOne({
    attributes: ["email", "agency_id"],
    where: {
      email: email,
    },
  });

  if (!agency) {
    return res
      .status(200)
      .json({ message: "OTP Sent to the mail if registered" });
  }

  generateOtp(agency.agency_id).then((otpReceived) => {
    otp = otpReceived;

    const data = {
      otp,
      reason: "Reset Password",
      email: agency.email,
    };
    addEmailJob(data);
    const token = jwt.sign(
      { email, generated: true, validated: false },
      process.env.JWT_SECRET
    );
    res.cookie("emailOtp", token, {
      httpOnly: true, // Prevents JavaScript access to the cookie
      secure: false, //process.env.NODE_ENV==='production', // Use Secure in production (requires HTTPS)
      sameSite: "Strict", // Adjust based on your needs
      maxAge: 36000000, // 10 hour in milliseconds
      path: "/",
    });
    return res.status(200).json({
      message: "OTP Sent to the mail if registered",
    });
  });
};

module.exports.verifyOtp = async (req, res) => {
  const email = req.body.email;
  const agency = await Agencies.findOne({
    attributes: ["email", "agency_id"],
    where: {
      email: email,
    },
  });

  if (!agency) {
    return res.status(400).json({ messge: "Email does not exists" });
  }

  validateOtp(agency.agency_id, req.body.otp.toString()).then((isValid) => {
    if (isValid) {
      var token = jwt.sign(
        { user_type: "agency", name: agency.name, id: agency.agency_id },
        process.env.JWT_SECRET
      );
      res.cookie("otp", token, {
        httpOnly: true, // Prevents JavaScript access to the cookie
        secure: process.env.NODE_ENV === "production", // Use Secure in production (requires HTTPS)
        sameSite: "Strict", // Adjust based on your needs
        maxAge: 36000000, // 10 hour in milliseconds
      });

      return res.status(200).json({
        message: "OTP IS VALID",
      });
    }
    return res.status(403).json({
      message: "OTP is invalid",
    });
  });
};

module.exports.newPassword = async (req, res) => {
  if (!req.cookies || !req.cookies.otp) {
    return res.status(403).json({
      message: "Request forbidden!! Unauthorised Access!",
    });
  }

  if (req.user && req.user.user_type === "agency") {
    try {
      const token = await jwt.verify(req.cookies.otp, process.env.JWT_SECRET);
      if (token && token.id === req.user.id) {
        const hashed = await bcrypt.hash(req.body.password, saltRounds);
        const agency = await Agencies.findByPk(token.id);
        agency.password = hashed;
        await agency.save();

        return res.status(200).json({
          message: "Changed password Successfully !!",
        });
      }
    } catch (err) {
      console.error("JWT verification failed:", err.message);
    }
  }
  return res.status(403).json({
    message: "Access Forbidden!! Agent not logged in",
  });
};
