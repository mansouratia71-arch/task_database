/**
 * Database lab — server.js
 * ---------------------
 * Application entry point: creates the Express app, wires middleware and routes,
 * connects to MySQL, then listens for HTTP requests.
 *
 * This file stays thin on purpose: URL → handler mapping lives in routes/,
 * business logic in controllers/, database setup in db.js (MVC-style).
 */

const express = require('express');
const { connectDb } = require('./db');
const cvRoutes = require('./routes/cvRoutes');

const app = express();

// Parse HTML form bodies (application/x-www-form-urlencoded) into req.body
app.use(express.urlencoded({ extended: true }));

// Mount CV routes at site root: GET / and POST /submit come from routes/cvRoutes.js
app.use('/', cvRoutes);

const PORT = 3000;

async function start() {
  try {
    // Must run before any request uses getPool() — creates DB, pool, and tables
    await connectDb();
    console.log('Database ready.');

    app.listen(PORT, () => {
      console.log(`http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Startup failed:', err.message);
  }
}

start();
