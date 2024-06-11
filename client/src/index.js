import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from '@ui5/webcomponents-react';
import {AuthContextProvider} from "../src/context/AuthContext.jsx"
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ThemeProvider>
    <BrowserRouter>
        <AuthContextProvider>
      <App />
      </AuthContextProvider>
    </BrowserRouter>
  </ThemeProvider>
);
