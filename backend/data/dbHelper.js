// db.js — Simple JSON file database
// Reads and writes data/db.json as our persistent storage

const fs   = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'db.json');

// Read the entire database from file
function readDB() {
  const raw = fs.readFileSync(DB_PATH, 'utf8');
  return JSON.parse(raw);
}

// Write the entire database back to file
function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = { readDB, writeDB };
