import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.tsx";
import "./stylesDashboard.css";
import "../stylesGeneral.css";
import { createUser, readUser } from "../../db/users-collection.ts";

// Define el tipo para el usuario
type UserType = {
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
};

export default function Dashboard() {
    const navigate = useNavigate();
    const auth = useAuth();
    const [userCreated, setUserCreated] = useState(false);
    const [loading, setLoading] = useState(true); // Estado de carga para evitar llamadas repetitivas

    const saveDataUser = async (valuesUser) => {
        const response = await createUser(valuesUser);
        if (response.success) {
            setUserCreated(true);
        }
    };

    const readDataUser = async (email) => {
        await readUser(email).then((res) => console.log(res))
        .catch((error) => console.error(error));
    };

    const handleUserCreation = useCallback(async () => {
        if (auth.userLogged) {
            const { displayName, email, photoURL } = auth.userLogged;

            const response = await readUser(email);
            if (!response.success) {
                await saveDataUser({
                    displayName: displayName,
                    email: email,
                    photoURL: photoURL
                });
            } else {
                setUserCreated(true); // Marca como creado si ya existe
            }
            readDataUser(email);
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

    return (
        <div className="container">
            <div className="header">
                <h1 className="main-title">Welcome</h1>
                {auth.userLogged?.photoURL && (
                    <img src={auth.userLogged.photoURL} alt="User" className="user-photo" id="dash-user-photo"/>
                )}
                {auth.userLogged?.displayName && (
                    <span className="sub-title">{auth.userLogged.displayName}</span>
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
