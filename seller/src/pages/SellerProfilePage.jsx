import React, { useState, useEffect } from "react";
import SellerProfile from "../components/SellerProfile"; // <= the form component!
import axios from "axios";

const SellerProfilePage = () => {
  const [form, setForm] = useState({
    sellerName: "",
    shopName: "",
    description: "",
    whatsappNumber: "",
    gstNumber: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const token = localStorage.getItem("sellerToken");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:4000/api/seller/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setForm({
            sellerName: res.data.seller.sellerName || "",
            shopName: res.data.seller.shopName || "",
            description: res.data.seller.description || "",
            whatsappNumber: res.data.seller.whatsappNumber || "",
            gstNumber: res.data.seller.gstNumber || "",
            password: ""
          });
        } else {
          setMessage({ type: "error", text: res.data.message || "Failed to load profile" });
        }
      } catch (err) {
        setMessage({
          type: "error",
          text: "Could not fetch seller profile. Please try again later."
        });
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
    if (message.text) setMessage({ type: "", text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const updateData = {
        description: form.description,
        whatsappNumber: form.whatsappNumber,
        gstNumber: form.gstNumber
      };
      if (form.password.trim() !== "") updateData.password = form.password;

      const res = await axios.put(
        "http://localhost:4000/api/seller/profile",
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
      } else {
        setMessage({ type: "error", text: res.data.message || "Profile update failed" });
      }
      setForm((prev) => ({ ...prev, password: "" }));
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Server error: Could not update profile"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-800">Manage Your Profile</h1>
          <p className="text-gray-600 mt-2">Update your seller information and shop details</p>
        </div>
        {message.text && (
          <div className={`mb-6 p-4 border-l-4 rounded
            ${message.type === "success" ? "bg-green-100 border-green-500 text-green-700" : ""}
            ${message.type === "error" ? "bg-red-100 border-red-500 text-red-700" : ""}`
          }>
            {message.text}
          </div>
        )}
        <SellerProfile
          form={form}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={loading}
        />
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">📌 Important Notes</h3>
          <ul className="list-disc list-inside text-blue-800 space-y-1">
            <li>Your seller name and shop name cannot be changed</li>
            <li>WhatsApp number is used for customer communications</li>
            <li>Leave password field blank if you don’t want to change it</li>
            <li>GST number is optional but recommended for business sellers</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SellerProfilePage;
