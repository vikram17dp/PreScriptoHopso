import express from 'express'
import { getProfile, googleAuth, registeruser, userLogin } from '../controllers/user.controller.js';
import authUser from '../middlewares/authUser.js';


const userRouter = express.Router();

userRouter.post('/register',registeruser)
userRouter.post('/login',userLogin)
userRouter.post('/google',googleAuth)
userRouter.get('/get-profile',authUser,getProfile)

export default userRouter