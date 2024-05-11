import React from "react";
import UserProvider from "./context/UserContext.tsx";
import RoutesChatEISC from "./routes/RoutesChatEISC.tsx";

export default function App() {
    return (
        <div className="container">
            <UserProvider>
                <RoutesChatEISC />
            </UserProvider>
        </div>
    );
}
