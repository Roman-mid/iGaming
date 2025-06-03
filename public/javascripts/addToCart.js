const itemsInCart = document.querySelector('.number-of-items');

const addToCart = async function (id) {
  await fetch('/cart/add-to-cart', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ id }),
  });

  await getQuantityItems();
};

const getQuantityItems = async () => {
  const response = await fetch('/cart/get-quantity-items', {
    credentials: 'include',
  });
  const { quantityItems } = await response.json();

  if (!quantityItems) {
    itemsInCart.textContent = '';
    itemsInCart.classList.add('d-none');
    return;
  }

  itemsInCart.classList.remove('d-none');

  itemsInCart.textContent = quantityItems;
};

getQuantityItems();
