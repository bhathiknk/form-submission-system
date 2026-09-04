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

// GET /api/submissions - admin only, supports ?gender=, ?search=, ?page=, ?limit=
const getAllSubmissions = asyncHandler(async (req, res) => {
  const { gender, search } = req.query;
  const page = parseInt(req.query.page || '1', 10);
  const limit = parseInt(req.query.limit || '20', 10);

  const where = {};

  if (gender) {
    where.gender = gender;
  }

  if (search) {
    // matches first name OR last name, partial and case-insensitive
    where.OR = [
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [submissions, total] = await prisma.$transaction([
    prisma.submission.findMany({
      where,
      include: {
        userCreated: { select: { id: true, email: true } },
        userModified: { select: { id: true, email: true } },
      },
      orderBy: { dateCreated: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.submission.count({ where }),
  ]);

  return res.status(200).json({
    success: true,
    data: {
      submissions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    },
  });
});

// GET /api/submissions/:id - admin only
const getSubmissionById = asyncHandler(async (req, res) => {
  const submission = await prisma.submission.findUnique({
    where: { id: req.params.id },
    include: {
      userCreated: { select: { id: true, email: true } },
      userModified: { select: { id: true, email: true } },
    },
  });

  if (!submission) {
    return res.status(404).json({ success: false, message: 'Submission not found' });
  }

  return res.status(200).json({ success: true, data: { submission } });
});

module.exports = { createSubmission, getAllSubmissions, getSubmissionById };
