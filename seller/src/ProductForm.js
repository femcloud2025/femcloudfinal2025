import React, { useState, useEffect } from "react";

const ProductForm = ({ form, onChange, onSubmit, onCancel, editing }) => {
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl("");
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    console.log("File selected:", file);
    setImageFile(file || null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!form.name || !form.description || !form.price || !form.category || !form.whatsappNumber) {
      alert("Please fill all required fields");
      return;
    }

    // For new products, image is required
    if (!editing && !imageFile) {
      alert("Please select an image for the product");
      return;
    }

    const data = new FormData();
    data.append("name", form.name);
    data.append("description", form.description);
    data.append("price", form.price);
    data.append("category", form.category);
    data.append("whatsappNumber", form.whatsappNumber);
    data.append("sellerId", form.sellerId);
    console.log("ImageFile before submit:", imageFile);

    if (imageFile) {
      // Use field name "image" to match backend multer config
      data.append("image", imageFile);
    }

    onSubmit(data);

    setImageFile(null);
    setPreviewUrl("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 space-y-4 bg-gray-50 p-6 rounded border">
      <input
        type="text"
        name="name"
        placeholder="Product Name *"
        value={form.name}
        onChange={onChange}
        required
        className="w-full border rounded p-3"
      />
      <textarea
        name="description"
        placeholder="Description *"
        value={form.description}
        onChange={onChange}
        required
        rows={3}
        className="w-full border rounded p-3"
      />
      <input
        type="number"
        name="price"
        placeholder="Price *"
        value={form.price}
        onChange={onChange}
        required
        min="0"
        step="0.01"
        className="w-full border rounded p-3"
      />
      <select
        name="category"
        value={form.category}
        onChange={onChange}
        required
        className="w-full border rounded p-3"
      >
        <option value="">Select Category *</option>
        <option value="Electronics">Electronics</option>
        <option value="Fashion">Fashion</option>
        <option value="Home & Kitchen">Home & Kitchen</option>
        <option value="Beauty & Personal Care">Beauty & Personal Care</option>
        <option value="Books">Books</option>
        <option value="Stationary">Stationary</option>
        <option value="Sports & Fitness">Sports & Fitness</option>
        <option value="Toys & Games">Toys & Games</option>
        <option value="Grocery">Grocery</option>
        <option value="Other">Other</option>
      </select>
      <input
        type="tel"
        name="whatsappNumber"
        placeholder="WhatsApp Number *"
        value={form.whatsappNumber}
        onChange={onChange}
        required
        className="w-full border rounded p-3"
      />
      <div>
        <label className="block mb-1 font-medium text-gray-700">
          Upload Image {!editing && "*"}
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required={!editing}
        />
        <p className="text-sm text-gray-500 mt-1">
          {editing ? "Select new image to update (optional)" : "Image is required"}
        </p>
      </div>
      {previewUrl && (
        <img 
          src={previewUrl} 
          alt="Preview" 
          className="w-24 h-24 object-cover rounded border mt-2" 
        />
      )}
      <div className="flex gap-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          {editing ? "Update Product" : "Add Product"}
        </button>
        {editing && (
          <button
            type="button"
            onClick={onCancel}
            className="border px-6 py-2 rounded hover:bg-gray-100 transition"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ProductForm;
