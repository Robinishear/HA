// ✅ আপনার হোয়াটসঅ্যাপ নাম্বার সেট করা হয়েছে
const WHATSAPP_NUMBER = "8801947164074"; // আন্তর্জাতিক ফরম্যাটে (88 যুক্ত করে) দেয়া ভালো

const PRODUCTS = [
  {
    name: "HBC সেরা মিক্স আচার",
    package: "১ মাসের প্যাকেজ",
    description: "✨ ১০০% খাঁটি স্বাদ ও ফ্রি হোম ডেলিভারি",
    price: 250,
    image: "sera-achar.jpeg",
  },
];

function formatPrice(value) {
  return `৳${Number(value).toFixed(2)}`;
}

function renderProducts() {
  const productList = document.getElementById("productList");
  if (!productList) return;

  productList.innerHTML = PRODUCTS.map(
    (product, index) => `
      <label class="product">
        <input
          type="radio"
          name="product"
          value="${product.name}"
          data-price="${product.price}"
          data-image="${product.image}"
          data-package="${product.package}"
          data-description="${product.description}"
          ${index === 0 ? "checked" : ""}
        >
        <img src="public/${product.image}" alt="${product.name}" class="product-media">
        <div class="pinfo">
          <strong>${product.name} - ${product.package}</strong>
          <p class="pdesc">${product.description}</p>
          <span class="price">${formatPrice(product.price)}</span>
        </div>
      </label>
    `,
  ).join("");

  document.querySelectorAll('input[name="product"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      updatePreviewFromSelected();
      updateSelectedVisual();
    });
  });
}

function updatePreviewFromSelected() {
  const sel = document.querySelector('input[name="product"]:checked');
  if (!sel) return;
  const name = sel.value;
  const price = Number(sel.dataset.price || 0);
  const image = sel.dataset.image;

  const previewImg = document.getElementById("previewImg");
  const previewName = document.getElementById("previewName");
  const previewPrice = document.getElementById("previewPrice");
  const subtotalPrice = document.getElementById("subtotalPrice");
  const totalPrice = document.getElementById("totalPrice");
  const confirmBtn = document.getElementById("confirmBtn");

  let imgPath = image || "";
  if (imgPath) {
    if (
      !(
        imgPath.startsWith("/") ||
        imgPath.startsWith("http") ||
        imgPath.startsWith("public/")
      )
    ) {
      imgPath = `public/${imgPath}`;
    }
  }
  if (previewImg && imgPath) previewImg.src = imgPath;
  if (previewName) previewName.textContent = name;
  const formattedPrice = formatPrice(price);
  if (previewPrice) previewPrice.textContent = formattedPrice;
  if (subtotalPrice) subtotalPrice.textContent = formattedPrice;
  if (totalPrice) totalPrice.textContent = formattedPrice;
  if (confirmBtn)
    confirmBtn.textContent = `অর্ডার কনফার্ম করুন ${formattedPrice}`;
}

function updateSelectedVisual() {
  document.querySelectorAll("label.product").forEach((l) => {
    l.classList.remove("selected");
    const old = l.querySelectorAll(".check");
    old.forEach((n) => n.remove());
  });

  const sel = document.querySelector('input[name="product"]:checked');
  if (!sel) return;
  const parent = sel.closest("label.product");
  if (parent) {
    parent.classList.add("selected");
    const badge = document.createElement("span");
    badge.className = "check";
    badge.textContent = "✓";
    parent.appendChild(badge);
  }
}

// --- অর্ডার ফর্ম সাবমিট এবং হোয়াটসঅ্যাপে পাঠানো ---
document.getElementById("orderForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const customerName = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim().replace(/\s+/g, "");
  const address = document.getElementById("address").value.trim();
  const sel = document.querySelector('input[name="product"]:checked');

  if (!sel) return alert("দয়া করে একটি প্রোডাক্ট সিলেক্ট করুন");

  const phoneRegex = /^01[3-9][0-9]{8}$/;
  if (!phoneRegex.test(phone)) {
    alert("সঠিক ফোন নাম্বার দিন (যেমন: 017XXXXXXXX)");
    return;
  }

  const product = sel.value;
  const price = Number(sel.dataset.price || 0);
  const productPackage = sel.dataset.package || "";

  const msg = `🛍️ *নতুন অর্ডার রিকোয়েস্ট!*
----------------------------
👤 *নাম:* ${customerName}
📞 *ফোন:* ${phone}
📍 *ঠিকানা:* ${address}

📦 *প্রোডাক্ট:* ${product}
⚖️ *প্যাকেজ:* ${productPackage}
💰 *মোট বিল:* ${formatPrice(price)}
----------------------------
ধন্যবাদ!`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  
  window.open(url, "_blank");
});

renderProducts();
updatePreviewFromSelected();
updateSelectedVisual();