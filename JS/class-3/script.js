// Product data
const products = [
  { name: "Classic Shirt", cat: "shirt", price: 800, stock: true },
  { name: "Denim Pants", cat: "pants", price: 1200, stock: false },
  { name: "Running Shoes", cat: "shoes", price: 2500, stock: true },
  { name: "Formal Shirt", cat: "shirt", price: 1500, stock: true },
  { name: "Cargo Pants", cat: "pants", price: 1800, stock: true },
  { name: "Sneakers", cat: "shoes", price: 3200, stock: true },
  { name: "Polo Shirt", cat: "shirt", price: 900, stock: false },
];

let activeCat = "all";
let stockOnly = true;

const grid = document.getElementById("grid");
const countEl = document.getElementById("count");
const totalEl = document.getElementById("total");

function render() {
  // Filter + map (10% discount) + reduce (total)
  const list = products
    .filter((p) => (activeCat === "all" ? true : p.cat === activeCat))
    .filter((p) => (stockOnly ? p.stock : true))
    .map((p) => ({ ...p, discounted: Math.round(p.price * 0.9) }));

  const total = list.reduce((s, p) => s + (p.stock ? p.discounted : 0), 0);

  grid.innerHTML = list
    .map(
      (p) => `
    <div class="card ${p.stock ? "" : "out"}">
      <div class="cat">${p.stock ? "In Stock" : "Out"}</div>
      <h3>${p.name}</h3>
      <div class="price">
        <span class="old">৳${p.price}</span>৳${p.discounted}
      </div>
      ${p.stock ? "" : '<span class="out-badge">Out of stock</span>'}
    </div>
  `,
    )
    .join("");

  countEl.textContent = list.length;
  totalEl.textContent = "৳" + total;
}

// Wire buttons
document.querySelectorAll(".f").forEach((b) => {
  b.addEventListener("click", () => {
    document
      .querySelectorAll(".f")
      .forEach((x) => x.classList.remove("active"));
    b.classList.add("active");
    activeCat = b.dataset.f;
    render();
  });
});

document.getElementById("stock").addEventListener("change", (e) => {
  stockOnly = e.target.checked;
  render();
});

render();
