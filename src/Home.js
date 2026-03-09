import { useState, useEffect } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import Logo from "./main.png";

const Home = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const handleKeyDown = (e) => {
      if (e.key === "Enter") navigate("/Login");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  return (
    <div className="hcm-dark-theme">
      {/* Dynamic Background Overlay */}
      <div className="bg-overlay"></div>

      <nav className={`hcm-navbar fade-down ${isVisible ? "active" : ""}`}>
        <div className="logo">HCM</div>
        <div className="nav-group">
          {/* <button className="text-link">Product</button> */}
          {/* <button className="text-link">Pricing</button> */}
          <button className="cta-outline" onClick={() => navigate("/Login")}>Login</button>
        </div>
      </nav>

      <section className="hero-center">
        <div className={`glass-hero-card fade-up ${isVisible ? "active" : ""}`}>
          <div className="status-pill"><span className="static-dot">●</span> System Live: v1.0.0</div>

          <h1 className="reveal-text-1">Unified Intelligence for <span>Modern Teams.</span></h1>

          <p className="reveal-text-2">
            The all-in-one platform to hire, pay, and manage your global workforce
            with total compliance and zero friction.
          </p>

          <div className="search-box-mockup reveal-text-3">
            {/* <input type="text" placeholder="Enter your work email..." /> */}
            <button className="btn-solid" onClick={() => navigate("/Login")}>Get Started</button>
          </div>

          <div className="trust-badges reveal-text-4">
            <span className="trusted-text">Trusted by:</span>
            <div className="brand-icons">
              <img src={Logo} alt="YJK Logo" className="brand-logo" />
              <strong>YJK TECHNOLOGIES</strong>
            </div>
          </div>
        </div>
      </section>

      {/* <div className="feature-row">
        <div className="bento-box">
          <div className="bento-item main">
             <h3>Automated Payroll</h3>
             <p>Sync with 50+ countries instantly.</p>
          </div>
          <div className="bento-item">
             <h3>AI Insights</h3>
             <p>Predict turnover before it happens.</p>
          </div>
          <div className="bento-item">
             <h3>Compliance</h3>
             <p>Local laws, handled.</p>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Home;