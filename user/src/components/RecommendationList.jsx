import React from "react";
import ProductCard from "./ProductCard";

export default function RecommendationList({ sellerId, products }) {
  // Note: seller is ObjectId, so compare product.seller equal to sellerId
  const recommended = products.filter(p => p.seller === sellerId);
  if (recommended.length === 0) return null;
  return (
    <div className="mt-6">
      <div className="font-bold text-md mb-2">Recommended from this Seller:</div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {recommended.map(product => (
          <ProductCard key={product._id} product={product} showSave={true} />
        ))}
      </div>
    </div>
  );
}
