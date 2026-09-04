const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const env = require('./config/env');
const authRoutes = require('./routes/authRoutes');
const submissionRoutes = require('./routes/submissionRoutes');

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

app.get('/', (req, res) => {
  res.json({ success: true, message: 'Evotec Full-Stack Assignment API' });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is healthy', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/submissions', submissionRoutes);

module.exports = app;
