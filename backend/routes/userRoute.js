import express from 'express';
import { loginUser,registerUser,adminLogin } from '../controllers/userController.js';
import { loginSeller } from '../controllers/sellerControllers.js';
const userRouter = express.Router();

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.post('/admin',adminLogin)
userRouter.post('/login/seller',loginSeller)

export default userRouter;