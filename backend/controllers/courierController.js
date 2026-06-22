const Booking = require('../models/Booking');
const { success, error } = require('../utils/apiResponse');

const getAvailableJobs = async (req, res) => {
  try {
    const jobs = await Booking.findAvailableForCourier();
    return success(res, { jobs });
  } catch (err) {
    return error(res, err.message);
  }
};

const acceptJob = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      return error(res, 'Booking not found', 404);
    }
    
    if (booking.courier_id) {
      return error(res, 'Job already assigned to another courier', 400);
    }
    
    await Booking.assignCourier(bookingId, req.user.id);
    await Booking.updateStatus(bookingId, 'picking_up');
    
    return success(res, {}, 'Job accepted successfully');
  } catch (err) {
    return error(res, err.message);
  }
};

const getActiveDeliveries = async (req, res) => {
  try {
    const deliveries = await Booking.findByCourier(req.user.id);
    return success(res, { deliveries });
  } catch (err) {
    return error(res, err.message);
  }
};

const updateDeliveryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['picking_up', 'in_transit', 'delivered'];
    if (!validStatuses.includes(status)) {
      return error(res, 'Invalid status', 400);
    }
    
    const booking = await Booking.findById(id);
    if (!booking) {
      return error(res, 'Booking not found', 404);
    }
    
    if (booking.courier_id !== req.user.id) {
      return error(res, 'Unauthorized', 403);
    }
    
    await Booking.updateStatus(id, status);
    
    return success(res, {}, 'Delivery status updated');
  } catch (err) {
    return error(res, err.message);
  }
};

module.exports = { getAvailableJobs, acceptJob, getActiveDeliveries, updateDeliveryStatus };