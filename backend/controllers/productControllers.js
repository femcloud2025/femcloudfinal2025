


import productModel from "../models/productModel.js";
import cloudinary from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

// Load env vars (make sure dotenv is called in project entry if not here)
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const addProduct = async (req, res) => {
  try {
    console.log("== ADD PRODUCT DEBUG ==");
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);

    // Extract fields - handle both seller and sellerId
    const { name, description, price, category, whatsappNumber, sellerId, seller } = req.body;

    // Determine the actual seller ID (handle both field names)
    const actualSellerId = sellerId || seller;
    
    console.log("Extracted sellerId:", sellerId);
    console.log("Extracted seller:", seller);
    console.log("Actual sellerId to use:", actualSellerId);

    // Validation
    if (!name || !description || !price || !category || !whatsappNumber || !actualSellerId) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required field(s)",
        missing: {
          name: !name,
          description: !description,
          price: !price,
          category: !category,
          whatsappNumber: !whatsappNumber,
          sellerId: !actualSellerId
        }
      });
    }

    // Handle single image
    let imageUrl = '';
    if (req.file) {
      try {
        const uploaded = await cloudinary.uploader.upload(req.file.path, {
          resource_type: "image",
          folder: "products"
        });
        await fs.promises.unlink(req.file.path);
        imageUrl = uploaded.secure_url;
      } catch (err) {
        console.error("Cloudinary upload error:", err);
        await fs.promises.unlink(req.file.path);
        return res.status(500).json({
          success: false,
          message: "Error uploading image",
          details: err.message || "No error message from Cloudinary"
        });
      }
    } else {
      return res.status(400).json({ success: false, message: "A product image is required" });
    }

    // Create product data - use the actualSellerId for the seller field
    const productData = {
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      image: imageUrl,
      category: category.trim(),
      whatsappNumber: whatsappNumber.trim(),
      seller: actualSellerId // Use the determined seller ID
    };

    console.log("Saving product:", productData);

    const product = new productModel(productData);
    await product.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: {
        _id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        category: product.category,
        whatsappNumber: product.whatsappNumber,
        seller: product.seller
      }
    });

  } catch (error) {
    console.error("Error adding product:", error);
    
    // More specific error handling
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
        field: error.path,
        value: error.value
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: "Server error: " + error.message 
    });
  }
};
// function for removing product
export const removeProduct = async (req, res) => {
    try {
        
        await productModel.findByIdAndDelete(req.body.id)
        res.json({success:true,message:"Product Removed"})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const existing = await productModel.findById(productId);

    if (!existing)
      return res.status(404).json({ success: false, message: "Product not found" });

    // Update fields (from req.body)
    Object.assign(existing, req.body);

    // If a new image is uploaded, update the image field
    if (req.file) {
      existing.image = req.file.filename; // or req.file.path, based on your setup
    }

    const updated = await existing.save();
    res.status(200).json({ success: true, updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating product", error });
  }
}


//list products by seller
export const listProducts=async (req, res) => {
  try {
    const sellerId = req.params.sellerId;
    // Find products where seller matches the sellerId
    const products = await productModel.find({ seller: sellerId });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products by seller", error });
  }
}
export const listAllProducts=async (req, res) => {
  try {
    // Populate seller info if you want seller details (name, etc.)
    const products = await productModel.find().populate("seller");
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Fetch products failed", error: err.message });
  }
}