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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 relative overflow-hidden">
      {/* Animated gradient background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/2 w-full h-full bg-gradient-to-r from-cyan/20 to-transparent rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 -right-1/2 w-full h-full bg-gradient-to-l from-neon-pink/20 to-transparent rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Pass the scrolled state to Header */}
        <Header scrolled={scrolled} />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
