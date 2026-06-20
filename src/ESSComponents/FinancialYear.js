import React, { useState, useEffect } from "react";
import "../input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import TabButtons from './Tabs.js';
import { useNavigate } from "react-router-dom";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { showConfirmationToast } from '../ToastConfirmation';
import '../apps.css'
import LoadingScreen from '../Loading';
import * as XLSX from "xlsx-js-style";
import Select from "react-select";

const config = require('../Apiconfig');

const getFinancialYearDates = () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // getMonth() is 0-based
  console.log(currentMonth)
  let startYear, endYear;

  if (currentMonth < 4) {
    startYear = currentYear - 1;
    endYear = currentYear;
  } else {
    startYear = currentYear;
    endYear = currentYear + 1;
  }

  const FirstDate = `${startYear}-04-01`;
  const LastDate = `${endYear}-03-31`;

  return { FirstDate, LastDate };
};

const { FirstDate, LastDate } = getFinancialYearDates();

function Input() {

  //code added by Pavun purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem('permissions')) || {};
  const payslipSalaryDaysPermissions = permissions
    .filter(permission => permission.screen_type === 'PayslipSalaryDays')
    .map(permission => permission.permission_type.toLowerCase());

  const [FromDate, setFromDate] = useState(FirstDate);
  const [ToDate, setToDate] = useState(LastDate);
  const [Start_Year, setStart_Year] = useState(FirstDate);
  const [End_Year, setEnd_Year] = useState(LastDate);
  const [Salary_Days, setSalary_Days] = useState("");
  const [EligibleDays, setEligibledays] = useState("");
  const [error, setError] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [activeTab, setActiveTab] = useState("Salary Eligibility Days")
  const [loading, setLoading] = useState(false);

  const [selectedStatus, setSelectedStatus] = useState(null);
  const [isSelectFocused, setIsSelectFocused] = useState(false);
  const [Status, setStatus] = useState("");
  const [statusdrop, setStatusdrop] = useState([]);

  const [selectedStatusSC, setSelectedStatusSC] = useState(null);
  const [StatusSC, setStatusSC] = useState("");
  const [isSelectFocusedSC, setIsSelectFocusedSC] = useState(false);
  const [statusdropSC, setStatusdropSC] = useState([]);

  const [statusgriddrop, setStatusGriddrop] = useState([]);

  const navigate = useNavigate();

  const handleChangeStatus = (selectedStatus) => {
    setSelectedStatus(selectedStatus);
    setStatus(selectedStatus ? selectedStatus.value : "");
  };

  const filteredOptionStatus = statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

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
      .then((val) => setStatusdrop(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleChangeStatusSC = (selectedStatusSC) => {
    setSelectedStatusSC(selectedStatusSC);
    setStatusSC(selectedStatusSC ? selectedStatusSC.value : "");
  };

  const filteredOptionStatusSC = statusdropSC.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

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
      .then((val) => setStatusdropSC(val))
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
        setStatusGriddrop(statusOption);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);


  const searchClearInputFields = () => {
    setStart_Year("");
    setEnd_Year("");
    setSalary_Days("");
  };

  const formatDate = (isoDateString) => {
    if (!isoDateString) return "";
    const date = new Date(isoDateString);
    if (isNaN(date)) return "Invalid Date";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };


  const handleSearch = async () => {
    setLoading(true);
    try {
      const body = {
        Start_Year: Start_Year,
        End_Year: End_Year,
        Salary_Days: Salary_Days,
        status: StatusSC,
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      };

      const response = await fetch(`${config.apiBaseUrl}/salarySearchoption`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const fetchedData = await response.json();
        const newRows = fetchedData.map((matchedItem) => ({
          Start_Year: matchedItem.Start_Year,
          End_Year: matchedItem.End_Year,
          Salary_Days: matchedItem.Salary_Days,
          status: matchedItem.status,
          company_code: sessionStorage.getItem("selectedCompanyCode"),
        }));
        setRowData(newRows);
      } else if (response.status === 404) {
        console.log("Data Not found");
        toast.warning("Data Not found");
        setRowData([]);
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to insert sales data");
        console.error(errorResponse.details || errorResponse.message);
        setRowData([]);
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
      toast.error("Error fetching search data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (rowData) => {
    showConfirmationToast(
      "Are you sure you want to update the data in the selected rows?",
      async () => {
        try {
          setLoading(true);
          const company_code = sessionStorage.getItem('selectedCompanyCode');
          const modified_by = sessionStorage.getItem('selectedUserCode');

          // const dataToSend = { editedData: Array.isArray(rowData) ? rowData : [rowData] };

          const dataToSend = {
            editedData: Array.isArray(rowData)
              ? rowData.map((row) => ({
                ...row,
                company_code,
                modified_by,
              }))
              : [
                {
                  ...rowData,
                  company_code,
                  modified_by,
                },
              ],
          };

          const response = await fetch(`${config.apiBaseUrl}/UpdateSalary`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "company_code": company_code,
              "modified-by": modified_by
            },
            body: JSON.stringify(dataToSend)
          });

          if (response.ok) {
            toast.success("Data updated successfully", {
              onClose: () => handleSearch(), // Runs handleSearch when toast closes
            });
          } else {
            const errorResponse = await response.json();
            toast.warning(errorResponse.message || "Failed to insert sales data");
          }
        } catch (error) {
          console.error("Error deleting rows:", error);
          toast.error('Error Deleting Data: ' + error.message);
        } finally {
          setLoading(false);
        }
      },
      () => {
        toast.info("Data updated cancelled.");
      }
    );
  };

  const handleDelete = async (rowData) => {
    showConfirmationToast(
      "Are you sure you want to Delete the data in the selected rows?",
      async () => {
        try {
          setLoading(true);
          const company_code = sessionStorage.getItem('selectedCompanyCode');
          const modified_by = sessionStorage.getItem("selectedUserCode");

          // const dataToSend = { editedData: Array.isArray(rowData) ? rowData : [rowData] };

          const dataToSend = {
            editedData: Array.isArray(rowData)
              ? rowData.map((row) => ({
                ...row,
                company_code,
                modified_by,
              }))
              : [
                {
                  ...rowData,
                  company_code,
                  modified_by,
                },
              ],
          };

          const response = await fetch(`${config.apiBaseUrl}/salaryDelete`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "company_code": company_code
            },
            body: JSON.stringify(dataToSend)
          });

          if (response.ok) {
            toast.success("Data deleted successfully", {
              onClose: () => handleSearch(),
            });
          } else {
            const errorResponse = await response.json();
            toast.warning(errorResponse.message || "Failed to insert sales data");
          }
        } catch (error) {
          console.error("Error deleting rows:", error);
          toast.error('Error Deleting Data: ' + error.message);
        } finally {
          setLoading(false);
        }
      },
      () => {
        toast.info("Data Delete cancelled.");
      }
    );
  };

  const reloadGridData = () => {
    setRowData([]);
    searchClearInputFields();
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
      headerName: "Start Year",
      field: "Start_Year",
      editable: true,
    },
    {
      headerName: "End Year",
      field: "End_Year",
      editable: true,
    },
    {
      headerName: "Eligibility Salary Days",
      field: "Salary_Days",
      editable: true,
    },
    {
      headerName: "Status",
      field: "status",
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: statusgriddrop,
      },
      editable: true,
    },

  ]

  const onFirstDataRendered = (params) => {
  const allColumnIds = params.columnApi
    .getColumns()
    .map((col) => col.getId());

  params.columnApi.autoSizeColumns(allColumnIds);
};

  const tabs = [
    { label: 'Salary Eligibility Days' },
    { label: 'Bonus' },
    { label: 'PF Contribution' },
    { label: 'Professional Tax' },
    // { label: 'Loan Type' },
    { label: 'TDS' },
  ];

  const handleTabClick = (tabLabel) => {
    setActiveTab(tabLabel);
    switch (tabLabel) {
      case 'EmployeeAllowance':
        NavigateEmployeeAllowance();
        break;
      case 'Salary Eligibility Days':
        FinancialYear();
        break;
      case 'Bonus':
        EmployeeBonus();
        break;
      case 'PF Contribution':
        EmpPFCompany();
        break;
      case 'Professional Tax':
        EmpProfessionalTax();
        break;
      // case 'Loan Type':
      //   EmpLoanType();
      //   break;
      case 'TDS':
        EmpTDS();
        break;
      default:
        break;
    }
  };

  const NavigateEmployeeAllowance = () => {
    navigate("/EmployeeAllowance");
  };

  const FinancialYear = () => {
    navigate("/PayslipSalaryDays");
  };

  const EmployeeBonus = () => {
    navigate("/PayslipEmpBonus");
  };

  const EmpPFCompany = () => {
    navigate("/PFContribution");
  };

  const EmpProfessionalTax = () => {
    navigate("/PayslipEmpProTax");
  };

  const EmpTDS = () => {
    navigate("/PayslipEmpTDS");
  };

  const handleSave = async () => {
    if (!FromDate || !ToDate || !EligibleDays) {
      setError(true);
      toast.warning("Error: Missing required fields");
      return;
    }
    setError(false);
    setLoading(true);

    try {
      const formattedFromDate = new Date(FromDate).toISOString().split("T")[0];
      const formattedToDate = new Date(ToDate).toISOString().split("T")[0];

      const Header = {
        Start_Year: formattedFromDate,
        End_Year: formattedToDate,
        Salary_Days: EligibleDays,
        company_code: sessionStorage.getItem("selectedCompanyCode"),
        created_by: sessionStorage.getItem("selectedUserCode"),
      };
      const response = await fetch(`${config.apiBaseUrl}/AddSalaryCriteria`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Header),
      });

      console.log("Response Status:", response.status);

      if (response.ok) {
        console.log("Data inserted successfully");
        toast.success("Data inserted successfully!", {
          onClose: () => window.location.reload(),
        });
      } else {
        const errorResponse = await response.json();
        console.error("Error Response:", errorResponse);
        toast.warning(errorResponse.message || "Failed to insert data");
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error("Error inserting data: " + error);
    } finally {
      setLoading(false);
    }
  };

  const getCSSVariable = (variableName) => {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(variableName)
      .trim();
  };

  const transformRowData = (data) => {
    return data.map((row) => ({
      "Start Year": row.Start_Year || "",
      "End Year": row.End_Year || "",
      "Eligibility Salary Days": row.Salary_Days || "",
      "Status": row.status || "",
    }));
  };

  const handleExportToExcel = () => {
    if (!rowData || rowData.length === 0) {
      toast.warning("There is no data to export.");
      return;
    }

    const screenName = "Salary Eligibility Days Search Report";
    const company = sessionStorage.getItem("selectedCompanyName") || "";

    /* ================= THEME COLORS ================= */

    const titleBg = getCSSVariable("--but").replace("#", "");
    const tableHeaderBg = getCSSVariable("--ag-header").replace("#", "");
    const fontColor = getCSSVariable("--font-color").replace("#", "");
    const altRowBg = getCSSVariable("--ag-row").replace("#", "");

    /* ================= HEADER ================= */

    const headerData = [
      [screenName],
      company ? [`Company Name: ${company}`] : [],
      [],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(headerData);

    /* ================= TABLE DATA ================= */

    const transformedData = transformRowData(rowData);

    XLSX.utils.sheet_add_json(worksheet, transformedData, {
      origin: `A${headerData.length + 1}`,
    });

    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    const headerRowIndex = headerData.length;

    /* ================= TITLE STYLE ================= */

    worksheet["A1"].s = {
      font: { bold: true, sz: 16, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: titleBg } },
      alignment: { horizontal: "center", vertical: "center" },
    };

    worksheet["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: Object.keys(transformedData[0]).length - 1 } },
    ];

    /* ================= TABLE HEADER STYLE ================= */

    const totalColumns = Object.keys(transformedData[0]).length;

    for (let C = 0; C < totalColumns; C++) {
      const cell =
        worksheet[XLSX.utils.encode_cell({ r: headerRowIndex, c: C })];

      if (!cell) continue;

      cell.s = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: tableHeaderBg } },
        alignment: { horizontal: "center" },
        border: {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        },
      };
    }

    /* ================= TABLE BODY STYLE ================= */

    for (let R = headerRowIndex + 1; R <= range.e.r; R++) {
      for (let C = 0; C < totalColumns; C++) {
        const cell =
          worksheet[XLSX.utils.encode_cell({ r: R, c: C })];

        if (!cell) continue;

        cell.s = {
          font: { color: { rgb: fontColor } },
          fill:
            R % 2 === 0
              ? { fgColor: { rgb: altRowBg } }
              : undefined,
          border: {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" },
          },
        };
      }
    }

    /* ================= COLUMN WIDTH ================= */

    worksheet["!cols"] = Array(totalColumns).fill({ wch: 22 });

    /* ================= EXPORT ================= */

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Salary Eligibility Days");

    XLSX.writeFile(workbook, "Salary_Eligibility_Days_Search_Report.xlsx");
  };

  const handleReloadAdd = () => {
    clearInputsAdd([]);
  };

  const clearInputsAdd = () => {
    setFromDate('');
    setToDate('');
    setEligibledays('');
    setSelectedStatus('');
    setStatus('');
  };

  return (
    <div class="container-fluid Topnav-screen ">
      {loading && <LoadingScreen />}
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="shadow-lg p-1 bg-light rounded main-header-box">
        <div className="header-flex">
          <h1 className="page-title">Salary Eligibility Days</h1>
          <div className="action-wrapper desktop-actions">
            {['add', 'all permission'].some(permission => payslipSalaryDaysPermissions.includes(permission)) && (
              <div onClick={handleSave} className="action-icon add">
                <span className="tooltip">Save</span>
                <i class="fa-solid fa-floppy-disk"></i>
              </div>
            )}
            <div className="action-icon print" onClick={handleReloadAdd}>
              <span className="tooltip">Reload</span>
              <i className="fa-solid fa-arrow-rotate-right"></i>
            </div>
          </div>

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

              {['add', 'all permission'].some(p => payslipSalaryDaysPermissions.includes(p)) && (
                <li>
                  <button className="dropdown-item" onClick={handleSave}>
                    <i className="fa-solid fa-floppy-disk add fs-4"></i>
                  </button>
                </li>
              )}

              <li>
                <button className="dropdown-item" onClick={handleReloadAdd}>
                  <i className="fa-solid fa-arrow-rotate-right text-dark fs-4"></i>
                </button>
              </li>

            </ul>
          </div>

        </div>
      </div>
      <TabButtons tabs={tabs} activeTab={activeTab} onTabClick={handleTabClick} />
      <div className="shadow-lg p-3 bg-light rounded mt-2 container-form-box">
        <div className="row g-3">

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="add3"
                class="exp-input-field form-control"
                type="Date"
                placeholder=""
                required title="Please Choose the Start Year"
                autoComplete="off"
                value={FromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
              <label For="city" className={` exp-form-labels ${error && !FromDate ? 'text-danger' : ''}`}>Start Year<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="add3"
                class="exp-input-field form-control"
                type="Date"
                placeholder=""
                required title="Please Choose the End Year"
                autoComplete="off"
                value={ToDate}
                onChange={(e) => setToDate(e.target.value)}
              />
              <label For="city" className={` exp-form-labels ${error && !ToDate ? 'text-danger' : ''}`}>End Year<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="Number"
                placeholder=""
                required title="Please Enter the Eligibility Salary Days"
                autoComplete="off"
                value={EligibleDays}
                onChange={(e) => setEligibledays(Number(e.target.value))}
              />
              <label for="sname" className={` exp-form-labels ${error && !EligibleDays ? 'text-danger' : ''}`}>Eligibility Salary Days<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedStatus ? "has-value" : ""} 
              ${isSelectFocused ? "is-focused" : ""}`}
              title="Please Select the Status"
            >
              <Select
                id="status"
                isClearable
                value={selectedStatus}
                onChange={handleChangeStatus}
                options={filteredOptionStatus}
                classNamePrefix="react-select"
                placeholder=""
                onFocus={() => setIsSelectFocused(true)}
                onBlur={() => setIsSelectFocused(false)}
              />
              <label className={`floating-label ${error && !Status ? "text-danger" : ""}`}>Status<span className="text-danger">*</span></label>
            </div>
          </div>

        </div>
      </div>

      <div className="shadow-lg p-3 bg-light rounded mt-2 container-form-box">
        <div className="header-flex">
          <h6 className="">Search Criteria:</h6>
        </div>
        <div className="row g-3">

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="add3"
                class="exp-input-field form-control"
                type="Date"
                placeholder=""
                required title="Please Choose the Start Year"
                autoComplete="off"
                value={Start_Year}
                onChange={(e) => setStart_Year(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <label For="city" className="exp-form-labels">Start Year</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="add3"
                class="exp-input-field form-control"
                type="Date"
                placeholder=""
                required title="Please Choose the End Year"
                autoComplete="off"
                value={End_Year}
                onChange={(e) => setEnd_Year(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <label For="city" className="exp-form-labels">End Year</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="Number"
                placeholder=""
                required title="Please Enter the Eligibility Salary Days"
                autoComplete="off"
                value={Salary_Days}
                onChange={(e) => setSalary_Days(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <label for="sname" className="exp-form-labels">Eligibility Salary Days</label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedStatusSC ? "has-value" : ""} 
              ${isSelectFocusedSC ? "is-focused" : ""}`}
              title="Please Select the Status"
            >
              <Select
                id="status"
                isClearable
                value={selectedStatusSC}
                onChange={handleChangeStatusSC}
                options={filteredOptionStatusSC}
                classNamePrefix="react-select"
                placeholder=""
                onFocus={() => setIsSelectFocusedSC(true)}
                onBlur={() => setIsSelectFocusedSC(false)}
              />
              <label class="floating-label">Status</label>
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

              <div className="icon-btn excel" onClick={handleExportToExcel}>
                <span className="tooltip">Excel</span>
                <i className="fa-solid fa-file-excel"></i>
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
            rowSelection="multiple"
            // onRowClicked={(event) => handleRowSelection(event.data)}
            pagination={true}
            paginationAutoPageSize={true}
            onFirstDataRendered={onFirstDataRendered}
          />
        </div>
      </div>




    </div>
  )
}
export default Input;