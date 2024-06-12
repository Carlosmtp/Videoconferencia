import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.tsx";
import "./stylesDashboard.css";
import "../stylesGeneral.css";

// Define el tipo para el usuario
type UserType = {
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
};

export default function Dashboard() {
    const navigate = useNavigate();
    const auth = useAuth();
    const [valueUser, setValueUser] = React.useState<UserType | null>(null);

    useEffect(() => {
        if (auth.userLogged) {
            const { displayName, email, photoURL } = auth.userLogged;
            setValueUser({
                displayName: displayName,
                email: email,
                photoURL: photoURL
            });
        }
    }, [auth.userLogged]);

    const onHandleChat = () => {
        alert("We're working on it!");
    }

    const onHandleVideoCall = () => {
        navigate("/video-call");
    }

    const onHandleButtonLogout = async () => {
        try {
            await auth.logout();
            navigate("/");
        } catch (error) {
            console.error("Failed to logout:", error);
        }
    }

    return (
        <div className="container">
            <div className="header">
                <h1 className="main-title">Welcome</h1>
                {valueUser?.photoURL && (
                    <img src={valueUser.photoURL} alt="User" className="user-photo" id="dash-user-photo"/>
                )}
                <span className="sub-title">{auth.userLogged?.displayName}</span>
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
