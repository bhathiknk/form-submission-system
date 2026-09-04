const { body, param, query } = require('express-validator');

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

const updateSubmissionValidator = [
  param('id').isUUID().withMessage('Invalid submission id'),
  body('firstName').optional().trim().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().trim().notEmpty().withMessage('Last name cannot be empty'),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Email must be a valid email address')
    .normalizeEmail(),
  body('gender')
    .optional()
    .isIn(GENDER_VALUES).withMessage(`Gender must be one of: ${GENDER_VALUES.join(', ')}`),
  body('mobileNumber')
    .optional()
    .trim()
    .matches(MOBILE_REGEX).withMessage('Mobile number format is invalid'),
  body('address').optional().trim().notEmpty().withMessage('Address cannot be empty'),
  body('feedback').optional({ checkFalsy: true }).trim(),
];

const idParamValidator = [param('id').isUUID().withMessage('Invalid submission id')];

const listSubmissionsValidator = [
  query('gender').optional().isIn(GENDER_VALUES).withMessage(`Gender must be one of: ${GENDER_VALUES.join(', ')}`),
  query('search').optional().trim(),
  query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100'),
];

module.exports = {
  createSubmissionValidator,
  updateSubmissionValidator,
  idParamValidator,
  listSubmissionsValidator,
  GENDER_VALUES,
};
