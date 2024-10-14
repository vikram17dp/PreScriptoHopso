import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios'

export const AppContext = createContext();

const AppContextProvider = ({children}) => {
    const [doctors, setDoctors] = useState([]);
    const currencySymbol = '$'
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [token,setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'):false)
  
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
    const value = {
        doctors,
        currencySymbol,
        getDoctorsData,
        token,
        setToken,
        backendUrl
    }
    useEffect(() => {
        getDoctorsData()
    }, [])

   

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;