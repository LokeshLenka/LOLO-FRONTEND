// src/components/Header.tsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, CalendarClock, Clapperboard, Home, LogIn } from "lucide-react";
import NavDropdown from "@/components/NavDropdown";
import Lolo_logo_1 from "@/assets/logos/Lolo_logo_1.png";
import { useAuth } from "@/context/AuthContext";

interface HeaderProps {
  scrolled: boolean;
}

const NAV_ITEMS = [
  { label: "Home", path: "/", icon: Home },
  { label: "Events", path: "/events", icon: CalendarClock },
  { label: "Publications", path: "/publications", icon: Clapperboard },
];

const Header: React.FC<HeaderProps> = ({ scrolled: _scrolled }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = (useAuth && useAuth()) || { user: null };
  const location = useLocation();

  return (
    <header
      style={{
        fontFamily: "Tahoma, Arial, sans-serif",
        background: "#d4d0c8",
        borderBottom: "2px solid #808080",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
      }}
    >
      {/* Win2000 title bar */}
      <div
        style={{
          background: "linear-gradient(to right, #0a246a, #a6caf0)",
          padding: "3px 6px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <img src={Lolo_logo_1} alt="LoLo Logo" style={{ height: "16px", width: "16px", objectFit: "contain" }} />
          <span style={{ color: "white", fontWeight: "bold", fontSize: "11px", letterSpacing: "0.3px" }}>
            SRKR LOLO Music Club - Microsoft Internet Explorer
          </span>
        </div>
        <div style={{ display: "flex", gap: "2px" }}>
          {["_", "□", "✕"].map((c, i) => (
            <button
              key={i}
              style={{
                background: "#d4d0c8",
                border: "1px solid",
                borderColor: "#ffffff #808080 #808080 #ffffff",
                color: "#000",
                width: "16px",
                height: "14px",
                fontSize: "8px",
                cursor: "pointer",
                fontFamily: "Arial",
                lineHeight: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Menu bar */}
      <div
        style={{
          background: "#d4d0c8",
          padding: "2px 4px",
          borderBottom: "1px solid #808080",
          display: "flex",
          alignItems: "center",
          gap: "0",
        }}
      >
        {["File", "Edit", "View", "Favorites", "Tools", "Help"].map((item) => (
          <button
            key={item}
            style={{
              background: "transparent",
              border: "none",
              padding: "2px 6px",
              fontSize: "11px",
              fontFamily: "Tahoma, Arial, sans-serif",
              cursor: "pointer",
              color: "#000",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#0a246a";
              (e.currentTarget as HTMLElement).style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color = "#000";
            }}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Address bar + nav */}
      <div
        style={{
          background: "#d4d0c8",
          padding: "3px 6px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          borderBottom: "1px solid #808080",
        }}
      >
        {/* Back / Forward buttons */}
        <div style={{ display: "flex", gap: "2px" }}>
          {["◄", "►", "✕", "⟳"].map((btn, i) => (
            <button
              key={i}
              style={{
                background: "#d4d0c8",
                border: "1px solid",
                borderColor: "#ffffff #808080 #808080 #ffffff",
                padding: "1px 5px",
                fontSize: "10px",
                cursor: "pointer",
                color: i < 2 ? "#000" : "#666",
                fontFamily: "Arial",
                minWidth: "22px",
              }}
            >
              {btn}
            </button>
          ))}
        </div>

        {/* Nav links as tabs */}
        <div style={{ display: "flex", gap: "2px", marginLeft: "4px" }}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                background: location.pathname === item.path ? "#ffffff" : "#d4d0c8",
                border: "1px solid",
                borderColor: location.pathname === item.path
                  ? "#808080 #ffffff #ffffff #808080"
                  : "#ffffff #808080 #808080 #ffffff",
                padding: "2px 10px",
                fontSize: "11px",
                fontFamily: "Tahoma, Arial, sans-serif",
                color: location.pathname === item.path ? "#0a246a" : "#000",
                fontWeight: location.pathname === item.path ? "bold" : "normal",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              {item.label}
            </Link>
          ))}
          <div style={{ display: "flex", alignItems: "center" }}>
            <NavDropdown />
          </div>
        </div>

        {/* Address bar */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px", flex: 1 }}>
          <span style={{ fontSize: "11px", fontFamily: "Tahoma, Arial, sans-serif", whiteSpace: "nowrap" }}>Address</span>
          <div
            style={{
              flex: 1,
              background: "#fff",
              border: "1px solid",
              borderColor: "#808080 #ffffff #ffffff #808080",
              padding: "1px 4px",
              fontSize: "11px",
              fontFamily: "Tahoma, Arial, sans-serif",
              color: "#000080",
              display: "flex",
              alignItems: "center",
            }}
          >
            {typeof window !== "undefined" ? window.location.href : "http://srkrlolo.in/"}
          </div>
          <button
            style={{
              background: "#d4d0c8",
              border: "1px solid",
              borderColor: "#ffffff #808080 #808080 #ffffff",
              padding: "1px 8px",
              fontSize: "11px",
              fontFamily: "Tahoma, Arial, sans-serif",
              cursor: "pointer",
            }}
          >
            Go
          </button>
        </div>

        {/* Auth buttons */}
        <div style={{ display: "flex", gap: "4px" }}>
          {user ? (
            <Link to={`/${user.username}/dashboard`}>
              <button
                style={{
                  background: "#d4d0c8",
                  border: "1px solid",
                  borderColor: "#ffffff #808080 #808080 #ffffff",
                  padding: "2px 10px",
                  fontSize: "11px",
                  fontFamily: "Tahoma, Arial, sans-serif",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <User size={12} />
                Dashboard
              </button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <button
                  style={{
                    background: "#d4d0c8",
                    border: "1px solid",
                    borderColor: "#ffffff #808080 #808080 #ffffff",
                    padding: "2px 10px",
                    fontSize: "11px",
                    fontFamily: "Tahoma, Arial, sans-serif",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <LogIn size={12} />
                  Login
                </button>
              </Link>
              <Link to="/signup">
                <button
                  style={{
                    background: "#d4d0c8",
                    border: "1px solid",
                    borderColor: "#ffffff #808080 #808080 #ffffff",
                    padding: "2px 10px",
                    fontSize: "11px",
                    fontFamily: "Tahoma, Arial, sans-serif",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
          style={{
            background: "#d4d0c8",
            border: "1px solid",
            borderColor: "#ffffff #808080 #808080 #ffffff",
            padding: "2px 6px",
            cursor: "pointer",
          }}
          onClick={() => setIsMenuOpen((s) => !s)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={14} /> : <Menu size={14} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div
          style={{
            background: "#d4d0c8",
            borderBottom: "2px solid #808080",
            padding: "8px",
          }}
          className="md:hidden"
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMenuOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 10px",
                background: location.pathname === item.path ? "#0a246a" : "transparent",
                color: location.pathname === item.path ? "#fff" : "#000",
                fontSize: "12px",
                fontFamily: "Tahoma, Arial, sans-serif",
                textDecoration: "none",
                marginBottom: "2px",
              }}
            >
              <item.icon size={14} />
              {item.label}
            </Link>
          ))}
          <hr style={{ border: "1px solid #808080", margin: "6px 0" }} />
          {user ? (
            <Link to={`/${user.username}/dashboard`} onClick={() => setIsMenuOpen(false)} style={{ textDecoration: "none" }}>
              <button
                style={{
                  width: "100%",
                  background: "#d4d0c8",
                  border: "1px solid",
                  borderColor: "#ffffff #808080 #808080 #ffffff",
                  padding: "4px 10px",
                  fontSize: "12px",
                  fontFamily: "Tahoma, Arial, sans-serif",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <User size={14} />
                Dashboard
              </button>
            </Link>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <Link to="/login" onClick={() => setIsMenuOpen(false)} style={{ textDecoration: "none" }}>
                <button
                  style={{
                    width: "100%",
                    background: "#d4d0c8",
                    border: "1px solid",
                    borderColor: "#ffffff #808080 #808080 #ffffff",
                    padding: "4px 10px",
                    fontSize: "12px",
                    fontFamily: "Tahoma, Arial, sans-serif",
                    cursor: "pointer",
                  }}
                >
                  Login
                </button>
              </Link>
              <Link to="/signup" onClick={() => setIsMenuOpen(false)} style={{ textDecoration: "none" }}>
                <button
                  style={{
                    width: "100%",
                    background: "#d4d0c8",
                    border: "1px solid",
                    borderColor: "#ffffff #808080 #808080 #ffffff",
                    padding: "4px 10px",
                    fontSize: "12px",
                    fontFamily: "Tahoma, Arial, sans-serif",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Sign Up
                </button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
