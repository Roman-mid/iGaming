const express = require('express');
const router = express.Router();
// const cats = require('../data/data.json');
const pool = require('../db/config');

router.get('/', async (req, res, next) => {
  try {
    const { rows: data } = await pool.query(`
      SELECT *
      FROM categories
      LEFT JOIN categories_lang ON categories.id = categories_lang.cid
      WHERE categories_lang.lang = 'en'
      ORDER BY categories_lang.cid ASC
    `);

    res.render('all_categories', {
      title: 'All categories',
      text: 'You can find everything for comfortable gaming',
      data: data,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:goods', async (req, res, next) => {
  const single_category = req.params.goods;

  try {
    const { rows: data } = await pool.query(
      `
      SELECT *
      FROM categories
      LEFT JOIN categories_lang ON categories.id = categories_lang.cid
      WHERE categories_lang.lang = 'en' AND categories.url = $1
      ORDER BY categories_lang.cid ASC`,
      [single_category]
    );

    const { rows: goods } = await pool.query(
      `
      SELECT * FROM goods
      LEFT JOIN goods_lang ON goods.id = goods_lang.gid
      WHERE goods.cid = $1 AND goods_lang.lang = 'en'`,
      [data[0].cid]
    );

    res.render('single_category', {
      data: data[0],
      goods: goods,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:goods/:item', (req, res, next) => {
  const item = req.params.item;

  res.render('item', {
    // data: cats[item],
  });
});

module.exports = router;
