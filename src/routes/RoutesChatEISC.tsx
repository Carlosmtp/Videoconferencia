import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NotFound from "../pages/not-found/NotFound.tsx";
import Home from "../pages/home/Home.tsx";
import Dashboard from "../pages/dashboard/Dashboard.tsx";
import VideoCall from "../pages/video-call/VideoCall.tsx";


export default function RoutesChatEISC() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/video-call" element={<VideoCall />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    )
}