import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./styles.css";
import { AuthProvider } from "./context/AuthContext.tsx"; // Cambiado para importar AuthProvider

const rootElement = document.getElementById("root");
const root = createRoot(rootElement ? rootElement : document.createElement("div"));

root.render(
    <React.StrictMode>
        <AuthProvider> {/* Cambiado para usar AuthProvider */}
            <App />
        </AuthProvider>
    </React.StrictMode>
);
