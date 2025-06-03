const mainCart = document.querySelector('#main-cart');
const minusBtns = document.querySelectorAll('.cart-minus');

let cart, goodsObject;

const getOrder = async () => {
  try {
    const response = await fetch('/cart/get-cart', {
      credentials: 'include',
    });
    const result = await response.json();

    cart = result.cart;
    goodsObject = result.goodsInCart.reduce((accum, item) => {
      accum[item.gid] = item;
      return accum;
    }, {});

    showCart();
  } catch (error) {
    console.log(error);
  }
};

// update cart after adding/removeing item
const updateCart = async () => {
  await fetch('/cart/update-cart', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(cart),
  });
};

// minus item
const minusItem = (id) => {
  cart[id]--;
  showCart();
};

// plus item
const plusItem = (id) => {
  cart[id]++;
  showCart();
};

// remove item from cart
const removeItem = (id) => {
  delete cart[id];
  showCart();
};

// chow cart on a page
const showCart = () => {
  updateCart();

  if (Object.keys(cart).length === 0) {
    mainCart.innerHTML = `
    <h1>You don't have any items</h1>
    <div class='col-12 flex-center fixed-photo'>
      <img class='imh-fluid' src='/images/empty-cart.jpg'/>
    </div>
    `;
    itemsInCart.textContent = '';
    itemsInCart.classList.add('d-none');
    return;
  }

  let table = '';
  let total = 0;
  let countItemsInCart = 0;

  table += '<form action="/cart/buy-now" method="POST">';
  table += '<table class="table">';
  table +=
    '<tr><th></th><th>Image</th><th>Title</th><th>Count</th><th>Price</th></tr>';

  for (let id in cart) {
    const cartId = cart[id];
    const itemId = goodsObject[id];

    total += cartId * itemId.price;

    table += '<tr>';
    table += `
      <td>
          <button class='btn btn-danger cart-remove' data-id='${id}'>
          x
          </button>
      </td>`;

    table += `
        <td class='cart-item-img'>
          <img src=/images/${itemId.image} alt=${itemId.url} class='img-fluid'>
        </td>`;

    table += `<td style='max-width: 250px'>${itemId.title}</td>`;

    table += `
        <td>
          <button class='btn btn-light me-2 cart-minus' data-id='${id}' 
          ${cart[id] < 2 ? 'disabled' : ''}>-
        </button>${cart[id]} 
          <button class='btn btn-light ms-2 cart-plus' data-id='${id}'>
            +
          </button>
        </td>`;
    table += `<td>${cart[id] * itemId.price} £</td>`;
    table += '</tr>';

    countItemsInCart += cart[id]; //count all items in cart
  }
  table += `<tr><td colspan="4">Total:</td><td><b>${total} £</b></td></tr>`;
  table += '</table>';
  table += `<button id="checkoutBtn" class="btn btn-success mt-3 buy-now-btn">Buy now</button>`;
  table += '</form>';

  mainCart.innerHTML = table; // show cart table
  // mainCart.insertAdjacentHTML(
  //   'beforeend',
  //   `<button id="checkoutBtn" class="btn btn-success mt-3 buy-now-btn">Buy now</button>`
  // );

  itemsInCart.textContent = countItemsInCart; // show quantity in cart btn
};

mainCart.addEventListener('click', (e) => {
  const target = e.target;
  if (target.classList.contains('cart-remove')) removeItem(target.dataset.id);
  if (target.classList.contains('cart-minus')) minusItem(target.dataset.id);
  if (target.classList.contains('cart-plus')) plusItem(target.dataset.id);
});

getOrder();
