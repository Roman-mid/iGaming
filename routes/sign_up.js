const express = require('express');
const router = express.Router();
const pool = require('../db/config');
const bcrypt = require('bcrypt');
const { messages } = require('./constants/validations');
const { isValidPassword, isValidEmail } = require('./tools/validateFields');

router.get('/', (req, res, next) => {
  res.render('sign_up', {});
});

router.post('/', async (req, res, next) => {
  try {
    const email = req.body.email.trim().toLowerCase();
    const password = req.body.password.trim();

    if (!email || !password) {
      return res.status(400).json({ message: messages.required });
    }

    if (!isValidPassword(res, password) || !isValidEmail(res, email)) {
      return;
    }

    const { rows: user } = await pool.query(
      `
      SELECT email FROM users WHERE email = $1
    `,
      [email]
    );

    if (user.length > 0) {
      return res.status(409).json({ message: 'User id already registered' });
    }

    const hashedPassword = await hashPassword(password);
    await pool.query(
      `
      INSERT INTO users (email, password) VALUES ($1, $2)`,
      [email, hashedPassword]
    );

    res.status(200).json({
      message: 'You have registered successfully',
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: messages.networkError });
  }
});

module.exports = router;

const hashPassword = async (plainPassword) => {
  const saltRounds = 10;
  const hash = await bcrypt.hash(plainPassword, saltRounds);
  return hash;
};
