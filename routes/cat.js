const express = require('express');
const router = express.Router();
const cats = require('../data/data.json');
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

    res.render('cat', {
      title: 'All categories',
      text: 'You can find everything for comfortable gaming',
      data: data,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:item', (req, res, next) => {
  const oneitem = req.params.item;
  console.log(oneitem);
  res.render('item', {
    data: cats[oneitem],
  });
});

router.get('/:item/:oneitem', (req, res, next) => {
  const oneitem = req.params.oneitem;

  res.render('oneitem', {
    data: cats[oneitem],
  });
});

module.exports = router;
