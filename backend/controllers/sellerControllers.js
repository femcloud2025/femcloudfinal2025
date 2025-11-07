
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import sellerModel from "../models/sellerModel.js";
import productModel from "../models/productModel.js";
import mongoose from "mongoose";

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};
export const loginSeller = async (req, res) => {
    try {
        const { sellerName, password } = req.body;

        const seller = await sellerModel.findOne({ sellerName: sellerName });
        if (!seller) {
            return res.json({ success: false, message: "Seller doesn't exist" });
        }

        const isMatch = await bcrypt.compare(password, seller.password);

        if (isMatch) {
            const token = createToken(seller._id);
            res.json({ success: true, token,sellerId:seller._id,sellerName:seller.sellerName });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};
export const createSeller=async (req, res) => {
  try {
    // Destructure seller fields from request body
    const { sellerName, shopName, password, description, whatsappNumber } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simple validation for required fields
    if (!sellerName || !shopName || !password || !description || !whatsappNumber) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create a new seller document in MongoDB
    const newSeller = new sellerModel({
      sellerName,
      shopName,
      password:hashedPassword,
      description,
      whatsappNumber
     // products: [], // initialize with empty products array
    });

    const savedSeller = await newSeller.save();

    res.status(201).json({
      message: 'Seller created successfully',
      seller: savedSeller,
      });
  } catch (error) {
    console.error('Error creating seller:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
export const deleteSeller=async (req, res) => {
  try {
    const { id } = req.body;

    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid seller ID' });
    }

    // Find and delete the seller
    const deletedSeller = await sellerModel.findByIdAndDelete(id);

    // If no seller found, return 404
    if (!deletedSeller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    res.status(200).json({
      message: 'Seller deleted successfully',
      seller: deletedSeller,
    });
  } catch (error) {
    console.error('Error deleting seller:', error);
    res.status(500).json({ message: 'Server error' });
}
}
export const listSellers = async (req, res) => {
    try {

        const sellers = await sellerModel.find({});
        res.json({ success: true, sellers })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
  

export const getSellerProfile = async (req, res) => {
  try {
    const sellerId = req.sellerId;

    const seller = await sellerModel.findById(sellerId).select("-password");
    if (!seller) {
      return res.status(404).json({ success: false, message: "Seller not found" });
    }

    res.status(200).json({
      success: true,
      seller,
    });
  } catch (error) {
    console.error("Error fetching seller profile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
export const updateSellerProfile = async (req, res) => {
  try {
    const { description, whatsappNumber, gstNumber, password } = req.body;

    const seller = await sellerModel.findById(req.sellerId);
    if (!seller) {
      return res.status(404).json({ success: false, message: "Seller not found" });
    }

    if (description !== undefined) seller.description = description;
    if (whatsappNumber !== undefined) seller.whatsappNumber = whatsappNumber;
    if (gstNumber !== undefined) seller.gstNumber = gstNumber;

    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      seller.password = await bcrypt.hash(password, salt);
      }

    await seller.save();
    res.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update profile" });
  }
};

//export default { loginSeller, createSeller, deleteSeller, listSellers };