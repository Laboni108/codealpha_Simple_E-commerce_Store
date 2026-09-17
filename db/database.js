// db/database.js
// Lightweight JSON-file database (via lowdb). Stores users, products, orders.
// Swap this module out for a real SQL/NoSQL driver in production (e.g. Postgres, MySQL, MongoDB) —
// every other file only talks to the functions exported here, so the rest of the app won't change.

const path = require('path');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync(path.join(__dirname, '..', 'data', 'db.json'));
const db = low(adapter);

// Default schema
db.defaults({
  users: [],
  products: [],
  orders: [],
  nextUserId: 1,
  nextOrderId: 1,
}).write();

module.exports = db;
