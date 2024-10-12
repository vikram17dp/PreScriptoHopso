import { createContext} from 'react'

export const AppContext = createContext();

const AppContextProvider = (Children)=>{
    const value = {

    }
    return(
        <AppContext.Provider value={value}>
            {Children}
        </AppContext.Provider>
    )
}

export default AppContextProvider