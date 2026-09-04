/* eslint-disable no-unused-vars */

// central error handler, catches everything passed to next(err)
function errorHandler(err, req, res, next) {
  // eslint-disable-next-line no-console
  console.error(err);

  // prisma unique constraint error
  if (err.code === 'P2002') {
    const field = Array.isArray(err.meta?.target) ? err.meta.target.join(', ') : 'field';
    return res.status(409).json({
      success: false,
      message: `A record with this ${field} already exists`,
    });
  }

  // prisma record not found
  if (err.code === 'P2025') {
    return res.status(404).json({ success: false, message: 'Record not found' });
  }

  const status = err.statusCode || err.status || 500;
  const message = status === 500 ? 'Internal server error' : err.message;

  return res.status(status).json({ success: false, message });
}

function notFoundHandler(req, res) {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
}

module.exports = { errorHandler, notFoundHandler };
