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

const backendUrl = "https://femcloudfinal2025.onrender.com/api/seller/product";

const ProtectedRoute = ({ token }) => {
  const location = useLocation();
  return token ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
};

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("sellerToken"));
  const [sellerId, setSellerId] = useState(localStorage.getItem("sellerId"));
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    whatsappNumber: "",
  });

  const fetchProducts = useCallback(async () => {
    if (!token || !sellerId) return;
    try {
      const res = await axios.post(
        `${backendUrl}/list/${sellerId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = res.data?.data || [];
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching products:", err.response?.data || err.message);
    }
  }, [token, sellerId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const onLogin = (tok, id) => {
    if (!tok || !id) {
      alert("Login failed. Invalid credentials.");
      return;
    }
    localStorage.setItem("sellerToken", tok);
    localStorage.setItem("sellerId", id);
    setToken(tok);
    setSellerId(id);
    fetchProducts();
  };

  const onLogout = () => {
    localStorage.clear();
    setToken(null);
    setSellerId(null);
    setProducts([]);
    setEditingProduct(null);
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

  const onEditProduct = (product) => {
    setEditingProduct(product);
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
      const cleanFormData = new FormData();
      for (let [key, value] of formData.entries()) {
        cleanFormData.append(key, value);
      }
      cleanFormData.append("sellerId", sellerId);

      const url = editingProduct
        ? `${backendUrl}/update/${editingProduct._id}`
        : `${backendUrl}/add`;

      await axios.post(url, cleanFormData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(editingProduct ? "Product updated successfully!" : "Product added successfully!");
      setEditingProduct(null);
      setForm({
        name: "",
        description: "",
        price: "",
        category: "",
        whatsappNumber: "",
      });
      fetchProducts();
    } catch (err) {
      console.error("Error saving product:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Something went wrong.");
    }
  };

  const onDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.post(
        `${backendUrl}/delete`,
        { id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Product deleted successfully!");
      fetchProducts();
    } catch (err) {
      console.error("Delete failed:", err.response?.data || err.message);
      alert("Failed to delete product.");
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
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
              token ? <Navigate to="/products" replace /> : <SellerLogin onLogin={onLogin} />
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

                  <ProductForm
                    form={form}
                    onChange={onChange}
                    onSubmit={onSubmitProduct}
                    onCancel={handleCancelEdit}
                    editing={!!editingProduct}
                  />

                  <ProductList
                    products={products}
                    onEdit={onEditProduct}
                    onDelete={(index) => onDeleteProduct(products[index]._id)}
                  />
                </div>
              }
            />
            <Route path="/profile" element={<SellerProfilePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
