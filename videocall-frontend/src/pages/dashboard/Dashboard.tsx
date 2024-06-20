import React, { useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.tsx";
import "./stylesDashboard.css";
import "../stylesGeneral.css";
import { createUser, readUser } from "../../db/users-collection.ts";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../redux/userSlice.ts"; // Asegúrate de importar la acción correcta

type UserType = {
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
};

export default function Dashboard() {
    const navigate = useNavigate();
    const auth = useAuth();
    const user = useSelector((state: { user: UserType }) => state.user);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    const saveDataUser = async (valuesUser: UserType) => {
        const response = await createUser(valuesUser as { email: string; displayName: string | null; photoURL: string | null });
        return response.success;
    };

    const handleUserCreation = useCallback(async () => {
        if (auth.userLogged) {
            const { displayName, email, photoURL } = auth.userLogged;

            const response = await readUser(email!);
            if (!response.success) {
                const success = await saveDataUser({
                    displayName,
                    email,
                    photoURL
                });
                if (success) {
                    dispatch(setUser({ displayName, email, photoURL }));
                }
            } else if (response.data) {
                dispatch(setUser(response.data)); // Usa los datos de la base de datos si el usuario ya existe
            }
        }
    }, [auth.userLogged, dispatch]);

    useEffect(() => {
        if (auth.userLogged && loading) {
            handleUserCreation().finally(() => setLoading(false));
        }
    }, [auth.userLogged, loading, handleUserCreation]);

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
                {user.photoURL && (
                    <img src={user.photoURL} alt="User" className="user-photo" id="dash-user-photo"/>
                )}
                {user.name && (
                    <span className="sub-title">{user.name}</span>
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