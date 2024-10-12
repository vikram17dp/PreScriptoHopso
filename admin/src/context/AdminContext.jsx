import {  createContext } from "react";


export const AdminContext = createContext()

const AdminContextProvider = ({children})=>{
    const value = {

    }
    return(
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider;