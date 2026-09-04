const express = require('express');
const submissionController = require('../controllers/submissionController');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createSubmissionValidator, idParamValidator, listSubmissionsValidator } = require('../validators/submissionValidators');

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

// admin only - list, filter by gender, search by name
router.get(
  '/',
  authenticate,
  authorize('ADMIN'),
  listSubmissionsValidator,
  validate,
  submissionController.getAllSubmissions
);

router.get(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  idParamValidator,
  validate,
  submissionController.getSubmissionById
);

module.exports = router;
