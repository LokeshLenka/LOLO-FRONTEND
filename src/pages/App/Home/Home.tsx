import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Music,
  Users,
  Mic2,
  Disc3,
  Award,
  Headphones,
  CalendarDays,
} from "lucide-react";

// Win2000-style helper components
const Win2kPanel: React.FC<{
  children: React.ReactNode;
  title?: string;
  style?: React.CSSProperties;
  className?: string;
}> = ({ children, title, style, className }) => (
  <div
    className={className}
    style={{
      background: "#d4d0c8",
      border: "2px solid",
      borderColor: "#ffffff #808080 #808080 #ffffff",
      fontFamily: "Tahoma, Arial, sans-serif",
      ...style,
    }}
  >
    {title && (
      <div
        style={{
          background: "linear-gradient(to right, #0a246a, #a6caf0)",
          padding: "3px 6px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          marginBottom: "0",
        }}
      >
        <span style={{ color: "white", fontWeight: "bold", fontSize: "11px" }}>
          {title}
        </span>
      </div>
    )}
    <div style={{ padding: title ? "8px" : "0" }}>{children}</div>
  </div>
);

const Win2kButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
  primary?: boolean;
}> = ({ children, onClick, style, primary }) => {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        background: "#d4d0c8",
        border: "2px solid",
        borderColor: pressed
          ? "#808080 #ffffff #ffffff #808080"
          : "#ffffff #808080 #808080 #ffffff",
        padding: "4px 16px",
        fontFamily: "Tahoma, Arial, sans-serif",
        fontSize: "12px",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        color: primary ? "#000080" : "#000",
        fontWeight: primary ? "bold" : "normal",
        ...style,
      }}
    >
      {children}
    </button>
  );
};

const Win2kProgressBar: React.FC<{ value: number; label: string }> = ({
  value,
  label,
}) => (
  <div style={{ marginBottom: "8px" }}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: "11px",
        fontFamily: "Tahoma, Arial, sans-serif",
        marginBottom: "2px",
        color: "#000",
      }}
    >
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <div
      style={{
        background: "#fff",
        border: "1px solid",
        borderColor: "#808080 #ffffff #ffffff #808080",
        height: "14px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${value}%`,
          height: "100%",
          background: "#0a246a",
          backgroundImage:
            "repeating-linear-gradient(90deg, #0a246a 0px, #0a246a 12px, #1a56c8 12px, #1a56c8 14px)",
        }}
      />
    </div>
  </div>
);

const MarqueeText: React.FC<{ text: string }> = ({ text }) => {
  const [pos, setPos] = useState(100);
  useEffect(() => {
    const id = setInterval(() => {
      setPos((p) => {
        if (p < -150) return 100;
        return p - 0.3;
      });
    }, 16);
    return () => clearInterval(id);
  }, []);
  return (
    <div
      style={{
        overflow: "hidden",
        background: "#000080",
        padding: "2px 4px",
        borderTop: "1px solid #808080",
      }}
    >
      <span
        style={{
          display: "inline-block",
          transform: `translateX(${pos}%)`,
          color: "#ffff00",
          fontSize: "11px",
          fontFamily: "Tahoma, Arial, sans-serif",
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </span>
    </div>
  );
};

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const timelineData = [
    {
      title: "Formation",
      content:
        "SRKR LOLO began as a collective of passionate musicians and students wanting to bridge the gap between academic life and creative expression.",
    },
    {
      title: "Dec 2, 2024",
      content:
        "The college administration officially recognized SRKR LOLO as a legit Music Band & Club. This marked the beginning of a structured era with Faculty Coordinators and a dedicated student body.",
    },
    {
      title: "The Present",
      content:
        "We are now a fully functional ecosystem producing music for short films, hosting workshops, and performing at major college events like Hackathons.",
    },
  ];

  const features = [
    {
      icon: Headphones,
      title: "Contemporary Fusion",
      desc: "Seamlessly blending genres for a refreshingly experimental sound that breaks traditional boundaries.",
      progress: 85,
    },
    {
      icon: Disc3,
      title: "Immersive Soundscapes",
      desc: "Experience energetic rhythms and melodic storytelling crafted by the best talent.",
      progress: 72,
    },
    {
      icon: Award,
      title: "Resonant Community",
      desc: "More than just music — it's about connecting audiences across generations and backgrounds.",
      progress: 91,
    },
  ];

  return (
    <div
      style={{
        background: "#008080",
        minHeight: "100vh",
        paddingTop: "120px",
        fontFamily: "Tahoma, Arial, sans-serif",
      }}
    >
      {/* Desktop icons row */}
      <div
        style={{
          display: "flex",
          gap: "24px",
          padding: "16px 16px 0",
          flexWrap: "wrap",
        }}
      >
        {[
          { icon: "🎵", label: "Music" },
          { icon: "📅", label: "Events" },
          { icon: "👥", label: "Team" },
          { icon: "📖", label: "Publications" },
          { icon: "🖼️", label: "Gallery" },
          { icon: "❓", label: "FAQ" },
        ].map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "2px",
              cursor: "pointer",
              width: "64px",
            }}
          >
            <div
              style={{
                fontSize: "28px",
                filter: "drop-shadow(1px 1px 0 #000)",
              }}
            >
              {item.icon}
            </div>
            <span
              style={{
                color: "#fff",
                fontSize: "11px",
                textAlign: "center",
                textShadow: "1px 1px 1px #000",
                background: "transparent",
              }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>

      <div
        style={{
          padding: "16px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: "12px",
          alignItems: "start",
        }}
      >
        {/* === HERO WINDOW === */}
        <div
          style={{
            gridColumn: "1 / -1",
            background: "#d4d0c8",
            border: "2px solid",
            borderColor: "#ffffff #808080 #808080 #ffffff",
            boxShadow: "2px 2px 0 #000",
          }}
        >
          {/* Title bar */}
          <div
            style={{
              background: "linear-gradient(to right, #0a246a, #a6caf0)",
              padding: "4px 8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              <span style={{ fontSize: "14px" }}>🎸</span>
              <span
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "12px",
                }}
              >
                SRKR LOLO Music Club - Welcome
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
                    width: "18px",
                    height: "16px",
                    fontSize: "9px",
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

          {/* Content */}
          <div
            style={{
              padding: "16px",
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
              alignItems: "center",
              background: "#d4d0c8",
            }}
          >
            <div style={{ flex: "1 1 300px" }}>
              <p
                style={{
                  fontSize: "11px",
                  color: "#000080",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  marginBottom: "4px",
                  fontWeight: "bold",
                }}
              >
                Living Out Loud Originals
              </p>
              <h1
                style={{
                  fontSize: "clamp(28px, 5vw, 48px)",
                  fontWeight: "bold",
                  color: "#000080",
                  lineHeight: 1.2,
                  marginBottom: "8px",
                  textShadow: "2px 2px 0 #a6caf0",
                  fontFamily: "Arial Black, Arial, sans-serif",
                }}
              >
                Unleash Your Rhythm
              </h1>
              <p
                style={{
                  fontSize: "12px",
                  color: "#444",
                  marginBottom: "16px",
                  maxWidth: "420px",
                  lineHeight: "1.6",
                }}
              >
                Blending cultures and hearts, turning campus energy into music
                that lives beyond the stage.
              </p>

              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <Link
                  to="/events/9abdbf2e-37d1-4adb-ad26-779bc6a3951c"
                  style={{ textDecoration: "none" }}
                >
                  <Win2kButton primary>
                    <span>▶</span> Join Paatashaala
                  </Win2kButton>
                </Link>
                <a
                  href="https://lyrics.srkrlolo.in/"
                  style={{ textDecoration: "none" }}
                >
                  <Win2kButton>
                    <span>♪</span> Lyrics
                  </Win2kButton>
                </a>
              </div>
            </div>

            {/* Stats box */}
            <div
              style={{
                flex: "0 0 auto",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              {[
                { icon: <Mic2 size={14} />, value: "10+", label: "Artists" },
                {
                  icon: <CalendarDays size={14} />,
                  value: "15+",
                  label: "Events",
                },
                {
                  icon: <Users size={14} />,
                  value: "25+",
                  label: "Team Members",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  style={{
                    background: "#fff",
                    border: "2px solid",
                    borderColor: "#808080 #ffffff #ffffff #808080",
                    padding: "6px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    minWidth: "140px",
                  }}
                >
                  <span style={{ color: "#000080" }}>{stat.icon}</span>
                  <span
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: "#000080",
                    }}
                  >
                    {stat.value}
                  </span>
                  <span style={{ fontSize: "11px", color: "#444" }}>
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <MarqueeText
            text="★ SRKR LOLO Music Club — Unleash Your Rhythm ★ Events | Concerts | Publications | Team | Gallery | FAQ ★ Visit us at srkrlolo.in ★"
          />
        </div>

        {/* === ABOUT WINDOW === */}
        <Win2kPanel
          title="About LOLO Music — Properties"
          style={{ boxShadow: "2px 2px 0 #000" }}
        >
          <div
            style={{
              background: "#fff",
              border: "1px solid",
              borderColor: "#808080 #fff #fff #808080",
              padding: "10px",
              marginBottom: "8px",
            }}
          >
            <img
              src="/cover.jpg"
              alt="SRKR LOLO Band"
              style={{
                width: "100%",
                height: "180px",
                objectFit: "cover",
                display: "block",
                filter: "grayscale(20%)",
              }}
            />
          </div>
          <p
            style={{ fontSize: "11px", color: "#000", lineHeight: "1.6", marginBottom: "8px" }}
          >
            <strong>Living Out Loud Originals (LOLO)</strong> is SRKR&apos;s
            premier contemporary fusion band and music club. Born from a passion
            for blending Indian Classical rhythms with modern Rock and Pop beats,
            we exist to create an infectious, genre-transcending sound that makes
            you say{" "}
            <em style={{ color: "#000080" }}>"YoYo"</em>!
          </p>
          <p
            style={{ fontSize: "11px", color: "#444", lineHeight: "1.6" }}
          >
            More than just a band, we are a movement. We provide a platform for
            students to de-stress, build confidence, and find their unique
            musical identity.
          </p>

          <blockquote
            style={{
              borderLeft: "3px solid #000080",
              margin: "10px 0 0",
              paddingLeft: "10px",
              fontStyle: "italic",
              fontSize: "12px",
              color: "#000080",
            }}
          >
            &quot;To grow together, we must play together.&quot;
            <br />
            <span
              style={{
                fontSize: "10px",
                color: "#666",
                fontStyle: "normal",
              }}
            >
              — Our Philosophy
            </span>
          </blockquote>
        </Win2kPanel>

        {/* === WHY LOLO / FEATURES WINDOW === */}
        <Win2kPanel
          title="Why LOLO? — System Properties"
          style={{ boxShadow: "2px 2px 0 #000" }}
        >
          {features.map((f, i) => (
            <div
              key={i}
              style={{
                background: "#fff",
                border: "1px solid",
                borderColor: "#808080 #fff #fff #808080",
                padding: "8px",
                marginBottom: "6px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "4px",
                }}
              >
                <div
                  style={{
                    background: "#d4d0c8",
                    border: "1px solid",
                    borderColor: "#ffffff #808080 #808080 #ffffff",
                    padding: "3px",
                    color: "#000080",
                  }}
                >
                  <f.icon size={14} />
                </div>
                <strong style={{ fontSize: "12px", color: "#000080" }}>
                  {f.title}
                </strong>
              </div>
              <p
                style={{
                  fontSize: "11px",
                  color: "#444",
                  marginBottom: "6px",
                  lineHeight: "1.5",
                }}
              >
                {f.desc}
              </p>
              <Win2kProgressBar value={f.progress} label="Score" />
            </div>
          ))}
        </Win2kPanel>

        {/* === ECOSYSTEM WINDOW === */}
        <Win2kPanel
          title="Our Ecosystem — Notepad"
          style={{ boxShadow: "2px 2px 0 #000" }}
        >
          {/* Tab bar */}
          <div
            style={{
              display: "flex",
              borderBottom: "2px solid #808080",
              marginBottom: "8px",
            }}
          >
            {["Music & Performance", "Management & Ops"].map((tab, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                style={{
                  padding: "4px 14px",
                  fontSize: "11px",
                  fontFamily: "Tahoma, Arial, sans-serif",
                  background: activeTab === i ? "#d4d0c8" : "#b0b0a8",
                  border: "1px solid",
                  borderColor:
                    activeTab === i
                      ? "#ffffff #808080 #d4d0c8 #ffffff"
                      : "#ffffff #808080 #808080 #ffffff",
                  marginBottom: activeTab === i ? "-2px" : "0",
                  cursor: "pointer",
                  fontWeight: activeTab === i ? "bold" : "normal",
                  color: activeTab === i ? "#000080" : "#444",
                  zIndex: activeTab === i ? 1 : 0,
                  position: "relative",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 0 && (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "8px",
                  padding: "8px",
                  background: "#fff",
                  border: "1px solid",
                  borderColor: "#808080 #fff #fff #808080",
                }}
              >
                <Music size={32} style={{ color: "#000080" }} />
                <div>
                  <strong style={{ fontSize: "13px", color: "#000080" }}>
                    Music & Performance
                  </strong>
                  <p style={{ fontSize: "11px", color: "#444", margin: "2px 0 0" }}>
                    From the recording studio to the main stage.
                  </p>
                </div>
              </div>
              <p
                style={{
                  fontSize: "11px",
                  color: "#444",
                  lineHeight: "1.6",
                  marginBottom: "8px",
                }}
              >
                Join a community of vocalists, instrumentalists, and producers
                shaping the campus sound.
              </p>
              <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                {["Live Concerts", "Film Scoring", "Jam Sessions"].map(
                  (tag) => (
                    <span
                      key={tag}
                      style={{
                        background: "#d4d0c8",
                        border: "1px solid",
                        borderColor: "#ffffff #808080 #808080 #ffffff",
                        padding: "2px 8px",
                        fontSize: "10px",
                        color: "#000080",
                      }}
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>
          )}

          {activeTab === 1 && (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "8px",
                  padding: "8px",
                  background: "#fff",
                  border: "1px solid",
                  borderColor: "#808080 #fff #fff #808080",
                }}
              >
                <Users size={32} style={{ color: "#000080" }} />
                <div>
                  <strong style={{ fontSize: "13px", color: "#000080" }}>
                    Management & Ops
                  </strong>
                  <p style={{ fontSize: "11px", color: "#444", margin: "2px 0 0" }}>
                    The architects of experience.
                  </p>
                </div>
              </div>
              <p
                style={{
                  fontSize: "11px",
                  color: "#444",
                  lineHeight: "1.6",
                  marginBottom: "8px",
                }}
              >
                Master the art of event planning, team leadership, and marketing
                in a real-world environment.
              </p>
              <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                {[
                  "Event Planning",
                  "Team Leadership",
                  "Marketing",
                ].map((tag) => (
                  <span
                    key={tag}
                    style={{
                      background: "#d4d0c8",
                      border: "1px solid",
                      borderColor: "#ffffff #808080 #808080 #ffffff",
                      padding: "2px 8px",
                      fontSize: "10px",
                      color: "#000080",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "12px",
            }}
          >
            <Link to="/team" style={{ textDecoration: "none" }}>
              <Win2kButton primary>
                View Our Team <ArrowRight size={12} />
              </Win2kButton>
            </Link>
          </div>
        </Win2kPanel>

        {/* === TIMELINE WINDOW === */}
        <div
          style={{
            gridColumn: "1 / -1",
            background: "#d4d0c8",
            border: "2px solid",
            borderColor: "#ffffff #808080 #808080 #ffffff",
            boxShadow: "2px 2px 0 #000",
          }}
        >
          <div
            style={{
              background: "linear-gradient(to right, #0a246a, #a6caf0)",
              padding: "4px 8px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span style={{ fontSize: "14px" }}>📋</span>
            <span
              style={{
                color: "white",
                fontWeight: "bold",
                fontSize: "12px",
              }}
            >
              Our Story — Timeline.txt
            </span>
          </div>

          <div
            style={{
              padding: "12px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "10px",
            }}
          >
            {timelineData.map((item, i) => (
              <div
                key={i}
                style={{
                  background: "#fff",
                  border: "2px solid",
                  borderColor: "#808080 #ffffff #ffffff #808080",
                  padding: "10px",
                }}
              >
                <div
                  style={{
                    background: "#000080",
                    color: "#fff",
                    padding: "2px 8px",
                    fontSize: "11px",
                    fontWeight: "bold",
                    marginBottom: "6px",
                    display: "inline-block",
                  }}
                >
                  {item.title}
                </div>
                <p
                  style={{
                    fontSize: "11px",
                    color: "#000",
                    lineHeight: "1.6",
                  }}
                >
                  {item.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* === JOIN CTA WINDOW === */}
        <div
          style={{
            gridColumn: "1 / -1",
            background: "#d4d0c8",
            border: "2px solid",
            borderColor: "#ffffff #808080 #808080 #ffffff",
            boxShadow: "2px 2px 0 #000",
          }}
        >
          <div
            style={{
              background: "linear-gradient(to right, #0a246a, #a6caf0)",
              padding: "4px 8px",
            }}
          >
            <span
              style={{
                color: "white",
                fontWeight: "bold",
                fontSize: "12px",
              }}
            >
              Join the Family — Registration Wizard
            </span>
          </div>

          <div
            style={{
              padding: "24px",
              textAlign: "center",
              background: "#d4d0c8",
            }}
          >
            <div
              style={{
                fontSize: "32px",
                marginBottom: "8px",
              }}
            >
              🎸
            </div>
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#000080",
                marginBottom: "8px",
                fontFamily: "Arial Black, Arial, sans-serif",
              }}
            >
              Join the SRKR LOLO Family!
            </h2>
            <p
              style={{
                fontSize: "12px",
                color: "#444",
                marginBottom: "16px",
              }}
            >
              Your musical journey starts here. Join us and make some noise!
            </p>

            <div
              style={{
                background: "#fff",
                border: "2px solid",
                borderColor: "#808080 #ffffff #ffffff #808080",
                padding: "12px",
                maxWidth: "400px",
                margin: "0 auto 16px",
                textAlign: "left",
              }}
            >
              <p
                style={{
                  fontSize: "11px",
                  color: "#000080",
                  fontWeight: "bold",
                  marginBottom: "4px",
                }}
              >
                Setup Wizard - Step 1 of 3
              </p>
              <Win2kProgressBar value={33} label="Registration Progress" />
              <p style={{ fontSize: "11px", color: "#444", marginTop: "6px" }}>
                Welcome to SRKR LOLO Music Club setup. Click &apos;Get
                Started&apos; to begin your journey.
              </p>
            </div>

            <Link to="/signup" style={{ textDecoration: "none" }}>
              <Win2kButton primary style={{ padding: "8px 24px", fontSize: "13px" }}>
                Get Started Now <ArrowRight size={14} />
              </Win2kButton>
            </Link>
          </div>

          {/* Status bar */}
          <div
            style={{
              background: "#d4d0c8",
              borderTop: "1px solid #808080",
              padding: "2px 8px",
              display: "flex",
              gap: "16px",
              alignItems: "center",
            }}
          >
            {[
              "Ready",
              "10+ Artists",
              "15+ Events",
              "25+ Members",
            ].map((item, i) => (
              <span
                key={i}
                style={{
                  fontSize: "11px",
                  color: "#000",
                  fontFamily: "Tahoma, Arial, sans-serif",
                  borderRight: "1px solid #808080",
                  paddingRight: "12px",
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Taskbar */}
      <div
        style={{
          position: "sticky",
          bottom: 0,
          left: 0,
          right: 0,
          background: "#d4d0c8",
          borderTop: "2px solid #ffffff",
          padding: "3px 6px",
          display: "flex",
          alignItems: "center",
          gap: "4px",
          zIndex: 100,
        }}
      >
        <button
          style={{
            background: "#d4d0c8",
            border: "2px solid",
            borderColor: "#ffffff #808080 #808080 #ffffff",
            padding: "2px 10px",
            fontWeight: "bold",
            fontSize: "12px",
            fontFamily: "Tahoma, Arial, sans-serif",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span style={{ fontSize: "14px" }}>🪟</span>
          Start
        </button>

        <div
          style={{
            height: "20px",
            width: "1px",
            background: "#808080",
            margin: "0 4px",
          }}
        />

        {["SRKR LOLO - Welcome", "Events", "Publications"].map((w, i) => (
          <button
            key={i}
            style={{
              background: "#d4d0c8",
              border: "1px solid",
              borderColor: i === 0 ? "#808080 #ffffff #ffffff #808080" : "#ffffff #808080 #808080 #ffffff",
              padding: "2px 10px",
              fontSize: "11px",
              fontFamily: "Tahoma, Arial, sans-serif",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontWeight: i === 0 ? "bold" : "normal",
            }}
          >
            <Music size={11} />
            {w}
          </button>
        ))}

        <div style={{ flex: 1 }} />

        {/* Clock */}
        <div
          style={{
            background: "#d4d0c8",
            border: "1px solid",
            borderColor: "#808080 #ffffff #ffffff #808080",
            padding: "2px 8px",
            fontSize: "11px",
            fontFamily: "Tahoma, Arial, sans-serif",
          }}
        >
          {new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
