import React, {useRef} from "react";
import { useNavigate } from "react-router-dom";
import "./stylesVideoCall.css";
// import { MdCall } from "react-icons/md";
import { MdCallEnd } from "react-icons/md";
// import { FaMicrophone } from "react-icons/fa";
import { FaMicrophoneSlash } from "react-icons/fa";
// import { BsFillCameraVideoFill } from "react-icons/bs";
import { BsFillCameraVideoOffFill } from "react-icons/bs";
import { IoSend } from "react-icons/io5";




export default function VideoCall(){
    const chatHistoryRef = useRef<HTMLTextAreaElement>(null);
    const messageRef = useRef<HTMLTextAreaElement>(null);

    function onHandleSend(){
        if (messageRef.current!.value === "" || 
                messageRef.current!.value === "\n"){
            messageRef.current!.value = "";
            return;
        }
        chatHistoryRef.current!.value += messageRef.current!.value + "\n";
        messageRef.current!.value = "";
    }

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
                    <textarea ref={chatHistoryRef} className="video-call-chat-history" readOnly></textarea>
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