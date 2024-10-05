const { createClient } = require("ioredis");
const redis = createClient();

// Generate OTP and store it in Redis
const generateOtp = async (userId) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
  await redis.set(`otp:${userId}`, otp, "EX", 300); // Store OTP with a 5-minute expiration
  return otp;
};

// Validate OTP
const validateOtp = async (userId, inputOtp, res) => {
  try {
    const storedOtp = await redis.get(`otp:${userId}`);
    if (storedOtp === inputOtp) {
      await redis.del(`otp:${userId}`); // Delete OTP after successful validation
      return true;
    }
    return false;
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};

module.exports = { generateOtp, validateOtp };
