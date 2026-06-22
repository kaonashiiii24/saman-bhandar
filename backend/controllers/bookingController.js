const Booking = require('../models/Booking');
const Listing = require('../models/Listing');
const { success, error } = require('../utils/apiResponse');
const emailService = require('../services/emailService');
const pool = require('../config/db');

const COMMISSION_RATE = 10;

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.findBySeller(req.user.id);
    return success(res, { bookings });
  } catch (err) { return error(res, err.message); }
};

const getHostBookings = async (req, res) => {
  try {
    const bookings = await Booking.findByHost(req.user.id);
    return success(res, { bookings });
  } catch (err) { return error(res, err.message); }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll();
    return success(res, { bookings });
  } catch (err) { return error(res, err.message); }
};

const createBooking = async (req, res) => {
  try {
    const { listing_id, start_date, end_date } = req.body;
    if (!listing_id || !start_date || !end_date) return error(res, 'All fields required', 400);
    
    const start = new Date(start_date);
    const end = new Date(end_date);
    
    if (start >= end) return error(res, 'End date must be after start date', 400);
    if (start < new Date().setHours(0,0,0,0)) return error(res, 'Start date cannot be in the past', 400);
    
    const listing = await Listing.findById(listing_id);
    if (!listing) return error(res, 'Listing not found', 404);
    
    const hasConflict = await Booking.checkDateConflict(listing_id, start_date, end_date);
    if (hasConflict) return error(res, 'This space is already booked for the selected dates. Please choose different dates.', 409);
    
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const total_amount = Math.ceil((listing.price_per_month / 30) * days);
    const commission_amount = Math.ceil(total_amount * (COMMISSION_RATE / 100));
    
    const id = await Booking.create({
      seller_id: req.user.id,
      listing_id,
      start_date,
      end_date,
      total_amount,
      commission_rate: COMMISSION_RATE,
      commission_amount
    });
    
    const booking = await Booking.findById(id);
    return success(res, { 
      booking,
      breakdown: {
        total: total_amount,
        commission: commission_amount,
        host_earns: total_amount - commission_amount,
        rate: COMMISSION_RATE
      }
    }, 'Booking created', 201);
  } catch (err) { return error(res, err.message); }
};

const updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return error(res, 'Booking not found', 404);
    
    if (req.body.status === 'approved' || req.body.status === 'active') {
      const hasConflict = await Booking.checkDateConflict(
        booking.listing_id, 
        booking.start_date, 
        booking.end_date, 
        booking.id
      );
      if (hasConflict) return error(res, 'Cannot approve — date conflict with another approved booking', 409);
    }
    
    await Booking.updateStatus(req.params.id, req.body.status);
    
    const [user] = await pool.query('SELECT * FROM users WHERE id = ?', [booking.seller_id]);
    if (user[0]) {
      emailService.sendBookingStatusEmail(user[0], booking, req.body.status);
    }
    
    return success(res, {}, 'Booking updated');
  } catch (err) { return error(res, err.message); }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return error(res, 'Booking not found', 404);
    if (booking.seller_id !== req.user.id) return error(res, 'Unauthorized', 403);
    
    if (booking.status === 'active' || booking.status === 'picking_up' || booking.status === 'in_transit') {
      return error(res, 'Cannot cancel an active booking. Contact support.', 400);
    }
    
    if (booking.status === 'delivered' || booking.status === 'completed') {
      return error(res, 'Cannot cancel a completed booking.', 400);
    }
    
    await Booking.updateStatus(req.params.id, 'cancelled');
    
    const [user] = await pool.query('SELECT * FROM users WHERE id = ?', [booking.seller_id]);
    if (user[0]) {
      emailService.sendBookingStatusEmail(user[0], booking, 'cancelled');
    }
    
    return success(res, {}, 'Booking cancelled');
  } catch (err) { return error(res, err.message); }
};

module.exports = { getMyBookings, getHostBookings, getAllBookings, createBooking, updateBookingStatus, cancelBooking };