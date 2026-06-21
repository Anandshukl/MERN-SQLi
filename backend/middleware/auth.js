const jwt = require('jsonwebtoken');

/**
 * JWT Authentication Middleware
 * Validates Bearer token from Authorization header and
 * attaches decoded user payload to req.user
 */
module.exports = function authMiddleware(req, res, next) {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Expect format: "Bearer <token>"
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ msg: 'Token format is invalid (expected: Bearer <token>)' });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'super_secret_jwt_key_sqli_guardian_987!'
    );
    req.user = decoded.user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ msg: 'Token has expired, please log in again' });
    }
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
