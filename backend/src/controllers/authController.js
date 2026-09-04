const bcrypt = require('bcrypt');
const prisma = require('../config/prisma');
const { asyncHandler, generateRandomPassword } = require('../utils/helpers');
const { signAccessToken, signRefreshToken, hashToken } = require('../utils/jwt');

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

module.exports = { register, customerLogin, adminLogin, createAdmin };
