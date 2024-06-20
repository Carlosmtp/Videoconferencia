import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.tsx";
import "./stylesDashboard.css";
import "../stylesGeneral.css";
import { createUser, readUser } from "../../db/users-collection.ts";

type UserType = {
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
};

export default function Dashboard() {
    const navigate = useNavigate();
    const auth = useAuth();
    const [userCreated, setUserCreated] = useState(false);
    const [userData, setUserData] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(true);

    const saveDataUser = async (valuesUser: UserType) => {
        const response = await createUser(valuesUser as { email: string; displayName: string | null; photoURL: string | null });
        if (response.success) {
            setUserCreated(true);
        }
    };

    const readDataUser = async (email: string) => {
        const response = await readUser(email);
        if (response.success && response.data) {
            setUserData(response.data);
            setUserCreated(true);
        }
    };

    const handleUserCreation = useCallback(async () => {
        if (auth.userLogged) {
            const { displayName, email, photoURL } = auth.userLogged;

            const response = await readUser(email!);
            if (!response.success) {
                await saveDataUser({
                    displayName: displayName,
                    email: email,
                    photoURL: photoURL
                });
                setUserData({
                    displayName: displayName,
                    email: email,
                    photoURL: photoURL
                });
            } else if (response.data) {
                setUserData(response.data); // Usa los datos de la base de datos si el usuario ya existe
                setUserCreated(true);
            }
        }
    }, [auth.userLogged]);

    useEffect(() => {
        if (auth.userLogged && !userCreated && loading) {
            handleUserCreation().finally(() => setLoading(false));
        }
    }, [auth.userLogged, userCreated, loading, handleUserCreation]);

    const onHandleChat = () => {
        alert("We're working on it!");
    };

    const onHandleVideoCall = () => {
        navigate("/video-call");
    };

    const onHandleButtonLogout = async () => {
        try {
            await auth.logout();
            navigate("/");
        } catch (error) {
            console.error("Failed to logout:", error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
            <div className="header">
                <h1 className="main-title">Welcome</h1>
                {userData?.photoURL && (
                    <img src={userData.photoURL} alt="User" className="user-photo" id="dash-user-photo"/>
                )}
                {userData?.displayName && (
                    <span className="sub-title">{userData.displayName}</span>
                )}
            </div>
            <div className="flex center-item">
                <button onClick={onHandleChat} className="login-button background-color-green color-white">
                    Chat
                </button>
                <button onClick={onHandleVideoCall} className="login-button background-color-blue color-white">
                    Video call
                </button>
            </div>
            <div className="flex center-item">
                <button id="logout-button" onClick={onHandleButtonLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
}
