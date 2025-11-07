import express from 'express';
import  adminAuth  from '../middleware/adminAuth.js';
import  { loginSeller, createSeller, deleteSeller, listSellers, updateSellerProfile } from '../controllers/sellerControllers.js';
import {authSeller} from '../middleware/auth.js';
import { getSellerProfile } from '../controllers/sellerControllers.js';
//import { updateSellerProfile } from '../controllers/sellerControllers.js';
const sellerRouter = express.Router();

sellerRouter.post('/add',adminAuth,createSeller)
sellerRouter.delete('/delete',adminAuth,deleteSeller)
sellerRouter.get('/list',adminAuth,listSellers)
sellerRouter.get('/profile',authSeller,getSellerProfile)
sellerRouter.put('/profile',authSeller,updateSellerProfile);

export default sellerRouter;