import React from "react";
import logo from "./logo.svg";
import "./App.css";

import { Routes, Route } from "react-router-dom";

import UseRedirectToHttps from "./hooks/useRedirectToHttps";

import LoginPage from "./components/pages/login/LoginPage";

function App() {
  UseRedirectToHttps();
  return (
    <div className="App" style={{ width: "100vw", height: "100vh" }}>
      <Routes>
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </div>
  );
}

export default App;
