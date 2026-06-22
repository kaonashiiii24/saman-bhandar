const router = require('express').Router();
const { getStats, getPublicStats, getUsers, updateUser, deleteUser, getListings, toggleListing, getBookings, getPayments } = require('../controllers/adminController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.get('/stats', auth, roleCheck('admin'), getStats);
router.get('/users', auth, roleCheck('admin'), getUsers);
router.put('/users/:id', auth, roleCheck('admin'), updateUser);
router.delete('/users/:id', auth, roleCheck('admin'), deleteUser);
router.get('/listings', auth, roleCheck('admin'), getListings);
router.put('/listings/:id/toggle', auth, roleCheck('admin'), toggleListing);
router.get('/bookings', auth, roleCheck('admin'), getBookings);
router.get('/payments', auth, roleCheck('admin'), getPayments);
router.get('/public-stats', getPublicStats);

module.exports = router;