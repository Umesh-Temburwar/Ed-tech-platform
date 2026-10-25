/**
 * Request Validation Middleware
 * Validates request payload schemas before reaching controllers
 */
const { sendBadRequest } = require('../utils/apiResponse');

/**
 * Validates signup payload
 */
function validateSignup(req, res, next) {
  const { firstName, lastName, email, password, confirmPassword, accountType } = req.body;

  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    return sendBadRequest(res, 'All fields are required for signup');
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email.trim())) {
    return sendBadRequest(res, 'Please provide a valid email address');
  }

  if (password.length < 6) {
    return sendBadRequest(res, 'Password must be at least 6 characters long');
  }

  if (password !== confirmPassword) {
    return sendBadRequest(res, 'Password and Confirm Password do not match');
  }

  if (accountType && !['Student', 'Instructor', 'Admin'].includes(accountType)) {
    return sendBadRequest(res, 'Invalid account type specified');
  }

  next();
}

/**
 * Validates login payload
 */
function validateLogin(req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    return sendBadRequest(res, 'Email and password are required');
  }
  next();
}

/**
 * Validates OTP sending payload
 */
function validateSendOtp(req, res, next) {
  const { email } = req.body;
  if (!email || !email.trim()) {
    return sendBadRequest(res, 'Email is required to send OTP');
  }
  next();
}

module.exports = {
  validateSignup,
  validateLogin,
  validateSendOtp,
};
