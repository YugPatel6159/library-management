const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'library.db');

let db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the SQlite database.');
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )`, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Table created or already exists.');
    }
  });
});
// Add this block of code temporarily to update your database schema
db.run(`
  ALTER TABLE users ADD COLUMN otp TEXT;
`, (err) => {
  if (err) {
    console.error('Error updating table:', err.message);
  } else {
    console.log('Table updated successfully.');
  }
});
db.run(`ALTER TABLE users ADD COLUMN otp_expires DATETIME`, function(err) {
    if (err) {
      console.error("Error adding column 'otp_expires':", err.message);
    } else {
      console.log("'otp_expires' column added successfully.");
    }
  });
  db.serialize(() => {
    // Create the table if it doesn't exist
    db.run(`
        CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            author TEXT NOT NULL,
            genre TEXT,
            file_path TEXT
        );
    `, (err) => {
        if (err) {
            console.error("Error creating table:", err.message);
        } else {
            console.log('Table created or already exists.');
        }
    });
});
db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Close the database connection.');
});
