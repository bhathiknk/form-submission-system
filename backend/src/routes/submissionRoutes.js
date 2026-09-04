const express = require('express');
const submissionController = require('../controllers/submissionController');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createSubmissionValidator } = require('../validators/submissionValidators');

const router = express.Router();

// customer only - submit a form
router.post(
  '/',
  authenticate,
  authorize('CUSTOMER'),
  createSubmissionValidator,
  validate,
  submissionController.createSubmission
);

module.exports = router;
