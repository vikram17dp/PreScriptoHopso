import { createContext} from 'react'

export const AppContext = createContext();

const AppContextProvider = ({children})=>{
    const currency = '$'
    const months = [
        "",
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC",
      ];
    
      const slotsDateFormat = (slotDate) => {
        const dateArray = slotDate.split("_");
        return `${dateArray[0]} ${months[Number(dateArray[1])]} ${dateArray[2]}`;
      };
    const calculateAge = (dob)=>{
        const today = new Date()
        const birthDate = new Date(dob)
        let age = today.getFullYear() - birthDate.getFullYear()
        return age
    }
    const value = {
        calculateAge,
        slotsDateFormat,
        currency
    }
    return(
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContextProvider