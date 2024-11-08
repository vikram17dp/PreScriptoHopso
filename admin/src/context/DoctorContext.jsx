import axios from "axios";
import {  createContext, useState } from "react";
import {toast} from 'react-toastify'
export const DoctorContext = createContext()

const DoctorContextProvider = ({children})=>{
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [dToken, setDToken] = useState(localStorage.getItem('dToken') || '')
    const [appointments,setAppointments] = useState([])
    const getAllappointments = async()=>{
        try {
            const {data} = await axios.get(backendUrl + '/api/doctor/appointments',{headers: {
                Authorization: `Bearer ${dToken}`,
              },})
            if(data.success){
                setAppointments(data.appointments)
                // console.log(data.appointments.reverse());
                
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.error(error)
            toast.error(error.message)
        }
    }
    const AppointmentComplete = async(appointmentId)=>{
        try {
            const {data} = await axios.post(backendUrl + '/api/doctor/complete-appointment',{appointmentId},{headers: {
                Authorization: `Bearer ${dToken}`,
              },})
            if(data.success){
               toast.success(data.message)
               getAllappointments()
                
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.error(error)
            toast.error(error.message)
        }
    }
    const Appointmentcancel = async(appointmentId)=>{
        try {
            const {data} = await axios.post(backendUrl + '/api/doctor/cancel-appointment',{appointmentId},{headers: {
                Authorization: `Bearer ${dToken}`,
              },})
            if(data.success){
               toast.success(data.message)
               getAllappointments()
                
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.error(error)
            toast.error(error.message)
        }
    }
    const value = {
        backendUrl,
        dToken,
        setDToken,
        setAppointments,
        appointments,
        getAllappointments,
        AppointmentComplete,
        Appointmentcancel
    }
    return(
        <DoctorContext.Provider value={value}>
            {children}
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider