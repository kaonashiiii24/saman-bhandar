const router = require('express').Router();
const { getMyPayments, getAllPayments, initiatePayment } = require('../controllers/paymentController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.get('/my', auth, roleCheck('seller'), getMyPayments);
router.post('/', auth, roleCheck('seller'), initiatePayment);

module.exports = router;