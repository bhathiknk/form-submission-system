const prisma = require('../config/prisma');
const { asyncHandler } = require('../utils/helpers');

// POST /api/submissions - customer only, creates a new form submission
const createSubmission = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, gender, mobileNumber, address, feedback } = req.body;

  const existing = await prisma.submission.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ success: false, message: 'A submission with this email already exists' });
  }

  const submission = await prisma.submission.create({
    data: {
      firstName,
      lastName,
      email,
      gender,
      mobileNumber,
      address,
      feedback: feedback || null,
      userCreatedId: req.user.id,
    },
  });

  return res.status(201).json({
    success: true,
    message: 'Submission created successfully',
    data: { submission },
  });
});

module.exports = { createSubmission };
