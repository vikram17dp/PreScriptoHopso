import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios'

export const AppContext = createContext();

const AppContextProvider = ({children}) => {
    const [doctors, setDoctors] = useState([]);
    const currencySymbol = '$'
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [token,setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'):false)
    const [userData,setUserData] = useState(false)
  
    const getDoctorsData = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/doctor/list');
            
            if (response.data && response.data.success) {
                if (Array.isArray(response.data.doctors)) {
                    setDoctors(response.data.doctors);
                    toast.success(response.message);
                }
            } else {
                console.error("API request failed:", response.data);
                toast.error(response.data?.message || "Failed to fetch doctors");
            }
        } catch (error) {
            console.error("Error fetching doctors:", error);
            toast.error(error.message || "An error occurred while fetching doctors");
        }
    }

    const loadUserProfileData = async ()=>{
        try {
            const {data} = await axios.get(backendUrl + '/api/user/get-profile',{headers: { Authorization: `Bearer ${token}` }})
            if(data.success){
                setUserData(data.userData)
            }else{
                toast.error(data.error)
            }
        } catch (error) {
            toast.error(error.message || "An Error Occurred while profile")
        }
    }
    const value = {
        doctors,
        currencySymbol,
        getDoctorsData,
        token,
        setToken,
        userData,
        setUserData,
        loadUserProfileData,
        backendUrl
    }
    useEffect(() => {
        getDoctorsData()
    }, [])
    useEffect(()=>{
        if(token){
            loadUserProfileData()
        }else{
            setUserData(false)
        }
    },[token])

   

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;