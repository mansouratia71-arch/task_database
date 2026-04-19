# Database lab — CV form + MySQL (step-by-step)

Small **Node.js** + **Express** + **mysql2** project: submit a CV through the browser, save rows in **MySQL**, then run **aggregate SQL** from a separate script.


---

## What is MVC (here)?

**MVC (Model–View–Controller)** splits responsibilities:

| Piece | In this project | Role |
|--------|-----------------|------|
| **Model** | Not a separate ORM; **`db.js`** + SQL | Data: tables, connections, queries |
| **View** | **`views/*.html`** | What the user sees (static HTML) |
| **Controller** | **`controllers/cvController.js`** | Glue: read HTTP input, call DB, choose which view to send |
| **Routes** | **`routes/cvRoutes.js`** | Maps URLs (`GET /`, `POST /submit`) to controller functions |
| **Entry** | **`server.js`** | Starts the app, connects the DB, mounts routes |

The **server** file stays **thin**: it configures Express and starts listening; it does not contain INSERT logic.

---

## Project structure

```
database-lab/              # project root (rename your folder if you like)
├── server.js              # Entry: Express app + listen + connectDb()
├── db.js                  # MySQL: create DB, pool, CREATE TABLE
├── controllers/
│   └── cvController.js    # showForm, submitForm
├── routes/
│   └── cvRoutes.js        # GET / , POST /submit
├── views/
│   ├── index.html         # CV form
│   ├── saved.html         # After successful save (static message)
│   └── error.html         # On error (static message)
├── queries.js             # Aggregate SELECTs (run in terminal)
├── package.json
└── README.md
```

---

## Prerequisites

- **Node.js** 18+ recommended  
- **MySQL** 8 running locally  
- A MySQL user that can create databases (e.g. `root`) — update **password in `db.js`** to match your machine

---

## Setup

1. **Install dependencies**

   ```bash
   cd database-lab   
   npm install
   ```

2. **Configure MySQL credentials**  
   Open **`db.js`** and set `user` / `password` (two places: the first `createConnection` and the `createPool`).

3. **No manual `CREATE DATABASE` required**  
   The first successful `connectDb()` runs `CREATE DATABASE IF NOT EXISTS mycvproject` and creates tables.

---

## Run the web app

```bash
npm start
```

Open **`http://localhost:3000`**, fill the form, submit.

- Success → **`views/saved.html`**  
- Failure → **`views/error.html`** (details are in the **terminal** via `console.error`)

---

## Run aggregate queries (after you have data)

```bash
node queries.js
```

or

```bash
npm run queries
```


---

## Suggested learning order (how you might rebuild it)

1. **`npm init`** → **`package.json`**
2. **`db.js`** — connect, create database, pool, tables  
3. **`views/index.html`** — form with `method="post"` and `action="/submit"`  
4. **`server.js`** — Express, `urlencoded`, `POST /submit` with INSERTs (monolith first)  
5. Split **`routes/cvRoutes.js`** + **`controllers/cvController.js`**  
6. Add **`queries.js`** for reporting SQL  

---

## Troubleshooting

| Symptom | Things to check |
|--------|------------------|
| `ECONNREFUSED` | MySQL service not running |
| `Access denied` | Wrong `user` / `password` in **`db.js`** |
| Duplicate email error | **`Email`** is `UNIQUE` on `person`; use another email or clear the table in Workbench |


