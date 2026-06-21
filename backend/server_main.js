const express = require('express');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/detect', require('./routes/detect'));
app.use('/api/payloads', require('./routes/payloads'));
app.use('/api/profile', require('./routes/profile'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = app;
