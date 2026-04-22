import { useState, useEffect, useRef } from "react";
import { ThemeProvider } from "./ThemeContext";
import AppContent from "./App_content";
import ForgotPopup from "./Forgotpopup";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";

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
  const [loading, setLoading] = useState(false);

  const [DateDrop, setDateDrop] = useState([]);
  const [dateFormat, setDateFormat] = useState('');
  const [dateFormatValue, setDateFormatValue] = useState('');
  const [currencyDrop, setCurrencyDrop] = useState([]);
  const [currency, setCurrency] = useState('');
  const [currencyValue, setCurrencyValue] = useState('');

  const [errors, setErrors] = useState(false);

  const config = require("./Apiconfig");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/getSettings`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            company_code: sessionStorage.getItem("selectedCompanyCode"),
          }),
        });

        const data = await response.json();

        if (data && data.length > 0) {
          const settings = data[0];

          const selectedLang = languageOptions.find(
            (opt) => opt.value === settings.Default_language
          );
          setSelectedOption(selectedLang);

          const selectedDate = filteredOptionDate.find(
            (opt) => opt.value === settings.Default_date_format
          );
          setDateFormat(selectedDate);

          const selectedCurrency = filteredOptionCurrency.find(
            (opt) => opt.value === settings.Default_currency
          );
          setCurrency(selectedCurrency);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    fetchSettings();
  }, [DateDrop, currencyDrop]);

  const languageOptions = [
    { value: "English", label: "English" },
    { value: "French", label: "French" },
    { value: "Spanish", label: "Spanish" },
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

  const handleChangeDateFormat = (selected) => {
    setDateFormat(selected);
    setDateFormatValue(selected ? selected.value : '');
  };

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    fetch(`${config.apiBaseUrl}/getCurrenyCode`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => setCurrencyDrop(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const filteredOptionCurrency = Array.isArray(currencyDrop)
    ? currencyDrop.map((option) => ({
      value: option?.attributedetails_name,
      label: option?.attributedetails_name,
    }))
    : [];

  const handleChangeCurrency = (selected) => {
    setCurrency(selected);
    setCurrencyValue(selected ? selected.value : '');
  };


  const handleSave = async () => {

    if (!dateFormatValue || !currencyValue) {
      toast.warning("Please select required fields");
      setErrors(true);
      return;
    }

    setLoading(true);
    setErrors(false);

    try {
      const payload = {
        Default_date_format: dateFormatValue,
        Default_language: selectedOption.value,
        Default_currency: currencyValue,
        Status: 'Active',
        company_code: sessionStorage.getItem("selectedCompanyCode"),
        created_by: sessionStorage.getItem("selectedUserCode"),
      };

      const response = await fetch(`${config.apiBaseUrl}/global_settingsInsert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Settings saved successfully!", {
          onClose: () => window.location.reload(),
        });
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to save settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

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
          <button className="btn-reset" title="Reset Password" onClick={() => setOpen(true)}>
            <i className="fa-solid fa-key"></i>
            <span>Reset Password</span>
          </button>
          <button className="btn-save" title="Save Changes" onClick={handleSave}>
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
                  <label title="Select your preferred system language">
                    System Language
                  </label>

                  <div title="This controls the language used throughout the application">
                    <Select
                      options={languageOptions}
                      value={selectedOption}
                      onChange={setSelectedOption}
                      isClearable
                      classNamePrefix="modern-select"
                      placeholder="Select Language..."
                    />
                  </div>
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
                <h3>Regional Format Settings</h3>
              </div>

              <div className="card-body-simple">
                <p className="section-instruction">
                  Configure your default date format and currency display preferences.
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

                  {/* Total Stock Values */}
                  <div className="col">
                    <div className="custom-select-container">
                      <label style={{ color: errors && !dateFormatValue ? "red" : "" }}>
                        <i className="fa-solid fa-warehouse me-2"></i>
                        Date Format<span className="text-danger">*</span>
                      </label>
                      <div title="Choose how dates will be displayed across the system">
                        <Select
                          value={dateFormat}
                          onChange={handleChangeDateFormat}
                          options={filteredOptionDate}
                          classNamePrefix="modern-select"
                          placeholder="Select Date Format"
                          isClearable
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col">
                    <div className="custom-select-container">
                      <label
                        title="Select the default currency used across the system"
                        style={{ color: errors && !currencyValue ? "red" : "" }}
                      >
                        <i className="fa-solid fa-warehouse me-2"></i>
                        Currency<span className="text-danger">*</span>
                      </label>

                      <div title="Choose the currency for transactions and reports">
                        <Select
                          value={currency}
                          onChange={handleChangeCurrency}
                          options={filteredOptionCurrency}
                          classNamePrefix="modern-select"
                          placeholder="Select Currency"
                          isClearable
                        />
                      </div>
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