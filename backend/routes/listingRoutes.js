const router = require('express').Router();
const { getListings, getListing, getMyListings, createListing, updateListing, deleteListing, getListingItems, getLocations } = require('../controllers/listingController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const upload = require('../middleware/upload');

router.get('/locations', getLocations);
router.get('/', getListings);
router.get('/host/my', auth, roleCheck('host'), getMyListings);
router.get('/:id/items', auth, roleCheck('host'), getListingItems);
router.get('/:id', getListing);
router.post('/', auth, roleCheck('host'), upload.single('image'), createListing);
router.put('/:id', auth, updateListing);
router.delete('/:id', auth, deleteListing);

module.exports = router;