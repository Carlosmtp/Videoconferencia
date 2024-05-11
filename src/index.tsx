import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./styles.css";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement ? rootElement : document.createElement("div"));

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
