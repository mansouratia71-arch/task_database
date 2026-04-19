/**
 * Database lab — queries.js
 * ---------------------
 * Standalone script to run aggregate SELECTs, UPDATEs, and DELETEs.
 */

const { connectDb, getPool } = require('./db');

async function runQueries() {
  await connectDb();
  const pool = getPool();
  
  console.log('\n── QUERY 1: Number of courses per person ──');
  const [courseCounts] = await pool.query(`
    SELECT p.fName, p.lName, COUNT(c.idcourse) AS courseCount
    FROM person p
    LEFT JOIN course c ON c.person_idperson = p.idperson
    GROUP BY p.idperson, p.fName, p.lName
    ORDER BY courseCount DESC
  `);
  courseCounts.forEach(row =>
    console.log(`  ${row.fName} ${row.lName} → ${row.courseCount} course(s)`)
  );

  
  console.log('\n── QUERY 2: Persons with more than 1 project ──');
  const [topPerson] = await pool.query(`
    SELECT p.fName, p.lName, COUNT(pr.idproject) AS projectCount
    FROM person p
    INNER JOIN project pr ON pr.person_idperson = p.idperson
    GROUP BY p.idperson, p.fName, p.lName
    HAVING projectCount > 1
    ORDER BY projectCount DESC
  `);
  if (topPerson.length > 0) {
    topPerson.forEach(t => console.log(`  ${t.fName} ${t.lName} — ${t.projectCount} project(s)`));
  } else {
    console.log('  No data yet.');
  }

  // ——
  console.log('\n── QUERY 3: Unique countries ──');
  const [distinctCountries] = await pool.query(`
    SELECT DISTINCT country FROM person ORDER BY country ASC
  `);
  distinctCountries.forEach(row => console.log(`  ${row.country || 'N/A'}`));

  // ======================================== TASKS =============================================================

  console.log('\n── TASK 1: Persons in > 2 courses ──');
  const [task1] = await pool.query(`
    SELECT p.fName, p.lName, COUNT(c.idcourse) AS courseCount
    FROM person p
    JOIN course c ON c.person_idperson = p.idperson
    GROUP BY p.idperson, p.fName, p.lName
    HAVING COUNT(c.idcourse) > 2
  `);
  task1.forEach(row => console.log(`  ${row.fName} ${row.lName} → ${row.courseCount}`));

 
  console.log('\n── TASK 2: Countries with > 2 persons ──');
  const [task2] = await pool.query(`
    SELECT country, COUNT(*) AS personCount
    FROM person
    GROUP BY country
    HAVING COUNT(*) > 2
  `);
  task2.forEach(row => console.log(`  ${row.country} → ${row.personCount} persons`));


  console.log('\n── TASK 3: Update emails for project owners ──');
  const [updateRes] = await pool.query(`
    UPDATE person
    SET email = LOWER(CONCAT(fName, lName, '@company.com'))
    WHERE idperson IN (SELECT DISTINCT person_idperson FROM project)
  `);
  console.log(`  Updated ${updateRes.affectedRows} person(s) emails.`);

  
  console.log('\n── TASK 4: Delete courses for a specific country ──');
  const targetCountry = 'Egypt'; 
  const [deleteRes] = await pool.query(`
    DELETE FROM course
    WHERE person_idperson IN (SELECT idperson FROM person WHERE country = ?)
  `, [targetCountry]);
  console.log(`  Deleted ${deleteRes.affectedRows} courses from ${targetCountry}.`);

  
  console.log('\n── TASK 5: Avg languages per country > 1 ──');
  
  const [task5] = await pool.query(`
    SELECT country, AVG(language_count) AS avgLanguages
    FROM person
    GROUP BY country
    HAVING AVG(language_count) > 1
  `);
  task5.forEach(row => console.log(`  ${row.country} → Average: ${row.avgLanguages.toFixed(2)}`));

  await pool.end();
}

runQueries().catch(err => console.error('Error:', err.message));