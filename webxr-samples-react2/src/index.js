import React from "react";
import { StrictMode } from "react";
import { render } from "react-dom";
import "./styles.css";
import App from "./App";

const root = document.getElementById("root");
render(
    <StrictMode>
        <App />
    </StrictMode>,
    root
);
