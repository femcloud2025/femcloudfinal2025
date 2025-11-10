import React from "react";

const ProductList = ({ products, onEdit, onDelete }) => {
  if (!products.length) {
    return <p className="text-gray-500">No products added yet.</p>;
  }

  return (
    <ul className="space-y-6">
      {products.map((product, index) => (
        <li
          key={index}
          className="flex flex-col md:flex-row md:items-center gap-4 border rounded p-4 shadow-sm bg-white"
        >
          {/* Show single product image or "No Image" */}
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-24 h-24 object-cover rounded border"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-100 flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}

          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
            <p className="text-gray-600 mt-1">{product.description}</p>
            <p className="text-indigo-600 font-semibold mt-1">
              ₹{product.price}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => onEdit(product, index)}
              className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded text-white"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(index)}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ProductList;
