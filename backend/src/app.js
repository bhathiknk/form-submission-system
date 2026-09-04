const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const env = require('./config/env');
const authRoutes = require('./routes/authRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

// security headers
app.use(helmet());

// only allow the configured frontend origin(s)
app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true,
  })
);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(morgan(env.nodeEnv === 'development' ? 'dev' : 'combined'));

// slow down abuse across the whole api
const globalLimiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later' },
});
app.use('/api', globalLimiter);

// stricter limiter just for auth endpoints (brute-force protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many auth attempts, please try again later' },
});
app.use('/api/auth', authLimiter);

app.get('/', (req, res) => {
  res.json({ success: true, message: 'Evotec Full-Stack Assignment API' });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is healthy', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/submissions', submissionRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
