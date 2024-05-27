import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase.config";

type ValueProp = {
    userId: string
    setUserId: React.Dispatch<React.SetStateAction<string>>;
}

type ContextProp = {
    children: React.ReactNode
}

export const AppContext = React.createContext({} as ValueProp);

export default function AuthContext({ children }: ContextProp ){
    const [ userId, setUserId ] = useState<string>('');
    return (
        <AppContext.Provider value={{userId, setUserId}}>
            {children}
        </AppContext.Provider>
    )
}

export const useGlobalContext = ():ValueProp => {
    return useContext(AppContext)
}