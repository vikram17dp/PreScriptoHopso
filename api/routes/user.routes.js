import express from 'express'
import { bookAppointment, getProfile, googleAuth, myAppointments, registeruser, updateProfile, userLogin } from '../controllers/user.controller.js';
import authUser from '../middlewares/authUser.js';
import upload from '../middlewares/multer.js';


const userRouter = express.Router();

userRouter.post('/register',registeruser)
userRouter.post('/login',userLogin)
userRouter.post('/google',googleAuth)
userRouter.get('/get-profile',authUser,getProfile)
userRouter.post('/update-profile',upload.single('image'),authUser,updateProfile)
userRouter.post('/book-appointment',authUser,bookAppointment)
userRouter.get('/my-appointments',authUser,myAppointments)



export default userRouter