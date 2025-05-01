const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.json({
    title: 'API works! You are the best!!! VERY COOL!!!',
    description:
      'Сделал первое API на express.js. Просто потестить как это работает.',
    mode: 'test',
    framework: 'express.js',
  });
});

module.exports = router;
