// import { useState, useEffect } from "react";
// import { ThemeProvider } from "./ThemeContext";
// import AppContent from "./App_content";
// import ForgotPopup from "./Forgotpopup";
// import Select from "react-select";

// const config = require("./Apiconfig");

// const SettingsPage = () => {
//   const [open, setOpen] = useState(false);
//   const [perioddrop, setPerioddrop] = useState([]);
//   const [selectedPeriod, setSelectedPeriod] = useState(null);

//   // For floating label focus status
//   const [isSelectLanguage, setIsSelectLanguage] = useState(false);
//   const [isSelectSales, setIsSelectSales] = useState(false);
//   const [isSelectPurchase, setIsSelectPurchase] = useState(false);
//   const [isSelectItems, setIsSelectItems] = useState(false);
//   const [isSelectStock, setIsSelectStock] = useState(false);
//   const [selectedOption, setSelectedOption] = useState("");

//   // useEffect(() => {
//   //   fetch(`${config.apiBaseUrl}/getDateRange`)
//   //     .then((data) => data.json())
//   //     .then((val) => {
//   //       setPerioddrop(val);

//   //       if (val?.length > 0) {
//   //         const first = {
//   //           value: val[0].Sno,
//   //           label: val[0].DateRangeDescription,
//   //         };
//   //         setSelectedPeriod(first);
//   //       }
//   //     });
//   // }, []);

//   const filteredOptionPeriod = perioddrop.map((option) => ({
//     value: option.Sno,
//     label: option.DateRangeDescription,
//   }));

//   const languageOptions = [
//     { value: "en", label: "English" },
//     { value: "fr", label: "French" },
//     { value: "es", label: "Spanish" },
//   ];

//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);

//   return (
//     <div className="container-fluid Topnav-screen">
//       {/* ---------------- Header Box ---------------- */}
//       <div className="shadow-lg p-1 bg-light rounded main-header-box">
//         <div className="header-flex">
//           <h1 className="page-title">Settings</h1>

//           {/* -------- Desktop Icons -------- */}
//           <div className="action-wrapper desktop-actions">
//             <div className="action-icon add">
//               <span className="tooltip">Save</span>
//               <i className="fa-solid fa-floppy-disk"></i>
//             </div>

//             <div className="action-icon search me-2" onClick={handleOpen}>
//               <span className="tooltip">Reset Password</span>
//               <i className="fa-solid fa-unlock-keyhole"></i>
//             </div>
//           </div>

//           {/* -------- Mobile Dropdown Actions -------- */}
//           <div className="dropdown mobile-actions">
//             <button className="btn btn-primary dropdown-toggle p-1" data-bs-toggle="dropdown">
//               <i className="fa-solid fa-list"></i>
//             </button>

//             <ul className="dropdown-menu dropdown-menu-end text-center">
//               <li className="dropdown-item">
//                 <i className="fa-solid fa-floppy-disk text-success fs-4"></i>
//               </li>

//               <li className="dropdown-item" onClick={handleOpen}>
//                 <i className="fa-solid fa-unlock-keyhole text-primary fs-4"></i>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </div>

//       {/* ---------------- Main Form Box ---------------- */}
//       <div className="shadow-lg p-3 bg-light rounded mt-2 container-form-box">
//         <div className="row g-3">
//           {/* --------------- LANGUAGE ---------------- */}
//           <div className="col-md-2 me-4">
//             <label className="fw-bold fs-5">General :</label>

//             <div
//               className={`inputGroup selectGroup 
//               ${selectedOption ? "has-value" : ""} 
//               ${isSelectLanguage ? "is-focused" : ""}`}
//             >
//               <Select
//                 options={languageOptions}
//                 value={selectedOption}
//                 onChange={setSelectedOption}
//                 classNamePrefix="react-select"
//                 isClearable
//                 placeholder=""
//                 onFocus={() => setIsSelectLanguage(true)}
//                 onBlur={() => setIsSelectLanguage(false)}
//               />
//               <label className="floating-label">Language</label>
//             </div>
//           </div>

//           {/* --------------- DASHBOARD SETTINGS ---------------- */}
//           <div className="col-md-4">
//             <label className="fw-bold fs-5">Dashboard Settings :</label>

//             <div className="row">
//               {/* Total Sales */}
//               <div className="col-12 col-md-8">
//                 <div
//                   className={`inputGroup selectGroup 
//                     ${selectedPeriod ? "has-value" : ""} 
//                     ${isSelectSales ? "is-focused" : ""}`}
//                 >
//                   <Select
//                     value={selectedPeriod}
//                     onChange={setSelectedPeriod}
//                     options={filteredOptionPeriod}
//                     classNamePrefix="react-select"
//                     placeholder=""
//                     isClearable
//                     onFocus={() => setIsSelectSales(true)}
//                     onBlur={() => setIsSelectSales(false)}
//                   />
//                   <label className="floating-label">Total Sales</label>
//                 </div>
//               </div>

//               {/* Total Purchase */}
//               <div className="col-12 col-md-8">
//                 <div
//                   className={`inputGroup selectGroup 
//                     ${selectedPeriod ? "has-value" : ""} 
//                     ${isSelectPurchase ? "is-focused" : ""}`}
//                 >
//                   <Select
//                     value={selectedPeriod}
//                     onChange={setSelectedPeriod}
//                     options={filteredOptionPeriod}
//                     classNamePrefix="react-select"
//                     placeholder=""
//                     isClearable
//                     onFocus={() => setIsSelectPurchase(true)}
//                     onBlur={() => setIsSelectPurchase(false)}
//                   />
//                   <label className="floating-label">Total Purchase</label>
//                 </div>
//               </div>

//               {/* Total Items */}
//               <div className="col-12 col-md-8">
//                 <div
//                   className={`inputGroup selectGroup 
//                     ${selectedPeriod ? "has-value" : ""} 
//                     ${isSelectItems ? "is-focused" : ""}`}
//                 >
//                   <Select
//                     value={selectedPeriod}
//                     onChange={setSelectedPeriod}
//                     options={filteredOptionPeriod}
//                     classNamePrefix="react-select"
//                     placeholder=""
//                     isClearable
//                     onFocus={() => setIsSelectItems(true)}
//                     onBlur={() => setIsSelectItems(false)}
//                   />
//                   <label className="floating-label">Total Items</label>
//                 </div>
//               </div>

//               {/* Total Stock Values */}
//               <div className="col-12 col-md-8">
//                 <div
//                   className={`inputGroup selectGroup 
//                     ${selectedPeriod ? "has-value" : ""} 
//                     ${isSelectStock ? "is-focused" : ""}`}
//                 >
//                   <Select
//                     value={selectedPeriod}
//                     onChange={setSelectedPeriod}
//                     options={filteredOptionPeriod}
//                     classNamePrefix="react-select"
//                     placeholder=""
//                     isClearable
//                     onFocus={() => setIsSelectStock(true)}
//                     onBlur={() => setIsSelectStock(false)}
//                   />
//                   <label className="floating-label">Total Stock Values</label>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* --------------- THEME ---------------- */}
//           <div className="col-md-2">
//             <label className="fw-bold fs-5">Theme :</label>
//             <div className="inputGroup">
//               <ThemeProvider>
//                 <AppContent />
//               </ThemeProvider>
//             </div>
//           </div>

//           {/* ---------------- Forgot Password Popup ---------------- */}
//           <ForgotPopup open={open} handleClose={handleClose} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SettingsPage;

import { useState } from "react";
import { ThemeProvider } from "./ThemeContext";
import AppContent from "./App_content";
import ForgotPopup from "./Forgotpopup";
import Select from "react-select";
import { ToastContainer } from 'react-toastify';

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

  const languageOptions = [
    { value: "en", label: "English" },
    { value: "fr", label: "French" },
    { value: "es", label: "Spanish" },
  ];

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
                <h3>Dashboard Visualizations</h3>
              </div>

              <div className="card-body-simple">
                <p className="section-instruction">
                  Customize the default data ranges and visibility for your dashboard widgets.
                </p>

                {/* Grid: 1 col on mobile, 2 on tablet, 3 on desktop */}
                <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">

                  {/* Total Sales */}
                  <div className="col">
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
                  </div>

                  {/* Total Purchase */}
                  <div className="col">
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
                  </div>

                  {/* Total Items */}
                  <div className="col">
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
                  </div>

                  {/* Total Stock Values */}
                  <div className="col">
                    <div className="custom-select-container">
                      <label><i className="fa-solid fa-warehouse me-2"></i>Total Stock Values</label>
                      <Select
                        // value={stockPeriod}
                        // onChange={setStockPeriod}
                        // options={filteredOptionPeriod}
                        classNamePrefix="modern-select"
                        placeholder="Select Period"
                        isClearable
                      />
                    </div>
                  </div>

                  {/* Upcoming Birthdays Input */}
                  <div className="col">
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
                  </div>

                  {/* New Joinees Input */}
                  <div className="col">
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
                  </div>

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