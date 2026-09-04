const { body } = require('express-validator');

const GENDER_VALUES = ['MALE', 'FEMALE', 'OTHER'];

// matches local mobile formats, e.g. 09171234567, +639171234567, 0917-123-4567
const MOBILE_REGEX = /^(\+?\d{1,3}[-\s]?)?\(?0?\d{2,4}\)?[-\s]?\d{3,4}[-\s]?\d{3,4}$/;

const createSubmissionValidator = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email must be a valid email address')
    .normalizeEmail(),
  body('gender')
    .notEmpty().withMessage('Gender is required')
    .isIn(GENDER_VALUES).withMessage(`Gender must be one of: ${GENDER_VALUES.join(', ')}`),
  body('mobileNumber')
    .trim()
    .notEmpty().withMessage('Mobile number is required')
    .matches(MOBILE_REGEX).withMessage('Mobile number format is invalid'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('feedback').optional({ checkFalsy: true }).trim(),
];

module.exports = { createSubmissionValidator, GENDER_VALUES };
