import React from "react";
const categories = [
  "", "Electronics", "Fashion", "Home & Kitchen", "Beauty & Personal Care",
  "Books", "Sports & Fitness", "Toys & Games", "Grocery","Stationary" ,"Other"
];

export default function CategorySelect({ selected, onSelect }) {
  return (
    <select
      className="border p-2 rounded w-full mb-4"
      value={selected}
      onChange={e => onSelect(e.target.value)}
    >
      {categories.map(cat => (
        <option key={cat} value={cat}>{cat ? cat : "Select Category"}</option>
      ))}
    </select>
  );
}
