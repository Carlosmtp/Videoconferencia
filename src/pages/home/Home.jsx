import { useNavigate } from "react-router-dom";
import "./stylesHome.css";

export default function Home() {
    const navigate = useNavigate();

    const onHandleLogin = () => {
        navigate("/login");
    }

    const onHandleRegister = () => {
        navigate("/register", {
            state: {firstTime: true}
        });
    }

    return (
        <div className="container">
            <div className="header">
                <h1 className="text-align-center color-red"> Chat EISC </h1>
                <span className="text-align-center flex align-items-center"> Welcome </span>
            </div>
            <div className="container center-item vertical" >
                <button onClick={onHandleLogin} 
                    className="login-button background-color-blue color-white">Login
                </button>
                <button onClick={onHandleRegister} 
                    className="login-button background-color-green color-white">Register
                </button>
            </div>
        </div>
    )
}

