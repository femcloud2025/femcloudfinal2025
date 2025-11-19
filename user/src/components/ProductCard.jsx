import React, { useState } from "react";

export default function ProductCard({
  product,
  onClick,
  showSave,
  showUnsave,
  expanded,
  onSaveOrUnsave
}) {
  const [showQR, setShowQR] = useState(false);

  // Prefer seller's WhatsApp if it exists
  const sellerWhatsapp = product.seller?.whatsappNumber || product.whatsappNumber;
  const whatsappMessage = encodeURIComponent(
    `Hello, I'm interested in your product: ${product.name}`
  );
  const whatsappLink = sellerWhatsapp
    ? `https://api.whatsapp.com/send?phone=${sellerWhatsapp}&text=${whatsappMessage}`
    : null;

  // UPI Payment
  const sellerUPI = product.seller?.sellerUPIID;
  const upiQRUrl = sellerUPI
    ? `upi://pay?pa=${sellerUPI}&pn=${encodeURIComponent(
        product.seller.sellerName
      )}&am=${product.price}&cu=INR`
    : null;

  const qrImageURL = sellerUPI
    ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
        upiQRUrl
      )}`
    : null;

  return (
    <>
      <div
        onClick={onClick}
        className={`bg-white rounded shadow cursor-pointer p-3 hover:shadow-lg transition border border-gray-200
          ${expanded ? "w-full max-w-2xl mx-auto mb-8" : ""}`}
        style={expanded ? { minHeight: 250 } : {}}
      >
        <img
          src={product.image}
          alt={product.name}
          className={expanded ? "w-full h-64 object-cover rounded" : "w-full h-32 object-cover rounded"}
        />

        <div className="font-bold mt-2">{product.name}</div>
        <div className="text-green-800 font-semibold">₹{product.price}</div>

        {product.seller && (
          <div className="mt-2 text-sm text-gray-700">
            <div><span className="font-semibold">Seller:</span> {product.seller.sellerName}</div>
            <div><span className="font-semibold">Shop:</span> {product.seller.shopName}</div>
          </div>
        )}

        {(expanded && product.description) && (
          <div className="text-sm text-gray-600 mt-2">{product.description}</div>
        )}

        {/* Save/Unsave */}
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

        {/* Pay with UPI Button */}
        {sellerUPI && (
          <button
            className="mt-3 p-2 bg-purple-600 text-white rounded w-full font-semibold"
            onClick={e => {
              e.stopPropagation();
              setShowQR(true);
            }}
          >
            Pay with UPI
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

      {/* QR Modal */}
      {showQR && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-5 rounded shadow-lg text-center w-80">
            <h2 className="font-bold text-lg mb-3">Scan & Pay</h2>

            {qrImageURL && (
              <img src={qrImageURL} alt="UPI QR" className="mx-auto mb-3" />
            )}

            <p className="text-sm text-gray-600 mb-3">
              Pay the product amount via UPI.  
              After payment, send the **payment screenshot** to the seller on WhatsApp.
            </p>

            <button
              onClick={() => setShowQR(false)}
              className="mt-2 p-2 bg-gray-200 rounded w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
