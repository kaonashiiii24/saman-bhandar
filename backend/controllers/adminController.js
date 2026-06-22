const pool = require('../config/db');
const Listing = require('../models/Listing');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const { success, error } = require('../utils/apiResponse');

const getStats = async (req, res) => {
  try {
    const [[{ total_users }]] = await pool.query('SELECT COUNT(*) as total_users FROM users');
    const [[{ total_listings }]] = await pool.query('SELECT COUNT(*) as total_listings FROM listings');
    const [[{ total_bookings }]] = await pool.query('SELECT COUNT(*) as total_bookings FROM bookings');
    const [[{ total_revenue }]] = await pool.query('SELECT COALESCE(SUM(total_amount),0) as total_revenue FROM bookings WHERE status IN ("active", "completed", "delivered")');
    const [[{ total_commission }]] = await pool.query('SELECT COALESCE(SUM(commission_amount),0) as total_commission FROM bookings WHERE status IN ("active", "completed", "delivered")');
    const [[{ pending_bookings }]] = await pool.query('SELECT COUNT(*) as pending_bookings FROM bookings WHERE status = "pending"');
    const [[{ active_bookings }]] = await pool.query('SELECT COUNT(*) as active_bookings FROM bookings WHERE status IN ("active", "approved", "picking_up", "in_transit")');
    
    return success(res, { 
      total_users, 
      total_listings, 
      total_bookings,
      pending_bookings,
      active_bookings,
      total_revenue,
      total_commission,
      platform_earnings: total_commission
    });
  } catch (err) { return error(res, err.message); }
};

const getPublicStats = async (req, res) => {
  try {
    const [[{ total_sellers }]] = await pool.query("SELECT COUNT(*) as total_sellers FROM users WHERE role = 'seller' AND status = 'active'");
    const [[{ total_hosts }]] = await pool.query("SELECT COUNT(*) as total_hosts FROM users WHERE role = 'host' AND status = 'active'");
    const [[{ total_listings }]] = await pool.query('SELECT COUNT(*) as total_listings FROM listings WHERE is_active = 1');
    const [[{ total_cities }]] = await pool.query('SELECT COUNT(DISTINCT location) as total_cities FROM listings WHERE is_active = 1');
    const [[{ total_items }]] = await pool.query('SELECT COALESCE(SUM(quantity), 0) as total_items FROM inventory');
    const [[{ monthly_revenue }]] = await pool.query("SELECT COALESCE(SUM(total_amount), 0) as monthly_revenue FROM bookings WHERE status IN ('active', 'completed', 'delivered') AND MONTH(created_at) = MONTH(CURRENT_DATE())");
    
    const [recentBookings] = await pool.query(`
      SELECT b.*, l.title as listing_title, l.location, u.full_name as host_name
      FROM bookings b
      JOIN listings l ON b.listing_id = l.id
      JOIN users u ON l.host_id = u.id
      WHERE b.status IN ('active', 'approved')
      ORDER BY b.created_at DESC
      LIMIT 3
    `);
    
    return success(res, {
      total_sellers,
      total_hosts,
      total_listings,
      total_cities,
      total_items,
      monthly_revenue,
      recent_bookings: recentBookings.map(b => ({
        id: b.id,
        listing_title: b.listing_title,
        location: b.location,
        host_name: b.host_name,
        status: b.status
      }))
    });
  } catch (err) { return error(res, err.message); }
};

const getUsers = async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id, full_name, email, phone, role, status, created_at FROM users ORDER BY created_at DESC');
    return success(res, { users });
  } catch (err) { return error(res, err.message); }
};

const emailService = require('../services/emailService');

const updateUser = async (req, res) => {
  try {
    const { role, status } = req.body;
    if (role) await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, req.params.id]);
    if (status) {
      if (status === 'active') {
        await pool.query('UPDATE users SET status = ?, approved_at = NOW() WHERE id = ?', [status, req.params.id]);
        const [user] = await pool.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
        if (user[0] && user[0].status !== 'active') {
          emailService.sendApprovalEmail(user[0]);
        }
      } else {
        await pool.query('UPDATE users SET status = ? WHERE id = ?', [status, req.params.id]);
      }
    }
    return success(res, {}, 'User updated');
  } catch (err) { return error(res, err.message); }
};

const deleteUser = async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    return success(res, {}, 'User deleted');
  } catch (err) { return error(res, err.message); }
};

const getListings = async (req, res) => {
  try {
    const listings = await Listing.findAll();
    return success(res, { listings });
  } catch (err) { return error(res, err.message); }
};

const toggleListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return error(res, 'Listing not found', 404);
    await Listing.update(req.params.id, { is_active: listing.is_active ? 0 : 1 });
    return success(res, {}, 'Listing toggled');
  } catch (err) { return error(res, err.message); }
};

const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll();
    return success(res, { bookings });
  } catch (err) { return error(res, err.message); }
};

const getPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll();
    return success(res, { payments });
  } catch (err) { return error(res, err.message); }
};

module.exports = { getStats, getPublicStats, getUsers, updateUser, deleteUser, getListings, toggleListing, getBookings, getPayments };