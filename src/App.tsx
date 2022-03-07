import React from "react";
import logo from "./logo.svg";
import "./App.css";

import { Routes, Route } from "react-router-dom";

import UseRedirectToHttps from "./hooks/useRedirectToHttps";

import LoginPage from "./components/pages/login/LoginPage";
import SupervisionListPage from "./components/pages/supervisionList/SupervisionListPage";

import MyDocument from "./components/pdf-report/PdfReport";
import { PDFViewer } from "@react-pdf/renderer";

function App() {
  UseRedirectToHttps();

  return (
    <div className="App" style={{ width: "100%", height: "100%" }}>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/tilsynsturer" element={<SupervisionListPage />} />
        <Route
          path="/pdf-rapport"
          element={
            // <PDFViewer>
            //   <MyDocument />
            // </PDFViewer>
            <div>
              
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
