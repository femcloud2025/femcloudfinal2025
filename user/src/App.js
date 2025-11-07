import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SavedPage from "./pages/SavedPage";
import { getAllProducts } from "./api/productApi";
export default function App() {
  const [allProducts, setAllProducts] = useState([]);
  useEffect(() => {
    getAllProducts().then(setAllProducts);
  }, []);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/home" element={<HomePage allProducts={allProducts} setAllProducts={setAllProducts} />} />
        <Route path="/saved" element={<SavedPage allProducts={allProducts} />} />
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </BrowserRouter>
  );
}
