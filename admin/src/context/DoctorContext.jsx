import {  createContext, useState } from "react";

export const DoctorContext = createContext()

const DoctorContextProvider = ({children})=>{
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [dToken, setDToken] = useState(localStorage.getItem('dToken') || '')

    const value = {
        backendUrl,
        dToken,
        setDToken
    }
    return(
        <DoctorContext.Provider value={value}>
            {children}
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider