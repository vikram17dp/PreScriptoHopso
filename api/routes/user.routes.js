import express from 'express'
import { registeruser } from '../controllers/user.controller.js';


const userRouter = express.Router();

userRouter.post('/register',registeruser)

export default userRouter