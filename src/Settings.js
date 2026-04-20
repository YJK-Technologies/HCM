import { useState, useEffect, useRef } from "react";
import { ThemeProvider } from "./ThemeContext";
import AppContent from "./App_content";
import ForgotPopup from "./Forgotpopup";
import Select from "react-select";
import { ToastContainer } from "react-toastify";

const SettingsPage = () => {
  const [open, setOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [salesPeriod, setSalesPeriod] = useState(null);
  const [purchasePeriod, setPurchasePeriod] = useState(null);
  const [itemsPeriod, setItemsPeriod] = useState(null);
  const [stockPeriod, setStockPeriod] = useState(null);
  const [birthdayPeriod, setBirthdayPeriod] = useState(null);
  const [joineesPeriod, setJoineesPeriod] = useState(null);
  const [birthdayDays, setBirthdayDays] = useState(null);
  const [joineesDays, setJoineesDays] = useState(null);
  const [DateDrop, setDateDrop] = useState([]);
  const [dateFormat, setDateFormat] = useState(null);
  
  const config = require("./Apiconfig");

  const languageOptions = [
    { value: "en", label: "English" },
    { value: "fr", label: "French" },
    { value: "es", label: "Spanish" },
  ];

  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/getDateFormat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            company_code: sessionStorage.getItem("selectedCompanyCode"),
          }),
        });

        const val = await response.json();
        setDateDrop(val);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchLeaveData();
  }, []);

  const filteredOptionDate = DateDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_code,
  }));

  return (
    <div className="container-fluid Topnav-screen">
      <ToastContainer position="top-right" theme="colored" />
      <header className="settings-header shadow-sm">
        <div className="header-left">
          <i className="fa-solid fa-gear header-icon"></i>
          <div>
            <h1>Global Settings</h1>
            <p>Manage your preferences and dashboard configurations</p>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn-reset" onClick={() => setOpen(true)}>
            <i className="fa-solid fa-key"></i>
            <span>Reset Password</span>
          </button>
          <button className="btn-save">
            <i className="fa-solid fa-floppy-disk"></i> Save Changes
          </button>
        </div>
      </header>

      <main className="settings-content">
        <div className="row g-2 mb-2">
          <div className="col-lg-4">
            <section className="settings-card shadow-sm">
              <div className="card-header-simple">
                <i className="fa-solid fa-globe"></i>
                <h3>General Preferences</h3>
              </div>
              <div className="card-body-simple">
                <div className="custom-select-container">
                  <label>System Language</label>
                  <Select
                    options={languageOptions}
                    value={selectedOption}
                    onChange={setSelectedOption}
                    classNamePrefix="modern-select"
                    placeholder="Select Language..."
                  />
                </div>

                <div className="theme-toggle-box">
                  <label>Appearance Mode</label>
                  <ThemeProvider>
                    <AppContent />
                  </ThemeProvider>
                </div>
              </div>
            </section>
          </div>

          <div className="col-lg-8">
            <section className="settings-card shadow-sm">
              <div className="card-header-simple">
                <i className="fa-solid fa-chart-line"></i>
                <h3>Global Date Format</h3>
              </div>

              <div className="card-body-simple">
                <p className="section-instruction">
                  Customize the default data ranges and visibility for your
                  Global Date Format.
                </p>

                {/* Grid: 1 col on mobile, 2 on tablet, 3 on desktop */}
                <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
                  {/* Total Sales */}
                  {/* <div className="col">
                    <div className="custom-select-container">
                      <label><i className="fa-solid fa-sack-dollar me-2"></i>Total Sales Period</label>
                      <Select
                        // value={salesPeriod}
                        // onChange={setSalesPeriod}
                        // options={filteredOptionPeriod}
                        classNamePrefix="modern-select"
                        placeholder="Select Period"
                        isClearable
                      />
                    </div>
                  </div> */}

                  {/* Total Purchase */}
                  {/* <div className="col">
                    <div className="custom-select-container">
                      <label><i className="fa-solid fa-cart-shopping me-2"></i>Total Purchase Period</label>
                      <Select
                        // value={purchasePeriod}
                        // onChange={setPurchasePeriod}
                        // options={filteredOptionPeriod}
                        classNamePrefix="modern-select"
                        placeholder="Select Period"
                        isClearable
                      />
                    </div>
                  </div> */}

                  {/* Total Items */}
                  {/* <div className="col">
                    <div className="custom-select-container">
                      <label><i className="fa-solid fa-boxes-stacked me-2"></i>Total Items Period</label>
                      <Select
                        // value={itemsPeriod}
                        // onChange={setItemsPeriod}
                        // options={filteredOptionPeriod}
                        classNamePrefix="modern-select"
                        placeholder="Select Period"
                        isClearable
                      />
                    </div>
                  </div> */}

                  {/* Total Stock Values */}
                  <div className="col">
                    <div className="custom-select-container">
                      <label>
                        <i className="fa-solid fa-warehouse me-2"></i>Date  Format</label>
                      <Select
                        value={dateFormat}
                        onChange={setDateFormat}
                        options={filteredOptionDate} // ✅ correct options
                        classNamePrefix="modern-select"
                        placeholder="Select Date Format"
                        isClearable
                      />
                    </div>
                  </div>

                  {/* Upcoming Birthdays Input */}
                  {/* <div className="col">
                    <div className="custom-input-group">
                      <label>
                        <i className="fa-solid fa-cake-candles me-2"></i>Upcoming Birthdays
                      </label>
                      <div className="input-with-icon">
                        <input
                          type="number"
                          className="modern-text-input"
                          placeholder="e.g. 7 days"
                          value={birthdayDays}
                          onChange={(e) => setBirthdayDays(e.target.value)}
                        />
                        <span className="input-suffix">Days</span>
                      </div>
                    </div>
                  </div> */}

                  {/* New Joinees Input */}
                  {/* <div className="col">
                    <div className="custom-input-group">
                      <label>
                        <i className="fa-solid fa-user-plus me-2"></i>New Joinees
                      </label>
                      <div className="input-with-icon">
                        <input
                          type="number"
                          className="modern-text-input"
                          placeholder="e.g. 30 days"
                          value={joineesDays}
                          onChange={(e) => setJoineesDays(e.target.value)}
                        />
                        <span className="input-suffix">Days</span>
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <ForgotPopup open={open} handleClose={() => setOpen(false)} />
    </div>
  );
};

export default SettingsPage;
