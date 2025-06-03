const addToCartBtn = document.querySelector('.button-add-to-cart');
const buyBtn = document.querySelector('.buy-now-btn');

addToCartBtn.addEventListener('click', function () {
  try {
    const id = this.dataset.id;
    addToCart(id);
  } catch (error) {
    console.log(error.message);
  }
});
