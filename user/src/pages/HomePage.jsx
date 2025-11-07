import React, { useEffect, useState } from "react";
import { getAllProducts } from "../api/productApi";
import ProductCard from "../components/ProductCard";
import CategorySelect from "../components/CategorySelect";
import ExpandedDrawer from "../components/ExpandedDrawer";

function getSavedProducts() {
  return JSON.parse(localStorage.getItem("savedProducts") || "[]");
}
function setSavedProducts(arr) {
  localStorage.setItem("savedProducts", JSON.stringify(arr));
}

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [showDetails, setShowDetails] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [savedIds, setSavedIds] = useState(getSavedProducts());
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getAllProducts().then(setProducts);
    function sync() { setSavedIds(getSavedProducts()); }
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  // Save/Unsave logic
  function handleSaveOrUnsave(type, productId) {
    let arr = getSavedProducts();
    if (type === "save") {
      if (!arr.includes(productId)) arr.push(productId);
    } else if (type === "unsave") {
      arr = arr.filter(id => id !== productId);
    }
    setSavedProducts(arr);
    setSavedIds(arr);
  }

  // Filter by category and search term
  const filtered = products
    .filter(p => (category ? p.category === category : true))
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="pt-20 px-4 flex flex-col min-h-screen">
      <div className="flex flex-1 gap-4">
        {/* Category Selector */}
        <div className="hidden md:block md:w-1/5">
          <CategorySelect selected={category} onSelect={setCategory} />
        </div>

        {/* Main Section */}
        <div className="w-full md:w-4/5">
          {showDetails && (
            <div className="bg-blue-50 p-4 rounded mb-4">
              <div className="text-2xl font-bold text-blue-700">FEMCLOUD</div>
              <div>Empowering women entrepreneurs. Supported by <b>V.V.S Mahila Mandali</b>.</div>
            </div>
          )}
          <button
            className="mb-2 text-sm underline"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? "Hide details" : "Show details"}
          </button>
          {/* Search Bar */}
          <div className="mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search products by name..."
              className="w-full p-2 border rounded mb-4"
            />
            {/* Product List */}
            {category && filtered.length === 0 ? (
              <div className="font-semibold text-red-600">No product in this category.</div>
            ) : filtered.length === 0 && searchTerm ? (
              <div className="font-semibold text-red-600">No products match your search.</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
                {filtered.map(p =>
                  <ProductCard
                    key={p._id}
                    product={p}
                    onClick={() => setSelectedProduct(p)}
                    showSave={!savedIds.includes(p._id)}
                    showUnsave={savedIds.includes(p._id)}
                    onSaveOrUnsave={handleSaveOrUnsave}
                  />
                )}
              </div>
            )}
          </div>
          {/* Expanded Drawer */}
          {selectedProduct && (
            <ExpandedDrawer
              product={selectedProduct}
              products={products}
              onClose={() => setSelectedProduct(null)}
              onSaveOrUnsave={handleSaveOrUnsave}
              savedIds={savedIds}
            />
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 mb-4 text-center p-4 bg-gray-50 rounded-lg border-t border-blue-200">
        <div className="font-bold text-blue-700 text-lg mb-1">
          Want to become a seller on FEMCLOUD?
        </div>
        <div>
          Contact <span className="font-semibold">Vasavya Mahila Mandali</span>
        </div>
        <div>
          Email: <a
            href="mailto:vasavyamm@vasavya.org"
            className="underline text-blue-700"
            target="_blank"
            rel="noopener noreferrer"
          >
            vasavyamm@vasavya.org
          </a>
        </div>
        <div>
          Phone: <a
            href="tel:+91866470966"
            className="underline text-blue-700"
          >+91-866-470966</a>
        </div>
      </footer>
    </div>
  );
}
