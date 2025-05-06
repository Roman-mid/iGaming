const express = require('express');
const router = express.Router();
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

router.get('/:goods/:item', async (req, res, next) => {
  const single_category = req.params.goods;
  const oneItem = req.params.item;

  try {
    const { rows: goods } = await pool.query(
      `
      SELECT *
      FROM categories
      LEFT JOIN categories_lang ON categories.id = categories_lang.cid
      WHERE categories_lang.lang = 'en' AND categories.url = $1
      ORDER BY categories_lang.cid ASC`,
      [single_category]
    );

    // get one item
    const { rows: item } = await pool.query(
      `
      SELECT * FROM goods
      LEFT JOIN goods_lang ON goods.id = goods_lang.gid
      WHERE goods.url = $1 AND goods_lang.lang = 'en'`,
      [oneItem]
    );

    // get similar items
    const { rows: similarGoods } = await pool.query(
      `
      SELECT * FROM goods
      LEFT JOIN goods_lang ON goods.id = goods_lang.gid
      WHERE goods.cid = ${goods[0].cid} AND goods.id != ${item[0].gid} AND goods_lang.lang = 'en' 
      ORDER BY random()
      LIMIT 4`
    );

    const { rows: images } = await pool.query(
      `
      SELECT * FROM images
      WHERE gid = $1 
      ORDER BY ord ASC`,
      [item[0].gid]
    );

    res.render('item', {
      goods: goods[0],
      item: item[0],
      similarGoods: similarGoods,
      images: images,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
