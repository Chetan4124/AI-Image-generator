import React from "react";
import { createContext, useState } from "react";
export const AppContext =createContext()
const AppContextProvider =(props)=>{
    const [user , setUser]=useState(null);
    const [showLogin ,setShowLogin] = useState(false);

    const [token ,setToken] =useState(localStorage.getItem('token'))

    const [credit ,setCredit] =useState(false)


    // Normalize backend URL: strip quotes, fix single-slash protocol, ensure it includes protocol and no trailing slash
    const rawBackend = import.meta.env.VITE_BACKEND_URL || ''
    let normalized = rawBackend && rawBackend.trim();
    // remove surrounding single/double quotes added in .env
    if (normalized) {
        normalized = normalized.replace(/^['\"]|['\"]$/g, '')
    }
    // repair incorrect single-slash protocol like `http:/localhost` => `http://localhost`
    if (normalized) {
        normalized = normalized.replace(/^([a-z]+):\/(?!\/)/i, '$1://')
    }
    if (normalized && !/^https?:\/\//i.test(normalized)) {
        normalized = `http://${normalized}`
    }
    if (normalized) {
        normalized = normalized.replace(/\/+$/, '')
    }
    const backendUrl = normalized || 'http://localhost:4000'
    const value={
        user ,setUser,showLogin ,setShowLogin ,backendUrl,token ,setToken ,credit ,setCredit
    }
    return(
       <AppContext.Provider value={value}>

        {props.children}

       </AppContext.Provider>
    )
}
export default AppContextProvider