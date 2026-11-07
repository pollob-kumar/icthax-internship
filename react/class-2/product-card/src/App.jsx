import Header from "./components/Header";
import ProductCard from "./components/ProductCard";
import Footer from "./components/Footer";
import "./App.css";

const products = [
  { id: 1, title: "Laptop", price: 75000, image: "https://picsum.photos/200?1" },
  { id: 2, title: "Mobile", price: 42000, image: "https://picsum.photos/200?2" },
  { id: 3, title: "Headphone", price: 5000, image: "https://picsum.photos/200?3" },
  { id: 4, title: "Watch", price: 35000, image: "https://picsum.photos/200?4" },
];

function App() {
  return (
    <div>
      <Header title="TechBazar Pro" />

      <main className="container">
        <h2>Amader Products</h2>
        <div className="grid">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              title={p.title}
              price={p.price}
              image={p.image}
            />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;