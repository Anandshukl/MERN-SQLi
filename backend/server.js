const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();

// ── Middleware ──────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ── MongoDB Connection ─────────────────────────────────
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sqli_guardian';

mongoose
  .connect(mongoUri)
  .then(() => console.log('🗄️  MongoDB connected successfully'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('⚠️  Server will run but DB operations will fail. Please start MongoDB.');
  });

// ── API Routes ─────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/detect', require('./routes/detect'));
app.use('/api/payloads', require('./routes/payloads'));
app.use('/api/profile', require('./routes/profile'));

// ── Serve Frontend (Production) ────────────────────────
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
const fs = require('fs');

if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({
      status: 'running',
      msg: 'SQLi-Guardian API is live. Frontend not built yet — run npm run build in /frontend.',
    });
  });
}

// ── Global Error Handler ───────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ msg: 'Internal server error' });
});

// ── Start Server ───────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 SQLi-Guardian server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
  if (fs.existsSync(frontendDist)) {
    console.log(`📦 Serving frontend build from ${frontendDist}`);
  } else {
    console.log('📦 Frontend build not found — API-only mode');
    console.log('   Run "cd frontend && npm run build" to generate production build\n');
  }
});
