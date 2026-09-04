const express = require('express');
const authController = require('../controllers/authController');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  registerValidator,
  loginValidator,
  createAdminValidator,
  refreshValidator,
} = require('../validators/authValidators');

const router = express.Router();

router.post('/register', registerValidator, validate, authController.register);
router.post('/customer/login', loginValidator, validate, authController.customerLogin);
router.post('/admin/login', loginValidator, validate, authController.adminLogin);
router.post('/refresh', refreshValidator, validate, authController.refresh);
router.post('/logout', authController.logout);

// requires a valid access token
router.get('/me', authenticate, authController.me);

// admin only - creates another admin account
router.post(
  '/admin/create',
  authenticate,
  authorize('ADMIN'),
  createAdminValidator,
  validate,
  authController.createAdmin
);

module.exports = router;
