import React, { createContext, useCallback, useState } from "react";

const AuthContext = createContext({
    isFetched: false,
    fetched: () => {},
    isAdmin: false,
    logIn: () => {},
    logOut: () => {}
})

const AuthContextProvider:React.FC = (props) => {
    const [ isFetched, setIsFetched ] = useState(false);
    const [ isAdmin, setIsLoggedIn ] = useState(false);

    const fetched = useCallback(() => {
        setIsFetched(true);
    }, [])

    const logIn = useCallback(() => {
        setIsLoggedIn(true);
    }, []);

    const logOut = useCallback(() => {
        setIsLoggedIn(false);
    }, []);

    const context = {isFetched, fetched, isAdmin, logIn, logOut};
    return (
        <AuthContext.Provider value={context}>{props.children}</AuthContext.Provider>
    )
}

export { AuthContextProvider };
export default AuthContext;