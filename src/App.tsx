import React from "react";
import logo from "./logo.svg";
import "./App.css";

import LoginPage from "./components/pages/login/LoginPage";

function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <LoginPage></LoginPage>
    </div>
  );
}

export default App;

