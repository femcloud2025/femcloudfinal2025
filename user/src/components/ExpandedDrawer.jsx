import React from "react";
import ProductCard from "./ProductCard";
import RecommendationList from "./RecommendationList";

export default function ExpandedDrawer({ product, products, onClose, onSaveOrUnsave, savedIds }) {
  // Filter out the current product from recommendations
  const otherProducts = products.filter(p => p._id !== product._id);

  return (
    <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-xl shadow-2xl border-t-4 border-blue-200 z-50 p-6 max-h-[80vh] overflow-y-auto transition-all">
      <div className="flex justify-between items-center mb-4">
        <div className="text-lg font-bold text-blue-700">
          Product Details
        </div>
        <button
          className="hover:bg-gray-200 px-2 py-1 rounded underline"
          onClick={onClose}
        >
          Close
        </button>
      </div>
      {/* Expanded ProductCard */}
      <ProductCard
        product={product}
        expanded
        showSave={!savedIds?.includes(product._id)}
        showUnsave={savedIds?.includes(product._id)}
        onSaveOrUnsave={onSaveOrUnsave}
      />
      {/* Recommendations */}
      <RecommendationList
        sellerId={product.seller}
        products={otherProducts}
      />
    </div>
  );
}
