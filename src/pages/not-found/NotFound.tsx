import React from "react";
import "./stylesNotFound.css";

export default function NotFound() {
    return (
        <div className="container">
            <h1 className="error">404 error</h1>
            <p className="description">Page not found</p>
        </div>
    );
}