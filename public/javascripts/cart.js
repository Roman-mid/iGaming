const addToCartBtn = document.querySelector('.button-add-to-cart');

addToCartBtn.addEventListener('click', function () {
  const id = this.dataset.id;
  addToCart(id);
  // getQuantityItems();
});

// addToCartBtn.addEventListener('click', async function () {
//   const itemId = this.dataset.id;

//   await fetch('/cart/add-to-cart', {
//     method: 'POST',
//     headers: { 'content-Type': 'application/json' },
//     body: JSON.stringify({ id: itemId }),
//   });

//   // getOrder();
//   getQuantityItems();
// });
