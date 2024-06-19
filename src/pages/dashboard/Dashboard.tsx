import React, { useEffect } from "react";
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
    const [valueUser] = React.useState<UserType | null>(null);

    const saveDataUser = async (valuesUser) => {
        await createUser(valuesUser);
    }

    const readDataUser = async (email) => {
        await readUser(email).then((res) => console.log(res))
        .catch((error) => console.error(error));
    }

    useEffect(() => {
        if (auth.userLogged) {
            const { displayName, email, photoURL } = auth.userLogged;

            saveDataUser({
                displayName: displayName,
                email: email,
                photoURL: photoURL
            
            });
            readDataUser(email);
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
