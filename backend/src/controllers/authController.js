const bcrypt = require('bcrypt');
const prisma = require('../config/prisma');
const { asyncHandler, generateRandomPassword } = require('../utils/helpers');
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  hashToken,
} = require('../utils/jwt');

const SALT_ROUNDS = 12;
const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // fallback, matches default expiry

// saves a hashed refresh token so we can revoke it later
async function storeRefreshToken(userId, refreshToken) {
  const tokenHash = hashToken(refreshToken);
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);
  await prisma.refreshToken.create({
    data: { tokenHash, userId, expiresAt },
  });
}

function sanitizeUser(user) {
  return { id: user.id, email: user.email, role: user.role, createdAt: user.createdAt };
}

// POST /api/auth/register - creates a new customer account
const register = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ success: false, message: 'An account with this email already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: { email, password: hashedPassword, role: 'CUSTOMER' },
  });

  return res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: { user: sanitizeUser(user) },
  });
});

// shared by customer/admin login, only lets the matching role through
async function loginWithRole(req, res, requiredRole) {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  // same message for "no user" and "wrong password" so we don't leak which emails exist
  const invalidMsg = 'Invalid email or password';

  if (!user) {
    return res.status(401).json({ success: false, message: invalidMsg });
  }

  if (user.role !== requiredRole) {
    return res.status(401).json({ success: false, message: invalidMsg });
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    return res.status(401).json({ success: false, message: invalidMsg });
  }

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  await storeRefreshToken(user.id, refreshToken);

  return res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: sanitizeUser(user),
      accessToken,
      refreshToken,
    },
  });
}

// POST /api/auth/customer/login
const customerLogin = asyncHandler((req, res) => loginWithRole(req, res, 'CUSTOMER'));

// POST /api/auth/admin/login
const adminLogin = asyncHandler((req, res) => loginWithRole(req, res, 'ADMIN'));

// POST /api/auth/admin/create - admin only, creates another admin with a random password
const createAdmin = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ success: false, message: 'An account with this email already exists' });
  }

  const rawPassword = generateRandomPassword(12);
  const hashedPassword = await bcrypt.hash(rawPassword, SALT_ROUNDS);

  const admin = await prisma.user.create({
    data: { email, password: hashedPassword, role: 'ADMIN' },
  });

  return res.status(201).json({
    success: true,
    message: 'Admin account created successfully',
    data: {
      user: sanitizeUser(admin),
      temporaryPassword: rawPassword, // only returned here, once
    },
  });
});

// POST /api/auth/refresh - issues a new access token, rotates the refresh token
const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
  }

  if (payload.type !== 'refresh') {
    return res.status(401).json({ success: false, message: 'Invalid token type' });
  }

  const tokenHash = hashToken(refreshToken);
  const stored = await prisma.refreshToken.findUnique({ where: { tokenHash } });

  if (!stored || stored.revoked || stored.expiresAt < new Date()) {
    return res.status(401).json({ success: false, message: 'Refresh token is no longer valid' });
  }

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user) {
    return res.status(401).json({ success: false, message: 'User no longer exists' });
  }

  // rotate: revoke old token, issue a new pair
  const newAccessToken = signAccessToken(user);
  const newRefreshToken = signRefreshToken(user);

  await prisma.$transaction([
    prisma.refreshToken.update({ where: { id: stored.id }, data: { revoked: true } }),
  ]);
  await storeRefreshToken(user.id, newRefreshToken);

  return res.status(200).json({
    success: true,
    data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
  });
});

// POST /api/auth/logout - revokes the given refresh token
const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (refreshToken) {
    const tokenHash = hashToken(refreshToken);
    await prisma.refreshToken.updateMany({
      where: { tokenHash },
      data: { revoked: true },
    });
  }

  return res.status(200).json({ success: true, message: 'Logged out successfully' });
});

// GET /api/auth/me - returns the logged in user's profile
const me = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  return res.status(200).json({ success: true, data: { user: sanitizeUser(user) } });
});

module.exports = { register, customerLogin, adminLogin, createAdmin, refresh, logout, me };
