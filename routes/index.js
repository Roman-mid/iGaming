const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  // lang = JSON.stringify(lang)
  res.render('index', { title: 'iGaming' });
});

module.exports = router;
