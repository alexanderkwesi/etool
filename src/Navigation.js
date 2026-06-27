import React, { useState, useEffect } from "react";
import "./Navigation.css";

const navItems = [
  { id: "introduction", label: "Introduction" },
  { id: "dashboard-layout", label: "Dashboard Layout" },
  { id: "plan-system", label: "Plan & Tier System" },
  { id: "file-operations", label: "File Operations" },
  { id: "security-privacy", label: "Security & Encryption" },
  { id: "team-management", label: "Team Management" },
  { id: "support-resources", label: "Support & Help" },
];

const Navigation = () => {
  const [activeSection, setActiveSection] = useState("");
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
    setIsMobileOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map((item) => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i] && scrollPosition >= sections[i].offsetTop) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <button
        className="mobile-menu-toggle"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? "✕" : "☰"}
      </button>

      <nav
        className={`navigation-container ${isMobileOpen ? "mobile-open" : ""}`}
      >
        <ul className="nav-list">
          {navItems.map((item) => (
            <li key={item.id} className="nav-item">
              <button
                onClick={() => scrollTo(item.id)}
                className={`nav-button ${activeSection === item.id ? "active" : ""}`}
              >
                <span className="nav-dot"></span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
        <div className="quick-links-section">
          <h3 className="quick-links-title">Quick Links</h3>
          <ul className="quick-links-list">
            <li className="quick-link-item">
              <a
                href="#"
                className="quick-link"
                onClick={() => setIsMobileOpen(false)}
              >
                FAQ
              </a>
            </li>
            <li className="quick-link-item">
              <a
                href="#"
                className="quick-link"
                onClick={() => setIsMobileOpen(false)}
              >
                Video Tutorials
              </a>
            </li>
            <li className="quick-link-item">
              <a
                href="#"
                className="quick-link"
                onClick={() => setIsMobileOpen(false)}
              >
                API Reference
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
