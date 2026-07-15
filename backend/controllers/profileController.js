const User = require('../models/User')
const bcrypt = require('bcryptjs')
const { success, error } = require('../utils/apiResponse')

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) return error(res, 'User not found', 404)
    // Remove sensitive data
    const { password, ...safeUser } = user
    return success(res, safeUser, 'Profile fetched')
  } catch (err) {
    return error(res, 'Server error', 500)
  }
}

exports.updateProfile = async (req, res) => {
  try {
    const allowedFields = ['full_name', 'phone']
    const updates = {}
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field]
    })
    if (req.file) {
      updates.profile_image = '/uploads/' + req.file.filename
    }
    if (Object.keys(updates).length === 0) {
      return error(res, 'No valid fields to update', 400)
    }
    await User.update(req.user.id, updates)
    const updatedUser = await User.findById(req.user.id)
    const { password, ...safeUser } = updatedUser
    return success(res, safeUser, 'Profile updated')
  } catch (err) {
    return error(res, 'Server error', 500)
  }
}

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body
    if (!oldPassword || !newPassword) {
      return error(res, 'Old and new password required', 400)
    }
    const user = await User.findByEmail(req.user.email) // we need a findByEmail that returns password
    if (!user) return error(res, 'User not found', 404)
    const isMatch = await bcrypt.compare(oldPassword, user.password)
    if (!isMatch) return error(res, 'Incorrect current password', 401)
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)
    await User.updatePassword(req.user.id, hashedPassword)
    return success(res, null, 'Password changed successfully')
  } catch (err) {
    return error(res, 'Server error', 500)
  }
}