import React from "react";
import { useLocation } from "react-router-dom";
import { useUser } from "../../context/UserContext.tsx";
import "./stylesRegister.css";

interface LocationState {
    firstTime: boolean;
}

export default function Register() {
    useUser();
    const { state } = useLocation();

    const { firstTime } = state;

    return (
        <div className="container">
            <h1 className="text-align-center color-red">Register</h1> 
            <span className="text-align-center">Please register to continue</span>
            {firstTime && <span>Welcome PLEASE REGISTER</span>}
        </div>
    );
}
