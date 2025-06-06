const express = require('express');
const router = express.Router();
const pool = require('../db/config');

// const auth = require('./middlewares/auth');

router.get('/', async (req, res, next) => {
  const userID = req.session.user?.id;

  if (!userID) {
    res.redirect('/login');
    return;
  }

  const { rows: orders } = await pool.query(
    `
    SELECT orders, created_at FROM orders_history WHERE user_id = $1
    `,
    [userID]
  );

  const cart = orders.map((obj) => ({
    ...obj,
    orders: JSON.parse(obj.orders),
  }));

  const ordersID = cart.map((obj) => Object.keys(obj.orders)).flat();
  const unicOrdersId = [...new Set(ordersID)];

  const { rows: goods } = await pool.query(
    `
    SELECT * FROM goods
    LEFT JOIN goods_lang ON goods.id = goods_lang.gid
    WHERE goods.id IN (${unicOrdersId}) and goods_lang.lang = $1
    `,
    [lang]
  );

  const ordersHistory = cart.map((obj) => {
    const items = Object.entries(obj.orders).map(([gid, quantity]) => {
      const product = goods.find((item) => item.gid === Number(gid));

      return {
        ...product,
        quantity,
      };
    });
    return {
      items,
      created_at: transformDate(obj.created_at),
      totalPrice: items.reduce(
        (acc, item) => (acc += item.price * item.quantity),
        0
      ),
    };
  });

  res.render('orders_history', { orders: ordersHistory });
});

module.exports = router;

const transformDate = (date) => {
  const formattedDate = date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long', // 'short' — если хочешь сокращённое название месяца
    year: 'numeric',
  });

  return formattedDate;
};
