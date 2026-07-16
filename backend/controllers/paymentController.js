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

const verifySimulatedPayment = async (req, res) => {
  try {
    const { bookingId, txn, method } = req.body;

    if (!bookingId) return error(res, 'Missing booking ID', 400);

    const booking = await Booking.findById(bookingId);
    if (!booking) return error(res, 'Booking not found', 404);

    await Payment.create({
      booking_id: bookingId,
      seller_id: booking.seller_id,
      amount: booking.total_amount,
      method: method || 'simulated',
      transaction_id: txn || `TXN-${Date.now()}`,
      status: 'completed'
    });

    await Booking.updateStatus(bookingId, 'active');

    return success(res, {}, 'Payment verified and booking activated');
  } catch (err) { return error(res, err.message); }
};

module.exports = { getMyPayments, getAllPayments, verifySimulatedPayment };