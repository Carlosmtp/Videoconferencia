import React from "react";
import { useNavigate } from "react-router-dom";
import "./stylesHome.css";
import { useAuth } from "../../context/AuthContext.tsx"
import { BsGoogle } from "react-icons/bs";

export default function Home() {
    const navigate = useNavigate();
    const auth = useAuth();
    const onHandleLogin = async () => {
        await auth.loginWithGoogle();
        console.log("auth", auth);
    };

    return (
        <div className="container">
            <div className="header">
                <h1 className="text-align-center color-red">VideoChat EISC</h1>
                <span className="text-align-center flex align-items-center">Welcome</span>
            </div>
            <div className="container center-item vertical">
                <button onClick={onHandleLogin} className="login-button">
                    <BsGoogle className="icon" />
                    Login With Google
                    </button>
            </div>
        </div>
    );
}