const express = require('express');
const router = express.Router();
const pool = require('../db/config');

const auth = require('./middlewares/auth');

router.get('/', auth, async (req, res, next) => {
  const userID = req.session.user.id;
  const { rows: orders } = await pool.query(
    `
    SELECT orders FROM orders_history WHERE user_id = $1
    `,
    [userID]
  );

  console.log(orders);

  res.render('orders_history', { orders });
});

module.exports = router;
