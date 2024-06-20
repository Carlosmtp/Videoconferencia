import React, {useEffect, useRef, useState, useCallback} from "react";
import { useNavigate } from "react-router-dom";
import "./stylesVideoCall.css";
// import { MdCall } from "react-icons/md";
import { MdCallEnd } from "react-icons/md";
// import { FaMicrophone } from "react-icons/fa";
import { FaMicrophoneSlash } from "react-icons/fa";
// import { BsFillCameraVideoFill } from "react-icons/bs";
import { BsFillCameraVideoOffFill } from "react-icons/bs";
import { IoSend } from "react-icons/io5";

import { socketServer } from "../../socket/server-websockets";
import { useAuth } from "../../context/AuthContext.tsx";
import { createUser, readUser } from "../../db/users-collection.ts";


type UserType = {
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
};

export default function VideoCall(){
    const chatHistoryRef = useRef<HTMLTextAreaElement>(null);
    const messageRef = useRef<HTMLTextAreaElement>(null);


    const auth = useAuth();
    const [userCreated, setUserCreated] = useState(false);
    const [userData, setUserData] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(true);

    const saveDataUser = async (valuesUser: UserType) => {
        const response = await createUser(valuesUser as { email: string; displayName: string | null; photoURL: string | null });
        if (response.success) {
            setUserCreated(true);
        }
    };

    const readDataUser = async (email: string) => {
        const response = await readUser(email);
        if (response.success && response.data) {
            setUserData(response.data);
            setUserCreated(true);
        }
    };

    const handleUserCreation = useCallback(async () => {
        if (auth.userLogged) {
            const { displayName, email, photoURL } = auth.userLogged;

            const response = await readUser(email!);
            if (!response.success) {
                await saveDataUser({
                    displayName: displayName,
                    email: email,
                    photoURL: photoURL
                });
                setUserData({
                    displayName: displayName,
                    email: email,
                    photoURL: photoURL
                });
            } else if (response.data) {
                setUserData(response.data); // Usa los datos de la base de datos si el usuario ya existe
                setUserCreated(true);
            }
        }
    }, [auth.userLogged]);


    function onHandleSend(){
        if (messageRef.current!.value === "" || 
                messageRef.current!.value === "\n"){
            messageRef.current!.value = "";
            return;
        }
        const newMessage = messageRef.current!.value;
        socketServer.emit("new-message", newMessage);
        messageRef.current!.value = "";
    }

    useEffect(() => {
        if (auth.userLogged && !userCreated && loading) {
            handleUserCreation().finally(() => setLoading(false));
        }
        const handleMessage = (message: string) => {
            chatHistoryRef.current!.value += String( userData?.displayName?.split(" ")[0] ) + ":" + message + "\n";
        };

        socketServer.on("new-message", handleMessage);

        // Cleanup function to remove the event listener
        return () => {
            socketServer.off("new-message", handleMessage);
        };
    }, [auth.userLogged, userCreated, loading, handleUserCreation]);

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            onHandleSend();
        }
    };

    return(
        <div className="container">
            <div className="flex center-item margin-bottom-0">
                
                <div className="video-and-buttons">
                    <div className="video-call-placeholder">
                        <p>No active video call</p>
                    </div>
                    <div className="video-call-buttons">
                        <button className="round-button color-black hover-red">
                            <MdCallEnd />{/* Start/Finish Video Call */} 
                        </button>
                        <button className="round-button color-black hover-red">
                            <BsFillCameraVideoOffFill />{/* Activate/Deactivate camera */}
                        </button>
                        <button className="round-button color-black hover-red">
                            <FaMicrophoneSlash />{/* Activate/Deactivate Mic */}
                        </button>
                    </div>
                </div>
                <div className="video-call-chat">
                    <textarea ref={chatHistoryRef} className="video-call-chat-history" readOnly defaultValue=""></textarea>
                    <div className="video-call-chat-input-area">
                        <textarea ref={messageRef} onKeyDown={handleKeyPress} className="video-call-chat-input-textarea" placeholder="Type a message" />
                        <button onClick={onHandleSend} className="send-button background-color-green color-white">
                            <IoSend />
                        </button>
                    </div>
                </div>
            </div>            
        </div>
    )
}