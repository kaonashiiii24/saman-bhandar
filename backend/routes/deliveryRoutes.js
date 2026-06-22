const router = require('express').Router();
const { createRequest, getAvailableJobs, acceptJob, getActiveDeliveries, updateDeliveryStatus, cancelDelivery, cancelRequest } = require('../controllers/deliveryController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.post('/', auth, roleCheck('seller'), createRequest);
router.get('/jobs', auth, roleCheck('courier'), getAvailableJobs);
router.post('/jobs/:id/accept', auth, roleCheck('courier'), acceptJob);
router.get('/deliveries', auth, roleCheck('courier'), getActiveDeliveries);
router.put('/deliveries/:id/status', auth, roleCheck('courier'), updateDeliveryStatus);
router.put('/jobs/:id/cancel', auth, roleCheck('courier'), cancelDelivery);
router.put('/request/:id/cancel', auth, roleCheck('seller'), cancelRequest);

module.exports = router;