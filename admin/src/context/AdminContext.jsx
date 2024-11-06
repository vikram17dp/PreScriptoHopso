import { createContext, useState } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'

export const AdminContext = createContext()

const AdminContextProvider = ({children}) => {
    const [aToken, setAToken] = useState(localStorage.getItem('aToken') || '')
    const [doctors, setDoctors] = useState([])
    const [appointments,setAppointments] = useState([])
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const getAllDoctors = async () => {
        try {
            const response = await axios.post( backendUrl +'/api/admin/all-doctors', {}, {
                headers: {
                    Authorization: `Bearer ${aToken}`,
                },
            });
            if (response.data && response.data.success) {
                setDoctors(response.data.doctors);
            } else {
                toast.error(response.data?.message || "Failed to fetch doctors");
            }

            // console.log('Full response:', response.data.doctors);   
        } catch (error) {
            toast.error(error.message)
        }
    }
const changeAvailblity = async (docId)=>{
    try {
        const {data} = await axios.post(backendUrl + '/api/admin/change-availblity',{docId},
            {headers: {
                Authorization: `Bearer ${aToken}`,
            }}
        )
        if(data.success){
            toast.success(data.message)
            getAllDoctors()
        }else{
            toast.error(data.message)
        }
    } catch (error) {
        toast.error(error.message)
        
    }
}
const getAllappointments = async()=>{
   try {
    const {data} = await axios.get(backendUrl + '/api/admin/appointments',{headers: {
        Authorization: `Bearer ${aToken}`,
    }})
    if(data.success){
        setAppointments(data.appointments )
        console.log(data.appointments );
        
    }else{
        toast.error(data.message)
    }
   } catch (error) {
    toast.error(error.message)
    
   }
}
    const value = {
        aToken,
        setAToken,
        backendUrl,
        doctors,
        getAllDoctors,
        changeAvailblity,
        appointments,
        setAppointments,
        getAllappointments
    }

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider;