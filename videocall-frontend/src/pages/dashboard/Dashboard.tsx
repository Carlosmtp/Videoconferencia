import React, { useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.tsx";
import "./stylesDashboard.css";
import "../stylesGeneral.css";
import { createUser, readUser } from "../../db/users-collection.ts";
import { useSelector, useDispatch } from "react-redux";
import { setCallStarted, setCamStatus, setMicStatus } from "../../redux/videoCallSlice.ts";
import { setUser } from "../../redux/userSlice.ts";
import io from 'socket.io-client';


const videoCallsocket = io(process.env.REACT_APP_VIDEO_SOCKET_SERVER_URL as string);

type UserType = {
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
};

export default function Dashboard() {
    const navigate = useNavigate();
    const auth = useAuth();
    const user = useSelector((state: { user: any }) => state.user);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [isRoomFull, setIsRoomFull] = useState(false);

    const saveDataUser = async (valuesUser: UserType) => {
        const response = await createUser(valuesUser as { email: string; displayName: string | null; photoURL: string | null });
        return response.success;
    };

    const handleUserCreation = useCallback(async () => {
        if (auth.userLogged) {
            dispatch(setCallStarted(false));
            dispatch(setCamStatus(true));
            dispatch(setMicStatus(true));
            const { displayName, email, photoURL } = auth.userLogged;

            const response = await readUser(email!);
            if (!response.success) {
                const success = await saveDataUser({
                    displayName,
                    email,
                    photoURL
                });
                if (success) {
                    dispatch(setUser({ displayName, email, photoURL }));
                }
            } else if (response.data) {
                dispatch(setUser(response.data)); 
            }
        }
    }, [auth.userLogged, dispatch]);

    useEffect(() => {
        if (auth.userLogged && loading) {
            handleUserCreation().finally(() => setLoading(false));
        }

        videoCallsocket.on('full-house', () => {
            setIsRoomFull(true);
            alert('The video call room is full. Please try again later.');
        });

        return () => {
            videoCallsocket.off('full-house');
        };
    }, [auth.userLogged, loading, handleUserCreation]);

    const onHandleChat = () => {
        alert("We're working on it!");
    };

    const onHandleVideoCall = () => {
        videoCallsocket.emit('check-room-status');

        videoCallsocket.once('room-full', () => {
            setIsRoomFull(true);
            alert("The video call room is full. Please try again later.");
        });

        videoCallsocket.once('room-available', () => {
            setIsRoomFull(false);
            navigate("/video-call");
        });
    };

    const onHandleButtonLogout = async () => {
        try {
            await auth.logout();
            navigate("/");
        } catch (error) {
            console.error("Failed to logout:", error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
            <div className="header">
                <h1 className="main-title">Welcome</h1>
                {user.photoURL && (
                    <img src={user.photoURL} alt="User" className="user-photo" id="dash-user-photo"/>
                )}
                {user.name && (
                    <span className="sub-title">{user.name}</span>
                )}
            </div>
            <div className="flex center-item">
                <button onClick={onHandleChat} className="login-button background-color-green color-white">
                    Chat
                </button>
                <button onClick={onHandleVideoCall} className="login-button background-color-blue color-white">
                    Video call
                </button>
            </div>
            <div className="flex center-item">
                <button id="logout-button" onClick={onHandleButtonLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
}
