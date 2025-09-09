import { useState } from "react";
import "./App.css";
import { Route, Router, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import { AnimatePresence } from "motion/react";
import MainLayout from "./layouts/MainLayout";
import { Signup } from "./Pages/Signup";

function App() {
  // const [count, setCount] = useState(0);

  return (
    <AnimatePresence mode="wait">
      {/* <ScrollToTop /> */}
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          {/* <Route path="*" element={<div>404 Not Found</div>} /> */}
          <Route path="/signup" element={<Signup />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default App;
