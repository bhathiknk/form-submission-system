const { verifyAccessToken } = require('../utils/jwt');

// checks the Bearer token and attaches user info to req.user
function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({
      success: false,
      message: 'Missing or malformed Authorization header. Expected: Bearer <token>',
    });
  }

  try {
    const payload = verifyAccessToken(token);

    if (payload.type !== 'access') {
      return res.status(401).json({ success: false, message: 'Invalid token type' });
    }

    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };

    return next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Access token expired' });
    }
    return res.status(401).json({ success: false, message: 'Invalid access token' });
  }
}

// restricts a route to specific roles, e.g. authorize('ADMIN')
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action',
      });
    }
    return next();
  };
}

module.exports = { authenticate, authorize };
