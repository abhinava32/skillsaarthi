const Agencies = require("../../DB/models").agencies;
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

  generateOtp(agency.agency_id).then((otpReceived) => {
    otp = otpReceived;

    const data = {
      otp,
      reason: "Reset Password",
      phone: agency.phone,
    };
    addSmsJob(data);
    const token = jwt.sign(
      { phone, id: agency.agency_id, generated: true, validated: false },
      process.env.JWT_SECRET
    );
    res.cookie("otp", token, {
      httpOnly: true, // Prevents JavaScript access to the cookie
      secure: false, //process.env.NODE_ENV==='production', // Use Secure in production (requires HTTPS)
      sameSite: "Strict", // Adjust based on your needs
      maxAge: 36000000, // 10 hour in milliseconds
      path: "/",
    });

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
      { email, id: agency.agency_id, generated: true, validated: false },
      process.env.JWT_SECRET
    );
    res.cookie("otp", token, {
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

module.exports.newPassword = async (req, res) => {
  if (!req.cookies || !req.cookies.otp) {
    return res.status(403).json({
      message: "Request forbidden!! Unauthorised Access!",
    });
  }

  try {
    const token = await jwt.verify(req.cookies.otp, process.env.JWT_SECRET);
    if (token) {
      const hashed = await bcrypt.hash(req.body.password, saltRounds);
      const agency = await Agencies.findByPk(token.id);
      agency.password = hashed;
      await agency.save();
      res.cookie("otp", "", {
        httpOnly: true,
        secure: false,
        sameSite: "Strict",
        maxAge: 1,
        path: "/",
      });

      return res.status(200).json({
        message: "Changed password Successfully !!",
      });
    } else {
      return res
        .status(410)
        .message("Session Expired, Please verify your OTP again");
    }
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res.status(503).json({
      message:
        "Internal Server Error, Service unavailable right now. Please try after some time",
    });
  }
};
