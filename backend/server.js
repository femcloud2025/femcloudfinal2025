import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import sellerRouter from './routes/sellerRoute.js';
import productRouter from './routes/productRoute.js';
import userRouter from './routes/userRoute.js';
import connectCloudinary from './config/cloudinary.js';
import dotenv from "dotenv";
dotenv.config();
const app=express();
const port=process.env.PORT||4000;
connectDB();
connectCloudinary();

app.use(express.json());
app.use(cors());
//app.options("/*", cors()); 
app.use('/api',userRouter);
app.use('/api/seller',sellerRouter);
app.use('/api/seller/product',productRouter);
app.use('/api/products',productRouter);
app.get('/',(req,res)=>{
   res.send("API working");
})
//console.log("Admin Email:", process.env.ADMIN_EMAIL);
//console.log("Admin Password:", process.env.ADMIN_PASSWORD);

app.listen(port, ()=> console.log('Server started on PORT : '+ port))