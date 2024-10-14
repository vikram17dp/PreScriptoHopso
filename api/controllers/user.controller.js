import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/user.model.js';
import jwt from 'jsonwebtoken'

export const registeruser = async (req,res)=>{
    try {
        const {name,email,password} = req.body;
        if(!name || !email || !password){
            return res.json({success:false,message:"Missing Details"})
        }
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"Enter a valid email"})
        }

        if(password.length < 5){
            return res.json({success:false,message:"Enter a string pasword"})
        }
        const salt = await bcrypt.genSalt(10)
        const hasedpassword = await bcrypt.hash(password,salt)

        const userData = {
            name,
            email,
            password:hasedpassword
        }
        const newuser = new userModel(userData)
        const user = await newuser.save()

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
        res.status(200).json({ success: true, message: "User registered successfully", token });
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message});
    }
}