import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ResumeProvider } from "./context/ResumeProvider";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <ResumeProvider>
          <App />
          <Toaster position="top-right" />
        </ResumeProvider>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
