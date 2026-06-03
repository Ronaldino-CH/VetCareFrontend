import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./hooks/useAuth";
import { ChatGeneralProvider } from "./hooks/useChatGeneral";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <AuthProvider>
        <ChatGeneralProvider>
          <App />
        </ChatGeneralProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
