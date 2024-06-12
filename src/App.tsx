import React from "react";
import RoutesChatEISC from "./routes/RoutesChatEISC.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";

export default function App() {
    return (
        <div className="container">
            
                <AuthProvider>
                    <RoutesChatEISC />
                </AuthProvider>
            
        </div>
    );
}
