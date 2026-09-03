const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const env = require('../config/env');

// short-lived token used to authenticate requests
function signAccessToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role, type: 'access' },
    env.jwt.accessSecret,
    { expiresIn: env.jwt.accessExpiresIn }
  );
}

// long-lived token used to get new access tokens without re-login
function signRefreshToken(user) {
  return jwt.sign(
    { sub: user.id, type: 'refresh', jti: crypto.randomUUID() },
    env.jwt.refreshSecret,
    { expiresIn: env.jwt.refreshExpiresIn }
  );
}

function verifyAccessToken(token) {
  return jwt.verify(token, env.jwt.accessSecret);
}

function verifyRefreshToken(token) {
  return jwt.verify(token, env.jwt.refreshSecret);
}

// we store a hash of the refresh token, never the raw token
function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  hashToken,
};
