const bcrypt = require('bcrypt');
const prisma = require('../config/prisma');
const { asyncHandler } = require('../utils/helpers');

const SALT_ROUNDS = 12;

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

module.exports = { register };
