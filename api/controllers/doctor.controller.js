import doctorModel from "../models/doctor.model.js";


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