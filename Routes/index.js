const router = require("express").Router();
const { returnuser } = require("../Controllers/returnuser");
const {
  sendOtpEmail,
  verifyOtpPhone,
  verifyOtpEmail,
  sendAadharOtp,
  verifyAadharOtp,
  sendOtpPhone,
} = require("../Controllers/verifications");

router.use(
  "/agency",
  (req, res, next) => {
    console.log("at agency");
    next();
  },
  (req, res, next) => {
    console.log("at agency");
    next();
  },
  require("./Agencies/index")
);
router.use("/trainee", require("./Trainee/index"));
router.use("/admin", require("./Admin/index"));
router.use("/trainer", require("./Trainers/index"));
router.use("/agent", require("./Agents/index"));
router.get("/send-otp-phone/:phone", sendOtpPhone);
router.post("/verify-otp-phone", verifyOtpPhone);
router.post("/verify-otp-email", verifyOtpEmail);
router.get("/send-otp-aadhar/:aadhar", sendAadharOtp);
router.post("/verify-otp-aadhar", verifyAadharOtp);
router.get("/get-user", returnuser);
// router.post('/create', testingController.createDoc);

module.exports = router;
