const router = require('express').Router();
const { getMyPayments, getAllPayments, verifySimulatedPayment } = require('../controllers/paymentController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.get('/my', auth, roleCheck('seller'), getMyPayments);
router.post('/verify-simulated', auth, verifySimulatedPayment);

module.exports = router;