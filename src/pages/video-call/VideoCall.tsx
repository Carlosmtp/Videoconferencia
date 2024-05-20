import React from "react";
import { useNavigate } from "react-router-dom";
import "./stylesVideoCall.css";
import { MdCall } from "react-icons/md";
import { FaMicrophone } from "react-icons/fa";
import { BsFillCameraVideoFill } from "react-icons/bs";
import { IoSend } from "react-icons/io5";

export default function VideoCall(){

    return(
        <div className="container">
            <div className="flex center-item">
                <div className="video-call-placeholder">
                    <p>Not active video call</p>
                </div>
                <div className="video-call-chat">
                    <textarea className="video-call-chat-history"></textarea>
                    <div className="video-call-chat-input-area">
                        <input type="text" className="video-call-chat-input-text" placeholder="Type a message" />
                        <button className="send-button background-color-green color-white">
                            <IoSend />
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex center-item">
                <button className="login-button background-color-green color-white hover-darkgreen">
                    <MdCall />{/* Start/Finish Video Call */} 
                </button>
                <button className="login-button background-color-blue color-white hover-darkgreen">
                    <BsFillCameraVideoFill />{/* Activate/Deactivate camera */}
                </button>
                <button className="login-button background-color-green color-white hover-darkblue">
                    <FaMicrophone />{/* Activate/Deactivate Mic */}
                </button>
            </div>
        </div>
    )
}