const router = require('express').Router();
const {sendOtp, verifyOtp} = require('../Controllers/verifications');

router.use('/agency', require('./Agencies/index'));
router.use('/trainee', require('./Trainee/index'));
router.use('/admin', require('./Admin/index'));
router.use('/trainer', require('./Trainers/index'));
router.use('/agent', require('./Agents/index'));
router.get('/send-otp/:phone',sendOtp);
router.post('/verify-otp',verifyOtp);
// router.post('/create', testingController.createDoc);

module.exports = router;