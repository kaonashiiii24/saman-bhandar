const Listing = require('../models/Listing');
const fs = require('fs');
const path = require('path');
const { success, error } = require('../utils/apiResponse');

const getListings = async (req, res) => {
  try {
    const listings = await Listing.findAllAvailable(req.query);
    return success(res, { listings });
  } catch (err) { return error(res, err.message); }
};

const getListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return error(res, 'Listing not found', 404);
    return success(res, { listing });
  } catch (err) { return error(res, err.message); }
};

const getMyListings = async (req, res) => {
  try {
    const listings = await Listing.findByHost(req.user.id);
    return success(res, { listings });
  } catch (err) { return error(res, err.message); }
};

const createListing = async (req, res) => {
  try {
    const { title, description, size, price_per_month } = req.body;
    const location = req.body.location 
      ? req.body.location.trim().charAt(0).toUpperCase() + req.body.location.trim().slice(1).toLowerCase() 
      : '';

    if (!title || !location || !price_per_month) return error(res, 'Title, location and price are required', 400);
    
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;
    
    const id = await Listing.create({
      host_id: req.user.id,
      title,
      description,
      location,
      size,
      price_per_month,
      image_url
    });
    
    const listing = await Listing.findById(id);
    return success(res, { listing }, 'Listing created', 201);
  } catch (err) { return error(res, err.message); }
};

const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return error(res, 'Listing not found', 404);
    if (listing.host_id !== req.user.id && req.user.role !== 'admin') return error(res, 'Unauthorized', 403);
    
    if (req.body.is_active !== undefined && req.body.is_active == 0) {
      const Booking = require('../models/Booking');
      const bookings = await Booking.findByListing(req.params.id);
      const activeBookings = bookings.filter(b => 
        ['pending', 'approved', 'active', 'picking_up', 'in_transit'].includes(b.status)
      );
      
      if (activeBookings.length > 0) {
        return error(res, `Cannot deactivate — ${activeBookings.length} active booking(s) exist.`, 400);
      }
    }
    await Listing.update(req.params.id, req.body);
    return success(res, {}, 'Listing updated');
  } catch (err) { return error(res, err.message); }
};

const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return error(res, 'Listing not found', 404);
    if (listing.host_id !== req.user.id && req.user.role !== 'admin') return error(res, 'Unauthorized', 403);
    
    if (req.user.role !== 'admin') {
      const Booking = require('../models/Booking');
      const bookings = await Booking.findByListing(req.params.id);
      const activeBookings = bookings.filter(b => 
        ['pending', 'approved', 'active', 'picking_up', 'in_transit'].includes(b.status)
      );
      
      if (activeBookings.length > 0) {
        return error(res, `Cannot delete this listing. It has ${activeBookings.length} active booking(s). Cancel or complete them first.`, 400);
      }
    }
    
    if (listing.image_url) {
      const imagePath = path.join(__dirname, '..', listing.image_url);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await Listing.remove(req.params.id);
    return success(res, {}, 'Listing deleted');
  } catch (err) { return error(res, err.message); }
};

const getListingItems = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return error(res, 'Listing not found', 404);
    if (listing.host_id !== req.user.id && req.user.role !== 'admin') return error(res, 'Unauthorized', 403);
    
    const items = await Listing.findItemsByListing(req.params.id);
    return success(res, { items });
  } catch (err) { return error(res, err.message); }
};

const getLocations = async (req, res) => {
  try {
    const locations = await Listing.getLocations();
    return success(res, { locations });
  } catch (err) { return error(res, err.message); }
};

module.exports = { getListings, getListing, getMyListings, createListing, updateListing, deleteListing, getListingItems, getLocations };