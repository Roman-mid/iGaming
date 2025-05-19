const express = require('express');
const router = express.Router();
const pool = require('../db/config');

router.get('/', (req, res, next) => {
  res.render('cart', {});
});

// get number of items for headr
router.get('/get-quantity-items', async (req, res) => {
  const uid = req.session.uid;

  const { rows: orders } = await pool.query(
    `
    SELECT * FROM orders WHERE uid = $1 AND status = 1 LIMIT 1
      `,
    [uid]
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
router.get('/get-cart', async (req, res) => {
  const uid = req.session.uid;

  const { rows: orders } = await pool.query(
    `
    SELECT * FROM orders WHERE uid = $1 AND status = 1 LIMIT 1
      `,
    [uid]
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
router.post('/add-to-cart', async (req, res, next) => {
  const uid = req.session.uid;
  const id = req.body.id;

  const { rows: orders } = await pool.query(
    `
    SELECT * FROM orders WHERE uid = $1 AND status = 1 LIMIT 1
    `,
    [uid]
  );

  const cart = {};

  if (orders.length === 0) {
    cart[id] = 1;

    await pool.query(
      `
    INSERT INTO orders (uid, cart) VALUES ($1, $2)
    `,
      [uid, cart]
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
router.post('/update-cart', async (req, res) => {
  const uid = req.session.uid;
  const cart = req.body;

  await pool.query('UPDATE orders SET cart = $1 WHERE uid = $2', [cart, uid]);

  res.json({ result: true });
});

module.exports = router;
