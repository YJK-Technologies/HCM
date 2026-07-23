import { useState, useEffect } from "react";
import "./input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import Select from "react-select";
import { showConfirmationToast } from './ToastConfirmation';
import LoadingScreen from './Loading';
const config = require("./Apiconfig");

function PMSsettings() {
  const [statusdrop, setStatusdrop] = useState([]);
  const [PerDayWorkingHours, setPerDayWorkingHours] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [status, setstatus] = useState("");
  const [checkInMode, setCheckInMode] = useState('Manual'); // or '' for empty initial state
  const [error, setError] = useState("");
  const [isUpdateVisible, setIsUpdateVisible] = useState(false);
  const [isSelectStatus, setIsSelectStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const permissions = JSON.parse(sessionStorage.getItem("permissions")) || {};
  const pMSsettingsPermissions = permissions
    .filter((permission) => permission.screen_type === "PMSsettings")
    .map((permission) => permission.permission_type.toLowerCase());


  const filteredOptionStatus = statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleChangeStatus = (selectedStatus) => {
    setSelectedStatus(selectedStatus);
    setstatus(selectedStatus ? selectedStatus.value : '');
  };

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setStatusdrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/GetPMSsettings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
        Location_Code: sessionStorage.getItem('selectedLocationCode'),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data || data.length === 0) return;

        const { Status, Per_Day_Working_hours, Check_In_Mode } = data[0];

        const setDefault = (type, setType, options, setSelected) => {
          if (type !== undefined && type !== null) {
            const typeStr = type.toString();
            setType(typeStr);
            setSelected(options.find((opt) => opt.value === typeStr) || null);
          }
        };

        setDefault(Status, setstatus, filteredOptionStatus, setSelectedStatus);

        if (Per_Day_Working_hours) {
          setPerDayWorkingHours(Per_Day_Working_hours);
        }

        if (Check_In_Mode) {
          setCheckInMode(Check_In_Mode);
        }

        // 👇 Show Update button and hide Save
        setIsUpdateVisible(true);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [statusdrop]);

  const handleSave = async () => {
    setLoading(true);
    if (
      !PerDayWorkingHours ||
      !status ||
      !checkInMode
    ) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }
    try {
      const response = await fetch(`${config.apiBaseUrl}/AddPMSSetting`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem('selectedCompanyCode'),
          Location_Code: sessionStorage.getItem('selectedLocationCode'),
          Per_Day_Working_hours: PerDayWorkingHours,
          Status: status,
          Check_In_Mode: checkInMode,
          created_by: sessionStorage.getItem('selectedUserCode')
        }),
      });
      if (response.status === 200) {
        console.log("Data inserted successfully");
        setTimeout(() => {
          toast.success("Data inserted successfully!", {
            onClose: () => window.location.reload(), // Reloads the page after the toast closes
          });
        }, 1000);
      } else {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.warning(errorResponse.message);
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error('Error inserting data: ' + error.message);
    }finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    if (!PerDayWorkingHours || !status) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }

    showConfirmationToast(
      "Are you sure you want to Delete the data ?",
      async () => {
        try {
          const Header = {
            company_code: sessionStorage.getItem("selectedCompanyCode"),
            modified_by: sessionStorage.getItem('selectedUserCode'),
            Location_Code: sessionStorage.getItem('selectedLocationCode'),
          };

          const response = await fetch(`${config.apiBaseUrl}/deletePMSsettings`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(Header),
          });

          if (response.status === 200) {
            console.log("Data deleted successfully");
            setTimeout(() => {
              toast.success("Data deleted successfully!", {
                onClose: () => window.location.reload(),
              });
            }, 1000);
          } else {
            const errorResponse = await response.json();
            toast.warning(errorResponse.message || "Failed to insert sales data");
            console.error(errorResponse.details || errorResponse.message);
          }
        } catch (error) {
          console.error("Error inserting data:", error);
          toast.error('Error inserting data: ' + error.message);
        }finally {
      setLoading(false);
    }
      },
      () => {
        toast.info("Data Delete cancelled.");
      }
    );
  };

  const handleUpdate = async () => {
    setLoading(true);
    if (!PerDayWorkingHours || !status || !checkInMode) {
      setError(" ");
      return;
    }

    try {
      const response = await fetch(`${config.apiBaseUrl}/PMSsettingsUpdate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem('selectedCompanyCode'),
          Location_Code: sessionStorage.getItem('selectedLocationCode'),
          Per_Day_Working_hours: PerDayWorkingHours,
          Status: status,
          Check_In_Mode: checkInMode,
          modified_by: sessionStorage.getItem('selectedUserCode')
        }),
      });

      if (response.status === 200) {
        console.log("Data inserted successfully");
        toast.success("Data Updated successfully!");

        // ⏳ Wait and reload
        setTimeout(() => {
          window.location.reload();
        }, 1500);

      } else if (response.status === 400) {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.warning(errorResponse.message);
      } else {
        console.error("Failed to insert data");
        toast.error("Failed to insert data");
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error("Error inserting data: " + error.message);
    }finally {
      setLoading(false);
    }
  };

  const reloadGridData = () => {
    window.location.reload();
  };

  return (
    <div className="container-fluid Topnav-screen">
      {loading && <LoadingScreen />}
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="shadow-lg p-1 bg-light rounded main-header-box">

        <div className="header-flex">
          <h1 className="page-title">PMS Setting Screen</h1>

          <div className="action-wrapper desktop-actions">
            {!isUpdateVisible && ['add', 'all permission'].some(permission => pMSsettingsPermissions.includes(permission)) && (
              <div className="action-icon add" onClick={handleSave}>
                <span className="tooltip">save</span>
                <i class="fa-solid fa-floppy-disk"></i>
              </div>
            )}
            <div className="action-icon print" onClick={reloadGridData}>
              <span className="tooltip">Reload</span>
              <i className="fa-solid fa-arrow-rotate-right"></i>
            </div>
          </div>

          {/* Mobile Dropdown */}
          <div className="dropdown mobile-actions">
            <button
              className="btn btn-primary dropdown-toggle p-0"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="fa-solid fa-ellipsis-vertical"></i>
            </button>

            <ul className="dropdown-menu dropdown-menu-end text-center">
              {!isUpdateVisible && ['add', 'all permission'].some(p => pMSsettingsPermissions.includes(p)) && (
                <li>
                  <button className="dropdown-item" onClick={handleSave}>
                    <i className="fa-solid fa-floppy-disk add fs-4"></i>
                  </button>
                </li>
              )}
              <li>
                <button className="dropdown-item" onClick={reloadGridData}>
                  <i className="fa-solid fa-arrow-rotate-right text-dark fs-4"></i>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="shadow-lg p-3 bg-light rounded mt-2 container-form-box">
        <div className="row g-3">

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="cusoff"
                className="exp-input-field form-control"
                placeholder=" "
                autoComplete="off"
                type="number"
                value={PerDayWorkingHours}
                onChange={(e) => setPerDayWorkingHours(e.target.value)}
                maxLength={20}
              />
              <label className={`exp-form-labels ${error && !PerDayWorkingHours ? 'text-danger' : ''}`}>
                Per Day Working Hours <span className="text-danger">*</span>
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedStatus ? "has-value" : ""} 
              ${isSelectStatus ? "is-focused" : ""}`}
            >
              <Select
                id="status"
                value={selectedStatus}
                onChange={handleChangeStatus}
                onKeyDown={(e) => e.key === 'Enter'()}
                options={filteredOptionStatus}
                placeholder=" "
                onFocus={() => setIsSelectStatus(true)}
                onBlur={() => setIsSelectStatus(false)}
                classNamePrefix="react-select"
                isClearable
              />
              <label className={`floating-label ${error && !selectedStatus ? 'text-danger' : ''}`}>
                Status<span className="text-danger">*</span>
              </label>
            </div>
          </div>

          {/* Check-In Mode Field */}
          <div className="col-md-3">
            <div className="d-flex align-items-center h-100">
              <label
                className={`form-label mb-0 me-3 ${error && !checkInMode ? 'text-danger' : ''}`}
                style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}
              >
                Check-In Mode <span className="text-danger">*</span>
              </label>

              <div className="form-check mb-0 me-3">
                <input
                  className="form-check-input"
                  type="radio"
                  name="checkInMode"
                  id="checkInManual"
                  value="Manual"
                  checked={checkInMode === 'Manual'}
                  onChange={(e) => setCheckInMode(e.target.value)}
                />
                <label className="form-check-label" htmlFor="checkInManual">
                  Manual
                </label>
              </div>

              <div className="form-check mb-0">
                <input
                  className="form-check-input"
                  type="radio"
                  name="checkInMode"
                  id="checkInIntegration"
                  value="Integration"
                  checked={checkInMode === 'Integration'}
                  onChange={(e) => setCheckInMode(e.target.value)}
                />
                <label className="form-check-label" htmlFor="checkInIntegration">
                  Integration
                </label>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="search-btn-wrapper">
              {isUpdateVisible && ['update', 'all permission'].some(permission => pMSsettingsPermissions.includes(permission)) && (
                  <div className="icon-btn save" onClick={handleUpdate}>
                    <span className="tooltip">Update</span>
                    <i className="fa-solid fa-floppy-disk"></i>
                  </div>
                )}

              {isUpdateVisible && ['delete', 'all permission'].some(permission => pMSsettingsPermissions.includes(permission)) && (
                  <div className="icon-btn delete" onClick={handleDelete}>
                    <span className="tooltip">Delete</span>
                    <i className="fa-solid fa-trash"></i>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PMSsettings;
