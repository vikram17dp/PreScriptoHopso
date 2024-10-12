import {  createContext } from "react";


export const AdminContext = createContext()

const AdminContextProvider = (Children)=>{
    const value = {

    }
    return(
        <AdminContext.Provider value={value}>
            {Children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider;