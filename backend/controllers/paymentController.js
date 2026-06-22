const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const { success, error } = require('../utils/apiResponse');

const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.findBySeller(req.user.id);
    return success(res, { payments });
  } catch (err) { return error(res, err.message); }
};

const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll();
    return success(res, { payments });
  } catch (err) { return error(res, err.message); }
};

const initiatePayment = async (req, res) => {
  try {
    const { booking_id, method } = req.body;
    if (!booking_id || !method) return error(res, 'Booking and method required', 400);
    const booking = await Booking.findById(booking_id);
    if (!booking) return error(res, 'Booking not found', 404);
    if (booking.seller_id !== req.user.id) return error(res, 'Unauthorized', 403);
    const transaction_id = `TXN-${Date.now()}`;
    const id = await Payment.create({ booking_id, seller_id: req.user.id, amount: booking.total_amount, method, transaction_id });
    await Payment.updateStatus(id, 'completed');
    await Booking.updateStatus(booking_id, 'active');
    return success(res, { transaction_id }, 'Payment successful', 201);
  } catch (err) { return error(res, err.message); }
};

module.exports = { getMyPayments, getAllPayments, initiatePayment };