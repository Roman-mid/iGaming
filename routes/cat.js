const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('cat', {
    title: 'All categories',
    text: 'This is a page with all categories',
  });
});

router.get('/:item', (req, res, next) => {
  res.render('item', {
    title: req.params.item,
    text: `Would you like to buy a new ${req.params.item}`,
  });
});

router.get('/:item/:oneitem', (req, res, next) => {
  console.log(req.params);
  res.render('oneitem', {
    title: 'Beautifull choise',
    text: 'It is the best item which we have ever had',
  });
});

module.exports = router;
