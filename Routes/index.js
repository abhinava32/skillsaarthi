const router = require('express').Router();

router.use('/agency', require('./Agencies/index'));
router.use('/trainee', require('./Trainee/index'));
router.use('/admin', require('./Admin/index'));
router.use('/trainer', require('./Trainers/index'));
router.use('/agent', require('./Agents/index'));
// router.post('/create', testingController.createDoc);

module.exports = router;