const router = require('express').Router();
const { getGroups, getGroupMessages, sendGroupMessage } = require('../controllers/groupChatController');
const auth = require('../middleware/auth');

router.get('/', auth, getGroups);
router.get('/:groupId', auth, getGroupMessages);
router.post('/send', auth, sendGroupMessage);

module.exports = router;