const Agent = require("../../DB/models").agents;
const bcrypt = require("bcrypt");
const { emailQueue } = require("../../Config/bullmq");
const { generateOtp, validateOtp } = require("../otp");
const jwt = require("jsonwebtoken");
const saltRounds = 10;

const addEmailJob = async (data) => {
  await emailQueue.add("send-otp", data);
};

module.exports.createOtp = async (req, res) => {
  let otp;
  const email = req.body.email;
  const agent = await Agent.findOne({
    attributes: ["email", "agent_id"],
    where: {
      email: email,
    },
  });

  if (!agent) {
    return res.status(400).json({ messge: "Email does not exists" });
  }

  generateOtp(agent.agent_id).then((otpReceived) => {
    otp = otpReceived;

    const data = {
      otp,
      reason: "Reset Password",
      email: agent.email,
    };
    addEmailJob(data);
    return res.status(200).json({
      message: "OTP Sent to the mail",
    });
  });
};

module.exports.verifyOtp = async (req, res) => {
  const email = req.body.email;
  const agent = await Agent.findOne({
    attributes: ["email", "agent_id"],
    where: {
      email: email,
    },
  });

  if (!agent) {
    return res.status(400).json({ messge: "Email does not exists" });
  }

  validateOtp(agent.agent_id, req.body.otp.toString()).then((isValid) => {
    if (isValid) {
      var token = jwt.sign(
        { user_type: "agent", name: agent.name, id: agent.agent_id },
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

  if (req.user && req.user.user_type === "agent") {
    try {
      const token = await jwt.verify(req.cookies.otp, process.env.JWT_SECRET);
      if (token && token.id === req.user.id) {
        const hashed = await bcrypt.hash(req.body.password, saltRounds);
        const agent = await Agent.findByPk(token.id);
        agent.password = hashed;
        await agent.save();

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
