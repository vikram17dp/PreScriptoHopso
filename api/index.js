import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/admin.route.js';
import dotenv from 'dotenv'
import doctorRouter from './routes/doctor.route.js';
import userRouter from './routes/user.routes.js';
const app = express();

const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();
dotenv.config()

app.use(express.json())
app.use(cors());

app.use('/api/admin',adminRouter)
app.use('/api/doctor',doctorRouter)
app.use('/api/user',userRouter)

app.get('/',(req,res)=>{
    res.send('API IS WORKING')
})

app.listen(port,()=>{
    console.log("server is listing on",port);
    
})
