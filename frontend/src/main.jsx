import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import router from "./router";
import { AuthProvider } from "./context/AuthContext";

import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>

      <RouterProvider router={router} />
<ToastContainer position="top-right" />
    </AuthProvider>
  </React.StrictMode>
);