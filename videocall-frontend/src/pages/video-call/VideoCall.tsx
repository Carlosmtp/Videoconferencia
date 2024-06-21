import React, {useEffect, useRef, useState, useCallback} from "react";
import "./stylesVideoCall.css";
import { MdCallEnd } from "react-icons/md";
import { FaMicrophoneSlash } from "react-icons/fa";
import { BsFillCameraVideoOffFill } from "react-icons/bs";
import { IoSend } from "react-icons/io5";
import { useAuth } from "../../context/AuthContext.tsx"
import { socketServer } from "../../socket/server-websockets";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { setUser } from "../../redux/userSlice.ts";

import { init } from "../../socket/server-webrtc.js"; 


type UserType = {
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
};

export default function VideoCall(){
    const auth = useAuth();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const chatHistoryRef = useRef<HTMLTextAreaElement>(null);
    const messageRef = useRef<HTMLTextAreaElement>(null);

    const user = useSelector((state: { user: any }) => state.user);



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

    const onHandleToggleMic = (e) => {
        e.preventDefault();
        console.log("Mic toggled");
        init();
    }

    useEffect(() => {
        if (user.email === ""){
            navigate("/dashboard")
        }
        const handleMessage = (message: string) => {
            chatHistoryRef.current!.value += String( user.name.split(" ")[0] ) + ":" + message + "\n";
        };

        socketServer.on("new-message", handleMessage);

        return () => {
            socketServer.off("new-message", handleMessage);
        };
    }, []);

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
                        <button onClick={ onHandleToggleMic } className="round-button color-black hover-red">
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