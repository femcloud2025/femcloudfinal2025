import React, { useState } from "react";
import axios from "axios";

const SellerLogin = ({ onLogin }) => {
  const [form, setForm] = useState({ sellerName: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("https://femcloudfinal2025.onrender.com/api/login/seller", {
        sellerName: form.sellerName,
        password: form.password,
      });

      console.log("Login response:", response.data); // Debug log

      if (response.data.success) {
        const { token, sellerId, sellerName } = response.data;
        
        // Validate that sellerId exists and is not undefined
        if (!sellerId) {
          setError("Login failed: No seller ID received from server");
          setLoading(false);
          return;
        }

        setSuccess("Login successful! Redirecting...");
        
        // Call onLogin with BOTH token and sellerId
        onLogin(token, sellerId);
        
        // Optional: You can remove the localStorage.setItem calls here
        // since onLogin should handle them, or keep them for redundancy
        localStorage.setItem("sellerToken", token);
        localStorage.setItem("sellerId", sellerId);
        localStorage.setItem("sellerName", sellerName);
        
      } else {
        setError(response.data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data?.message || "Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-green-100">
      <div className="bg-white p-10 rounded-xl shadow-2xl max-w-md w-full">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <img
              src="https://cdn-icons-png.flaticon.com/512/1041/1041916.png"
              alt="FemCloud Logo"
              className="h-14 w-14"
            />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800">
            FemCloud Seller Panel
          </h1>
          <p className="text-gray-500 mt-1">Login to manage your products</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="sellerName" className="block text-gray-700 mb-2 font-semibold">
              Seller Name
            </label>
            <input
              type="text"
              name="sellerName"
              id="sellerName"
              value={form.sellerName}
              onChange={onChange}
              required
              placeholder="Enter your seller name"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-400 outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 mb-2 font-semibold">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={form.password}
              onChange={onChange}
              required
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-400 outline-none"
            />
          </div>

          {/* Feedback */}
          {error && <p className="bg-red-100 text-red-700 border-l-4 border-red-500 p-3 rounded">{error}</p>}
          {success && <p className="bg-green-100 text-green-700 border-l-4 border-green-500 p-3 rounded">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 shadow-lg"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          © {new Date().getFullYear()} FemCloud • Empowering online sellers
        </p>
      </div>
    </div>
  );
};

export default SellerLogin;
