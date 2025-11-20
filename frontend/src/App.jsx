import React from "react";
import "./styles/theme.css";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";

export const API_URL = "https://reel-backend-nckx.onrender.com";

function App() {
  return (
    <>
      <AppRoutes />
    </>
  );
}

export default App;
