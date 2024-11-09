import axios from "axios";
import {  createContext, useState } from "react";
import {toast} from 'react-toastify'
export const DoctorContext = createContext()

const DoctorContextProvider = ({children})=>{
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [dToken, setDToken] = useState(localStorage.getItem('dToken') || '')
    const [appointments,setAppointments] = useState([])
    const [dashData,setDashData] = useState(false)
    const [profileData,setProfileData] = useState(false)

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
              }})
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

    const getDashData = async ()=>{
        try {
            const {data} = await axios.get(backendUrl + '/api/doctor/dashboard',{headers: {
                Authorization: `Bearer ${dToken}`,
              }})
              if(data.success){
                setDashData(data.dashdata)
                // console.log(data.dashdata);
                
              }else{
                toast.error(data.message)
              }
        } catch (error) {
            console.error(error)
            toast.error(error.message)
        }
    }
    const getprofiledata = async () => {
        try {
          const { data } = await axios.get(`${backendUrl}/api/doctor/profile`, {
            headers: {
              Authorization: `Bearer ${dToken}`,
            },
          })
          if (data.success) {
            setProfileData(data.profileData)
            // console.log("profile data", data.profileData)
          } else {
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
        Appointmentcancel,
        getDashData,
        setDashData,
        dashData,
        profileData,
        setProfileData,
        getprofiledata
    }
    return(
        <DoctorContext.Provider value={value}>
            {children}
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider