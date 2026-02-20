import { useState, useEffect } from "react";
import "./input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import { showConfirmationToast } from './ToastConfirmation';
import LoadingScreen from './Loading';
import Select from "react-select";
const config = require('./Apiconfig');

function Input({ }) {

  const [Country_Code, setCountry_Code] = useState('');
  const [Country_Name, setCountry_Name] = useState('');
  const [ISO_Code, setISO_Code] = useState('');
  const [TimeZone_Default, setTimeZone_Default] = useState('');
  const [Week_Start_Day, setWeek_Start_Day] = useState('');
  const [Weekend_Days, setWeekend_Days] = useState('');
  const [Max_Work_Hours_Day, setMax_Work_Work_Day] = useState('');
  const [Max_Work_Hours_Week, setMax_Work_Hours_Week] = useState('');
  const [Overtime_Allowed, setOvertime_Allowed] = useState('');
  const [Currency_Code, setCurrency_Code] = useState('');
  const [statusDrop, setStatusDrop] = useState([]);
  const [statusGridDrop, setStatusGridDrop] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [Status, setStatus] = useState('');
  const [gridApi, setGridApi] = useState(null);
  const [rowData, setrowData] = useState([]);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [loading, setLoading] = useState(false);

  // For SC Mode
  const [Country_CodeSC, setCountry_CodeSC] = useState('');
  const [Country_NameSC, setCountry_NameSC] = useState('');
  const [ISO_CodeSC, setISO_CodeSC] = useState('');
  const [TimeZone_DefaultSC, setTimeZone_DefaultSC] = useState('');
  const [Week_Start_DaySC, setWeek_Start_DaySC] = useState('');
  const [Weekend_DaysSC, setWeekend_DaysSC] = useState('');
  const [Max_Work_Hours_DaySC, setMax_Work_Hours_DaySC] = useState('');
  const [Max_Work_Hours_WeekSC, setMax_Work_Hours_WeekSC] = useState('');
  const [Overtime_AllowedSC, setOvertime_AllowedSC] = useState('');
  const [Currency_CodeSC, setCurrency_CodeSC] = useState('');
  const [statusDropSC, setStatusDropSC] = useState([]);
  const [selectedStatusSC, setSelectedStatusSC] = useState('');
  const [StatusSC, setStatusSC] = useState('');

  const [isSelectStatus, setIsSelectStatus] = useState(false);
  const [isSelectStatusSC, setIsSelectStatusSC] = useState(false);

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleNavigateWithRowData = (selectedRow) => {
    navigate("/EmployeeGrade", { state: { mode: "update", selectedRow } });
  };

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    fetch(`${config.apiBaseUrl}/status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => setStatusDrop(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    fetch(`${config.apiBaseUrl}/status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => setStatusDropSC(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    fetch(`${config.apiBaseUrl}/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((response) => response.json())
      .then((data) => {
        const statusOption = data.map(option => option.attributedetails_name);
        setStatusGridDrop(statusOption);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const filteredOptionStatusSC = statusDropSC.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionStatus = statusDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleChangeStatusSC = (selectedStatusSC) => {
    setSelectedStatusSC(selectedStatusSC);
    setStatusSC(selectedStatusSC ? selectedStatusSC.value : "");
  };

  const handleChangeStatus = (selectedStatus) => {
    setSelectedStatus(selectedStatus);
    setStatus(selectedStatus ? selectedStatus.value : "");
  };

  const handleReload = () => {
    window.location.reload();
  }

  const reloadGridData = () => {
    setrowData([]);
  };

  const columnDefs = [
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params) => {
        const cellWidth = params.column.getActualWidth();
        const isWideEnough = cellWidth > 20;
        const showIcons = isWideEnough;
        return (
          <div className="position-relative d-flex align-items-center" style={{ minHeight: '100%', justifyContent: 'center' }}>
            {showIcons && (
              <>
                <span
                  className="icon mx-2"
                  onClick={() => handleUpdate(params.data, params.node.data)}
                  style={{ cursor: 'pointer' }}
                >
                  <i className="fa-regular fa-floppy-disk"></i>
                </span>

                <span
                  className="icon mx-2"
                  onClick={() => handleDelete(params.data)}
                  style={{ cursor: 'pointer' }}
                >
                  <i className="fa-solid fa-trash"></i>
                </span>
              </>
            )}
          </div>
        );
      },
    },
    {
      headerName: "Country Code",
      field: "Country_Code",
      cellStyle: { textAlign: "left" },
      cellEditorParams: {
        maxLength: 50,
      },
    },
    {
      headerName: "Country Name",
      field: "Country_Name",
      filter: 'agTextColumnFilter',
      editable: true
    },
    {
      headerName: "ISO Code",
      field: "ISO_Code",
      filter: 'agTextColumnFilter',
      editable: true
    },
    {
      headerName: "TimeZone Default",
      field: "TimeZone_Default",
      filter: 'agTextColumnFilter',
      editable: true
    },
    {
      headerName: "Week Start Day",
      field: "Week_Start_Day",
      filter: 'agTextColumnFilter',
      editable: true
    },
    {
      headerName: "Week End Day",
      field: "Weekend_Days",
      filter: 'agTextColumnFilter',
      editable: true
    },
    {
      headerName: "Max Work Hours Day",
      field: "Max_Work_Hours_Day",
      filter: 'agTextColumnFilter',
      editable: true
    },
    {
      headerName: "Max Work Hours Week",
      field: "Max_Work_Hours_Week",
      filter: 'agTextColumnFilter',
      editable: true
    },
    {
      headerName: "Overtime Allowed",
      field: "Overtime_Allowed",
      filter: 'agTextColumnFilter',
      editable: true
    },
    {
      headerName: "Currency Code",
      field: "Currency_Code",
      filter: 'agTextColumnFilter',
      editable: true
    },
    {
      headerName: "Status",
      field: "Status",
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: statusGridDrop,
      },
      editable: true
    },
  ]

  const gridOptions = {
    pagination: true,
  };

  const handleSave = async () => {
    console.log(Country_Code, Country_Name, Week_Start_Day, ISO_Code, TimeZone_Default, Status)
    if (!Country_Code || !Country_Name || !Week_Start_Day || !ISO_Code || !TimeZone_Default || !Status) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }

    setLoading(true);
    try {

      const Header = {
        Country_Code: Country_Code,
        Country_Name: Country_Name,
        ISO_Code: ISO_Code,
        Week_Start_Day: Week_Start_Day,
        Weekend_Days: Weekend_Days,
        Max_Work_Hours_Day: parseFloat(Max_Work_Hours_Day),
        Max_Work_Hours_Week: parseFloat(Max_Work_Hours_Week),
        Overtime_Allowed: Overtime_Allowed,
        Currency_Code: Currency_Code,
        Status: Status,
        ISO_Code: ISO_Code,
        TimeZone_Default: TimeZone_Default,
        company_code: sessionStorage.getItem('selectedCompanyCode'),
        created_by: sessionStorage.getItem('selectedUserCode')
      };

      const response = await fetch(`${config.apiBaseUrl}/CountryMasterInsert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Header),
      });
      if (response.status === 200) {
        console.log("Data inserted successfully");
        setTimeout(() => {
          toast.success("Data inserted successfully!", {
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
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const body = {
        Country_Code: Country_CodeSC,
        Country_Name: Country_NameSC,
        ISO_Code: ISO_CodeSC,
        TimeZone_Default: TimeZone_DefaultSC,
        Week_Start_Day: Week_Start_DaySC,
        Weekend_Days: Weekend_DaysSC,
        Max_Work_Hours_Day: parseFloat(Max_Work_Hours_DaySC),
        Max_Work_Hours_Week: parseFloat(Max_Work_Hours_WeekSC),
        Overtime_Allowed: Overtime_AllowedSC,
        Currency_Code: Currency_CodeSC,
        Status: StatusSC,
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }
      const response = await fetch(`${config.apiBaseUrl}/getCountrySearchData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });
      if (response.ok) {
        const fetchedData = await response.json();
        const newRows = fetchedData.map((matchedItem) => ({


          Country_Code: matchedItem.Country_Code,
          Country_Name: matchedItem.Country_Name,
          ISO_Code: matchedItem.ISO_Code,
          TimeZone_Default: matchedItem.TimeZone_Default,
          Week_Start_Day: matchedItem.Week_Start_Day,
          Weekend_Days: matchedItem.Weekend_Days,
          Max_Work_Hours_Day: matchedItem.Max_Work_Hours_Day,
          Max_Work_Hours_Week: matchedItem.Max_Work_Hours_Week,
          Overtime_Allowed: matchedItem.Overtime_Allowed,
          Currency_Code: matchedItem.Currency_Code,
          Status: matchedItem.Status,
          keyfield: matchedItem.keyfield,
        }));
        setrowData(newRows);
      } else if (response.status === 404) {
        console.log("Data Not found");
        toast.warning("Data Not found");
        setrowData([]);
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to insert sales data");
        console.error(errorResponse.details || errorResponse.message);
        setrowData([]);
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (rowData) => {
    setLoading(true);

    showConfirmationToast(
      "Are you sure you want to update the selected Country Master?",
      async () => {
        try {
          const Company_Code = sessionStorage.getItem("selectedCompanyCode");
          const modified_by = sessionStorage.getItem("selectedUserCode");

          const dataToSend = {
            sp_Country_MasterData: Array.isArray(rowData) ? rowData : [rowData],
          };

          const response = await fetch(`${config.apiBaseUrl}/Country_MasterLoopUpdate`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Company_Code": Company_Code,
                "modified-by": modified_by
              },
              body: JSON.stringify(dataToSend),
            }
          );

          if (response.ok) {
            toast.success("Country Master updated successfully", {
              onClose: () => handleSearch(),
            });
          } else {
            const errorResponse = await response.json();
            toast.warning(errorResponse.message || "Update failed");
          }
        } catch (error) {
          console.error("Update error:", error);
          toast.error("Error updating data: " + error.message);
        } finally {
          setLoading(false);
        }
      },
      () => toast.info("Update cancelled")
    );
  };

  const handleDelete = async (rowData) => {
    setLoading(true);

    showConfirmationToast(
      "Are you sure you want to delete the selected employee shift mapping data?",
      async () => {
        try {
          const Company_Code = sessionStorage.getItem("selectedCompanyCode");

          const dataToSend = {
            sp_Country_MasterData: Array.isArray(rowData) ? rowData : [rowData],
          };

          const response = await fetch(`${config.apiBaseUrl}/Country_MasterLoopDelete`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Company_Code": Company_Code
              },
              body: JSON.stringify(dataToSend),
            },
          );

          if (response.ok) {
            toast.success("Country master detail deleted successfully", {
              onClose: () => handleSearch(), // refresh data
            });
          } else {
            const errorResponse = await response.json();
            toast.warning(errorResponse.message || "Delete failed");
          }
        } catch (error) {
          console.error("Error deleting employee shift mapping rows:", error);
          toast.error("Error deleting employee shift mapping data: " + error.message);
        } finally {
          setLoading(false);
        }
      },
      () => toast.info("Delete cancelled"),
    );
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };


  return (
    <div class="container-fluid Topnav-screen ">
      {loading && <LoadingScreen />}
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="shadow-lg p-1 bg-light rounded main-header-box">
        <div className="header-flex">
          <h1 className="page-title">Country Master</h1>

          <div className="action-wrapper desktop-actions">
            <div className="action-icon add" onClick={handleSave}>
              <span className="tooltip">save</span>
              <i class="fa-solid fa-floppy-disk"></i>
            </div>
            <div className="action-icon print" onClick={handleReload}>
              <span className="tooltip">Reload</span>
              <i className="fa-solid fa-arrow-rotate-right"></i>
            </div>
          </div>

          <div className="dropdown mobile-actions">
            <button className="btn btn-primary dropdown-toggle p-1" data-bs-toggle="dropdown">
              <i className="fa-solid fa-list"></i>
            </button>

            <ul className="dropdown-menu dropdown-menu-end text-center">

              <li className="dropdown-item" onClick={handleSave}>
                <i className="fa-solid fa-floppy-disk text-success fs-4"></i>
              </li>

              <li className="dropdown-item" onClick={handleReload}>
                <i className="fa-solid fa-arrow-rotate-right"></i>
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
                id=" Grade ID"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the Grade ID"
                value={Country_Code}
                onChange={(e) => setCountry_Code(e.target.value)}
                maxLength={50}
              />
              <label for="cname" className={` exp-form-labels ${error && !Country_Code ? 'text-danger' : ''}`}>Country Code<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="Grade Name "
                class="exp-input-field form-control"
                type="Text"
                placeholder=""
                required title="Please Enter the Grade Name"
                value={Country_Name}
                onChange={(e) => setCountry_Name(e.target.value)}
                maxLength={100}
              />
              <label className={` exp-form-labels ${error && !Country_Name ? 'text-danger' : ''}`}>Country Name<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="Week_Start_Day"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the Salary Range From Amount"
                value={ISO_Code}
                onChange={(e) => setISO_Code(e.target.value)}
              />
              <label className={`exp-form-labels ${error && !ISO_Code ? 'text-danger' : ''}`}>ISO Code<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="Week_Start_Day"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the Salary Range To Amount"
                value={TimeZone_Default}
                onChange={(e) => setTimeZone_Default(e.target.value)}
              />
              <label className={`exp-form-labels ${error && !TimeZone_Default ? 'text-danger' : ''}`}>Default Timezone<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="Week_Start_Day"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the Basic Amount"
                value={Week_Start_Day}
                onChange={(e) => setWeek_Start_Day(e.target.value)}
              />
              <label className={`exp-form-labels ${error && !Week_Start_Day ? 'text-danger' : ''}`}>Week Start Day<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="Weekend_Days"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the HRA Allowance Amount"
                value={Weekend_Days}
                onChange={(e) => setWeekend_Days(e.target.value)}
                maxLength={250}
              />
              <label className="exp-form-labels">Week End Day</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="add3"
                class="exp-input-field form-control"
                type="Number"
                placeholder=""
                required title="Please Enter the Conveyance Allowance Amount"
                value={Max_Work_Hours_Day}
                onChange={(e) => setMax_Work_Work_Day(e.target.value)}
                maxLength={250}
              />
              <label className="exp-form-labels">Max Hours Work Day</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="add3"
                class="exp-input-field form-control"
                type="Number"
                placeholder=""
                required title="Please Enter the Medical Allowance Amount"
                value={Max_Work_Hours_Week}
                onChange={(e) => setMax_Work_Hours_Week(e.target.value)}
              />
              <label className="exp-form-labels">Max Hours Work Week</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="add3"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the Special Allowance"
                value={Overtime_Allowed}
                onChange={(e) => setOvertime_Allowed(e.target.value)}
              />
              <label className="exp-form-labels">Overtime Allowed</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="add3"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the  Company PF Contribution"
                value={Currency_Code}
                onChange={(e) => setCurrency_Code(e.target.value)}
              />
              <label className="exp-form-labels">Currency Code</label>
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
                  isClearable
                  value={selectedStatus}
                  onChange={handleChangeStatus}
                  options={filteredOptionStatus}
                  classNamePrefix="react-select"
                  placeholder=""
                  onFocus={() => setIsSelectStatus(true)}
                  onBlur={() => setIsSelectStatus(false)}
                />
                <label className={`floating-label ${error && !Status ? 'text-danger' : ''}`}>Status<span className="text-danger">*</span></label>
              </div>
            </div>

        </div>
      </div>

      <div className="shadow-lg p-3 bg-light rounded mt-2 container-form-box">
        <div className="header-flex">
          <h5 className="">Search Criteria:</h5>
        </div>
        <div className="row g-3">

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id=" Country_Code"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the Grade ID"
                value={Country_CodeSC}
                onChange={(e) => setCountry_CodeSC(e.target.value)}
              />
              <label className="exp-form-labels">Country Code</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="Country_Name"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the Grade Name"
                value={Country_NameSC}
                onChange={(e) => setCountry_NameSC(e.target.value)}
              />
              <label className="exp-form-labels">Country Name</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="Week_Start_Day"
                class="exp-input-field form-control"
                type="number"
                placeholder=""
                required title="Please Enter the Salary Range Amount"
                value={ISO_CodeSC}
                onChange={(e) => setISO_CodeSC(e.target.value)}
              />
              <label className="exp-form-labels">ISO Code</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="Week_Start_Day"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the Salary Range Amount"
                value={TimeZone_DefaultSC}
                onChange={(e) => setTimeZone_DefaultSC(e.target.value)}
              />
              <label className="exp-form-labels">Default Time Zone</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="Week_Start_Day"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the Basic Amount"
                value={Week_Start_DaySC}
                onChange={(e) => setWeek_Start_DaySC(e.target.value)}
              />
              <label className="exp-form-labels">Week Start Day</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="Weekend_Days"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the HRA Allowance Amount"
                value={Weekend_DaysSC}
                onChange={(e) => setWeekend_DaysSC(e.target.value)}
                maxLength={250}
              />
              <label className="exp-form-labels">Week End Day</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="Max_Work_Hours_Day"
                class="exp-input-field form-control"
                type="Number"
                placeholder=""
                required title="Please Enter the Conveyance Allowance Amount"
                value={Max_Work_Hours_DaySC}
                onChange={(e) => setMax_Work_Hours_DaySC(e.target.value)}
                maxLength={250}
              />
              <label className="exp-form-labels">Max Work Hours Day</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="Max_Work_Hours_Week"
                class="exp-input-field form-control"
                type="Number"
                placeholder=""
                required title="Please Enter the Medical Allowance Amount"
                value={Max_Work_Hours_WeekSC}
                onChange={(e) => setMax_Work_Hours_WeekSC(e.target.value)}
              />
              <label className="exp-form-labels">Max Work Hours Week</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="Overtime_Allowed"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the Special Allowance"
                value={Overtime_AllowedSC}
                onChange={(e) => setOvertime_AllowedSC(e.target.value)}
              />
              <label className="exp-form-labels"> Over Time Allowed</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="Currency_Code"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the Company PF Contribution"
                value={Currency_CodeSC}
                onChange={(e) => setCurrency_CodeSC(e.target.value)}
              />
              <label className="exp-form-labels"> Currency Code</label>
            </div>
          </div>

          <div className="col-md-2">
              <div
                className={`inputGroup selectGroup 
              ${selectedStatusSC ? "has-value" : ""} 
              ${isSelectStatusSC ? "is-focused" : ""}`}
              >
                <Select
                  id="status"
                  isClearable
                  value={selectedStatusSC}
                  onChange={handleChangeStatusSC}
                  options={filteredOptionStatusSC}
                  classNamePrefix="react-select"
                  placeholder=""
                  onFocus={() => setIsSelectStatusSC(true)}
                  onBlur={() => setIsSelectStatusSC(false)}
                />
                <label class="floating-label">Status</label>
              </div>
            </div>

          <div className="col-12">
            <div className="search-btn-wrapper">
              <div className="icon-btn search" onClick={handleSearch}>
                <span className="tooltip">Search</span>
                <i className="fa-solid fa-magnifying-glass"></i>
              </div>

              <div className="icon-btn reload" onClick={reloadGridData}>
                <span className="tooltip">Reload</span>
                <i className="fa-solid fa-rotate-right"></i>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="shadow-lg pt-3 pb-3 bg-light rounded mt-2 container-form-box" style={{ width: "100%" }}>
        <div class="ag-theme-alpine" style={{ height: 455, width: "100%" }}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            onGridReady={onGridReady}
            rowSelection="multiple"
            paginationAutoPageSize={true}
            gridOptions={gridOptions}
            pagination={true}
          />
        </div>
      </div>
    </div>
  );
}
export default Input;