/**
 * Standardized API Response Helper
 * Ensures predictable and uniform JSON responses across all backend controllers
 */

/**
 * Sends a successful JSON response
 * @param {import('express').Response} res
 * @param {string} message
 * @param {any} [data]
 * @param {number} [statusCode=200]
 */
function sendSuccess(res, message, data = undefined, statusCode = 200) {
  const payload = {
    success: true,
    message,
  };
  if (data !== undefined) {
    payload.data = data;
  }
  return res.status(statusCode).json(payload);
}

/**
 * Sends an error JSON response
 * @param {import('express').Response} res
 * @param {string} message
 * @param {number} [statusCode=500]
 * @param {any} [error=null]
 */
function sendError(res, message, statusCode = 500, error = null) {
  const payload = {
    success: false,
    message,
  };
  if (process.env.NODE_ENV === 'development' && error) {
    payload.error = error.message || error;
  }
  return res.status(statusCode).json(payload);
}

/**
 * Sends a 400 Bad Request response
 */
function sendBadRequest(res, message = 'Invalid request parameters') {
  return sendError(res, message, 400);
}

/**
 * Sends a 401 Unauthorized response
 */
function sendUnauthorized(res, message = 'Unauthorized access') {
  return sendError(res, message, 401);
}

/**
 * Sends a 403 Forbidden response
 */
function sendForbidden(res, message = 'Access forbidden') {
  return sendError(res, message, 403);
}

/**
 * Sends a 404 Not Found response
 */
function sendNotFound(res, message = 'Requested resource not found') {
  return sendError(res, message, 404);
}

module.exports = {
  sendSuccess,
  sendError,
  sendBadRequest,
  sendUnauthorized,
  sendForbidden,
  sendNotFound,
};
