const express = require('express');
const authController = require('../controllers/authController');
const validate = require('../middleware/validate');
const { registerValidator } = require('../validators/authValidators');

const router = express.Router();

router.post('/register', registerValidator, validate, authController.register);

module.exports = router;
