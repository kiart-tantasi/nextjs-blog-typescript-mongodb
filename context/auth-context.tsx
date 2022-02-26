import React, { createContext, useState } from "react";

const AuthContext = createContext({
    isAdmin: false,
    logIn: () => {},
    logOut: () => {}
})

const AuthContextProvider:React.FC = (props) => {
    const [ isAdmin, setIsLoggedIn ] = useState(false);
    const logIn = () => {
        setIsLoggedIn(true);
    }
    const logOut = () => {
        setIsLoggedIn(false);
    }
    
    const context = {isAdmin, logIn, logOut};
    return (
        <AuthContext.Provider value={context}>{props.children}</AuthContext.Provider>
    )
}

export { AuthContextProvider };
export default AuthContext;