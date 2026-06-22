const router = require('express').Router();
const { getContacts, getConversation, sendMessage } = require('../controllers/chatController');
const auth = require('../middleware/auth');

router.get('/contacts', auth, getContacts);
router.get('/:userId', auth, getConversation);
router.post('/', auth, sendMessage);

module.exports = router;