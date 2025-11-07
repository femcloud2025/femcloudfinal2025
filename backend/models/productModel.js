import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true }, // single image required as string
    category: { type: String, required: true },
    whatsappNumber: { type: String, required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'seller', required: true }
    // Other fields commented out as before
});

const productModel = mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
