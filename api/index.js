import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/admin.route.js';

const app = express();

const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

app.use(express.json())
app.use(cors());
app.use('/api/admin',adminRouter)

app.get('/',(req,res)=>{
    res.send('API IS WORKING')
})

app.listen(port,()=>{
    console.log("server is listing on",port);
    
})
