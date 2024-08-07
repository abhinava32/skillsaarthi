const router = require('express').Router();
const testingController = require('../Controllers/testing');

router.use('/agency', require('./Agencies/index'));
router.use('/trainee', require('./Trainee/index'));
router.use('/admin', require('./Admin/index'));
router.use('/trainer', require('./Trainers/index'));
router.use('/agents', require('./Agents/index'));
router.post('/create', testingController.createDoc);

module.exports = router;