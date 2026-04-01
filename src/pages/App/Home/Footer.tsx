import { Link } from "react-router-dom";
import { Instagram, Youtube } from "lucide-react";
import Lolo_logo_1 from "@/assets/logos/Lolo_logo_1.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "#d4d0c8",
        borderTop: "2px solid #ffffff",
        fontFamily: "Tahoma, Arial, sans-serif",
      }}
    >
      {/* Windows 2000-style section panel */}
      <div
        style={{
          background: "#d4d0c8",
          padding: "12px 16px",
          borderBottom: "1px solid #808080",
        }}
      >
        {/* Title bar for footer */}
        <div
          style={{
            background: "linear-gradient(to right, #0a246a, #a6caf0)",
            padding: "3px 8px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginBottom: "12px",
          }}
        >
          <img
            src={Lolo_logo_1}
            alt="LoLo Logo"
            style={{ height: "14px", width: "14px", objectFit: "contain" }}
          />
          <span
            style={{ color: "white", fontWeight: "bold", fontSize: "11px" }}
          >
            SRKR LOLO Music Club — Footer.exe
          </span>
        </div>

        {/* Grid of link panels */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "10px",
            marginBottom: "12px",
          }}
        >
          {/* Brand panel */}
          <div
            style={{
              background: "#d4d0c8",
              border: "2px solid",
              borderColor: "#ffffff #808080 #808080 #ffffff",
              padding: "8px",
              gridColumn: "span 2",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "8px",
              }}
            >
              <div
                style={{
                  background: "#d4d0c8",
                  border: "1px solid",
                  borderColor: "#ffffff #808080 #808080 #ffffff",
                  padding: "4px",
                }}
              >
                <img
                  src={Lolo_logo_1}
                  alt="LoLo Logo"
                  style={{ height: "20px", width: "20px", objectFit: "contain" }}
                />
              </div>
              <span
                style={{ fontWeight: "bold", fontSize: "14px", color: "#000080" }}
              >
                SRKR LOLO
              </span>
            </div>

            <p
              style={{
                fontSize: "11px",
                color: "#444",
                lineHeight: "1.6",
                marginBottom: "10px",
              }}
            >
              Empowering the next generation of campus artists. We provide the
              stage, the studio, and the community you need to amplify your
              sound.
            </p>

            {/* Address box */}
            <div
              style={{
                background: "#fff",
                border: "1px solid",
                borderColor: "#808080 #fff #fff #808080",
                padding: "8px",
                fontSize: "11px",
                color: "#000",
                lineHeight: "1.8",
              }}
            >
              <div
                style={{
                  fontWeight: "bold",
                  color: "#000080",
                  marginBottom: "4px",
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Contact / Address
              </div>
              SRKR Engineering College
              <br />
              Bhimavaram, Andhra Pradesh - 534204
              <br />
              <a
                href="mailto:bandloloplays0707@gmail.com"
                style={{ color: "#000080", textDecoration: "underline" }}
              >
                bandloloplays0707@gmail.com
              </a>
              <br />
              <a
                href="tel:+918333042318"
                style={{ color: "#000080", textDecoration: "underline" }}
              >
                +91 8333042318
              </a>
            </div>

            {/* Social icons */}
            <div
              style={{
                display: "flex",
                gap: "4px",
                marginTop: "8px",
              }}
            >
              {[
                {
                  icon: Instagram,
                  href: "https://www.instagram.com/lolo.band.official/",
                  label: "Instagram",
                },
                {
                  icon: Youtube,
                  href: "https://www.youtube.com/@LoLoBandOfficial",
                  label: "YouTube",
                },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  aria-label={social.label}
                  style={{
                    background: "#d4d0c8",
                    border: "2px solid",
                    borderColor: "#ffffff #808080 #808080 #ffffff",
                    padding: "4px 6px",
                    color: "#000080",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <social.icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Platform links */}
          <div
            style={{
              background: "#d4d0c8",
              border: "2px solid",
              borderColor: "#ffffff #808080 #808080 #ffffff",
              padding: "8px",
            }}
          >
            <div
              style={{
                background: "#000080",
                color: "#fff",
                padding: "2px 6px",
                fontSize: "11px",
                fontWeight: "bold",
                marginBottom: "8px",
              }}
            >
              Platform
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {[
                { label: "Home", link: "/home" },
                { label: "Events", link: "/events" },
                { label: "Publications", link: "/publications" },
              ].map((item) => (
                <li key={item.label} style={{ marginBottom: "4px" }}>
                  <Link
                    to={item.link}
                    style={{
                      fontSize: "11px",
                      color: "#000080",
                      textDecoration: "underline",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        width: "8px",
                        height: "8px",
                        background: "#000080",
                        marginRight: "4px",
                      }}
                    />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community links */}
          <div
            style={{
              background: "#d4d0c8",
              border: "2px solid",
              borderColor: "#ffffff #808080 #808080 #ffffff",
              padding: "8px",
            }}
          >
            <div
              style={{
                background: "#000080",
                color: "#fff",
                padding: "2px 6px",
                fontSize: "11px",
                fontWeight: "bold",
                marginBottom: "8px",
              }}
            >
              Community
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {[
                { label: "Team", link: "/team" },
                { label: "Registration Status", link: "/registration-status" },
                { label: "Join the Club", link: "/signup" },
              ].map((item) => (
                <li key={item.label} style={{ marginBottom: "4px" }}>
                  <Link
                    to={item.link}
                    style={{
                      fontSize: "11px",
                      color: "#000080",
                      textDecoration: "underline",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        width: "8px",
                        height: "8px",
                        background: "#000080",
                        marginRight: "4px",
                      }}
                    />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div
            style={{
              background: "#d4d0c8",
              border: "2px solid",
              borderColor: "#ffffff #808080 #808080 #ffffff",
              padding: "8px",
            }}
          >
            <div
              style={{
                background: "#000080",
                color: "#fff",
                padding: "2px 6px",
                fontSize: "11px",
                fontWeight: "bold",
                marginBottom: "8px",
              }}
            >
              Support
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {[
                { label: "About Us", link: "/about" },
                { label: "Contact Us", link: "/contact" },
                { label: "FAQ", link: "/faq" },
                { label: "Refund Policy", link: "/refund-policy" },
              ].map((item) => (
                <li key={item.label} style={{ marginBottom: "4px" }}>
                  <Link
                    to={item.link}
                    style={{
                      fontSize: "11px",
                      color: "#000080",
                      textDecoration: "underline",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        width: "8px",
                        height: "8px",
                        background: "#000080",
                        marginRight: "4px",
                      }}
                    />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Status bar / bottom bar */}
      <div
        style={{
          background: "#d4d0c8",
          borderTop: "1px solid #808080",
          padding: "3px 12px",
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "11px",
          color: "#000",
        }}
      >
        <div
          style={{
            border: "1px solid",
            borderColor: "#808080 #fff #fff #808080",
            padding: "1px 8px",
          }}
        >
          &copy; {currentYear} SRKR LOLO. All rights reserved.
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {[
            { label: "Privacy Policy", link: "/privacy-policy" },
            { label: "Terms of Service", link: "/terms-of-service" },
            { label: "Refund Policy", link: "/refund-policy" },
          ].map((item, i) => (
            <Link
              key={i}
              to={item.link}
              style={{
                color: "#000080",
                textDecoration: "underline",
                fontSize: "11px",
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div
          style={{
            border: "1px solid",
            borderColor: "#808080 #fff #fff #808080",
            padding: "1px 8px",
            color: "#000080",
          }}
        >
          srkrlolo.in
        </div>
      </div>
    </footer>
  );
};

export default Footer;
