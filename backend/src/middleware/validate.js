const { validationResult } = require('express-validator');

// runs after express-validator checks, returns 422 if anything failed
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({
        field: e.path,
        message: e.msg,
      })),
    });
  }
  return next();
}

module.exports = validate;
