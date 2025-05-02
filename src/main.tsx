
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Set global configuration to hide the Lovable badge
window.VITE_HIDE_BADGE = true;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
