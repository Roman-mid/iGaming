const express = require('express');
const router = express.Router();
const pool = require('../db/config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const JWT_SECRET = 'your_jwt_secret_key'; // just for test

router.get('/', (req, res, next) => {
  res.render('login', {});
});

router.post('/', async (req, res, next) => {
  try {
    const email = req.body.email.trim().toLowerCase();
    const password = req.body.password.trim();

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email and password are required' });
    }

    const { rows: user } = await pool.query(
      `
    SELECT * FROM users WHERE email = $1 
    `,
      [email]
    );

    if (user.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user[0].password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // const payload = { id: user[0].id, email: user[0].email };

    // const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    // res.cookie('token', token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'Strict',
    //   maxAge: 60 * 60 * 1000, // 1 час
    // });

    req.session.user = {
      id: user[0].id,
      email: user[0].email,
    };

    console.log({
      id: user[0].id,
      email: user[0].email,
    });

    // return res.status(200).json({ token });

    res.redirect('/');
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// for sessions
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/login');
  });
});

// for coocies
// router.post('/logout', (req, res) => {
//   res.clearCookie('token');
//   res.status(200).json({ message: 'Logged out' });
// });

module.exports = router;
