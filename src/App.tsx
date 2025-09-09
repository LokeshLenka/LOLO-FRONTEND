import { useState } from "react";
import "./App.css";
import { Route, Router, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import { AnimatePresence } from "motion/react";
import SignUp from "./Pages/SignUp";

function App() {
  // const [count, setCount] = useState(0);

  return (
    <AnimatePresence mode="wait">
      {/* <ScrollToTop /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
