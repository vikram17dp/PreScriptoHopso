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

export const appointmentComplete = async(req,res)=>{
    try {
        const {docId,appointmentId} = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId)
        if(appointmentData && appointmentData.docId === docId){
            await appointmentModel.findByIdAndUpdate(appointmentId,{isCompleted:true})
            return res.json({success:true,message:"Appointment completed"})
        }else{
            return res.json({success:false,message:"Mark failed"})
        }
    } catch (error) {
        console.error( error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const appointmentCancel = async(req,res)=>{
    try {
        const {docId,appointmentId} = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId)
        if(appointmentData && appointmentData.docId === docId){
            await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})
            return res.json({success:true,message:"Appointment cancelled"})
        }else{
            return res.json({success:false,message:"Cancellation failed"})
        }
    } catch (error) {
        console.error( error);
        res.status(500).json({ success: false, message: error.message });
    }
}


export const dashboardDoctor = async(req,res)=>{
    try {
        const {docId} = req.body;
        let earings = 0;
        const appointments = await appointmentModel.find({docId})
        appointments.map((item)=>{
            if(item.isCompleted || item.payment){
                earings += item.amount
            }
        })
        let patients = []
        appointments.map((item)=>{
            if(!patients.includes(item.userId))
            {
                patients.push(item.userId)
            }
        })
        const dashdata = {
            earings,
            appointments:appointments.length,
            patients:patients.length,
            latestappointment:appointments.reverse().slice(0,5)
        }
        res.json({success:true,dashdata})
    } catch (error) {
        console.error( error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const getdoctorprofile = async (req, res) => {
    try {
      const { docId } = req.body
      const profiledata = await doctorModel.findById(docId).select('-password')
      res.json({ success: true, profileData: profiledata })
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

export const updateProfileData = async (req,res)=>{
    try {
        const {docId,fees,available,address}= req.body;
        await doctorModel.findByIdAndUpdate(docId,{fees,available,address})
        res.json({success:true,message:"Profile Updated"})
    } catch (error) {
        console.error( error);
        res.status(500).json({ success: false, message: error.message });
    }
}