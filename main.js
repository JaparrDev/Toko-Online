const WA = "6287888245468"; // ganti dengan nomor WhatsApp toko
const rp = (n) => "Rp " + n.toLocaleString("id-ID");
const prod = (id) => products.find((p) => p.id === id);
let cart = [];
try {
  cart = JSON.parse(localStorage.getItem("cartSepatu")) || [];
} catch (e) {}
const $ = (s) => document.querySelector(s);
const page = document.body.dataset.page;

/* Navigasi */
const nav = [
  ["index.html", "home", "Home"],
  ["produk.html", "produk", "Produk"],
  ["tentang.html", "tentang", "Tentang"],
  ["kontak.html", "kontak", "Kontak"],
];

/* Header */
document.body.insertAdjacentHTML(
  "afterbegin",
  `<header class="top"><a class="logo" href="index.html"><img src="img/LogoWEB/Header.png" alt="Hadi Store" width="85" height="65">Hadi Store</a>
<nav id="nav">${nav.map((n) => `<a href="${n[0]}"${page === n[1] ? ' aria-current="page"' : ""}>${n[2]}</a>`).join("")}</nav>
<button class="cartbtn" id="cartbtn">Keranjang <span id="count">0</span></button>
<button class="burger" id="burger" aria-label="Buka menu">Menu</button></header>`,
);

/* End */
document.body.insertAdjacentHTML(
  "beforeend",
  `<footer class="foot"><div class="wrap"><b>Hadi Store</b><span>Pembayaran: Transfer Bank, QRIS, COD</span><span>&copy; 2026</span></div></footer>
<aside id="drawer" class="drawer"><div class="dh"><b>Keranjang</b><button id="close">Tutup</button></div><div id="items"></div>
<div class="df"><p>Total <b id="total"></b></p><button class="btn" id="checkout">Pesan lewat WhatsApp</button></div></aside><div id="scrim" class="scrim"></div>`,
);

function draw() {
  localStorage.setItem("cartSepatu", JSON.stringify(cart));
  $("#count").textContent = cart.reduce((n, c) => n + c.qty, 0);
  $("#items").innerHTML = cart.length
    ? cart
        .map((c) => {
          const p = prod(c.id);
          return `<div class="ci"><div><b>${p.nama}</b><br><span class="mut">${rp(p.harga)}</span></div>
<div class="qty"><button data-chg="${c.id}" data-d="-1" aria-label="Kurangi">-</button><span>${c.qty}</span><button data-chg="${c.id}" data-d="1" aria-label="Tambah">+</button></div></div>`;
        })
        .join("")
    : `<p class="mut pad">Keranjang masih kosong. Pilih produk dulu.</p>`;
  $("#total").textContent = rp(
    cart.reduce((s, c) => s + prod(c.id).harga * c.qty, 0),
  );
}

const openCart = (o) => document.body.classList.toggle("open", o);
function add(id) {
  const i = cart.find((c) => c.id === id);
  i ? i.qty++ : cart.push({ id, qty: 1 });
  draw();
  openCart(true);
}
function change(id, d) {
  const i = cart.find((c) => c.id === id);
  i.qty += d;
  if (i.qty < 1) cart = cart.filter((c) => c !== i);
  draw();
}

document.addEventListener("click", (e) => {
  const a = e.target.closest("[data-add]"),
    c = e.target.closest("[data-chg]");
  if (a) add(+a.dataset.add);
  if (c) change(+c.dataset.chg, +c.dataset.d);
});
$("#cartbtn").onclick = () => openCart(true);
$("#close").onclick = $("#scrim").onclick = () => openCart(false);
$("#burger").onclick = () => $("#nav").classList.toggle("show");
$("#checkout").onclick = () => {
  if (!cart.length) return;
  const baris = cart.map(
    (c) => `- ${prod(c.id).nama} x${c.qty} = ${rp(prod(c.id).harga * c.qty)}`,
  );
  const total = cart.reduce((s, c) => s + prod(c.id).harga * c.qty, 0);
  window.open(
    `https://wa.me/${WA}?text=` +
      encodeURIComponent(
        `Halo, saya mau pesan:\n${baris.join("\n")}\n\nTotal: ${rp(total)}`,
      ),
    "_blank",
  );
};

const card = (
  p,
) => `<article class="card"><div class="thumb" style="background:${p.warna}">${p.foto ? `<img src="${p.foto}" alt="${p.nama}" loading="lazy" onerror="this.remove()">` : ""}<span>${p.size}</span></div>
<div class="cb"><h3>${p.nama}</h3><p class="mut">${p.desk}</p><div class="row"><b>${rp(p.harga)}</b><button class="btn sm" data-add="${p.id}">Tambah</button></div></div></article>`;

if ($("#featured"))
  $("#featured").innerHTML = products.slice(0, 4).map(card).join("");

if ($("#grid")) {
  const q = $("#q"),
    kat = $("#kat"),
    urut = $("#urut");
  kat.value = new URLSearchParams(location.search).get("k") || "";
  const render = () => {
    let l = products.filter(
      (p) =>
        (!kat.value || p.kategori === kat.value) &&
        p.nama.toLowerCase().includes(q.value.toLowerCase()),
    );
    if (urut.value)
      l.sort((a, b) =>
        urut.value === "murah" ? a.harga - b.harga : b.harga - a.harga,
      );
    $("#grid").innerHTML = l.map(card).join("");
    $("#kosong").hidden = l.length > 0;
  };
  [q, kat, urut].forEach((el) => el.addEventListener("input", render));
  render();
}

if ($("#form"))
  $("#form").onsubmit = (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    window.open(
      `https://wa.me/${WA}?text=` +
        encodeURIComponent(
          `Halo, saya ${f.get("nama")} (${f.get("email")}).\n${f.get("pesan")}`,
        ),
      "_blank",
    );
  };

document.querySelectorAll("[data-n]").forEach((el) => {
  const to = +el.dataset.n,
    t0 = performance.now();
  const step = (t) => {
    const k = Math.min((t - t0) / 1200, 1);
    el.textContent = Math.round(to * k);
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
});
draw();
