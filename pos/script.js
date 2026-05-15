// USERS
let users = [
  { username: "admin", password: "admin123", role: "admin" },
  { username: "user", password: "user123", role: "user" }
];

let currentUser = null;

// LOGIN
function login() {
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;

  let user = users.find(u => u.username === username && u.password === password);

  if (!user) return alert("Invalid login!");

  currentUser = user;

  document.getElementById("login-screen").style.display = "none";
  document.querySelector(".overlay").style.display = "block";

  // 👇 SHOW ROLE BADGE
  let roleText = currentUser.role === "admin" ? "ADMIN" : "USER";
  document.getElementById("user-role").innerText = "👤 " + roleText;

  displayProducts();
  updateDailySalesDisplay();
}

// PRODUCTS
let products = JSON.parse(localStorage.getItem("products")) || [
  { id: 1, name: "Acoustic Guitar", price: 5000, stock: 5, img: "https://icons.iconarchive.com/icons/pictogrammers/material/128/guitar-acoustic-icon.png" },
  { id: 2, name: "Electric Guitar", price: 8000, stock: 3, img: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3b8.svg" },
  { id: 3, name: "Bass Guitar", price: 7500, stock: 3, img: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3b8.svg" },
  { id: 4, name: "Keyboard Piano", price: 7000, stock: 4, img: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3b9.svg" },
  { id: 5, name: "Drum Set", price: 12000, stock: 2, img: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f941.svg" },
  { id: 6, name: "Violin", price: 4000, stock: 6, img: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3bb.svg" },
  { id: 7, name: "Microphone", price: 2000, stock: 8, img: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3a4.svg" }
];

let cart = [];
let today = new Date().toLocaleDateString();
let salesData = JSON.parse(localStorage.getItem("sales")) || {};

function saveProducts() {
  localStorage.setItem("products", JSON.stringify(products));
}

function updateDailySalesDisplay() {
  document.getElementById("daily-sales").innerText = salesData[today] || 0;
}

// DISPLAY PRODUCTS
function displayProducts() {
  let list = document.getElementById("product-list");
  list.innerHTML = "";

  products.forEach(p => {
    list.innerHTML += `
      <div class="product-card">
        <img src="${p.img}">
        <h4>${p.name}</h4>
        <p>₱${p.price}</p>
        <p>Stock: ${p.stock}
          ${p.stock === 0 ? "<span style='color:red;'>❌ OUT OF STOCK</span>" : ""}
          ${p.stock > 0 && p.stock <= 3 ? "<span style='color:orange;'>⚠️ LOW STOCK</span>" : ""}
        </p>
        <button onclick="addToCart(${p.id})">Add</button>
        ${currentUser.role === "admin" ? `<button onclick="restock(${p.id})">➕ Stock</button>` : ""}
      </div>
    `;
  });
}

// RESTOCK
function restock(id) {
  if (!currentUser || currentUser.role !== "admin") {
    return alert("Only admin can restock!");
  }

  let amount = prompt("Enter quantity to add:");
  if (!amount || amount <= 0) return;

  let product = products.find(p => p.id === id);
  product.stock += parseInt(amount);

  saveProducts();
  displayProducts();
}

// CART
function addToCart(id) {
  let product = products.find(p => p.id === id);
  if (product.stock <= 0) return alert("Out of stock!");

  let item = cart.find(c => c.id === id);
  if (item) item.qty++;
  else cart.push({ ...product, qty: 1 });

  product.stock--;
  saveProducts();
  updateCart();
  displayProducts();
}

function updateCart() {
  let list = document.getElementById("cart-list");
  let total = 0;
  list.innerHTML = "";

  cart.forEach(item => {
    total += item.price * item.qty;

    list.innerHTML += `
      <li>
        ${item.name}<br>
        ₱${item.price * item.qty}<br>
        <button onclick="changeQty(${item.id}, -1)">-</button>
        ${item.qty}
        <button onclick="changeQty(${item.id}, 1)">+</button>
      </li>
    `;
  });

  document.getElementById("total").innerText = total;
}

function changeQty(id, change) {
  let item = cart.find(c => c.id === id);
  let product = products.find(p => p.id === id);

  if (change === 1 && product.stock > 0) {
    item.qty++;
    product.stock--;
  } else if (change === -1) {
    item.qty--;
    product.stock++;
    if (item.qty <= 0) cart = cart.filter(c => c.id !== id);
  }

  saveProducts();
  updateCart();
  displayProducts();
}

// CHECKOUT
function checkout() {
  let total = parseInt(document.getElementById("total").innerText);
  let cash = parseInt(document.getElementById("cash").value);

  if (!cash || cash < total) return alert("Not enough cash!");

  let change = cash - total;
  document.getElementById("change").innerText = "Change: ₱" + change;

  if (!salesData[today]) salesData[today] = 0;
  salesData[today] += total;
  localStorage.setItem("sales", JSON.stringify(salesData));

  updateDailySalesDisplay();
  generateReceipt(total, cash, change);

  cart = [];
  updateCart();
}

// RECEIPT
function generateReceipt(total, cash, change) {
  let receipt = document.getElementById("receipt");
  let content = document.getElementById("receipt-content");

  let items = cart.map(i => `
    ${i.name} x${i.qty}<br>
    ₱${i.price * i.qty}
  `).join("<br>");

  content.innerHTML = `
    <center><b>MUSIC STORE</b></center>
    <br>
    ${items}
    <br>------------------------
    <br>TOTAL: ₱${total}
    <br>CASH: ₱${cash}
    <br>CHANGE: ₱${change}
    <br>------------------------
    <br><center>Thank you! 🎵<br>${new Date().toLocaleString()}</center>
  `;

  receipt.classList.remove("hidden");
}

function printReceipt() {
  setTimeout(() => {
    window.print();
  }, 300);
}

// NEW TRANSACTION
function newTransaction() {
  cart = [];
  document.getElementById("cash").value = "";
  document.getElementById("change").innerText = "";
  document.getElementById("receipt").classList.add("hidden");

  updateCart();
}

function logout() {
  let confirmLogout = confirm("Are you sure you want to logout?");
  if (!confirmLogout) return;

  currentUser = null;

  cart = [];
  document.getElementById("cart-list").innerHTML = "";
  document.getElementById("total").innerText = "0";
  document.getElementById("cash").value = "";
  document.getElementById("change").innerText = "";

  document.getElementById("receipt").classList.add("hidden");

  document.getElementById("login-screen").style.display = "flex";
  document.querySelector(".overlay").style.display = "none";

  document.getElementById("username").value = "";
  document.getElementById("password").value = "";

  // clear badge
  document.getElementById("user-role").innerText = "";
}

const params = new URLSearchParams(window.location.search);

if (params.get("from") === "portfolio") {
  console.log("Opened from portfolio");
}

function goBack() {
  window.location.href = "../index.html"; // adjust if needed
}