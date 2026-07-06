const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 2499,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1518441313688-7f8b3c5e1d16?auto=format&fit=crop&w=800&q=80",
    description: "Comfortable wireless headphones with deep bass and long battery life."
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 3499,
    category: "Wearables",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    description: "Track fitness, notifications, and daily activity with a sleek smartwatch."
  },
  {
    id: 3,
    name: "Running Shoes",
    price: 1999,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    description: "Lightweight running shoes designed for comfort and performance."
  },
  {
    id: 4,
    name: "Backpack",
    price: 1499,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    description: "Durable everyday backpack with multiple compartments."
  },
  {
    id: 5,
    name: "Bluetooth Speaker",
    price: 1299,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1512314889357-e157c22f938d?auto=format&fit=crop&w=800&q=80",
    description: "Portable Bluetooth speaker with clear sound and strong bass."
  },
  {
    id: 6,
    name: "Sunglasses",
    price: 899,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
    description: "Stylish UV-protected sunglasses for everyday wear."
  }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const productList = document.getElementById("product-list");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const totalItems = document.getElementById("total-items");
const searchInput = document.getElementById("searchInput");
const clearCartBtn = document.getElementById("clearCartBtn");
const checkoutForm = document.getElementById("checkoutForm");
const orderMessage = document.getElementById("orderMessage");
const modal = document.getElementById("productModal");
const modalBody = document.getElementById("modalBody");
const closeModalBtn = document.getElementById("closeModalBtn");

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function getCartCount() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function getCartTotal() {
  return cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.id);
    return sum + product.price * item.quantity;
  }, 0);
}

function addToCart(productId) {
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }
  saveCart();
  renderCart();
}

function increaseQty(productId) {
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.quantity += 1;
    saveCart();
    renderCart();
  }
}

function decreaseQty(productId) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.quantity -= 1;
  if (item.quantity <= 0) {
    cart = cart.filter(i => i.id !== productId);
  }
  saveCart();
  renderCart();
}

function removeItem(productId) {
  cart = cart.filter(i => i.id !== productId);
  saveCart();
  renderCart();
}

function clearCart() {
  cart = [];
  saveCart();
  renderCart();
}

function renderProducts(list = products) {
  productList.innerHTML = list.map(product => `
    <div class="product-card">
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${product.category}</p>
      <p class="price">₹${product.price}</p>
      <button class="btn" onclick="openProduct(${product.id})">View Details</button>
      <button class="btn" style="margin-left:8px;" onclick="addToCart(${product.id})">Add to Cart</button>
    </div>
  `).join("");
}

function renderCart() {
  cartCount.textContent = getCartCount();
  cartTotal.textContent = getCartTotal();
  totalItems.textContent = getCartCount();

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  cartItems.innerHTML = cart.map(item => {
    const product = products.find(p => p.id === item.id);
    const subtotal = product.price * item.quantity;

    return `
      <div class="cart-item">
        <img src="${product.image}" alt="${product.name}">
        <div>
          <h3>${product.name}</h3>
          <p>₹${product.price} each</p>
          <p><strong>Subtotal:</strong> ₹${subtotal}</p>
          <div class="qty-controls">
            <button onclick="decreaseQty(${product.id})">-</button>
            <span>${item.quantity}</span>
            <button onclick="increaseQty(${product.id})">+</button>
            <button onclick="removeItem(${product.id})">Remove</button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

function openProduct(productId) {
  const product = products.find(p => p.id === productId);
  modalBody.innerHTML = `
    <div class="modal-grid">
      <img src="${product.image}" alt="${product.name}">
      <div>
        <h2>${product.name}</h2>
        <p>${product.category}</p>
        <p>${product.description}</p>
        <p class="price">₹${product.price}</p>
        <button class="btn" onclick="addToCart(${product.id})">Add to Cart</button>
      </div>
    </div>
  `;
  modal.classList.remove("hidden");
}

closeModalBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.classList.add("hidden");
});

searchInput.addEventListener("input", (e) => {
  const term = e.target.value.toLowerCase();
  const filtered = products.filter(product =>
    product.name.toLowerCase().includes(term) ||
    product.category.toLowerCase().includes(term) ||
    product.description.toLowerCase().includes(term)
  );
  renderProducts(filtered);
});

clearCartBtn.addEventListener("click", clearCart);

checkoutForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (cart.length === 0) {
    orderMessage.textContent = "Your cart is empty.";
    return;
  }
  const name = document.getElementById("name").value;
  orderMessage.textContent = `Thank you, ${name}. Your order has been placed successfully!`;
  clearCart();
  checkoutForm.reset();
});

renderProducts();
renderCart();