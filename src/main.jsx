import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CookiesProvider } from "react-cookie";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Home from "./Home.jsx";
import Login from "./login";
import Test from "./test.jsx"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CookiesProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/test" element={<Test />} />
        </Routes>
      </Router>
    </CookiesProvider>
  </StrictMode>,
);
