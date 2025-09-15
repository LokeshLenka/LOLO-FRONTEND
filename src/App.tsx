import { useState } from "react";
import "./App.css";
import { Route, Router, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import { AnimatePresence } from "motion/react";
import SignUp from "./Pages/SignUp";
import MainLayout from "./layouts/MainLayout";

function App() {
  // const [count, setCount] = useState(0);

  return (
    <AnimatePresence mode="wait">
      {/* <ScrollToTop /> */}
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
