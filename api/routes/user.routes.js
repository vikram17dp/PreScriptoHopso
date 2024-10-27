import express from 'express'
import { bookAppointment, cancelAppointment, getProfile, googleAuth, myAppointments, paymentStripe, registeruser, updateProfile, userLogin } from '../controllers/user.controller.js';
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
userRouter.post('/cancel-appointment',authUser,cancelAppointment)
userRouter.post('/payment-stripe',authUser,paymentStripe)



export default userRouter