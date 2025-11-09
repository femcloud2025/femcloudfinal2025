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

  // 🔹 Load sellers on component mount
  const fetchSellers = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/seller/list', {
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

  // 🔹 Add a new seller
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
      const res = await axios.post('http://localhost:4000/api/seller/add', payload, {
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

  // 🔹 Delete a seller
  const deleteSeller = async (id) => {
    if (!window.confirm('Are you sure you want to delete this seller?')) return;

    try {
      const res = await axios.delete('http://localhost:4000/api/seller/delete', {
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
        <div>
          <label className="block mb-1 text-gray-600">Seller Name</label>
          <input
            className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400"
            value={form.sellerName}
            onChange={e => setForm({ ...form, sellerName: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-600">Shop Name</label>
          <input
            className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400"
            value={form.shopName}
            onChange={e => setForm({ ...form, shopName: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-600">WhatsApp Number</label>
          <input
            className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400"
            value={form.whatsapp}
            onChange={e => setForm({ ...form, whatsapp: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-600">Shop Description</label>
          <textarea
            className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-600">Password</label>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>
        <div className="md:col-span-2 flex justify-end mt-2">
          <button
            type="submit"
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg transition"
          >
            Add Seller
          </button>
        </div>
      </form>

      <h3 className="text-xl font-semibold mb-3">Sellers</h3>
      <table className="w-full text-left border">
        <thead>
          <tr>
            <th className="p-2 border">Seller Name</th>
            <th className="p-2 border">Shop Name</th>
            <th className="p-2 border">WhatsApp</th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {sellers.map(s => (
            <tr key={s._id} className="hover:bg-gray-50">
              <td className="border p-2">{s.sellerName}</td>
              <td className="border p-2">{s.shopName}</td>
              <td className="border p-2">{s.whatsappNumber}</td>
              <td className="border p-2">{s.description}</td>
              <td className="border p-2">
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  onClick={() => deleteSeller(s._id)}
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
