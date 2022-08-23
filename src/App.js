import { BrowserRouter, Routes, Route, } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./styling/App.scss";
import "./styling/App.css";

import Header from "./components/Header.js";
import LaunchPage from "./components/LaunchPage.js";

function App() {
  document.title = "AlexCWarren.com";
  document.body.style.background = getComputedStyle(
    document.documentElement
  ).getPropertyValue("--primary1");

  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route exact path="/" element={<LaunchPage />} />
          {/* <Route path="/about" element={<About />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
