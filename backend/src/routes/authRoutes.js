const express = require('express');
const authController = require('../controllers/authController');
const validate = require('../middleware/validate');
const { registerValidator, loginValidator } = require('../validators/authValidators');

const router = express.Router();

router.post('/register', registerValidator, validate, authController.register);
router.post('/customer/login', loginValidator, validate, authController.customerLogin);
router.post('/admin/login', loginValidator, validate, authController.adminLogin);

module.exports = router;
