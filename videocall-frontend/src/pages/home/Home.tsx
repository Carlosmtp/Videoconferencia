import React from "react";
import { useNavigate } from "react-router-dom";
import "./stylesHome.css";
import "../stylesGeneral.css";
import { useAuth } from "../../context/AuthContext.tsx"
import { BsGoogle } from "react-icons/bs";

export default function Home() {
    const navigate = useNavigate();
    const auth = useAuth();
    

    const onHandleLogin = async () => {
        await auth.loginWithGoogle().then(() => {
            navigate("/dashboard");
        }).catch((error) => {
            console.log(error);
        });
    };

    return (
        <div className="container">
            <div className="header">
                <h1 className="main-title">VideoChat EISC</h1>
                <span className="sub-title">Welcome</span>
            </div>
            <div className="container center-item vertical">
                <div onClick={onHandleLogin} id="login-button">
                    <div id="google-icon-container">
                        <BsGoogle id="google-icon" />
                    </div>
                    <p>Login With Google</p>
                </div>
            </div>
        </div>
    );
}