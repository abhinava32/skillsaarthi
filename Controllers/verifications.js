const { generateOtp, validateOtp } = require("./otp");
const { smsQueue, emailQueue } = require("../Config/bullmq");
const axios = require("axios");
const { createClient } = require("ioredis");
const redis = createClient();
const jwt = require("jsonwebtoken");

const addSmsJob = async (data) => {
  await smsQueue.add("send-otp", data);
};

const addEmailJob = async (data) => {
  await emailQueue.add("send-otp", data);
};

const setRedis = (aadhar, reference_id) => {
  redis.set(`aadhar:${aadhar}`, reference_id);
  console.log("reference_id", reference_id);
  // const reference_id = response.data.reference_id;
  console.log(reference_id);
};

module.exports.sendOtpEmail = (req, res) => {
  console.log("Got request as ", req.params.email);
  const email = req.params.email;
  generateOtp(email).then((otpReceived) => {
    otp = otpReceived;
    const data = {
      otp,
      reason: "to reset password",
      email,
    };
    try {
      addEmailJob(data);
    } catch (err) {
      console.log(err);
      return res.status(403).json({
        message: "Error in sending OTP !!",
      });
    }
    const token = jwt.sign(
      { email, generated: true, validated: false },
      process.env.JWT_SECRET
    );
    res.cookie("emailOtp", token, {
      httpOnly: true, // Prevents JavaScript access to the cookie
      secure: process.env.NODE_ENV === "production", // Use Secure in production (requires HTTPS)
      sameSite: "Strict", // Adjust based on your needs
      maxAge: 1000 * 60 * 10, // 10 Minutes in milliseconds;
    });
    return res.status(200).json({ message: "OTP Send Successfully!!" });
  });
};

module.exports.sendOtpPhone = (req, res) => {
  const phoneNumber = req.params.phone;
  generateOtp(phoneNumber).then((otpReceived) => {
    otp = otpReceived;

    const data = {
      otp,
      reason: "to register your phone number",
      phone: `+91${phoneNumber}`,
    };
    try {
      addSmsJob(data);
    } catch (err) {
      console.log(err);
      return res.status(403).json({
        message: "Error in sending OTP!!",
      });
    }

    const token = jwt.sign(
      { phone: phoneNumber, generated: true, validated: false },
      process.env.JWT_SECRET
    );
    res.cookie("phoneOtp", token, {
      httpOnly: true, // Prevents JavaScript access to the cookie
      secure: process.env.NODE_ENV === "production", // Use Secure in production (requires HTTPS)
      sameSite: "Strict", // Adjust based on your needs
      maxAge: 1000 * 60 * 10, // 10 Minutes in milliseconds;
    });

    return res.status(200).json({ message: "OTP Send Successfully!!" });
  });
};

module.exports.verifyOtpEmail = async (req, res) => {
  if (!req.cookies || !req.cookies?.emailOtp) {
    res.status(500).json({ message: "OTP Expired, Please send new otp " });
  }
  const token = await jwt.verify(req.cookies.emailOtp, process.env.JWT_SECRET);
  const validation = await validateOtp(token.id, req.body.otp, res);
  if (validation && token.generated && !token.validated) {
    const newToken = jwt.sign(
      { email: token.email, id: token.id, generated: true, validated: true },
      process.env.JWT_SECRET
    );
    res.cookie("emailOtp", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 1000 * 60 * 20, // 20 Minutes in milliseconds;
    });

    return res.status(200).json({
      message: "OTP verified Successfully!!",
    });
  }
  return res.status(401).json({
    message: "OTP verification failed. Unauthorized access.",
  });
};

module.exports.verifyOtpPhone = async (req, res) => {
  if (!req.cookies || !req.cookies?.phoneOtp) {
    res.status(500).json({ message: "OTP Expired, Please send new otp " });
  }
  const token = await jwt.verify(req.cookies.phoneOtp, process.env.JWT_SECRET);
  if (
    validateOtp(token.agency_id, req.body.otp, res) &&
    token.generated &&
    !token.validated
  ) {
    const newToken = jwt.sign(
      { phone, id: token.id, generated: true, validated: true },
      process.env.JWT_SECRET
    );
    res.cookie("phoneOtp", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 1000 * 60 * 20, // 20 Minutes in milliseconds;
    });

    return res.status(200).json({
      message: "OTP verified Successfully!!",
    });
  }
  return res.status(401).json({
    message: "OTP verification failed. Unauthorized access.",
  });
};

module.exports.sendAadharOtp = async (req, res) => {
  if (!req.cookies || !req.cookies.phoneOtp) {
    const phoneToken = await jwt.verify(
      req.cookies.phoneOtp,
      process.env.JWT_SECRET
    );
    if (!phoneToken || !phoneToken.generated || !phoneToken.validated) {
      return res.status(401).json({
        message: "Phone not verified!! If Verified, please re-verify",
      });
    }
  }

  const aadhar = req.params.aadhar;
  const options = {
    method: "POST",
    url: "https://api.sandbox.co.in/kyc/aadhaar/okyc/otp",
    headers: {
      accept: "application/json",
      authorization: `${await redis.get("SANDBOX_JWT")}`,
      "x-api-key": process.env.SANDBOX_API_KEY,
      "x-api-version": "2.0",
      "content-type": "application/json",
    },
    data: {
      "@entity": "in.co.sandbox.kyc.aadhaar.okyc.otp.request",
      aadhaar_number: aadhar,
      consent: "y",
      reason: "For KYC",
    },
  };

  axios
    .request(options)
    .then(async function (response) {
      const reference_id = response.data.data.reference_id; // Extract reference_id

      await redis.set(`aadhar:${aadhar}`, reference_id);
      const token = await jwt.sign(
        { aadhar, generated: true, verified: false },
        process.env.JWT_SECRET
      );
      res.cookie("aadhar", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 1000 * 60 * 10, // 10 hour in milliseconds);
      });
      return res.status(200).json({
        message: "Aadhar OTP Sent!!",
      });
    })
    .catch(function (error) {
      console.log(error);
      return res.status(401).json({ message: "Error in sendng OTP !!" });
    });
};

module.exports.verifyAadharOtp = async (req, res) => {
  const axios = require("axios");
  if (!req.cookies || !req.cookies.aadhar || !req.cookies.phoneOtp) {
    return res.status(401).json({
      message: "Unauthorised Access!!",
    });
  }
  const token = await jwt.verify(req.cookies.aadhar, process.env.JWT_SECRET);
  const phoneToken = await jwt.verify(
    req.cookies.phoneOtp,
    process.env.JWT_SECRET
  );

  if (!token || !phoneToken) {
    return res.status(401).json({
      message: "Unauthorised Access!! Cookie Tampered!! ",
    });
  }

  const aadhar = token.aadhar;
  const options = {
    method: "POST",
    url: "https://api.sandbox.co.in/kyc/aadhaar/okyc/otp/verify",
    headers: {
      accept: "application/json",
      authorization: await redis.get("SANDBOX_JWT"),
      "x-api-key": process.env.SANDBOX_API_KEY,
      "x-api-version": "2.0",
      "content-type": "application/json",
    },
    data: {
      "@entity": "in.co.sandbox.kyc.aadhaar.okyc.request",
      reference_id: await redis.get(`aadhar:${aadhar}`),
      otp: req.body.otp,
    },
  };

  axios
    .request(options)
    .then(async function (response) {
      if (res.code === 200) {
        if (res.data.message === "Aadhaar Card Exists") {
          const newToken = jwt.sign(
            { aadhar, generated: true, verified: false },
            process.env.JWT_SECRET
          );
          res.cookie("aadhar", newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 1000 * 60 * 10, // 1 hour in milliseconds;
          });
          return res.status(200).json({
            message: "Aadhar Verified",
          });
        } else {
          return res.status(200).json({
            message: res.data.message,
          });
        }
      }
      await redis.del(`aadhar:${aadhar}`);
      return res.status(200).json({ message: "Aadhar Verified !!" });
    })
    .catch(function (error) {
      console.error(error);
      return res.status(401).json({
        message: "OTP Did not matched",
      });
    });
};
