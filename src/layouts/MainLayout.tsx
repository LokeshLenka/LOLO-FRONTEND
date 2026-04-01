// src/layouts/MainLayout.tsx
import Header from "@/components/Header";
import Footer from "@/pages/App/Home/Footer";
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

const MainLayout: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20); // Increased threshold slightly
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#008080", fontFamily: "Tahoma, Arial, sans-serif", color: "#000" }}>
      {/* Pass the scrolled state to Header */}
      <Header scrolled={scrolled} />
      <main className={`flex-1`}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
