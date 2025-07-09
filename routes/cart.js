const express = require('express');
const router = express.Router();
const pool = require('../db/config');

const auth = require('./middlewares/auth');

router.get('/', (req, res, next) => {
  if (!req.session.user?.id) {
    res.redirect('/login');
    return;
  }
  res.render('cart', {});
});

// get number of items for headr
router.get('/get-quantity-items', auth, async (req, res) => {
  const userID = req.session.user?.id;

  const { rows: orders } = await pool.query(
    `
    SELECT * FROM orders WHERE user_id = $1 AND status = 1 LIMIT 1
      `,
    [userID]
  );

  if (orders.length === 0) {
    res.json({
      goodsInCart: [],
      cart: [],
    });
  } else {
    const cart = JSON.parse(orders[0].cart);

    const quantityItems = Object.values(cart).reduce(
      (acc, value) => (acc += value),
      0
    );

    res.json({
      quantityItems,
    });
  }
});

// get items from cart - USING JS AND showCart()
router.get('/get-cart', auth, async (req, res) => {
  const userID = req.session.user.id;

  const { rows: orders } = await pool.query(
    `
    SELECT * FROM orders WHERE user_id = $1 AND status = 1 LIMIT 1
      `,
    [userID]
  );

  if (orders.length === 0) {
    res.json({
      goodsInCart: [],
      cart: [],
    });
  } else {
    const cart = JSON.parse(orders[0].cart);
    const idItemsInCart = Object.keys(cart);

    if (idItemsInCart.length === 0) {
      res.json({
        goodsInCart: [],
        cart: [],
      });
      return;
    }

    const { rows: goodsInCart } = await pool.query(
      `
      SELECT * FROM goods
      LEFT JOIN goods_lang ON goods.id = goods_lang.gid
      WHERE goods.id IN (${idItemsInCart}) AND goods_lang.lang = '${lang}'
      `
    );

    res.json({
      goodsInCart,
      cart,
    });
  }
});

// add item to cart
router.post('/add-to-cart', auth, async (req, res, next) => {
  const id = req.body.id;
  const userID = req.session.user.id;

  const { rows: orders } = await pool.query(
    `
    SELECT * FROM orders WHERE user_id = $1 AND status = 1 LIMIT 1
    `,
    [userID]
  );

  const cart = {};

  if (orders.length === 0) {
    cart[id] = 1;

    await pool.query(
      `
    INSERT INTO orders (user_id, cart) VALUES ($1, $2)
    `,
      [userID, cart]
    );
  } else {
    const cart = JSON.parse(orders[0].cart);

    if (id in cart) {
      cart[id]++;
    } else {
      cart[id] = 1;
    }

    await pool.query(
      `
      UPDATE orders SET cart = $1 WHERE id = $2
      `,
      [cart, orders[0].id]
    );
  }

  res.json({ result: true });
});

// update cart
router.post('/update-cart', auth, async (req, res) => {
  const cart = req.body;
  const userID = req.session.user.id;

  await pool.query('UPDATE orders SET cart = $1 WHERE user_id = $2', [
    cart,
    userID,
  ]);

  res.json({ result: true });
});

router.post('/buy-now', auth, async (req, res, next) => {
  try {
    const userID = req.session.user.id;

    const { rows: cart } = await pool.query(
      `
    SELECT cart, orders_history FROM orders WHERE user_id = $1
    `,
      [userID]
    );

    if (cart.length === 0 || !cart[0].cart) {
      return res.status(400).json({ result: false, message: 'Cart is empty' });
    }

    await pool.query(
      `
    INSERT INTO orders_history (user_id, orders) VALUES ($1, $2)
    `,
      [userID, cart[0].cart]
    );

    await pool.query(
      `
    UPDATE orders SET cart = '{}' WHERE user_id = $1
    `,
      [userID]
    );

    res.redirect('/categories');
  } catch (err) {
    res.status(500).json({ result: false, message: 'Server error' });
  }
});

module.exports = router;
