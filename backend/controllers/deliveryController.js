const DeliveryRequest = require('../models/DeliveryRequest');
const Inventory = require('../models/Inventory');
const ChatGroup = require('../models/ChatGroup');
const Booking = require('../models/Booking');
const Listing = require('../models/Listing');
const { success, error } = require('../utils/apiResponse');

const createRequest = async (req, res) => {
  try {
    const { booking_id, pickup_location, delivery_location, items, instructions, type, delivery_fee } = req.body;
    
    if (!booking_id || !pickup_location || !delivery_location || !items || items.length === 0) {
      return error(res, 'Booking, locations and items are required', 400);
    }
    
    const selectedItems = typeof items === 'string' ? JSON.parse(items) : items;
    let totalQuantity = 0;
    const requestType = type || 'pickup';

    if (requestType === 'pickup') {
      for (const item of selectedItems) {
        const inventoryItem = await Inventory.findById(item.id);
        if (!inventoryItem) return error(res, `Item "${item.name}" not found`, 404);
        if (inventoryItem.seller_id !== req.user.id) return error(res, 'Unauthorized', 403);
        if (inventoryItem.quantity < item.quantity) {
          return error(res, `Not enough quantity for "${item.name}". Available: ${inventoryItem.quantity}`, 400);
        }
        totalQuantity += parseInt(item.quantity);
      }
    } else {
      totalQuantity = selectedItems.reduce((sum, item) => sum + parseInt(item.quantity || 0), 0);
    }

    const id = await DeliveryRequest.create({
      booking_id,
      seller_id: req.user.id,
      pickup_location,
      delivery_location,
      items: selectedItems,
      quantity: totalQuantity,
      delivery_fee: delivery_fee || 0,
      instructions,
      type: requestType
    });
    
    const request = await DeliveryRequest.findById(id);
    return success(res, { request }, 'Delivery request created', 201);
  } catch (err) { return error(res, err.message); }
};

const getAvailableJobs = async (req, res) => {
  try {
    const jobs = await DeliveryRequest.findAvailable();
    return success(res, { jobs });
  } catch (err) { return error(res, err.message); }
};

const acceptJob = async (req, res) => {
  try {
    const requestId = req.params.id;
    const request = await DeliveryRequest.findById(requestId);
    
    if (!request) return error(res, 'Delivery request not found', 404);
    if (request.courier_id) return error(res, 'Job already assigned', 400);
    
    const assigned = await DeliveryRequest.assignCourier(requestId, req.user.id);
    if (!assigned) return error(res, 'Job was just taken by another courier', 409);
    
    const booking = await Booking.findById(request.booking_id);
    const listing = await Listing.findById(booking.listing_id);
    
    const memberIds = [request.seller_id, listing.host_id, req.user.id];
    const uniqueMembers = [...new Set(memberIds)];
    
    await ChatGroup.createGroup(
      requestId,
      `Delivery #${requestId} - ${listing.title}`,
      uniqueMembers
    );
    
    return success(res, {}, 'Job accepted and group chat created');
  } catch (err) { return error(res, err.message); }
};

const getActiveDeliveries = async (req, res) => {
  try {
    const deliveries = await DeliveryRequest.findByCourier(req.user.id);
    return success(res, { deliveries });
  } catch (err) { return error(res, err.message); }
};

const updateDeliveryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['picked_up', 'in_transit', 'delivered'];
    if (!validStatuses.includes(status)) return error(res, 'Invalid status', 400);
    
    const delivery = await DeliveryRequest.findById(id);
    if (!delivery) return error(res, 'Delivery not found', 404);
    if (delivery.courier_id !== req.user.id) return error(res, 'Unauthorized', 403);
    
    await DeliveryRequest.updateStatus(id, status);
    
    if (status === 'delivered') {
      const items = typeof delivery.items === 'string' ? JSON.parse(delivery.items) : delivery.items;
      
      if (delivery.type === 'pickup') {
        for (const item of items) {
          const inventoryItem = await Inventory.findById(item.id);
          if (inventoryItem) {
            const newQty = Math.max(0, inventoryItem.quantity - item.quantity);
            await Inventory.update(item.id, { quantity: newQty });
          }
        }
      } else {
        for (const item of items) {
          const existing = await Inventory.findBySellerAndBooking(delivery.seller_id, delivery.booking_id, item.name);
          if (existing) {
            await Inventory.update(existing.id, { quantity: existing.quantity + parseInt(item.quantity) });
          } else {
            await Inventory.create({
              seller_id: delivery.seller_id,
              booking_id: delivery.booking_id,
              name: item.name,
              category: item.category || '',
              quantity: parseInt(item.quantity) || 0,
              location: delivery.delivery_location
            });
          }
        }
      }
      
      const pool = require('../config/db');
      const [groups] = await pool.query(
        'SELECT id FROM chat_groups WHERE delivery_request_id = ?',
        [id]
      );
      for (const group of groups) {
        await ChatGroup.deactivateGroup(group.id);
      }
      
      await Booking.updateStatus(delivery.booking_id, 'completed');
    }
    
    return success(res, {}, 'Status updated');
  } catch (err) { return error(res, err.message); }
};

const cancelDelivery = async (req, res) => {
  try {
    const delivery = await DeliveryRequest.findById(req.params.id);
    if (!delivery) return error(res, 'Delivery not found', 404);
    if (delivery.courier_id !== req.user.id) return error(res, 'Unauthorized', 403);
    if (delivery.status === 'delivered') return error(res, 'Cannot cancel delivered job', 400);
    
    await DeliveryRequest.cancelDelivery(req.params.id, req.user.id);
    return success(res, {}, 'Job cancelled. It will reappear for other couriers.');
  } catch (err) { return error(res, err.message); }
};

const cancelRequest = async (req, res) => {
  try {
    const delivery = await DeliveryRequest.findById(req.params.id);
    if (!delivery) return error(res, 'Delivery not found', 404);
    if (delivery.seller_id !== req.user.id) return error(res, 'Unauthorized', 403);
    if (['picked_up', 'in_transit', 'delivered'].includes(delivery.status)) {
      return error(res, 'Cannot cancel — delivery is in progress', 400);
    }
    
    await DeliveryRequest.updateStatus(req.params.id, 'cancelled');
    return success(res, {}, 'Delivery request cancelled');
  } catch (err) { return error(res, err.message); }
};

module.exports = { createRequest, getAvailableJobs, acceptJob, getActiveDeliveries, updateDeliveryStatus, cancelDelivery, cancelRequest };