const router = require('express').Router();
const { getListingReviews, getMyReviews, submitReview, checkCanReview } = require('../controllers/reviewController');
const auth = require('../middleware/auth');

router.get('/listing/:listingId', getListingReviews);
router.get('/my', auth, getMyReviews);
router.get('/can-review/:bookingId', auth, checkCanReview);
router.post('/', auth, submitReview);  

module.exports = router;