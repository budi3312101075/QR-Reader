import React from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import "./index.css";
import "./css/style.css";
import Home from "./pages/home";

function App() {
  return (
    <>
      <Routes>
        <Route exact path="/" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
