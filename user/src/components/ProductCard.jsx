import React from "react";

export default function ProductCard({
  product,
  onClick,
  showSave,
  showUnsave,
  expanded,
  onSaveOrUnsave
}) {
  const whatsappMessage = encodeURIComponent(`Hello, I'm interested in your product: ${product.name}`);
  const whatsappLink =
    product.whatsappNumber
      ? `https://api.whatsapp.com/send?phone=${product.whatsappNumber}&text=${whatsappMessage}`
      : null;

  // Set image area height (can tweak for your UI, e.g. h-32 or h-64)
  const imageContainerClass = expanded
    ? "w-full h-64 rounded bg-gray-100 flex items-center justify-center overflow-hidden"
    : "w-full h-32 rounded bg-gray-100 flex items-center justify-center overflow-hidden";

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded shadow cursor-pointer p-3 hover:shadow-lg transition border border-gray-200
        ${expanded ? "w-full max-w-2xl mx-auto mb-8" : ""}`}
      style={expanded ? { minHeight: 250 } : {}}
    >
      {/* Fixed size container for image */}
      <div className={imageContainerClass}>
        <img
          src={product.image}
          alt={product.name}
          className="max-w-full max-h-full object-contain"
        />
      </div>

      {/* Product details */}
      <div className="mt-4">
        <div className="font-bold">{product.name}</div>
        <div className="text-green-800 font-semibold">{product.price}</div>
        {/* Seller Details */}
      {product.seller && (
        <div className="mt-2 text-sm text-gray-700">
          <div>
            <span className="font-semibold">Seller:</span> {product.seller.sellerName}
          </div>
          <div>
            <span className="font-semibold">Shop:</span> {product.seller.shopName}
          </div>
        </div>
      )}
        {(expanded && product.description) && (
          <div className="text-sm text-gray-600 mt-2">{product.description}</div>
        )}
      </div>

      {/* Save/Unsave Buttons */}
      {showSave && (
        <button
          className="mt-2 p-1 bg-blue-50 text-blue-700 rounded"
          onClick={e => { e.stopPropagation(); onSaveOrUnsave("save", product._id); }}
        >
          Save
        </button>
      )}
      {showUnsave && (
        <button
          className="mt-2 p-1 bg-red-50 text-red-700 rounded"
          onClick={e => { e.stopPropagation(); onSaveOrUnsave("unsave", product._id); }}
        >
          Unsave
        </button>
      )}

      {/* WhatsApp Button */}
      {whatsappLink && (
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 block p-1 bg-green-50 text-green-700 rounded text-center font-bold"
          onClick={e => e.stopPropagation()}
        >
          Contact Seller on WhatsApp
        </a>
      )}
    </div>
  );
}
