const router = require('express').Router();
const { getInventory, createItem, updateItem, deleteItem } = require('../controllers/inventoryController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.get('/', auth, roleCheck('seller'), getInventory);
router.post('/', auth, roleCheck('seller'), createItem);
router.put('/:id', auth, roleCheck('seller'), updateItem);
router.delete('/:id', auth, roleCheck('seller'), deleteItem);


module.exports = router;