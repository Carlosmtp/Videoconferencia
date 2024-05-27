import React from "react";
import { useNavigate } from "react-router-dom";



export default function Dashboard() {
    const navigate = useNavigate();

    const onHandleChat = () => {
        alert("We're working on it!");
    }

    const onHandleVideoCall = () => {
        navigate("/video-call");
    }

    return (
        <div className="container">
            <h1 className="color-red text-align-center">Dashboard</h1>
            <span className="text-align-center">Welcome to the dashboard</span>
            <div className="flex center-item">
                <button onClick={onHandleChat} className="login-button background-color-green color-white">
                    Chat
                </button>
                <button onClick={onHandleVideoCall} className="login-button background-color-blue color-white">
                    Video call
                </button>
            </div>
        </div>
    );
}
