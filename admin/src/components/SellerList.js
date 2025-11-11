import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

function SellerList() {
  const [sellers, setSellers] = useState([]);
  const [form, setForm] = useState({
    sellerName: '',
    shopName: '',
    whatsapp: '',
    description: '',
    password: ''
  });

  const adminToken = localStorage.getItem('adminToken'); // your saved token

  // Load sellers on component mount
  const fetchSellers = useCallback(async () => {
    try {
      const res = await axios.get('https://femcloudfinal2025.onrender.com/api/seller/list', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });

      if (res.data.success) {
        setSellers(res.data.sellers);
      } else {
        console.error('Failed to fetch sellers:', res.data.message);
      }
    } catch (err) {
      console.error('Failed to fetch sellers:', err);
      alert('Error fetching sellers. Make sure you are logged in as admin.');
    }
  }, [adminToken]);

  useEffect(() => {
    fetchSellers();
  }, [fetchSellers]);

  // Add a new seller
  const addSeller = async (e) => {
    e.preventDefault();

    if (!form.sellerName || !form.shopName || !form.whatsapp || !form.description || !form.password) {
      return alert('All fields are required.');
    }

    const payload = {
      sellerName: form.sellerName,
      shopName: form.shopName,
      password: form.password,
      description: form.description,
      whatsappNumber: form.whatsapp
    };

    try {
      const res = await axios.post('https://femcloudfinal2025.onrender.com/api/seller/add', payload, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });

      if (res.status === 201) {
        alert('Seller added successfully!');
        setForm({ sellerName: '', shopName: '', whatsapp: '', description: '', password: '' });
        fetchSellers(); // reload the list
      }
    } catch (err) {
      console.error('Error adding seller:', err);
      alert(err.response?.data?.message || 'Error adding seller');
    }
  };

  // Delete a seller
  const deleteSeller = async (id) => {
    if (!window.confirm('Are you sure you want to delete this seller?')) return;

    try {
      const res = await axios.delete('https://femcloudfinal2025.onrender.com/api/seller/delete', {
        headers: { Authorization: `Bearer ${adminToken}` },
        data: { id }
      });

      if (res.status === 200) {
        alert('Seller deleted successfully!');
        fetchSellers();
      }
    } catch (err) {
      console.error('Error deleting seller:', err);
      alert(err.response?.data?.message || 'Error deleting seller');
    }
  };

  return (
    <div className="max-w-3xl mx-auto shadow-md rounded-lg bg-white p-8">
      <h2 className="text-2xl font-semibold mb-6 text-indigo-700 tracking-tight">Add New Seller</h2>
      <form onSubmit={addSeller} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <input
          type="text"
          placeholder="Seller Name"
          value={form.sellerName}
          onChange={e => setForm({ ...form, sellerName: e.target.value })}
          required
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Shop Name"
          value={form.shopName}
          onChange={e => setForm({ ...form, shopName: e.target.value })}
          required
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="WhatsApp Number"
          value={form.whatsapp}
          onChange={e => setForm({ ...form, whatsapp: e.target.value })}
          required
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          required
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          required
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="col-span-1 md:col-span-2 bg-indigo-600 text-white p-2 rounded"
        >
          Add Seller
        </button>
      </form>
      <h3 className="text-xl font-semibold mb-3">Sellers</h3>
      <table className="w-full text-left border">
        <thead>
          <tr>
            <th className="border px-2 py-1">Seller Name</th>
            <th className="border px-2 py-1">Shop Name</th>
            <th className="border px-2 py-1">WhatsApp</th>
            <th className="border px-2 py-1">Description</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sellers.map((seller) => (
            <tr key={seller._id}>
              <td className="border px-2 py-1">{seller.sellerName}</td>
              <td className="border px-2 py-1">{seller.shopName}</td>
              <td className="border px-2 py-1">{seller.whatsappNumber}</td>
              <td className="border px-2 py-1">{seller.description}</td>
              <td className="border px-2 py-1">
                <button
                  onClick={() => deleteSeller(seller._id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SellerList;
