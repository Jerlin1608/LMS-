// routes/applications.js — CRUD for license applications

const express = require('express');
const router  = express.Router();
const { readDB, writeDB } = require('../data/dbHelper');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// ── GET /api/applications — get all (admin) or mine (applicant) ──
router.get('/', requireAuth, (req, res) => {
  const db   = readDB();
  const user = req.session.user;

  let apps = user.role === 'admin'
    ? db.applications
    : db.applications.filter(a => a.applicant_id === user.id);

  // Attach applicant info for admin view
  if (user.role === 'admin') {
    apps = apps.map(a => {
      const u = db.users.find(x => x.id === a.applicant_id);
      return { ...a, applicant: u ? { id:u.id, name:u.name, degree:u.degree||'', email:u.email } : null };
    });
  }

  res.json({ applications: apps });
});

// ── GET /api/applications/:id ────────────────────────────
router.get('/:id', requireAuth, (req, res) => {
  const db  = readDB();
  const app = db.applications.find(a => a.id === parseInt(req.params.id));
  if (!app) return res.status(404).json({ error: 'Application not found.' });

  // Applicants can only see their own
  if (req.session.user.role !== 'admin' && app.applicant_id !== req.session.user.id) {
    return res.status(403).json({ error: 'Access denied.' });
  }
  res.json({ application: app });
});

// ── POST /api/applications — submit new application ──────
router.post('/', requireAuth, (req, res) => {
  const { license_type, specialization, hospital, notes, documents } = req.body;
  if (!license_type || !specialization) {
    return res.status(400).json({ error: 'License type and specialization are required.' });
  }

  const db  = readDB();
  const today = new Date().toISOString().split('T')[0];

  const newApp = {
    id:            db.nextAppId++,
    applicant_id:  req.session.user.id,
    license_type,
    specialization,
    hospital:      hospital || '',
    notes:         notes || '',
    status:        'pending',
    applied_date:  today,
    review_note:   '',
    license_id:    null,
    documents:     documents || []
  };

  db.applications.push(newApp);
  writeDB(db);
  res.json({ success: true, application: newApp });
});

// ── PUT /api/applications/:id/approve ───────────────────
router.put('/:id/approve', requireAdmin, (req, res) => {
  const { note } = req.body;
  if (!note) return res.status(400).json({ error: 'Review note is required.' });

  const db  = readDB();
  const app = db.applications.find(a => a.id === parseInt(req.params.id));
  if (!app) return res.status(404).json({ error: 'Application not found.' });
  if (app.status !== 'pending') return res.status(400).json({ error: 'Only pending applications can be approved.' });

  // Generate license ID
  const y      = new Date().getFullYear();
  const n      = String(db.nextLicId).padStart(5,'0');
  const licId  = `MLA-${y}-${n}`;
  const today  = new Date().toISOString().split('T')[0];
  const expiry = new Date(Date.now() + 730*24*60*60*1000).toISOString().split('T')[0];

  // Create license
  const newLic = {
    id:            db.nextLicId++,
    license_id:    licId,
    applicant_id:  app.applicant_id,
    license_type:  app.license_type,
    specialization:app.specialization,
    status:        'active',
    issued_date:   today,
    expiry_date:   expiry,
    issued_by:     'Medical Council of India',
    review_note:   note
  };

  db.licenses.push(newLic);
  app.status      = 'approved';
  app.review_note = note;
  app.license_id  = licId;

  // Push notification
  db.notifications.push({
    id:      Date.now(),
    userId:  app.applicant_id,
    type:    'approved',
    title:   'License Approved!',
    message: `Your ${app.license_type} (${app.specialization}) has been approved. License ID: ${licId}`,
    time:    new Date().toISOString(),
    read:    false
  });

  writeDB(db);
  res.json({ success: true, license_id: licId, license: newLic });
});

// ── PUT /api/applications/:id/reject ────────────────────
router.put('/:id/reject', requireAdmin, (req, res) => {
  const { note } = req.body;
  if (!note) return res.status(400).json({ error: 'Review note is required.' });

  const db  = readDB();
  const app = db.applications.find(a => a.id === parseInt(req.params.id));
  if (!app) return res.status(404).json({ error: 'Application not found.' });

  app.status      = 'rejected';
  app.review_note = note;

  // Push notification
  db.notifications.push({
    id:      Date.now(),
    userId:  app.applicant_id,
    type:    'rejected',
    title:   'Application Rejected',
    message: `Your ${app.license_type} application was rejected. Reason: ${note}`,
    time:    new Date().toISOString(),
    read:    false
  });

  writeDB(db);
  res.json({ success: true });
});

module.exports = router;
