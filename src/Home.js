import { useState, useEffect } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import Logo from "./main.png";   // YJK gold logo — same as Login.js

/* ─────────────────────────────────────────
   Bubble field — same engine as Login
   3 types: gold, blue, teal, silver
   ───────────────────────────────────────── */
const BUBBLE_TYPES = [
  'gold', 'blue', 'teal', 'gold', 'silver', 'blue',
  'gold', 'teal', 'silver', 'gold', 'blue', 'teal',
  'silver', 'gold', 'blue', 'teal', 'gold', 'silver',
];

const BubbleField = () => (
  <div className="bubble-field" aria-hidden="true">
    {BUBBLE_TYPES.map((cls, i) => (
      <div key={i} className={`bubble ${cls}`} />
    ))}
  </div>
);

/* ─────────────────────────────────────────
   Stats
   ───────────────────────────────────────── */
const STATS = [
  { value: "500+", label: "Companies" },
  { value: "50K+", label: "Employees Managed" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "30+", label: "HR Modules" },
];

/* ─────────────────────────────────────────
   Features
   ───────────────────────────────────────── */
const FEATURES = [
  {
    icon: "💰",
    title: "Automated Payroll",
    desc: "Process salaries across departments with tax compliance, deductions, and instant payslip generation.",
    tag: "Core",
    main: true,
  },
  {
    icon: "🕐",
    title: "Attendance & Leave",
    desc: "Real-time tracking with geo-fencing, shift management, and leave approval workflows.",
    tag: "Operations",
    main: false,
  },
  {
    icon: "📈",
    title: "AI-Powered Insights",
    desc: "Predict attrition, monitor KPIs, and surface actionable workforce analytics.",
    tag: "Analytics",
    main: false,
  },
  {
    icon: "🎯",
    title: "Performance & Appraisals",
    desc: "Set goals, run 360° reviews, and link performance directly to compensation.",
    tag: "Growth",
    main: false,
  },
  {
    icon: "🚀",
    title: "Onboarding",
    desc: "Paperless journeys from offer letter to Day 1 — fully automated.",
    tag: "Hiring",
    main: false,
  },
];

/* ─────────────────────────────────────────
   Component
   ───────────────────────────────────────── */
const Home = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 60);

    const handleKeyDown = (e) => {
      if (e.key === "Enter") navigate("/Login");
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate]);

  return (
    <div className="hcm-dark-theme">

      {/* ── Layered background ── */}
      <div className="bg-overlay" />

      {/* ── Geometric grid lines (screenshot style) ── */}
      <div className="grid-lines" />

      {/* ── Gold + blue + teal bubbles ── */}
      <BubbleField />

      {/* ══════════════════════════
          NAVBAR
          ══════════════════════════ */}
      <nav className={`hcm-navbar fade-down ${isVisible ? "active" : ""}`}>

        <div className="navbar-brand">
          <img src={Logo} alt="YJK Logo" className="navbar-logo" />
          <span className="navbar-wordmark">TECHNOLOGIES</span>
        </div>

        <div className="nav-group">
          <div className="nav-live-badge">
            <span className="live-dot" />
            System Live: v1.0.0
          </div>

          {/* <button
            className="nav-login-btn"
            onClick={() => navigate("/Login")}
          >
            Sign In →
          </button> */}
        </div>
      </nav>

      {/* ══════════════════════════
          HERO
          ══════════════════════════ */}
      <section className="hero-center">
        <div className={`glass-hero-card fade-up ${isVisible ? "active" : ""}`}>

          {/* Logo */}
          <div className="hero-logo-block reveal-text-1">
            <img src={Logo} alt="YJK HCM" className="hero-logo-img" />
            <span className="hero-logo-name">TECHNOLOGIES</span>
          </div>

          {/* Status pill */}
          <div className="status-pill reveal-text-1">
            <span className="static-dot" />
            Human Capital Management Platform
          </div>

          {/* Headline */}
          <h1 className="reveal-text-2">
            Unified Intelligence for{" "}
            <span>Modern Teams.</span>
          </h1>

          {/* Subtitle */}
          <p className="reveal-text-3">
            The all-in-one platform to hire, pay, and manage your global
            workforce with total compliance and zero friction.
          </p>

          {/* CTA */}
          <div className="search-box-mockup reveal-text-4">
            <button
              className="btn-solid"
              onClick={() => navigate("/Login")}
            >
              Get Started
              <span className="btn-arrow">→</span>
            </button>
          </div>

          {/* Trust */}
          <div className="trust-badges reveal-text-5">
            <span className="trusted-text">Trusted by</span>
            <div className="brand-icons">
              <img src={Logo} alt="YJK" className="brand-logo" />
              <strong>TECHNOLOGIES</strong>
            </div>
            <span className="footer-copy">
              © 2025 YJK Technologies. Human Capital Management.
            </span>
          </div>

        </div>
      </section>

      {/* ══════════════════════════
          STATS
          ══════════════════════════ */}
      {/* <div className="stats-strip">
        <div className="stats-inner">
          {STATS.map((s) => (
            <div className="stat-item" key={s.label}>
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div> */}

      {/* ══════════════════════════
          FEATURES
          ══════════════════════════ */}
      {/* <section className="features-section">

        <div className="section-label">
          <span className="section-label-dot" />
          Platform Capabilities
        </div>

        <h2 className="section-heading">
          Everything your HR team<br />
          <em>actually needs.</em>
        </h2>

        <p className="section-sub">
          From hire to retire — every workflow automated,
          every decision data-driven.
        </p>

        <div className="bento-grid">
          {FEATURES.map((f) => (
            <div
              className={`bento-item ${f.main ? "main" : ""}`}
              key={f.title}
            >
              <div className="bento-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
              <span className="bento-tag">{f.tag}</span>
            </div>
          ))}
        </div>

      </section> */}

      {/* ══════════════════════════
          FOOTER
          ══════════════════════════ */}
      {/* <footer className="home-footer">
        <div className="footer-brand">
          <img src={Logo} alt="YJK" className="footer-logo" />
          <span className="footer-name">YJK</span>
        </div>

        <span className="footer-right">v1.0.0</span>
      </footer> */}

    </div>
  );
};

export default Home;