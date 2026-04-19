/**
 * Database lab — controllers/cvController.js
 * --------------------------------------
 * Controller layer (MVC): handles HTTP for the CV feature.
 * - Reads req (incoming request), uses the DB, sends res (response).
 * - Does not define routes here — routes/cvRoutes.js maps URLs to these functions.
 */

const path = require('path');
const { getPool } = require('../db');

/**
 * GET /
 * Show the CV form (static HTML under views/).
 */
exports.showForm = (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
};

/**
 * POST /submit
 * Body comes from <form method="post"> — same field names as <input name="...">.
 * Flow: INSERT person → read insertId → INSERT child rows linked by person_idperson.
 */
exports.submitForm = async (req, res) => {
  const {
    fName, lName, address, country, city, email,
    project1, project2, project3,
    course1, course2, course3,
    lang1, lang2, lang3,
    hobby1, hobby2, hobby3,
    training1, training2, training3
  } = req.body;

  const pool = getPool();

  try {
    // Parameterised INSERT: ? placeholders + array values prevent SQL injection
    const [result] = await pool.query(
      'INSERT INTO person (fName, lName, Address, country, city, Email) VALUES (?, ?, ?, ?, ?, ?)',
      [fName, lName, address, country, city, email]
    );
    // MySQL auto-increment ID of the row we just inserted (needed for foreign keys)
    const personId = result.insertId;

    /**
     * Insert each non-empty string into `table`, linking to this person.
     * `table` must be a fixed string (e.g. 'project') — never pass user input as table name.
     */
    const saveChildren = async (table, names) => {
      for (const name of names) {
        if (name && String(name).trim() !== '') {
          await pool.query(
            `INSERT INTO ${table} (name, person_idperson) VALUES (?, ?)`,
            [String(name).trim(), personId]
          );
        }
      }
    };

    await saveChildren('project', [project1, project2, project3]);
    await saveChildren('course', [course1, course2, course3]);
    await saveChildren('language', [lang1, lang2, lang3]);
    await saveChildren('hobby', [hobby1, hobby2, hobby3]);
    await saveChildren('training', [training1, training2, training3]);

    res.sendFile(path.join(__dirname, '..', 'views', 'saved.html'));
  } catch (err) {
    // Log real error server-side; user sees generic error.html (static message)
    console.error(err);
    res.status(500).sendFile(path.join(__dirname, '..', 'views', 'error.html'));
  }
};
