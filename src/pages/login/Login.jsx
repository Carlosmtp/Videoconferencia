import { useRef } from "react";
import { useUser } from "../../context/UserContext";
import "./stylesLogin.css"
import { useNavigate } from "react-router-dom";

export default function Login(props) {
    const {setUser} = useUser();
    const emailRef = useRef();
    const passwordRef = useRef();

    const navigate = useNavigate();

    console.log("testing");
    const onHandleLogin = () => {
        console.log("testing 2");

        let introducedEmail = emailRef.current.value;
        let introducedPassword = passwordRef.current.value;
        console.log(introducedEmail);
        console.log(introducedPassword);
        setUser({
            email: emailRef.current.value,
            password: passwordRef.current.value
        });
        if (introducedEmail === "" || introducedPassword === "") {
            alert("Email and password are required");
        } else if (introducedEmail === "user1@gmail.com" && introducedPassword === "pass1") {
            navigate("/dashboard");
        } else {
            alert("Invalid email or password");
        }
        // else {
        //     navigate("/register", {
        //         state: {firstTime: true}
        //     });
        // }
    }   
    return <>
        <div className="container">
            <h1 className="color-red text-align-center"> Login </h1> 
            <span className="text-align-center"> Please login to continue</span>
            <form>
                <input ref={emailRef} type="text" placeholder="email"/>
                <input ref={passwordRef} type="password" placeholder="password"/>
                <button onClick={onHandleLogin}> Login </button>
            </form>
        </div>
    </>
}