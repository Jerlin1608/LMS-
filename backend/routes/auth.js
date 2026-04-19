// routes/auth.js — Login, Logout, Signup, Session

const express = require('express');
const router  = express.Router();
const { readDB, writeDB } = require('../data/dbHelper');

// ── POST /api/auth/login ──────────────────────────────────
router.post('/login', (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role) {
    return res.status(400).json({ error: 'Username, password and role are required.' });
  }

  const db   = readDB();
  const user = db.users.find(u => u.username === username && u.role === role);

  if (!user) {
    return res.status(401).json({ error: 'Username not found or wrong role selected.' });
  }

  // Plain text password comparison
  if (user.password !== password) {
    return res.status(401).json({ error: 'Incorrect password. Try again.' });
  }

  // Store user in session (don't send password back)
  const safeUser = { ...user };
  delete safeUser.password;
  req.session.user = safeUser;

  res.json({ success: true, user: safeUser });
});

// ── POST /api/auth/logout ─────────────────────────────────
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// ── GET /api/auth/me — check who is logged in ─────────────
router.get('/me', (req, res) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: 'Not logged in.' });
  }
  res.json({ user: req.session.user });
});

// ── POST /api/auth/signup ─────────────────────────────────
router.post('/signup', (req, res) => {
  const { username, password, name, email, degree, specialization,
          dob, gender, phone, address, state, hospital, experience,
          reg_no, avatar } = req.body;

  if (!username || !password || !name || !email) {
    return res.status(400).json({ error: 'Required fields missing.' });
  }

  const db = readDB();

  if (db.users.find(u => u.username === username)) {
    return res.status(400).json({ error: 'Username already taken.' });
  }

  const newUser = {
    id:             db.nextUserId++,
    username,
    password,       // stored as plain text for simplicity
    role:           'applicant',
    name,
    email,
    degree:         degree || '',
    specialization: specialization || '',
    dob:            dob || '',
    gender:         gender || '',
    phone:          phone || '',
    address:        address || '',
    state:          state || '',
    hospital:       hospital || '',
    experience:     experience || '',
    reg_no:         reg_no || '',
    avatar:         avatar || 'DR',
    joined:         new Date().toISOString().split('T')[0]
  };

  db.users.push(newUser);
  writeDB(db);

  const safeUser = { ...newUser };
  delete safeUser.password;
  res.json({ success: true, user: safeUser });
});

// ── POST /api/auth/reset-password ────────────────────────
router.post('/reset-password', (req, res) => {
  const { username, newPassword } = req.body;
  if (!username || !newPassword) {
    return res.status(400).json({ error: 'Username and new password required.' });
  }
  const db = readDB();
  const user = db.users.find(u => u.username === username);
  if (!user) return res.status(404).json({ error: 'User not found.' });

  user.password = newPassword;
  writeDB(db);
  res.json({ success: true });
});

module.exports = router;
