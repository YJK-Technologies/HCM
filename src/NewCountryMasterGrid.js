import React, { useState } from "react";
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
  const [Status, setStatus] = useState('');
  // const [Other_Allowance, setOther_Allowance] = useState('');
  // const [LeaveDeduction, setLeaveDeduction] = useState('');
  // const [minimum_take_salary, setMinimumTakeSalary] = useState('');
  // const [ctc_currency, setCtcCurrency] = useState('');
  // const [otherDeductions, setotherDeductions] = useState('');
  const [saveButtonVisible, setSaveButtonVisible] = useState(true);
  const [gridApi, setGridApi] = useState(null);
  const [rowData, setrowData] = useState([]);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [showAsterisk, setShowAsterisk] = useState(true);
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
  const [StatusSC, setStatusSC] = useState('');

  // selected input fields
  // const [Gradeid, setGradeid] = useState('');
  // const [Gradename, setGradename] = useState('');
  // const [basic, setbasic] = useState('');
  // const [salaryrrangefrom, setsalaryrrangefrom] = useState('');
  // const [salaryrangeto, setsalaryrangeto] = useState('');
  // const [Hra, setHra] = useState('');
  // const [conveyance, setconveyance] = useState('');
  // const [medical, setmedical] = useState('');
  // const [SpecialAllowance, setSpecialAllowance] = useState('');
  // const [CompanyPfContribution, setCompanyPfContribution] = useState('');
  // const [BonusArrears, setBonusArrears] = useState('');
  // const [OtherAllowance, setOtherAllowance] = useState('');
  // const [Leavededuction, setLeavededuction] = useState('');
  // const [otherdeductions, setotherdeductions] = useState('');
  // const [ctccurrency, setCurrency] = useState('');
  // const [minimumtakesalary, setMinimumSalary] = useState('');

  const [error, setError] = useState('');
  const navigate = useNavigate();


  const handleNavigateWithRowData = (selectedRow) => {
    navigate("/EmployeeGrade", { state: { mode: "update", selectedRow } });
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

      cellRenderer: (params) => {
        const handleClick = () => {
          handleNavigateWithRowData(params.data);
        };

        return (
          <span
            style={{ cursor: "pointer" }}
            onClick={handleClick}
          >
            {params.value}
          </span>
        );
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
      filter: 'agTextColumnFilter',
      editable: true
    },
    // {
    //   headerName: "Other Allowance",
    //   field: "Other_Allowance",
    //   filter: 'agTextColumnFilter',
    //   editable: true
    // },
    // {
    //   headerName: "Leave Deductions",
    //   field: "LeaveDeduction",
    //   filter: 'agTextColumnFilter',
    //   editable: true
    // },
    // {
    //   headerName: "Other Deductions",
    //   field: "otherDeductions",
    //   filter: 'agTextColumnFilter',
    //   editable: true
    // },
    // {
    //   headerName: "CTC Currency",
    //   field: "ctc_currency",
    //   filter: 'agTextColumnFilter',
    //   editable: true
    // },
    // {
    //   headerName: "Minimum Take Salary",
    //   field: "minimum_take_salary",
    //   filter: 'agTextColumnFilter',
    //   editable: true
    // },
  ]

  const gridOptions = {
    pagination: true,
  };

  const handleSave = async () => {
    if (!Country_Code || !Country_Name || !Week_Start_Day || !ISO_Code || !TimeZone_Default || Status) {
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
        // Other_Allowance: parseFloat(Other_Allowance),
        // LeaveDeduction: parseFloat(LeaveDeduction),
        // otherDeductions: parseFloat(otherdeductions),
        ISO_Code: ISO_Code,
        TimeZone_Default: TimeZone_Default,
        // ctc_currency: ctccurrency,
        // minimum_take_salary: parseFloat(minimumtakesalary),
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
        // OtherAllowance: parseFloat(Currency_Code),
        // LeaveDeduction: parseFloat(Status),
        // otherDeductions: parseFloat(otherDeductions),
        // ctc_currency: ctc_currency,
        // salary_range_from: parseFloat(SalaryrrangeFrom),
        // salary_range_to: parseFloat(SalaryrangeTo),
        // minimum_take_salary: parseFloat(minimum_take_salary),
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }
      const response = await fetch(`${config.apiBaseUrl}/getCountrySearchData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body) // Send company_no and company_name as search criteria
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
          // Other_Allowance: matchedItem.Other_Allowance,
          // LeaveDeduction: matchedItem.LeaveDeduction,
          // otherDeductions: matchedItem.otherDeductions,
          // salary_range_from: matchedItem.salary_range_from,
          // salary_range_to: matchedItem.salary_range_to,
          // ctc_currency: matchedItem.ctc_currency,
          // minimum_take_salary: matchedItem.minimum_take_salary,
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



  // const onCellValueChanged = (params) => {
  //   const updatedRowData = [...rowData];
  //   const rowIndex = updatedRowData.findIndex(
  //     (row) => row.ProjectID === params.data.ProjectID
  //   );
  //   if (rowIndex !== -1) {
  //     updatedRowData[rowIndex][params.colDef.field] = params.newValue;
  //     setrowData(updatedRowData);

  //     // Add the edited row data to the state
  //     setEditedData((prevData) => [...prevData, updatedRowData[rowIndex]]);
  //   }
  // };

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  // const onSelectionChanged = () => {
  //   const selectedNodes = gridApi.getSelectedNodes();
  //   const selectedData = selectedNodes.map((node) => node.data);
  //   setSelectedRows(selectedData);
  // };


  return (
    <div class="container-fluid Topnav-screen ">
      {loading && <LoadingScreen />}
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="shadow-lg p-1 bg-light rounded main-header-box">
        <div className="header-flex">
          <h1 className="page-title">Country Master</h1>

          <div className="action-wrapper desktop-actions">
              {saveButtonVisible && (
                <div className="action-icon add" onClick={handleSave}>
                  <span className="tooltip">save</span>
                  <i class="fa-solid fa-floppy-disk"></i>
                </div>
              )}
              <div className="action-icon print" onClick={handleReload}>
                <span className="tooltip">Reload</span>
                <i className="fa-solid fa-arrow-rotate-right"></i>
              </div>
          </div>

          {/* Mobile Dropdown */}
          <div className="dropdown mobile-actions">
            <button className="btn btn-primary dropdown-toggle p-1" data-bs-toggle="dropdown">
              <i className="fa-solid fa-list"></i>
            </button>

            <ul className="dropdown-menu dropdown-menu-end text-center">

              {/* {saveButtonVisible && ['add', 'all permission'].some(p => employeePermissions.includes(p)) && ( */}
              {saveButtonVisible && (
                <li className="dropdown-item" onClick={handleSave}>
                  <i className="fa-solid fa-floppy-disk text-success fs-4"></i>
                </li>
              )}
              {/*})}*/}
              
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
                // onKeyPress={handleKeyPress}
                maxLength={50}
              />
              <label for="cname" className={` exp-form-labels ${error && !Country_Code ? 'text-danger' : ''}`}>Country Code{showAsterisk && <span className="text-danger">*</span>}</label>
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
              <label className={` exp-form-labels ${error && !Country_Name ? 'text-danger' : ''}`}>  Country Name {showAsterisk && <span className="text-danger">*</span>}</label>
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
              <label className={`exp-form-labels ${error && !ISO_Code ? 'text-danger' : ''}`}>ISO Code{showAsterisk && <span className="text-danger">*</span>}</label>
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
              <label className={`exp-form-labels ${error && !TimeZone_Default ? 'text-danger' : ''}`}>Default Timezone{showAsterisk && <span className="text-danger">*</span>}</label>
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
            <div className="inputGroup">
              <input
                id="add3"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the Bonus / Arrears"
                value={Status}
                onChange={(e) => setStatus(e.target.value)}
              />
              <label className={` exp-form-labels ${error && !Status ? 'text-danger' : ''}`}>Status{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div>

          {/* <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="add3"
                class="exp-input-field form-control"
                type="Number"
                placeholder=""
                required title="Please Enter the Other Allowance"
                value={OtherAllowance}
                onChange={(e) => setOtherAllowance(e.target.value)}
              />
              <label className="exp-form-labels"> Other Allowance</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="add3"
                class="exp-input-field form-control"
                type="Number"
                placeholder=""
                required title="Please Enter the Leave Deductions"
                value={Leavededuction}
                onChange={(e) => setLeavededuction(e.target.value)}
                maxLength={250}
              />
              <label className="exp-form-labels"> Leave Deductions</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="add3"
                class="exp-input-field form-control"
                type="Number"
                placeholder=""
                required title="Please Enter the Other Deductions"
                value={otherdeductions}
                onChange={(e) => setotherdeductions(e.target.value)}
              />
              <label className="exp-form-labels">  Other Deductions</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="add3"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the CTC Currency"
                value={ctccurrency}
                onChange={(e) => setCurrency(e.target.value)}
                maxLength={10}
              />
              <label className={` exp-form-labels ${error && !ctccurrency ? 'text-danger' : ''}`}> CTC Currency{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="add3"
                class="exp-input-field form-control"
                type="Number"
                placeholder=""
                required title="Please Enter the  Minimum Take Salary"
                value={minimumtakesalary}
                onChange={(e) => setMinimumSalary(e.target.value)}
              />
              <label className="exp-form-labels">Minimum Take Salary</label>
            </div>
          </div> */}

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
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <label className="exp-form-labels"> Currency Code</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="Status"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the Bonus / Arrears"
                value={StatusSC}
                onChange={(e) => setStatusSC(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <label className="exp-form-labels"> Status</label>
            </div>
          </div>

          

          {/* Search + Reload Buttons */}
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
            // defaultColDef={defaultColDef}
            onGridReady={onGridReady}
            // onCellValueChanged={onCellValueChanged}
            rowSelection="multiple"
            // onSelectionChanged={onSelectionChanged}
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
