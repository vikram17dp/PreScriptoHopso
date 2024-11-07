import doctorModel from "../models/doctor.model.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointment.model.js";

 export const changeAvailblity = async (req,res)=>{
    try {
        const {docId} = req.body;

        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId,{available:!docData.available})
        res.json({success:true,message:"Availblity checked"})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message});
    }
}
export const doctorList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select(['-password', '-email'])
        res.json({ success: true, doctors, message: "Doctors fetched successfully" })
    } catch (error) {   
        console.error("Error fetching doctors:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const loginDoctor = async (req,res)=>{
    try {
        const {email,password} = req.body;
        const doctor = await doctorModel.findOne({email})
        if(!doctor){
            res.json({success:false,message:"Invalid crdentials"})
        }
        const isMatch = await bcrypt.compare(password,doctor.password)
        if(isMatch){
            const token = jwt.sign({id:doctor._id},process.env.JWT_SECRET)
            res.json({success:true,token})
        }else{
            res.json({success:false,message:"Invalid crdentials"})

        }
    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}


export const appointmentDoctor = async (req,res)=>{
    try {
       const {docId} = req.body;
       const appointments = await appointmentModel.find({docId})
       res.json({success:true,appointments}) 
    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}