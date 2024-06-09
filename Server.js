const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public')); 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:3000',  // Client's URL
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

// Database connection
const dbPath = path.join(__dirname, 'database', 'library.db');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the library.db database.');
});
// const nodemailer = require('nodemailer');

// const upload = multer({ storage: storage });

let transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: '754b35001@smtp-brevo.com', // your SMTP login
        pass: 'Q4UYEGyzNa8MDtLR' // your SMTP password
    }
});
  
  function sendOTP(email, otp) {
    const mailOptions = {
      from: 'yugpatelaus@gmail.com',
      to: email,
      subject: 'Your OTP',
      text: `Here is your OTP: ${otp}. It expires in 10 minutes.`
    };
  
    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          reject(error);
        } else {
          console.log('Email sent:', info.response);
          resolve(info);
        }
      });
    });
  }

  const multer = require('multer');
  
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/') // Make sure the 'uploads' directory exists
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
  });
  const upload = multer({ dest: 'uploads/', storage: storage }); // Files will be saved in 'uploads' directory

  
  app.post('/all-books', upload.single('file_path'), (req, res) => {
      console.log(req.body); // will have title, author, and genre
      const { title, author, genre } = req.body;
      const file = req.file; // file information
      console.log("File path:", file.path); // Path where file is saved
  
      const sql = `INSERT INTO books (title, author, genre, file_path) VALUES (?, ?, ?, ?)`;
      db.run(sql, [title, author, genre, file.path], function(err) {
          if (err) {
              res.status(500).json({ error: err.message });
              return;
          }
          res.json({ message: 'Book added successfully', bookId: this.lastID });
      });
  });
  app.get('/download/uploads/:filename', (req, res) => {
    const filename = req.params.filename;
    const file = path.join(__dirname, 'uploads', filename);
    res.download(file, (err) => {
        if (err) {
            res.status(500).send({ message: "Could not download the file.", error: err });
        }
    });
});


  app.get('/all-books', (req, res) => {
      const sql = 'SELECT * FROM books';
      db.all(sql, [], (err, rows) => {
          if (err) {
              res.status(500).json({ error: err.message });
              return;
          }
          res.json({
              message: 'Success',
              data: rows
          });
      });
  });

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.send('Hello from the server!');
});

// Example: Fetch all users
app.get('/users', (req, res) => {
  const sql = 'SELECT * FROM users';
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'Success',
      data: rows
    });
  });
});

app.post('/users', (req, res) => {
    const { name, email, password } = req.body;
    // store encrypted password
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    const sql = 'INSERT INTO users (name, email, password) VALUES (?,?,?)';
    db.run(sql, [name, email, hashedPassword], function (err) {
      if (err) {
        res.status(400).json({ "error": err.message });
        return;
      }
      res.json({
        "message": "success",
        "data": this.lastID
      });
    });
  });


  app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const decryptedPassword = crypto.createHash('sha256').update(password).digest('hex');
    const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
    db.get(sql, [email, decryptedPassword], (err, row) => {
      console.log(row,'row');
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (!row) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }
      res.json({
        message: 'success',
        data: {
          id: row.id,
          email: row.email,
          Token: row.role
        }
      });
    });
  });

  app.post('/request-otp', (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
  
    const otp = crypto.randomInt(100000, 999999); // Generate a 6-digit OTP
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 10); // Set expiration time (10 minutes)
  
    // Verify if the email exists in the database and send the OTP
    const checkUserSql = 'SELECT * FROM users WHERE email = ?';
    db.get(checkUserSql, [email], (err, user) => {
      if (err) {
        console.error("Database read error:", err.message);
        return res.status(500).json({ error: "Database read error", details: err.message });
      }
      if (!user) {
        return res.status(404).json({ error: 'Email not found' });
      } else {
        const updateSql = 'UPDATE users SET otp = ?, otp_expires = ? WHERE email = ?';
        db.run(updateSql, [otp, expires.toISOString(), email], function(updateErr) {
          if (updateErr) {
            console.error("Database update error:", updateErr.message);
            return res.status(500).json({ error: "Database update error", details: updateErr.message });
          }
          sendOTP(email, otp)
            .then(() => res.json({ message: 'OTP sent to your email.' }))
            .catch(sendErr => {
              console.error("Email sending error:", sendErr);
              res.status(500).json({ error: "Email sending error", details: sendErr.message });
            });
        });
      }
    });
  });

  app.post('/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }
  
    const checkUserSql = 'SELECT * FROM users WHERE email = ?';
    db.get(checkUserSql, [email], (err, user) => {
      if (err) {
        console.error("Database read error:", err.message);
        return res.status(500).json({ error: "Database read error", details: err.message });
      }
      if (!user) {
        return res.status(404).json({ error: 'Email not found' });
      } else if (user.otp !== otp) {
        return res.status(401).json({ error: 'Invalid OTP' });
      } else if (user.otp_expires < new Date()) {
        return res.status(401).json({ error: 'OTP expired' });
      } else {
        res.json({ message: 'OTP verified successfully' });
      }
    });
  });

  app.put('/reset-password', (req, res) => {
    const { email, password } = req.body;
    console.log("Email:", email, "Password:", password);
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

  
    const updateSql = 'UPDATE users SET password = ? WHERE email = ?';
    db.run(updateSql, [hashedPassword, email], function (updateErr) {
      if (updateErr) {
        console.error("Database update error:", updateErr.message);
        return res.status(500).json({ error: "Database update error", details: updateErr.message });
      }
      res.json({ message: 'Password reset successful' });
    });
  });

  
// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
