import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../pages/login/Login.tsx";
import Register from "../pages/register/Register.tsx";
import NotFound from "../pages/not-found/NotFound.tsx";
import Home from "../pages/home/Home.tsx";
import Dashboard from "../pages/dashboard/Dashboard.tsx";

export default function RoutesChatEISC() {
    return (
        <BrowserRouter className="container">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    )
}