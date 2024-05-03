import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../pages/login/Login";
import Register from "../pages/register/Register";
import NotFound from "../pages/not-found/NotFound";
import Home from "../pages/home/Home";
import Dashboard from "../pages/dashboard/Dashboard";

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