const { error } = require('../utils/apiResponse');

module.exports = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return error(res, 'Access denied', 403);
  }
  next();
};