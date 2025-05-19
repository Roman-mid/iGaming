const express = require('express');
const router = express.Router();

router.post('/', async (req, res, next) => {
  lang = req.body.lang;

  res.json({ result: true });
});

module.exports = router;
