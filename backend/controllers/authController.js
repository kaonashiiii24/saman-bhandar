const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { success, error } = require('../utils/apiResponse');

const register = async (req, res) => {
  try {
    const { full_name, email, password, phone, role } = req.body;
    if (!full_name || !email || !password || !phone) {
      return error(res, 'All fields are required', 400);
    }
    const allowedRoles = ['seller', 'host', 'courier'];
    const safeRole = allowedRoles.includes(role) ? role : 'seller';
    const existing = await User.findByEmail(email);
    if (existing) return error(res, 'Email already registered', 400);
    const hashed = await bcrypt.hash(password, 10);
    const status = safeRole === 'seller' ? 'active' : 'pending';
    const id = await User.create({ full_name, email, password: hashed, phone, role: safeRole, status });
    const user = await User.findById(id);
    if (safeRole !== 'seller') {
      return success(res, { user, token: null, pending: true }, 'Registration successful. Your account is pending admin approval.', 201);
    }
    const token = generateToken(id, user.role);
    return success(res, { user, token }, 'Registered successfully', 201);
  } catch (err) {
    return error(res, err.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return error(res, 'All fields are required', 400);
    const user = await User.findByEmail(email);
    if (!user) return error(res, 'Invalid email or password', 401);
    const match = await bcrypt.compare(password, user.password);
    if (!match) return error(res, 'Invalid email or password', 401);
    if (user.status === 'pending') return error(res, 'Your account is pending admin approval. You will be notified once approved.', 403);
    if (user.status === 'suspended') return error(res, 'Your account has been suspended. Contact support.', 403);
    const token = generateToken(user.id, user.role);
    const { password: _, ...safeUser } = user;
    return success(res, { user: safeUser, token }, 'Login successful');
  } catch (err) {
    return error(res, err.message);
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return error(res, 'User not found', 404);
    return success(res, { user });
  } catch (err) {
    return error(res, err.message);
  }
};

const updateProfile = async (req, res) => {
  try {
    const { full_name, phone, address } = req.body;
    const fields = {};
    if (full_name) fields.full_name = full_name;
    if (phone) fields.phone = phone;
    await User.update(req.user.id, fields);
    const user = await User.findById(req.user.id);
    return success(res, { user }, 'Profile updated');
  } catch (err) {
    return error(res, err.message);
  }
};
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return error(res, 'Current password and new password are required', 400);
    }
    
    if (newPassword.length < 6) {
      return error(res, 'New password must be at least 6 characters', 400);
    }
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return error(res, 'User not found', 404);
    }
    
    const userWithPassword = await User.findByEmail(user.email);
    if (!userWithPassword) {
      return error(res, 'User not found', 404);
    }
    
    const isMatch = await bcrypt.compare(currentPassword, userWithPassword.password);
    if (!isMatch) {
      return error(res, 'Current password is incorrect', 400);
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updatePassword(req.user.id, hashedPassword);
    
    return success(res, {}, 'Password updated successfully');
  } catch (err) {
    return error(res, err.message);
  }
};
module.exports = { register, login, getProfile, updateProfile, changePassword };