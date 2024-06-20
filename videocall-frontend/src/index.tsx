import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./styles.css";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";
import { AuthProvider } from "./context/AuthContext.tsx";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement ? rootElement : document.createElement("div"));

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <AuthProvider>
                <App />
            </AuthProvider>
        </Provider>
    </React.StrictMode>
);
