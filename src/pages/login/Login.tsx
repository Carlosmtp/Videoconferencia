import React, { useRef } from "react";
import { useUser } from "../../context/UserContext.tsx";
import "./stylesLogin.css";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const { setUser } = useUser();
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const navigate = useNavigate();

    const onHandleLogin = () => {
        const introducedEmail = emailRef.current?.value || "";
        const introducedPassword = passwordRef.current?.value || "";

        setUser({
            email: introducedEmail,
            password: introducedPassword
        });

        if (introducedEmail === "" || introducedPassword === "") {
            alert("Email and password are required");
        } else if (introducedEmail === "user1@gmail.com" && introducedPassword === "pass1") {
            navigate("/dashboard");
        } else {
            alert("Invalid email or password");
        }
    };   

    const onHandleRegister = () => {
        navigate("/register", {
            state: { firstTime: true }
        });
    };

    return (
        <div className="container">
            <h1 className="color-red text-align-center">Login</h1> 
            <span className="text-align-center">Please login to continue</span>
            <form className="container center-item login-form">
                <input ref={emailRef} type="text" placeholder="email"/>
                <input ref={passwordRef} type="password" placeholder="password"/>
                <button onClick={onHandleLogin} className="login-button color-white background-color-blue">Login</button>
            </form>
            <div className="container center-item">
                <span>Don't have an account yet?</span>
                <button onClick={onHandleRegister} className="login-button color-white background-color-green">Register</button>
            </div>
        </div>
    );
}
