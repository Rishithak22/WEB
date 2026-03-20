// ═══════════════════════════════════════════════════════════
//  RedStore — main.js
//  Single JS file for the entire site.
//  Each section checks if its elements exist before running.
// ═══════════════════════════════════════════════════════════

// ─────────────────────────────────────────────
// SHARED: CART DATA  (available on every page)
// ─────────────────────────────────────────────
var CART_KEY = "redstore_cart";

var DEFAULT_ITEMS = [
  { id:1, name:"Red Printed T-Shirt", price:50,  qty:1, img:"Images/product-1.jpg" },
  { id:2, name:"Men Shoes by HRX",    price:90,  qty:1, img:"Images/product-2.jpg" },
  { id:4, name:"Blue Puma T-Shirt",   price:100, qty:1, img:"Images/product-4.jpg" }
];

function loadCart() {
  try {
    var stored = localStorage.getItem(CART_KEY);
    if (stored) {
      var parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch(e) {}
  var defaults = DEFAULT_ITEMS.map(function(i) {
    return { id:i.id, name:i.name, price:i.price, qty:i.qty, img:i.img };
  });
  saveCart(defaults);
  return defaults;
}

function saveCart(items) {
  try { localStorage.setItem(CART_KEY, JSON.stringify(items)); } catch(e) {}
}

var cartItems = loadCart();

// ─────────────────────────────────────────────
// SHARED: TOAST
// ─────────────────────────────────────────────
var toastTimer;
function showToast(msg) {
  var t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function() { t.classList.remove("show"); }, 2800);
}

// ─────────────────────────────────────────────
// SHARED: PRODUCT DATABASE
// ─────────────────────────────────────────────
var PRODUCTS = {
  1:  { id:1,  name:"Red Printed T-Shirt",   price:50,  category:"T-Shirt", stars:4,   img:"product-1.jpg",  desc:"A bold red printed t-shirt crafted from breathable cotton. Perfect for workouts or casual wear. Machine washable and long-lasting colour." },
  2:  { id:2,  name:"Men Shoes by HRX",       price:90,  category:"Shoes",   stars:4.5, img:"product-2.jpg",  desc:"High-performance training shoes by HRX with superior grip, cushioned insole and durable outsole. Ideal for gym and outdoor activities." },
  3:  { id:3,  name:"Track Pant",             price:50,  category:"Pants",   stars:4,   img:"product-3.jpg",  desc:"Comfortable cotton blend track pants with elastic waistband and side pockets. Great for morning jogs or lounging." },
  4:  { id:4,  name:"Blue Puma T-Shirt",      price:100, category:"T-Shirt", stars:4.5, img:"product-4.jpg",  desc:"Premium Puma t-shirt in vibrant blue. Moisture-wicking fabric keeps you cool during intense training sessions." },
  5:  { id:5,  name:"Casual Shoes",           price:80,  category:"Shoes",   stars:4,   img:"product-5.jpg",  desc:"Lightweight and stylish casual shoes suitable for everyday wear. Features a comfortable memory foam insole." },
  6:  { id:6,  name:"Black Puma T-Shirt",     price:70,  category:"T-Shirt", stars:4.5, img:"product-6.jpg",  desc:"Classic black Puma t-shirt — a wardrobe essential. Made from soft, breathable cotton with a slim fit." },
  7:  { id:7,  name:"Socks by HRX",           price:150, category:"Socks",   stars:4,   img:"product-7.jpg",  desc:"Pack of 6 premium HRX sports socks with arch support, moisture control and cushioned heel for all-day comfort." },
  8:  { id:8,  name:"Mens Watch By Fossil",   price:180, category:"Watch",   stars:4.5, img:"product-8.jpg",  desc:"Sophisticated Fossil watch with stainless steel case, scratch-resistant mineral glass and 50m water resistance." },
  9:  { id:9,  name:"Mens Watch by Roadster", price:150, category:"Watch",   stars:4,   img:"product-9.jpg",  desc:"Stylish Roadster analogue watch with a leather strap and minimalist dial. Perfect for both formal and casual occasions." },
  10: { id:10, name:"Shoes by HRX",           price:90,  category:"Shoes",   stars:4.5, img:"product-10.jpg", desc:"Performance running shoes by HRX with energy-return foam and breathable mesh upper. Built for speed and endurance." },
  11: { id:11, name:"Shoes by Roadster",      price:150, category:"Shoes",   stars:4,   img:"product-11.jpg", desc:"Versatile Roadster sneakers that pair well with both casuals and sportswear. Durable rubber sole for all terrains." },
  12: { id:12, name:"Track Pant by Nike",     price:80,  category:"Pants",   stars:4.5, img:"product-12.jpg", desc:"Nike Dri-FIT track pants with tapered fit, zip pockets and moisture-wicking technology. Training made comfortable." }
};

// ─────────────────────────────────────────────
// ALL PAGE INIT — runs after DOM is ready
// ─────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", function() {

  // ── 1. NAV TOGGLE ──
  var MenuItems = document.getElementById("MenuItems");
  if (MenuItems) MenuItems.style.maxHeight = "0px";

  // ── 2. ACCOUNT PAGE ──
  var LoginForm = document.getElementById("loginform");
  var RegForm   = document.getElementById("registerform");
  var Indicator = document.getElementById("indicator");

  // ── 3. DECIDE WHICH PAGE WE'RE ON AND INIT IT ──
  if (document.getElementById("productDetailRoot")) {
    initProductDetail();       // product-detail.html
  } else if (document.getElementById("cartBody")) {
    renderCart();              // cart.html
  } else if (document.getElementById("orderItemsList")) {
    initCheckout();            // checkout.html
  }

});

// ─────────────────────────────────────────────
// NAV TOGGLE  (called by onclick in HTML)
// ─────────────────────────────────────────────
function menutoggle() {
  var MenuItems = document.getElementById("MenuItems");
  if (!MenuItems) return;
  MenuItems.style.maxHeight = (MenuItems.style.maxHeight === "0px") ? "200px" : "0px";
}

// ─────────────────────────────────────────────
// ACCOUNT PAGE TOGGLE
// ─────────────────────────────────────────────
// ── Tab switching ──
  function showLogin() {
    document.getElementById("loginform").classList.remove("hidden");
    document.getElementById("loginform").classList.add("visible");
    document.getElementById("registerform").classList.remove("visible");
    document.getElementById("registerform").style.display = "none";
    document.getElementById("loginTab").classList.add("active-tab");
    document.getElementById("registerTab").classList.remove("active-tab");
    document.getElementById("tabSlider").classList.remove("right");
  }
 
  function showRegister() {
    document.getElementById("loginform").classList.add("hidden");
    document.getElementById("loginform").classList.remove("visible");
    document.getElementById("registerform").style.display = "block";
    setTimeout(function() {
      document.getElementById("registerform").classList.add("visible");
    }, 10);
    document.getElementById("registerTab").classList.add("active-tab");
    document.getElementById("loginTab").classList.remove("active-tab");
    document.getElementById("tabSlider").classList.add("right");
  }
 
  // Keep old function names working (called by main.js)
  function login()    { showLogin(); }
  function register() { showRegister(); }
 
  // ── Show/hide password ──
  function togglePw(inputId, icon) {
    var input = document.getElementById(inputId);
    if (input.type === "password") {
      input.type = "text";
      icon.classList.replace("fa-eye", "fa-eye-slash");
    } else {
      input.type = "password";
      icon.classList.replace("fa-eye-slash", "fa-eye");
    }
  }
 
  // ── Password strength checker ──
  function checkPasswordStrength(value) {
    var bar   = document.getElementById("pwBar");
    var label = document.getElementById("pwLabel");
    var strength = 0;
    if (value.length >= 6)                        strength++;
    if (value.length >= 10)                       strength++;
    if (/[A-Z]/.test(value))                      strength++;
    if (/[0-9]/.test(value))                      strength++;
    if (/[^A-Za-z0-9]/.test(value))              strength++;
 
    var pct    = (strength / 5) * 100;
    var colors = ["#e74c3c","#e67e22","#f1c40f","#2ecc71","#27ae60"];
    var labels = ["Very weak","Weak","Fair","Strong","Very strong"];
    bar.style.width      = pct + "%";
    bar.style.background = colors[strength - 1] || "#eee";
    label.textContent    = value.length > 0 ? labels[strength - 1] || "" : "";
    label.style.color    = colors[strength - 1] || "#999";
  }
 
  // ── Validation helper ──
  function showErr(id, show) {
    var el = document.getElementById(id);
    if (el) el.classList.toggle("show", show);
  }
 
  // ── Login submit ──
  function submitLogin(e) {
    e.preventDefault();
    var email = document.getElementById("loginEmail").value.trim();
    var pw    = document.getElementById("loginPassword").value;
    var ok    = true;
 
    var emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    showErr("loginEmailErr", !emailValid);
    if (!emailValid) ok = false;
 
    showErr("loginPwErr", pw.length === 0);
    if (pw.length === 0) ok = false;
 
    if (!ok) return;
 
    // Simulate login success (wire to backend here)
    showToastMsg("Login successful! Welcome back 👋");
    document.getElementById("loginEmail").value    = "";
    document.getElementById("loginPassword").value = "";
  }
 
  // ── Register submit ──
  function submitRegister(e) {
    e.preventDefault();
    var first   = document.getElementById("regFirst").value.trim();
    var last    = document.getElementById("regLast").value.trim();
    var email   = document.getElementById("regEmail").value.trim();
    var pw      = document.getElementById("regPassword").value;
    var confirm = document.getElementById("regConfirm").value;
    var terms   = document.getElementById("termsCheck").checked;
    var ok      = true;
 
    showErr("regNameErr",    !first || !last);
    if (!first || !last) ok = false;
 
    var emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    showErr("regEmailErr", !emailValid);
    if (!emailValid) ok = false;
 
    showErr("regPwErr", pw.length < 6);
    if (pw.length < 6) ok = false;
 
    showErr("regConfirmErr", pw !== confirm);
    if (pw !== confirm) ok = false;
 
    showErr("termsErr", !terms);
    if (!terms) ok = false;
 
    if (!ok) return;
 
    // Simulate registration success (wire to backend here)
    showToastMsg("Account created! Welcome to RedStore ✨");
    setTimeout(function() { showLogin(); }, 1500);
  }
 
  // ── Toast ──
  var toastTimer;
  function showToastMsg(msg) {
    var t = document.getElementById("toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function() { t.classList.remove("show"); }, 3000);
  }

// ═══════════════════════════════════════════════
// PRODUCT DETAIL PAGE
// ═══════════════════════════════════════════════
function renderStars(stars) {
  var html = "";
  for (var i = 1; i <= 5; i++) {
    if      (stars >= i)       html += '<i class="fa-solid fa-star" style="color:#ff523b"></i>';
    else if (stars >= i - 0.5) html += '<i class="fa-regular fa-star-half-stroke" style="color:#ff523b"></i>';
    else                       html += '<i class="fa-regular fa-star" style="color:#ff523b"></i>';
  }
  return html;
}

function getRelated(product, count) {
  var related = [];
  for (var key in PRODUCTS) {
    if (PRODUCTS[key].id !== product.id) related.push(PRODUCTS[key]);
  }
  related.sort(function(a, b) {
    return (a.category === product.category ? 0 : 1) - (b.category === product.category ? 0 : 1);
  });
  return related.slice(0, count);
}

function addToCart(productId) {
  var p = PRODUCTS[productId];
  if (!p) return;
  var existing = null;
  for (var i = 0; i < cartItems.length; i++) {
    if (cartItems[i].id === p.id) { existing = cartItems[i]; break; }
  }
  if (existing) {
    existing.qty += 1;
  } else {
    cartItems.push({ id:p.id, name:p.name, price:p.price, qty:1, img:"Images/" + p.img });
  }
  saveCart(cartItems);
  showToast('"' + p.name + '" added to cart');
}

function initProductDetail() {
  var root = document.getElementById("productDetailRoot");
  if (!root) return;

  // Read ?id= from URL
  var params  = new URLSearchParams(window.location.search);
  var id      = parseInt(params.get("id"), 10);
  var product = PRODUCTS[id];

  if (!product || isNaN(id)) {
    root.innerHTML =
      '<div style="text-align:center;padding:80px 20px">' +
        '<h2 style="color:#ff523b">Product not found</h2>' +
        '<p>The product you are looking for does not exist.</p>' +
        '<a href="product.html" style="color:#ff523b;font-weight:600">← Back to Products</a>' +
      '</div>';
    return;
  }

  document.title = product.name + " - RedStore";

  var mainImg     = "./Images/" + product.img;
  var related     = getRelated(product, 4);
  var relatedHTML = "";

  related.forEach(function(r) {
    relatedHTML +=
      '<div class="col-4">' +
        '<a href="product-detail.html?id=' + r.id + '" style="text-decoration:none;color:inherit;display:block">' +
          '<img src="./Images/' + r.img + '" alt="' + r.name + '" />' +
          '<h4>' + r.name + '</h4>' +
          '<p>$' + r.price + '.00</p>' +
        '</a>' +
      '</div>';
  });

  root.innerHTML =
    '<div class="small-container single-product">' +
      '<div class="row">' +
        '<div class="col-2">' +
          '<img src="' + mainImg + '" id="ProductImg" width="100%" />' +
          '<div class="small-img-row">' +
            '<div class="small-img-col"><img src="' + mainImg + '" class="small-img" width="100%" /></div>' +
            '<div class="small-img-col"><img src="' + mainImg + '" class="small-img" width="100%" /></div>' +
            '<div class="small-img-col"><img src="' + mainImg + '" class="small-img" width="100%" /></div>' +
            '<div class="small-img-col"><img src="' + mainImg + '" class="small-img" width="100%" /></div>' +
          '</div>' +
        '</div>' +
        '<div class="col-2">' +
          '<p><a href="index.html">Home</a> / ' + product.category + '</p>' +
          '<h1>' + product.name + '</h1>' +
          '<div class="rating">' + renderStars(product.stars) + '</div>' +
          '<h4>$' + product.price + '.00</h4>' +
          '<select>' +
            '<option value="">Select Size</option>' +
            '<option>XXL</option><option>XL</option><option>L</option>' +
            '<option>M</option><option>S</option><option>XS</option>' +
          '</select><br><br>' +
          '<button class="btn" onclick="addToCart(' + product.id + ')">Add To Cart</button>' +
          '<h3>Product Details</h3><br>' +
          '<p>' + product.desc + '</p>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div class="small-container">' +
      '<div class="row row-2">' +
        '<h2>Related Products</h2>' +
        '<a href="product.html">View More</a>' +
      '</div>' +
      '<div class="row">' + relatedHTML + '</div>' +
    '</div>';

  // Wire up thumbnail gallery AFTER HTML is injected into the DOM
  var pImg  = document.getElementById("ProductImg");
  var sImgs = document.getElementsByClassName("small-img");
  for (var i = 0; i < sImgs.length; i++) {
    (function(idx) {
      sImgs[idx].onclick = function() { pImg.src = sImgs[idx].src; };
    })(i);
  }
}

// ═══════════════════════════════════════════════
// CART PAGE
// ═══════════════════════════════════════════════
function renderCart() {
  var cartBody   = document.getElementById("cartBody");
  var cartTable  = document.getElementById("cartTable");
  var emptyDiv   = document.getElementById("emptyCart");
  var summaryDiv = document.getElementById("cartSummary");
  if (!cartBody || !cartTable) return;

  cartBody.innerHTML = "";

  if (cartItems.length === 0) {
    cartTable.style.display = "none";
    if (emptyDiv)   emptyDiv.style.display   = "block";
    if (summaryDiv) summaryDiv.style.display  = "none";
    return;
  }

  cartTable.style.display = "table";
  if (emptyDiv)   emptyDiv.style.display   = "none";
  if (summaryDiv) summaryDiv.style.display  = "block";

  cartItems.forEach(function(item, index) {
    var sub = (item.price * item.qty).toFixed(2);
    var tr  = document.createElement("tr");
    tr.innerHTML =
      '<td><div class="cart-product-cell">' +
        '<img src="' + item.img + '" alt="' + item.name + '" onerror="this.src=\'Images/product-1.jpg\'" />' +
        '<div class="cart-product-info"><h4>' + item.name + '</h4><p>$' + item.price.toFixed(2) + ' each</p></div>' +
      '</div></td>' +
      '<td><div class="qty-control">' +
        '<button onclick="changeQty(' + index + ',-1)">&#8722;</button>' +
        '<input type="number" min="1" value="' + item.qty + '" onchange="setQty(' + index + ',this.value)" />' +
        '<button onclick="changeQty(' + index + ',1)">+</button>' +
      '</div></td>' +
      '<td><strong>$' + sub + '</strong></td>' +
      '<td><button class="remove-btn" onclick="removeItem(' + index + ')">Remove</button></td>';
    cartBody.appendChild(tr);
  });

  updateCartSummary();
}

function removeItem(index) {
  if (index < 0 || index >= cartItems.length) return;
  var name = cartItems[index].name;
  cartItems.splice(index, 1);
  saveCart(cartItems);
  renderCart();
  showToast('"' + name + '" removed from cart');
}

function changeQty(index, delta) {
  if (index < 0 || index >= cartItems.length) return;
  var newQty = cartItems[index].qty + delta;
  if (newQty < 1) {
    if (confirm('Remove "' + cartItems[index].name + '" from cart?')) removeItem(index);
    return;
  }
  cartItems[index].qty = newQty;
  saveCart(cartItems);
  renderCart();
}

function setQty(index, value) {
  var qty = parseInt(value, 10);
  if (isNaN(qty) || qty < 1) { renderCart(); return; }
  cartItems[index].qty = qty;
  saveCart(cartItems);
  renderCart();
}

function updateCartSummary() {
  var subtotal = cartItems.reduce(function(s, i) { return s + i.price * i.qty; }, 0);
  var gst      = subtotal * 0.15;
  var shipping = (subtotal > 0 && subtotal < 100) ? 10 : 0;
  var total    = subtotal + gst + shipping;
  var el;
  el = document.getElementById("summarySubtotal"); if (el) el.textContent = "$" + subtotal.toFixed(2);
  el = document.getElementById("summaryGST");      if (el) el.textContent = "$" + gst.toFixed(2);
  el = document.getElementById("summaryShipping"); if (el) el.textContent = shipping === 0 ? "FREE" : "$" + shipping.toFixed(2);
  el = document.getElementById("summaryTotal");    if (el) el.textContent = "$" + total.toFixed(2);
}

function applyCouponCart() {
  var input = document.getElementById("couponInput");
  if (!input) return;
  var code = input.value.trim().toUpperCase();
  if      (code === "RED10") showToast("Coupon applied! 10% off");
  else if (code === "")      showToast("Please enter a coupon code");
  else                       showToast("Invalid coupon code");
}

function checkout() {
  if (cartItems.length === 0) { showToast("Your cart is empty!"); return; }
  window.location.href = "checkout.html";
}

// ═══════════════════════════════════════════════
// CHECKOUT PAGE
// ═══════════════════════════════════════════════
var couponApplied = false;
var activePayTab  = "card";

function initCheckout() {
  if (!document.getElementById("orderItemsList")) return;

  if (cartItems.length === 0) {
    var w = document.getElementById("checkoutWrapper");
    var e = document.getElementById("emptyCheckout");
    var s = document.getElementById("stepsBar");
    if (w) w.style.display = "none";
    if (e) e.style.display = "block";
    if (s) s.style.display = "none";
    return;
  }

  renderCheckoutItems();
  updateCheckoutTotals();
}

function renderCheckoutItems() {
  var list = document.getElementById("orderItemsList");
  if (!list) return;
  list.innerHTML = "";
  cartItems.forEach(function(item) {
    var div = document.createElement("div");
    div.className = "order-item";
    div.innerHTML =
      '<img src="' + item.img + '" alt="' + item.name + '" onerror="this.src=\'Images/product-1.jpg\'" />' +
      '<div class="order-item-info"><h4>' + item.name + '</h4><p>$' + item.price.toFixed(2) + ' x ' + item.qty + '</p></div>' +
      '<div class="order-item-price">$' + (item.price * item.qty).toFixed(2) + '</div>';
    list.appendChild(div);
  });
}

function updateCheckoutTotals() {
  var subtotal  = cartItems.reduce(function(s, i) { return s + i.price * i.qty; }, 0);
  var discount  = couponApplied ? subtotal * 0.10 : 0;
  var afterDisc = subtotal - discount;
  var gst       = afterDisc * 0.15;
  var shipping  = (subtotal > 0 && subtotal < 100) ? 10 : 0;
  var total     = afterDisc + gst + shipping;
  var el;
  el = document.getElementById("sumSubtotal");  if (el) el.textContent = "$" + subtotal.toFixed(2);
  el = document.getElementById("sumGST");       if (el) el.textContent = "$" + gst.toFixed(2);
  el = document.getElementById("sumShipping");  if (el) el.textContent = shipping === 0 ? "FREE" : "$" + shipping.toFixed(2);
  el = document.getElementById("sumTotal");     if (el) el.textContent = "$" + total.toFixed(2);
  el = document.getElementById("discountRow");  if (el) el.style.display = couponApplied ? "flex" : "none";
  el = document.getElementById("sumDiscount");  if (el) el.textContent = "-$" + discount.toFixed(2);
}

function applyCoupon() {
  var input = document.getElementById("couponInput");
  if (!input) return;
  var code = input.value.trim().toUpperCase();
  var msg  = document.getElementById("couponMsg");
  if (code === "RED10") {
    couponApplied = true;
    if (msg) { msg.textContent = "Coupon RED10 applied - 10% off!"; msg.className = "coupon-msg ok"; }
    updateCheckoutTotals();
  } else if (code === "") {
    if (msg) { msg.textContent = "Please enter a coupon code."; msg.className = "coupon-msg err"; }
  } else {
    couponApplied = false;
    if (msg) { msg.textContent = "Invalid coupon code."; msg.className = "coupon-msg err"; }
    updateCheckoutTotals();
  }
}

function switchPayTab(tab, el) {
  activePayTab = tab;
  document.querySelectorAll(".pay-tab").forEach(function(t)   { t.classList.remove("active"); });
  document.querySelectorAll(".pay-panel").forEach(function(p) { p.classList.remove("active"); });
  el.classList.add("active");
  var panel = document.getElementById("panel-" + tab);
  if (panel) panel.classList.add("active");
}

function formatCardNumber(input) {
  var v = input.value.replace(/\D/g, "").substring(0, 16);
  input.value = v.replace(/(.{4})/g, "$1 ").trim();
  var icon = document.getElementById("cardBrandIcon");
  if (!icon) return;
  if      (/^4/.test(v))     icon.innerHTML = '<i class="fa-brands fa-cc-visa" style="color:#1a1f71"></i>';
  else if (/^5/.test(v))     icon.innerHTML = '<i class="fa-brands fa-cc-mastercard" style="color:#eb001b"></i>';
  else if (/^3[47]/.test(v)) icon.innerHTML = '<i class="fa-brands fa-cc-amex" style="color:#2557d6"></i>';
  else                       icon.innerHTML = '<i class="fa-regular fa-credit-card"></i>';
}

function formatExpiry(input) {
  var v = input.value.replace(/\D/g, "").substring(0, 4);
  if (v.length >= 2) v = v.substring(0, 2) + "/" + v.substring(2);
  input.value = v;
}

function requiredField(id) {
  var el = document.getElementById(id);
  if (!el) return true;
  var ok = el.value.trim() !== "";
  el.classList.toggle("error", !ok);
  return ok;
}

function validateCheckoutForm() {
  var ok = true;
  ok = requiredField("firstName") && ok;
  ok = requiredField("lastName")  && ok;
  ok = requiredField("email")     && ok;
  ok = requiredField("phone")     && ok;
  ok = requiredField("addr1")     && ok;
  ok = requiredField("city")      && ok;
  ok = requiredField("state")     && ok;
  ok = requiredField("pin")       && ok;
  if (activePayTab === "card") {
    var cn = document.getElementById("cardNumber");
    if (cn) { var ok2 = cn.value.replace(/\s/g,"").length === 16; cn.classList.toggle("error", !ok2); if (!ok2) ok = false; }
    ok = requiredField("cardName")   && ok;
    ok = requiredField("cardExpiry") && ok;
    ok = requiredField("cardCvv")    && ok;
  } else if (activePayTab === "upi") {
    var up = document.getElementById("upiId");
    if (up) { var ok3 = up.value.trim().indexOf("@") > -1; up.classList.toggle("error", !ok3); if (!ok3) ok = false; }
  } else if (activePayTab === "netbanking") {
    ok = requiredField("bankSelect") && ok;
  }
  return ok;
}

function placeOrder() {
  if (!validateCheckoutForm()) {
    showToast("Please fill in all required fields");
    var firstErr = document.querySelector("input.error, select.error");
    if (firstErr) firstErr.scrollIntoView({ behavior:"smooth", block:"center" });
    return;
  }
  var orderId = "#RS" + Math.floor(100000 + Math.random() * 900000);
  var emailEl = document.getElementById("email");
  var email   = emailEl ? emailEl.value.trim() : "";

  cartItems = [];
  saveCart(cartItems);

  var wrapper   = document.getElementById("checkoutWrapper");
  var confirmed = document.getElementById("orderConfirmed");
  var stepsBar  = document.getElementById("stepsBar");
  if (wrapper)   wrapper.style.display   = "none";
  if (confirmed) confirmed.style.display = "block";

  var o = document.getElementById("confirmedOrderId");
  var m = document.getElementById("confirmedEmail");
  if (o) o.textContent = orderId;
  if (m) m.textContent = email;

  var s2 = document.getElementById("step2");
  var s3 = document.getElementById("step3");
  if (s2) { s2.classList.remove("active"); s2.classList.add("done"); }
  if (s3) s3.classList.add("active");
  if (stepsBar) stepsBar.style.display = "flex";

  window.scrollTo({ top:0, behavior:"smooth" });
}