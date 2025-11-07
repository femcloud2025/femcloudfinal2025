import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import ExpandedDrawer from "../components/ExpandedDrawer";

function getSavedProducts() {
  return JSON.parse(localStorage.getItem("savedProducts") || "[]");
}

function setSavedProducts(arr) {
  localStorage.setItem("savedProducts", JSON.stringify(arr));
}

export default function SavedPage({ allProducts }) {
  const [savedIds, setSavedIds] = useState(getSavedProducts());
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    function sync() { setSavedIds(getSavedProducts()); }
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  // Save/Unsave logic
  function handleSaveUnsave(type, productId) {
    let arr = getSavedProducts();
    if (type === "unsave") {
      arr = arr.filter(id => id !== productId);
      setSavedProducts(arr);
      setSavedIds(arr);
    }
    // (optional) Add save logic if desired
  }

  const savedProducts = allProducts.filter(p => savedIds.includes(p._id));

  return (
    <div className="pt-20 px-4">
      <h2 className="text-xl font-bold mb-4">Your Saved Products</h2>
      {savedProducts.length === 0
        ? <div>No saved products yet.</div>
        : <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {savedProducts.map(p =>
              <ProductCard
                key={p._id}
                product={p}
                onClick={() => setExpanded(p)}
                showUnsave={true}
                onSaveOrUnsave={handleSaveUnsave}
              />
            )}
          </div>
      }

      {/* Expanded Drawer */}
      {expanded && (
        <ExpandedDrawer
          product={expanded}
          products={savedProducts}
          onClose={() => setExpanded(null)}
        />
      )}
    </div>
  );
}
