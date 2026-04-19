'use strict';

const express = require('express');
const cors    = require('cors');
const session = require('express-session');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ──────────────────────────────────────────────
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '50mb' }));   // 50mb for file uploads as base64
app.use(express.urlencoded({ extended: true }));

// ── Session setup ───────────────────────────────────────────
app.use(session({
  secret:            'medlicense-secret-key-2024',
  resave:            false,
  saveUninitialized: false,
  cookie:            { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// ── API Routes ──────────────────────────────────────────────
app.use('/api/auth',          require('./routes/auth'));
app.use('/api/applications',  require('./routes/applications'));
app.use('/api/licenses',      require('./routes/licenses'));
app.use('/api/notifications', require('./routes/notifications'));

// ── Health check ────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'MedLicense Pro API is running' });
});

// ── Serve frontend ──────────────────────────────────────────
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));

// All other routes → serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// ── Start ───────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('  ╔══════════════════════════════════════════╗');
  console.log('  ║     MedLicense Pro — Full Stack v2.0     ║');
  console.log(`  ║   Running at: http://localhost:${PORT}      ║`);
  console.log('  ║   Press Ctrl+C to stop                   ║');
  console.log('  ╚══════════════════════════════════════════╝');
  console.log('');
  console.log('  Demo credentials:');
  console.log('  Admin     → admin     / Admin@123');
  console.log('  Doctor    → dr.arjun  / Doctor@123');
  console.log('');
});
