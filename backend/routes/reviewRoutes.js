const router = require('express').Router();
const { getListingReviews, getMyReviews, submitReview, checkCanReview, getTopTestimonials, getLatestReviews } = require('../controllers/reviewController');
const auth = require('../middleware/auth');

router.get('/listing/:listingId', getListingReviews);
router.get('/my', auth, getMyReviews);
router.get('/can-review/:bookingId', auth, checkCanReview);
router.post('/', auth, submitReview);
router.get('/top-testimonials', getTopTestimonials);
router.get('/latest', getLatestReviews);

module.exports = router;