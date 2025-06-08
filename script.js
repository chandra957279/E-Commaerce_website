let productsWrapper = document.getElementById("productsWrapper");
let cart = document.getElementById("cart");
let totalPrice = document.getElementById("totalPrice");
let payAllBtn = document.getElementById("payAllBtn"); // ✅ NEW: Overall Pay button

let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

// ✅ Display cart on page load
window.addEventListener("load", displayCartItems);

// ✅ Fetch products
async function fetchProducts() {
  try {
    let response = await fetch("https://fakestoreapi.com/products");
    let data = await response.json();
    displayProducts(data);
  } catch (error) {
    console.log(error);
    productsWrapper.innerHTML = `<h2>Something went wrong 🤪</h2>`;
  }
}
fetchProducts();

// ✅ Display Products
function displayProducts(products) {
  productsWrapper.innerHTML = "";
  products.forEach((product) => {
    const card = createProductCard(product);
    productsWrapper.appendChild(card);
  });
}

// ✅ Create each product card
function createProductCard(product) {
  let card = document.createElement("article");
  let productImage = document.createElement("img");
  let productTitle = document.createElement("h3");
  let productPrice = document.createElement("p");
  let btn = document.createElement("button");

  productImage.src = product.image;
  productTitle.textContent = product.title;
  productPrice.textContent = `Rs. ${product.price}`;
  btn.textContent = "Add to Cart";

  card.className = "productCard";
  card.setAttribute("data-aos", "fade-up");
  card.setAttribute("data-aos-duration", "3000");

  // ✅ Add to cart button logic
  btn.addEventListener("click", () => {
    let existing = cartItems.find((item) => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cartItems.push({ ...product, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cartItems));
    displayCartItems();

    btn.textContent = "Added!";
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = "Add to Cart";
      btn.disabled = false;
    }, 1000);
  });

  card.append(productImage, productTitle, productPrice, btn);
  return card;
}

// ✅ Display Cart Items and Total
function displayCartItems() {
  cart.innerHTML = "";
  let storedCart = JSON.parse(localStorage.getItem("cart")) || [];

  if (storedCart.length === 0) {
    cart.innerHTML = "<p>Your cart is empty 🛒</p>";
    totalPrice.textContent = "Total: Rs. 0";
    payAllBtn.style.display = "none"; // ✅ Hide Pay button if cart is empty
    return;
  }

  storedCart.forEach((item) => {
    const cartCard = createCartCard(item);
    cart.appendChild(cartCard);
  });

  // ✅ Update total price
  let total = storedCart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  totalPrice.textContent = `Total: Rs. ${total.toFixed(2)}`;
  payAllBtn.style.display = "block"; // ✅ Show Pay button when cart has items
}

// ✅ Create Cart Card
function createCartCard(item) {
  let cartCard = document.createElement("article");
  let cartImage = document.createElement("img");
  let cartTitle = document.createElement("h3");
  let cartQuantity = document.createElement("p");
  let cartPrice = document.createElement("p");
  let removeBtn = document.createElement("button");

  cartCard.className = "cartCard";
  cartImage.src = item.image;
  cartTitle.textContent = item.title;
  cartQuantity.textContent = `Qty: ${item.quantity}`;
  cartPrice.textContent = `Rs. ${(item.quantity * item.price).toFixed(2)}`;
  removeBtn.textContent = "Remove";

  // ✅ Remove logic
  removeBtn.addEventListener("click", () => {
    let index = cartItems.findIndex((ele) => ele.id === item.id);
    if (index !== -1) {
      if (cartItems[index].quantity > 1) {
        cartItems[index].quantity -= 1;
      } else {
        cartItems.splice(index, 1);
      }
      localStorage.setItem("cart", JSON.stringify(cartItems));
      displayCartItems();
    }
  });

  cartCard.append(cartImage, cartTitle, cartQuantity, cartPrice, removeBtn);
  return cartCard;
}

// ✅ Pay Button Alert
payAllBtn.addEventListener("click", () => {
  alert("Thanks for your purchase! 🛍️");
  cartItems = [];
  localStorage.removeItem("cart");
  displayCartItems();
});
