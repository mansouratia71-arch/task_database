/**
 * Database lab — db.js
 * ----------------
 * Database layer: connects to MySQL, ensures the database exists, creates a
 * connection pool, and creates all tables used by the CV form.
 *
 * Why a pool? Reuses open connections instead of opening a new one per query
 * (faster, avoids exhausting MySQL’s connection limit).
 *
 * Edit host / user / password below if your MySQL setup differs.
 */

const mysql = require('mysql2/promise');

/** Holds the pool after connectDb() finishes — used by controllers and queries.js */
let pool;

/**
 * One-time startup: create database if missing, open pool, CREATE TABLE IF NOT EXISTS.
 * Call this once when the server starts (see server.js).
 */
async function connectDb() {
  // Step 1: connect without picking a database (so we can CREATE DATABASE)
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '' // TODO: change to your MySQL root password
  });

  await connection.query('CREATE DATABASE IF NOT EXISTS mycvproject');
  await connection.end();

  // Step 2: pool for the lab database — all SQL goes through pool.query()
  pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '', // keep in sync with the connection above
    database: 'mycvproject'
  });

  // Parent table: one row per person in the CV form
  await pool.query(`
    CREATE TABLE IF NOT EXISTS person (
      idperson  INT          AUTO_INCREMENT PRIMARY KEY,
      fName     VARCHAR(45)  NOT NULL,
      lName     VARCHAR(45)  NOT NULL,
      Address   VARCHAR(100),
      city      VARCHAR(45),
      country   VARCHAR(45),
      Email     VARCHAR(100) UNIQUE
    )
  `);

  // Child tables: many rows per person, FK person_idperson → person(idperson)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS project (
      idproject       INT          AUTO_INCREMENT PRIMARY KEY,
      name            VARCHAR(100) NOT NULL,
      person_idperson INT,
      FOREIGN KEY (person_idperson) REFERENCES person(idperson)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS course (
      idcourse        INT          AUTO_INCREMENT PRIMARY KEY,
      name            VARCHAR(100) NOT NULL,
      person_idperson INT,
      FOREIGN KEY (person_idperson) REFERENCES person(idperson)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS language (
      idlanguage      INT          AUTO_INCREMENT PRIMARY KEY,
      name            VARCHAR(45)  NOT NULL,
      person_idperson INT,
      FOREIGN KEY (person_idperson) REFERENCES person(idperson)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS hobby (
      idhobby         INT          AUTO_INCREMENT PRIMARY KEY,
      name            VARCHAR(100) NOT NULL,
      person_idperson INT,
      FOREIGN KEY (person_idperson) REFERENCES person(idperson)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS training (
      idtraining      INT          AUTO_INCREMENT PRIMARY KEY,
      name            VARCHAR(100) NOT NULL,
      person_idperson INT,
      FOREIGN KEY (person_idperson) REFERENCES person(idperson)
    )
  `);
}

/** Returns the pool created in connectDb() — required before running queries */
function getPool() {
  return pool;
}

module.exports = { connectDb, getPool };
