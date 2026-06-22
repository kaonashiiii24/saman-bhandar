const Inventory = require('../models/Inventory');
const { success, error } = require('../utils/apiResponse');

const getInventory = async (req, res) => {
  try {
    const items = await Inventory.findBySeller(req.user.id);
    return success(res, { items });
  } catch (err) { return error(res, err.message); }
};

const createItem = async (req, res) => {
  try {
    const { name, category, quantity, location, booking_id } = req.body;
    if (!name) return error(res, 'Item name is required', 400);
    const id = await Inventory.create({ seller_id: req.user.id, booking_id, name, category, quantity: quantity || 0, location });
    const item = await Inventory.findById(id);
    return success(res, { item }, 'Item added', 201);
  } catch (err) { return error(res, err.message); }
};

const updateItem = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) return error(res, 'Item not found', 404);
    if (item.seller_id !== req.user.id) return error(res, 'Unauthorized', 403);
    await Inventory.update(req.params.id, req.body);
    return success(res, {}, 'Item updated');
  } catch (err) { return error(res, err.message); }
};

const deleteItem = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) return error(res, 'Item not found', 404);
    if (item.seller_id !== req.user.id) return error(res, 'Unauthorized', 403);
    await Inventory.remove(req.params.id);
    return success(res, {}, 'Item deleted');
  } catch (err) { return error(res, err.message); }
};

module.exports = { getInventory, createItem, updateItem, deleteItem };