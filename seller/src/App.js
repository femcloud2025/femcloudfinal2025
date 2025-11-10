import React, { useState, useEffect, useCallback } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import axios from "axios";
import SellerProfilePage from "./pages/SellerProfilePage";
import SellerLogin from "./SellerLogin";
import Navbar from "./Navbar";
import ProductForm from "./ProductForm";
import ProductList from "./ProductList";

const backendUrl = "http://localhost:4000/api/seller/product";

const ProtectedRoute = ({ token }) => {
  const location = useLocation();
  if (!token) return <Navigate to="/login" state={{ from: location }} replace />;
  return <Outlet />;
};

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("sellerToken"));
  const [sellerId, setSellerId] = useState(() => {
    const id = localStorage.getItem("sellerId");
    console.log("Initial sellerId from localStorage:", id);
    return id;
  });
  const [products, setProducts] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    whatsappNumber: "",
  });

  useEffect(() => {
    console.log("Current sellerId:", sellerId);
    console.log("Current token:", token);
  }, [sellerId, token]);

  const fetchProducts = useCallback(async () => {
    if (!token || !sellerId) {
      console.log("Cannot fetch products: missing token or sellerId");
      return;
    }
    
    try {
      console.log("Fetching products for seller:", sellerId);
      const res = await axios.post(
        `${backendUrl}/list/${sellerId}`,
        {},
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          } 
        }
      );
      console.log("Products API response:", res.data);
      
      const productsData = res.data.data || res.data || [];
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (err) {
      console.error("Error fetching products:", err);
      console.error("Error details:", err.response?.data);
      setProducts([]);
    }
  }, [token, sellerId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const onLogin = (tok, id) => {
    console.log("Login received - token:", tok, "sellerId:", id);
    
    if (!id || id === "undefined") {
      console.error("Invalid sellerId received during login:", id);
      alert("Login failed: Invalid seller ID");
      return;
    }
    
    setToken(tok);
    setSellerId(id);
    localStorage.setItem("sellerToken", tok);
    localStorage.setItem("sellerId", id);
    
    setForm({
      name: "",
      description: "",
      price: "",
      category: "",
      whatsappNumber: "",
    });
  };

  const onLogout = () => {
    localStorage.removeItem("sellerToken");
    localStorage.removeItem("sellerId");
    localStorage.removeItem("sellerName");
    setToken(null);
    setSellerId(null);
    setProducts([]);
    setEditingIndex(null);
    setEditingProductId(null);
    setForm({
      name: "",
      description: "",
      price: "",
      category: "",
      whatsappNumber: "",
    });
  };

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onEditProduct = (product, index) => {
    setEditingIndex(index);
    setEditingProductId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      whatsappNumber: product.whatsappNumber || "",
    });
  };

  const onSubmitProduct = async (formData) => {
    try {
      console.log("Submitting product data...");
      console.log("Current sellerId:", sellerId);
      
      if (!sellerId || sellerId === "undefined") {
        alert("Error: Invalid seller ID. Please log in again.");
        return;
      }

      // Create clean FormData to avoid duplication
      const cleanFormData = new FormData();
      for (let [key, value] of formData.entries()) {
        if (key !== "sellerId" && key !== "seller") {
          cleanFormData.append(key, value);
        }
      }
      cleanFormData.append("sellerId", sellerId);

      if (editingIndex !== null && editingProductId) {
        // Include product ID in URL, not FormData
      }

      console.log("Clean FormData contents:");
      for (let [key, value] of cleanFormData.entries()) {
        console.log(key + ": " + value);
      }

      const url = editingIndex !== null 
        ? `${backendUrl}/update/${editingProductId}` 
        : `${backendUrl}/add`;

      const response = await axios.post(url, cleanFormData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          // Let axios set Content-Type for FormData
        },
      });

      console.log("Product saved successfully:", response.data);
      
      setEditingIndex(null);
      setEditingProductId(null);
      setForm({
        name: "",
        description: "",
        price: "",
        category: "",
        whatsappNumber: "",
      });
      
      fetchProducts();
      
      alert(editingIndex !== null ? "Product updated successfully!" : "Product added successfully!");
    } catch (error) {
      console.error("Product save failed:", error);
      console.error("Error response:", error.response?.data);
      
      if (error.response?.data?.errors) {
        alert(`Validation Error: ${JSON.stringify(error.response.data.errors)}`);
      } else if (error.response?.data?.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert(`Error: ${error.message}`);
      }
    }
  };

  const onDeleteProduct = async (index) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }
    try {
      const productId = products[index]._id;
      console.log("Deleting product:", productId);
      
      await axios.post(
        `${backendUrl}/delete`,
        { id: productId },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          } 
        }
      );
      
      alert("Product deleted successfully!");
      fetchProducts();
    } catch (error) {
      console.error("Delete failed:", error);
      console.error("Error response:", error.response?.data);
      alert(`Delete failed: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingProductId(null);
    setForm({
      name: "",
      description: "",
      price: "",
      category: "",
      whatsappNumber: "",
    });
  };

  return (
    <Router>
      {token && <Navbar onLogout={onLogout} />}
      <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
        <Routes>
          <Route
            path="/"
            element={<Navigate to={token ? "/products" : "/login"} replace />}
          />
          <Route
            path="/login"
            element={
              token ? (
                <Navigate to="/products" replace />
              ) : (
                <SellerLogin onLogin={onLogin} />
              )
            }
          />
          <Route element={<ProtectedRoute token={token} />}>
            <Route
              path="/products"
              element={
                <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow">
                  <h1 className="text-3xl font-bold mb-6 text-gray-800">
                    Manage Products
                  </h1>
                  {sellerId && (
                    <div className="mb-4 p-3 bg-blue-50 rounded border border-blue-200">
                      <p className="text-sm text-blue-700">
                        <strong>Seller ID:</strong> {sellerId}
                      </p>
                      <p className="text-sm text-blue-600 mt-1">
                        <strong>Status:</strong> {editingIndex !== null ? "Editing Product" : "Adding New Product"}
                      </p>
                    </div>
                  )}
                  <ProductForm
                    form={form}
                    onChange={onChange}
                    onSubmit={onSubmitProduct}
                    onCancel={handleCancelEdit}
                    editing={editingIndex !== null}
                  />
                  <ProductList
                    products={products}
                    onEdit={onEditProduct}
                    onDelete={onDeleteProduct}
                  />
                </div>
              }
            />
            <Route path="/profile" element={<SellerProfilePage />} />
            <Route path="*" element={<Navigate to="/products" replace />} />
          </Route>
          <Route
            path="*"
            element={<Navigate to={token ? "/products" : "/login"} replace />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
