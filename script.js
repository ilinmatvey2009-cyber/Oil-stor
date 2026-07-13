// Каталог товаров
const products = [
  { id:1, name:"Mobil 1 5W-30", type:"synthetic", volume:1, price:1200, icon:"🛢️" },
  { id:2, name:"Mobil 1 5W-30", type:"synthetic", volume:4, price:4200, icon:"🛢️" },
  { id:3, name:"Castrol EDGE 5W-40", type:"synthetic", volume:1, price:1100, icon:"🛢️" },
  { id:4, name:"Castrol EDGE 5W-40", type:"synthetic", volume:4, price:3900, icon:"🛢️" },
  { id:5, name:"Shell Helix Ultra 5W-30", type:"synthetic", volume:4, price:4100, icon:"🛢️" },
  { id:6, name:"Shell Helix HX7 10W-40", type:"semi", volume:4, price:2600, icon:"🛢️" },
  { id:7, name:"Liqui Moly Top Tec 4200 5W-30", type:"synthetic", volume:5, price:5200, icon:"🛢️" },
  { id:8, name:"Liqui Moly MoS2 15W-40", type:"mineral", volume:4, price:2100, icon:"🛢️" },
  { id:9, name:"Роснефть Premium 5W-40", type:"semi", volume:4, price:1800, icon:"🛢️" },
  { id:10, name:"Роснефть Standard 10W-40", type:"mineral", volume:4, price:1400, icon:"🛢️" },
  { id:11, name:"Лукойл Genesis 5W-40", type:"synthetic", volume:4, price:2900, icon:"🛢️" },
  { id:12, name:"Total Quartz 9000 5W-40", type:"synthetic", volume:1, price:1050, icon:"🛢️" },
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const productGrid = document.getElementById("productGrid");
const filterType = document.getElementById("filterType");
const filterVolume = document.getElementById("filterVolume");
const sortPrice = document.getElementById("sortPrice");

const typeLabels = { synthetic:"Синтетика", semi:"Полусинтетика", mineral:"Минеральное" };

function renderProducts() {
  let list = [...products];

  if (filterType.value !== "all") list = list.filter(p => p.type === filterType.value);
  if (filterVolume.value !== "all") list = list.filter(p => p.volume == filterVolume.value);

  if (sortPrice.value === "asc") list.sort((a,b) => a.price - b.price);
  if (sortPrice.value === "desc") list.sort((a,b) => b.price - a.price);

  productGrid.innerHTML = list.map(p => `
    <div class="product-card">
      <div class="product-icon">${p.icon}</div>
      <h3>${p.name}</h3>
      <div class="product-meta">${typeLabels[p.type]} • ${p.volume} л</div>
      <div class="product-price">${p.price} ₽</div>
      <button class="add-btn" data-id="${p.id}">В корзину</button>
    </div>
  `).join("");

  document.querySelectorAll(".add-btn").forEach(btn => {
    btn.addEventListener("click", () => addToCart(Number(btn.dataset.id)));
  });
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty:1 });
  }
  saveCart();
  renderCart();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  saveCart();
  renderCart();
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function renderCart() {
  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const cartTotal = document.getElementById("cartTotal");

  const totalQty = cart.reduce((s,i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s,i) => s + i.qty * i.price, 0);

  cartCount.textContent = totalQty;
  cartTotal.textContent = totalPrice + " ₽";

  if (cart.length === 0) {
    cartItems.innerHTML = `<p class="empty-cart">Корзина пуста</p>`;
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div>
        <div>${item.name}</div>
        <div style="color:#888;font-size:0.8rem">${item.volume} л • ${item.price} ₽</div>
      </div>
      <div style="display:flex;align-items:center;gap:6px;">
        <button data-id="${item.id}" data-delta="-1">−</button>
        <span>${item.qty}</span>
        <button data-id="${item.id}" data-delta="1">+</button>
      </div>
    </div>
  `).join("");

  cartItems.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      changeQty(Number(btn.dataset.id), Number(btn.dataset.delta));
    });
  });
}

// Открытие/закрытие корзины
const cartPanel = document.getElementById("cartPanel");
const cartOverlay = document.getElementById("cartOverlay");

document.getElementById("cartBtn").addEventListener("click", () => {
  cartPanel.classList.add("active");
  cartOverlay.classList.add("active");
});
document.getElementById("cartClose").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

function closeCart() {
  cartPanel.classList.remove("active");
  cartOverlay.classList.remove("active");
}

document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Корзина пуста!");
    return;
  }
  alert("Заказ оформлен! Спасибо за покупку 🙌");
  cart = [];
  saveCart();
  renderCart();
  closeCart();
});

// Фильтры
[filterType, filterVolume, sortPrice].forEach(el => el.addEventListener("change", renderProducts));

renderProducts();
renderCart();
</script>