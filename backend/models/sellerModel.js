import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema({
  sellerName: { type: String, required: true, unique:true},
  shopName: { type: String, required: true ,unique:true },
  password: { type: String, required: true },
  description: { type: String, required: true },
  whatsappNumber:{type:String,required:true,unique:true},
  gstNumber:{type:String},
  sellerUPIID:{type:String},
 // products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]  // Reference to product documents
}, { minimize: false });

const sellerModel = mongoose.models.seller || mongoose.model('seller', sellerSchema);

export default sellerModel;
