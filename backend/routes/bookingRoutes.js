const router = require('express').Router();
const { getMyBookings, getHostBookings, getAllBookings, createBooking, updateBookingStatus, cancelBooking, extendBooking } = require('../controllers/bookingController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.get('/my', auth, roleCheck('seller'), getMyBookings);
router.get('/host', auth, roleCheck('host'), getHostBookings);
router.post('/', auth, roleCheck('seller'), createBooking);
router.put('/:id/status', auth, updateBookingStatus);
router.put('/:id/cancel', auth, roleCheck('seller'), cancelBooking);
router.put('/:id/extend', auth, roleCheck('seller'), extendBooking);

module.exports = router;