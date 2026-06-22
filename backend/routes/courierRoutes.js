const router = require('express').Router();
const { getAvailableJobs, acceptJob, getActiveDeliveries, updateDeliveryStatus } = require('../controllers/courierController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.get('/jobs', auth, roleCheck('courier'), getAvailableJobs);
router.get('/deliveries', auth, roleCheck('courier'), getActiveDeliveries);
router.post('/jobs/:id/accept', auth, roleCheck('courier'), acceptJob);
router.put('/deliveries/:id/status', auth, roleCheck('courier'), updateDeliveryStatus);

module.exports = router;