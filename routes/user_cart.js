const express = require('express');
const router = express.Router();
const pool = require('../db/config');

const auth = require('./middlewares/auth');

router.post('/add-to-cart', auth, async (req, res, next) => {
  const id = req.body.id;
  console.log(req.session.uid);
  const email = req.user.email;
  console.log(req.session.user.id);

  const { rows: orders } = await pool.query(
    `
    SELECT cart FROM users WHERE email = $1 LIMIT 1
    `,
    [email]
  );

  let cart = {};

  if (!orders[0].cart) {
    cart[id] = 1;
  } else {
    cart = JSON.parse(orders[0].cart);

    if (id in cart) {
      cart[id]++;
    } else {
      cart[id] = 1;
    }
  }

  await pool.query(
    `
      UPDATE users SET cart = $1 WHERE email = $2
      `,
    [cart, email]
  );

  res.json({ result: true });
});

module.exports = router;
