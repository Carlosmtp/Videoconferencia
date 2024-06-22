import React, { useEffect, useRef, useState } from "react";
import "./stylesVideoCall.css";
import { MdCallEnd } from "react-icons/md";
import { FaMicrophoneSlash, FaMicrophone } from "react-icons/fa";
import { BsFillCameraVideoOffFill, BsFillCameraVideoFill } from "react-icons/bs";
import { IoSend } from "react-icons/io5";
import { useAuth } from "../../context/AuthContext.tsx";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCallStarted, setCamStatus, setMicStatus } from "../../redux/videoCallSlice.ts";

import io from 'socket.io-client';

const chatSocket = io(process.env.REACT_APP_CHAT_SOCKET_SERVER_URL as string);
const videoCallSocket = io(process.env.REACT_APP_VIDEO_SOCKET_SERVER_URL as string);
const stunServer = process.env.REACT_APP_STUN_SERVER_URL as string;
const turnServer = process.env.REACT_APP_TURN_SERVER_URL as string;
const turnServerUsername = process.env.REACT_APP_TURN_SERVER_USERNAME as string;
const turnServerCredential = process.env.REACT_APP_TURN_SERVER_CREDENTIAL as string;

export default function VideoCall() {
    const auth = useAuth();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const chatHistoryRef = useRef<HTMLTextAreaElement>(null);
    const messageRef = useRef<HTMLTextAreaElement>(null);
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const user = useSelector((state: { user: any }) => state.user);
    const videoCall = useSelector((state: { videoCall: any }) => state.videoCall);
    const [pc, setPc] = useState<RTCPeerConnection | null>(null);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);

    useEffect(() => {
        if (user.email === "") {
            navigate("/dashboard");
        }
        if (!videoCall.callStarted) {
            console.log("Starting call");
            startCall();
            dispatch(setCallStarted(true));
        }

        chatSocket.emit("data-user", {
            name: user.name,
            email: user.email,
            photoURL: user.photoURL
        });
        videoCallSocket.emit("data-user", {
            name: user.name,
            email: user.email,
            photoURL: user.photoURL
        });

        videoCallSocket.on('offer', async (data) => {
            try {
                if (!pc) return;
                
                await pc.setRemoteDescription(new RTCSessionDescription(data));
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                videoCallSocket.emit('answer', answer);
            } catch (error) {
                console.error('Error handling offer:', error);
            }
        });

        videoCallSocket.on('answer', async (data) => {
            try {
                if (!pc) return;
                
                await pc.setRemoteDescription(new RTCSessionDescription(data));
            } catch (error) {
                console.error('Error handling answer:', error);
            }
        });

        videoCallSocket.on('candidate', async (data) => {
            try {
                if (!pc) return;
                
                await pc.addIceCandidate(new RTCIceCandidate(data));
            } catch (error) {
                console.error('Error handling ICE candidate:', error);
            }
        });

        const handleMessage = (message) => {
            chatHistoryRef.current!.value += `${message}\n`;
        };

        chatSocket.on("new-message", handleMessage);

        return () => {
            chatSocket.off("new-message", handleMessage);
        };
    }, [pc, user.email, navigate]);

    const startCall = async () => {
        localStorage.setItem("inCall", "true");
        const peerConnection = new RTCPeerConnection({
            iceServers: [
                { urls: stunServer },
                {
                    urls: [turnServer],
                    username: turnServerUsername,
                    credential: turnServerCredential
                }
            ]
        });
        setPc(peerConnection);

        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                videoCallSocket.emit('candidate', event.candidate);
            }
        };

        peerConnection.ontrack = (event) => {
            if (remoteVideoRef.current){
                remoteVideoRef.current.srcObject = event.streams[0];
            }
        };

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setLocalStream(stream);
            stream.getTracks().forEach((track) => {
                peerConnection.addTrack(track, stream);
            });
            if (localVideoRef.current){
                localVideoRef.current.srcObject = stream;
            }

            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            videoCallSocket.emit('offer', offer);
        } catch (error) {
            console.error('Error starting call:', error);
        }
    };

    const endCall = async () => {
        if (pc) {
            console.log("Ending call");
            pc.getSenders().forEach(sender => {
                if (sender.track) {
                    sender.track.stop();
                }
            });
            pc.getReceivers().forEach(receiver => {
                if (receiver.track) {
                    receiver.track.stop();
                }
            });
            pc.close();
            setPc(null);
        }

        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
            setLocalStream(null);
        }

        if (localVideoRef.current && localVideoRef.current.srcObject) {
            const localStream = localVideoRef.current.srcObject as MediaStream;
            localStream.getTracks().forEach(track => track.stop());
            localVideoRef.current.srcObject = null;
        }

        if (remoteVideoRef.current && remoteVideoRef.current.srcObject) {
            const remoteStream = remoteVideoRef.current.srcObject as MediaStream;
            remoteStream.getTracks().forEach(track => track.stop());
            remoteVideoRef.current.srcObject = null;
        }
        dispatch(setCallStarted(false));
        dispatch(setCamStatus(true));
        dispatch(setMicStatus(true));
        navigate("/dashboard");
        window.location.reload();
    };

    const deactivateCamera = async () => {
        if (localStream) {
            localStream.getVideoTracks().forEach(track => {
                track.enabled = false;
            });
        }
        dispatch(setCamStatus(false));
    }

    const activateCamera = () => {
        if (localStream) {
            localStream.getVideoTracks().forEach(track => {
                track.enabled = !track.enabled;
            });
        }
        dispatch(setCamStatus(true));
    }

    const deactivateMic = () => {
        if (localStream) {
            localStream.getAudioTracks().forEach(track => {
                track.enabled = !track.enabled;
            });
        }
        dispatch(setMicStatus(false));
    }

    const activateMic = () => {
        if (localStream) {
            localStream.getAudioTracks().forEach(track => {
                track.enabled = !track.enabled;
            });
        }
        dispatch(setMicStatus(true));
    }

    const handleSend = () => {
        if (messageRef.current!.value === "" || messageRef.current!.value === "\n") {
            messageRef.current!.value = "";
            return;
        }
        const newMessage = messageRef.current!.value;
        chatSocket.emit("new-message", newMessage);
        messageRef.current!.value = "";
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="container">
            <div className="video-call-section">
                <div className="videoo-call-placeholder">
                <video className = "video" ref={remoteVideoRef} autoPlay playsInline />
                <video className = "local-video" ref={localVideoRef} autoPlay playsInline muted />
                    </div>
                
                    <div className="video-call-controls">
                        <button onClick={endCall} className="round-button color-black hover-red">
                            <MdCallEnd />
                        </button>
                        <button onClick={videoCall.camStatus ? deactivateCamera : activateCamera} className={ videoCall.camStatus ? "round-button color-black hover-red" : "round-button background-color-red hover-red"}>
                            {videoCall.camStatus ? <BsFillCameraVideoFill /> : <BsFillCameraVideoOffFill />}
                        </button>
                        <button onClick={videoCall.micStatus? deactivateMic : activateMic} className={ videoCall.micStatus? "round-button color-black hover-red" : "round-button background-color-red hover-red"}>
                            {videoCall.micStatus ? <FaMicrophone /> : <FaMicrophoneSlash />}
                        </button>
                    </div>
                <div className="video-call-chat">
                    <textarea ref={chatHistoryRef} className="video-call-chat-history" readOnly defaultValue=""></textarea>
                    <div className="video-call-chat-input">
                        <textarea ref={messageRef} onKeyDown={handleKeyPress} className="video-call-chat-input-textarea" placeholder="Type a message"></textarea>
                        <button onClick={handleSend} className="send-button"><IoSend /></button>
                    </div>
                </div>
            </div>
        </div>
    );
};