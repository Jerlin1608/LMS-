// routes/licenses.js — license management

const express = require('express');
const router  = express.Router();
const { readDB, writeDB } = require('../data/dbHelper');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// ── GET /api/licenses — all (admin) or mine (applicant) ──
router.get('/', requireAuth, (req, res) => {
  const db   = readDB();
  const user = req.session.user;
  const lics = user.role === 'admin'
    ? db.licenses
    : db.licenses.filter(l => l.applicant_id === user.id);
  res.json({ licenses: lics });
});

// ── GET /api/licenses/verify/:licenseId — public, no auth ─
router.get('/verify/:licenseId', (req, res) => {
  const db  = readDB();
  const lic = db.licenses.find(l => l.license_id === req.params.licenseId);
  if (!lic) return res.status(404).json({ error: 'License not found.' });
  const user = db.users.find(u => u.id === lic.applicant_id);
  const safeUser = user ? { name:user.name, degree:user.degree, specialization:user.specialization, hospital:user.hospital, email:user.email, dob:user.dob } : null;
  res.json({ license: lic, doctor: safeUser });
});

// ── GET /api/licenses/verify-by-name/:name — public ──────
router.get('/verify-by-name/:name', (req, res) => {
  const db   = readDB();
  const name = req.params.name.toLowerCase();
  const user = db.users.find(u => u.name && u.name.toLowerCase().includes(name) && u.role === 'applicant');
  if (!user) return res.status(404).json({ error: 'No doctor found with that name.' });
  const lic = db.licenses.find(l => l.applicant_id === user.id);
  if (!lic) return res.status(404).json({ error: 'No license found for this doctor.' });
  const safeUser = { name:user.name, degree:user.degree, specialization:user.specialization, hospital:user.hospital, email:user.email, dob:user.dob };
  res.json({ license: lic, doctor: safeUser });
});

// ── PUT /api/licenses/:licId/suspend ─────────────────────
router.put('/:licId/suspend', requireAdmin, (req, res) => {
  const { note } = req.body;
  if (!note) return res.status(400).json({ error: 'Note is required.' });

  const db  = readDB();
  const lic = db.licenses.find(l => l.license_id === req.params.licId);
  if (!lic) return res.status(404).json({ error: 'License not found.' });

  lic.status      = 'suspended';
  lic.review_note = note;

  // Also update the application status
  const app = db.applications.find(a => a.license_id === req.params.licId);
  if (app) { app.status = 'suspended'; app.review_note = note; }

  // Notify doctor
  db.notifications.push({
    id:      Date.now(),
    userId:  lic.applicant_id,
    type:    'suspended',
    title:   'License Suspended',
    message: `Your license ${req.params.licId} has been temporarily suspended. Reason: ${note}`,
    time:    new Date().toISOString(),
    read:    false
  });

  writeDB(db);
  res.json({ success: true });
});

// ── PUT /api/licenses/:licId/revoke ──────────────────────
router.put('/:licId/revoke', requireAdmin, (req, res) => {
  const { note } = req.body;
  if (!note) return res.status(400).json({ error: 'Note is required.' });

  const db  = readDB();
  const lic = db.licenses.find(l => l.license_id === req.params.licId);
  if (!lic) return res.status(404).json({ error: 'License not found.' });

  lic.status      = 'revoked';
  lic.review_note = note;

  const app = db.applications.find(a => a.license_id === req.params.licId);
  if (app) { app.status = 'revoked'; app.review_note = note; }

  db.notifications.push({
    id:      Date.now(),
    userId:  lic.applicant_id,
    type:    'revoked',
    title:   'License Revoked',
    message: `Your license ${req.params.licId} has been permanently revoked. Reason: ${note}`,
    time:    new Date().toISOString(),
    read:    false
  });

  writeDB(db);
  res.json({ success: true });
});

module.exports = router;
