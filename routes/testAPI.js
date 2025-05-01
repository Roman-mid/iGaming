const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.json({ title: 'API works! You are the best!!! VERY COOL!!!' });
});

module.exports = router;
