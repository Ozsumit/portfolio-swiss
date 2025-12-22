import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import CustomCursor from "./components/custom-cursor";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App style={{ cursor: "none" }} />
    <CustomCursor /> {/* Mounted as a sibling, z-index determines visibility */}
  </React.StrictMode>
);
