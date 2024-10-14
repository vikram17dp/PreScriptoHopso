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

        if(password.length < 4){
            return res.json({success:false,message:"Enter a strong pasword"})
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



export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({ success: true, token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};
