import "./Home.css";
import { useNavigate } from "react-router-dom";
import bgImage from "./background.png";
import Logo from "./main.png";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="hcm-dark-theme">
      {/* Dynamic Background Overlay */}
      <div className="bg-overlay" style={{ backgroundImage: `url(${bgImage})` }}></div>

      <nav className="hcm-navbar">
        <div className="logo">HCM<span>.</span>PRO</div>
        <div className="nav-group">
          {/* <button className="text-link">Product</button> */}
          {/* <button className="text-link">Pricing</button> */}
          <button className="cta-outline" onClick={() => navigate("/Login")}>Login</button>
        </div>
      </nav>

      <section className="hero-center">
        <div className="glass-hero-card">
          <div className="status-pill">● System Live: v1.0.0</div>
          <h1>Unified Intelligence for <span>Modern Teams.</span></h1>
          <p>
            The all-in-one platform to hire, pay, and manage your global workforce
            with total compliance and zero friction.
          </p>

          <div className="search-box-mockup">
            {/* <input type="text" placeholder="Enter your work email..." /> */}
            <button onClick={() => navigate("/Login")}>Get Started</button>
          </div>

          <div className="trust-badges">
            <span>Trusted by:</span>
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