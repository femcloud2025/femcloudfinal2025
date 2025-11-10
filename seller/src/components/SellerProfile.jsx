import React from "react";

const SellerProfile = ({ form, onChange, onSubmit, loading = false }) => (
  <form onSubmit={onSubmit} className="space-y-6">
    <div>
      <label htmlFor="sellerName" className="block text-gray-700 font-semibold mb-2">
        Seller Name
      </label>
      <input
        type="text"
        id="sellerName"
        name="sellerName"
        value={form.sellerName}
        disabled
        className="w-full bg-gray-100 border border-gray-300 rounded p-3 focus:outline-none cursor-not-allowed"
      />
    </div>
    <div>
      <label htmlFor="shopName" className="block text-gray-700 font-semibold mb-2">
        Shop Name
      </label>
      <input
        type="text"
        id="shopName"
        name="shopName"
        value={form.shopName}
        disabled
        className="w-full bg-gray-100 border border-gray-300 rounded p-3 focus:outline-none cursor-not-allowed"
      />
    </div>
    <div>
      <label htmlFor="description" className="block text-gray-700 font-semibold mb-2">
        Shop Description <span className="text-red-500">*</span>
      </label>
      <textarea
        id="description"
        name="description"
        value={form.description}
        onChange={onChange}
        required
        rows={4}
        className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
      />
    </div>
    <div>
      <label htmlFor="whatsappNumber" className="block text-gray-700 font-semibold mb-2">
        WhatsApp Number <span className="text-red-500">*</span>
      </label>
      <input
        type="tel"
        id="whatsappNumber"
        name="whatsappNumber"
        value={form.whatsappNumber}
        onChange={onChange}
        required
        pattern="^\+?[1-9]\d{1,14}$"
        className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
      />
      <p className="text-sm text-gray-500 mt-1">Include country code (e.g., +91 for India)</p>
    </div>
    <div>
      <label htmlFor="gstNumber" className="block text-gray-700 font-semibold mb-2">
        GST Number <span className="text-gray-500 text-sm">(Optional)</span>
      </label>
      <input
        type="text"
        id="gstNumber"
        name="gstNumber"
        value={form.gstNumber}
        onChange={onChange}
        className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
      />
    </div>
    <div>
      <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
        New Password <span className="text-gray-500 text-sm">(Leave blank to keep current password)</span>
      </label>
      <input
        type="password"
        id="password"
        name="password"
        value={form.password}
        onChange={onChange}
        minLength={6}
        className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
      />
      <p className="text-sm text-gray-500 mt-1">Minimum 6 characters</p>
    </div>
    <button
      type="submit"
      disabled={loading}
      className={`w-full text-white font-semibold py-3 px-6 rounded shadow transition ${
        loading 
          ? 'bg-gray-400 cursor-not-allowed' 
          : 'bg-green-600 hover:bg-green-700'
      }`}
    >
      {loading ? "Updating..." : "Update Profile"}
    </button>
  </form>
);

export default SellerProfile;
