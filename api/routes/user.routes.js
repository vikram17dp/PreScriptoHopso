import express from 'express'
import { googleAuth, registeruser, userLogin } from '../controllers/user.controller.js';


const userRouter = express.Router();

userRouter.post('/register',registeruser)
userRouter.post('/login',userLogin)
userRouter.post('/google',googleAuth)

export default userRouter