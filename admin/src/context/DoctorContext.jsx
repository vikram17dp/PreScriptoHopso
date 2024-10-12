import { Children, createContext } from "react";

export const DoctorContext = createContext()

const DoctorContextProvider = (Children)=>{
    const value = {

    }
    return(
        <DoctorContext.Provider value={value}>
            {Children}
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider