import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "../firebase/firebase.config.ts";

interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
}

interface AuthContextType {
    userLogged: User | null;
    loginWithGoogle: () => Promise<{ success: boolean, user?: User, error?: any }>;
    logout: () => Promise<{ success: boolean, error?: any }>;
}

export const authContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(authContext);
    if (!context) {
        throw new Error("Error creating context!");
    }
    return context;
}

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [userLogged, setUserLogged] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUserLogged(currentUser as User | null);
        });
        return () => unsubscribe();
    }, []);

    const loginWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            return { success: true, user: result.user as User };
        } catch (error) {
            return { success: false, error };
        }
    }

    const logout = async () => {
        try {
            await signOut(auth);
            setUserLogged(null);
            return { success: true };
        } catch (error) {
            return { success: false, error };
        }
    }

    return (
        <authContext.Provider value={{ userLogged, loginWithGoogle, logout }}>
            {children}
        </authContext.Provider>
    );
}
