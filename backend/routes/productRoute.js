import express from "express";
import { authSeller } from "../middleware/auth.js";
import upload from "../middleware/multer.js"; // your multer setup
import {
  addProduct,
  removeProduct,
  updateProduct,
  listProducts,
  listAllProducts
} from "../controllers/productControllers.js";

const productRouter = express.Router();

// Multer
productRouter.post(
  "/add",
  authSeller,
  upload.single("image"),
  addProduct
);

productRouter.post("/delete", authSeller, removeProduct);

productRouter.post("/list/:sellerId", authSeller, listProducts);

productRouter.post(
  "/update/:productId",
  authSeller,
  upload.fields([{ name: "image", maxCount: 1 }]),
  updateProduct
);
productRouter.get("/", listAllProducts)

export default productRouter;
