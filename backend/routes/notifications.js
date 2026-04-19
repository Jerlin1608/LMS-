// routes/notifications.js
const express = require('express');
const router  = express.Router();
const { readDB, writeDB } = require('../data/dbHelper');
const { requireAuth } = require('../middleware/auth');

// GET /api/notifications — get my notifications
router.get('/', requireAuth, (req, res) => {
  const db    = readDB();
  const mine  = (db.notifications || []).filter(n => n.userId === req.session.user.id);
  res.json({ notifications: mine });
});

// PUT /api/notifications/mark-read — mark all as read
router.put('/mark-read', requireAuth, (req, res) => {
  const db = readDB();
  (db.notifications || []).forEach(n => {
    if (n.userId === req.session.user.id) n.read = true;
  });
  writeDB(db);
  res.json({ success: true });
});

// DELETE /api/notifications — clear all mine
router.delete('/', requireAuth, (req, res) => {
  const db = readDB();
  db.notifications = (db.notifications || []).filter(n => n.userId !== req.session.user.id);
  writeDB(db);
  res.json({ success: true });
});

module.exports = router;
