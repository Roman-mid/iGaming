const express = require('express');
const router = express.Router();
const pool = require('../db/config');
// const crypto = require('crypto');
const bcrypt = require('bcrypt');

router.get('/', (req, res, next) => {
  res.render('sign_up', {});
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
    SELECT email FROM users WHERE email = $1
    `,
      [email]
    );

    if (user.length > 0) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await hashPassword(password);
    await pool.query(
      `
    INSERT INTO users (email, password) VALUES ($1, $2)`,
      [email, hashedPassword]
    );

    // res.status(201).json({ result: true });
    res.redirect('/login');
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;

const hashPassword = async (plainPassword) => {
  const saltRounds = 10;
  const hash = await bcrypt.hash(plainPassword, saltRounds);
  return hash;
};

// const isValid = await bcrypt.compare(inputPassword, storedPasswordHash);
