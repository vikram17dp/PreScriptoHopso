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
export const doctorList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select(['-password', '-email'])
        res.json({ success: true, doctors, message: "Doctors fetched successfully" })
    } catch (error) {   
        console.error("Error fetching doctors:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}