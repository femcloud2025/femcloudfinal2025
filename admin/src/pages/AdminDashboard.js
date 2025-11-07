import React from 'react';
import SellerList from '../components/SellerList';

function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-100 via-purple-100 to-pink-100 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-indigo-700 font-display">FemCloud Admin Panel</h1>
        <SellerList />
      </div>
    </div>
  );
}
export default AdminDashboard;
