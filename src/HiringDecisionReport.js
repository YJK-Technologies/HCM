import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import "./App.css";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showConfirmationToast } from "./ToastConfirmation";
import LoadingScreen from "./Loading";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const config = require("./Apiconfig");

function HiringDecisionReport() {
  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const navigate = useNavigate();
  const [statusdrop, setStatusdrop] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedcandidate_name, setSelectedcandidatename] = useState("");
  const [isselectedscheduleid, setIsscheduleid] = useState("");
  const [canditatename, set_candidatename] = useState("");
  const [canditatenameDrop, setcanditatenameDrop] = useState([]);
  const [selectedStatusSC, setSelectedStatusSC] = useState(null);
  const [isSelectFocusedSC, setIsSelectFocusedSC] = useState(false);
  const [statusSC, setstatusSC] = useState("");
  const [scheduled_datetimeSC, setscheduled_datetimeSC] = useState("");
  const [ratingSC, setratingSC] = useState("");
  const [decided_on, setdecided_on] = useState("");
  const [remarksSC, setremarksSC] = useState("");
  const [job_titleSC, setjob_titleSC] = useState("");
  const [dptSC, setdptSC] = useState("");
  const [selecteddptSC, setselecteddeptSC] = useState("");
  const [isSelectDepartmentSC, setIsSelectDepartmentSC] = useState(false);
  const [DPTdrop, setDPTdrop] = useState([]);
  const [Country_CodeSC, setCountry_CodeSC] = useState("");
  const [decided_bySC, setdecided_bySC] = useState("");

  //purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem("permissions")) || {};
  const companyPermissions = permissions
    .filter((permission) => permission.screen_type === "Company")
    .map((permission) => permission.permission_type.toLowerCase());

  const handlescandidate_name = (selectedDPT) => {
    setSelectedcandidatename(selectedDPT);
    set_candidatename(selectedDPT ? selectedDPT.value : "");
  };

  const handleChangeStatusSC = (selectedStatus) => {
    setSelectedStatusSC(selectedStatus);
    setstatusSC(selectedStatus ? selectedStatus.value : "");
  };

  const handleDPTSC = (selectedDPT) => {
    setselecteddeptSC(selectedDPT);
    setdptSC(selectedDPT ? selectedDPT.value : "");
  };

  const filteredOptioncandidate_name = canditatenameDrop.map((option) => ({
    value: option.candidate_name,
    label: `${option.candidate_id} - ${option.candidate_name}`,
  }));

  const filteredOptionStatus = statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionDPtSC = DPTdrop.map((option) => ({
    value: option.dept_id,
    label: `${option.dept_id} - ${option.dept_name}`,
  }));

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    const fetchDept = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/CanditateID`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ company_code }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const val = await response.json();
        setcanditatenameDrop(val);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    if (company_code) {
      fetchDept();
    }
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
      .then((val) => setStatusdrop(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    const fetchDept = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/DeptID`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ company_code }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const val = await response.json();
        setDPTdrop(val);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    if (company_code) {
      fetchDept();
    }
  }, []);

  const handleSearch = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `${config.apiBaseUrl}/HiringDecisionSearch`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            // schedule_id: scheduleidSC,
            candidate_name: canditatename,
            // email: emailSC,
            // panel_name: panel_nameSC,
            // scheduled_datetime: scheduled_datetimeSC,
            // Interview_Mode: InterviewModeSC,
            // Status: statusSC,
            // location: locationSC,
            // employee_id: EmployeeIDSC,
            // role: RoleSC,
            // rating: Number(ratingSC),
            country_code: Country_CodeSC,
            Final_Status: statusSC,
            decided_on: decided_on,
            job_title: job_titleSC,
            department_id: dptSC,
            decided_by: decided_bySC,
            // remarks: remarksSC,
            // recommendation: RecommendationSC,
            // comments: commentsSC,
            // submitted_on: submitted_onSC,
            // meeting_link: meetingLinkSc,
            // timezone: timezoneSc,
          }),
        },
      );

      if (response.ok) {
        const searchData = await response.json();
        setRowData(searchData);
        console.log("Interview schedule fetched successfully");
      } else if (response.status === 404) {
        toast.warning("Data not found");
        setRowData([]);
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Search failed");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error fetching data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const columnDefs = [
    {
      headerName: "Candidate Name",
      field: "candidate_name",
      editable: false,
    },
    {
      headerName: "Job Title",
      field: "job_title",
      editable: false,
    },
    {
      headerName: "Department ID",
      field: "department_id",
      editable: false,
    },
    {
      headerName: "Country Code",
      field: "country_code",
      editable: false,
    },
    {
      headerName: "Final Status",
      field: "final_status",
      editable: false,
    },
    {
      headerName: "Decided By",
      field: "decided_by",
      editable: false,
    },
    {
      headerName: "Decided On",
      field: "decided_on",
      editable: false,
       valueFormatter: (params) => formatDate(params.value),
       filterParams: {
         comparator: (filterLocalDateAtMidnight, cellValue) => {
           const cellDate = new Date(cellValue.split("/").join("-"));
           if (cellDate < filterLocalDateAtMidnight) {
             return -1;
           } else if (cellDate > filterLocalDateAtMidnight) {
             return 1;
           }
           return 0;
         },
       },
    },
    // {
    //   headerName: "Meeting Link",
    //   field: "meeting_link",
    //   editable: true
    // },
    {
      headerName: "Keyfield",
      field: "keyfield",
      editable: false,
      hide: true,
    },
  ];

  const gridOptions = {
    pagination: true,
    paginationPageSize: 10,
  };

  const defaultColDef = {
    resizable: true,
    wrapText: true,
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  const generateReport = () => {
    if (!gridApi) return;

    const selectedRows = gridApi.getSelectedRows();

    if (selectedRows.length === 0) {
      toast.warning("Please select at least one row to print");
      return;
    }

    const logoUrl = "/favicon.ico"; // <-- put your logo inside public folder

    const reportWindow = window.open("", "_blank");

    reportWindow.document.write(`
    <html>
    <head>
      <title>Hiring Decision Report</title>
      <style>
        body {
          font-family: 'Segoe UI', sans-serif;
          margin: 0;
          padding: 20px;
          background-color: #f4f6f9;
        }

        .header {
          display: flex;
          align-items: center;
          background: linear-gradient(90deg, #4e73df, #1cc88a);
          padding: 15px 20px;
          color: white;
          border-radius: 8px;
        }
        
        .logo {
          height: 60px;
        }
        
        .title-section {
          flex: 1;
          text-align: center;
        }
      
        .title-section h2 {
          margin: 0;
        }

        .sub-info {
          margin: 15px 0;
          font-size: 14px;
          color: #555;
          display: flex;
          justify-content: space-between;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        th {
          background-color: #4e73df;
          color: white;
          padding: 10px;
          text-align: left;
        }

        td {
          padding: 8px;
          border-bottom: 1px solid #ddd;
        }

        tr:nth-child(even) {
          background-color: #f2f2f2;
        }

        tr:hover {
          background-color: #e2e6f0;
        }

        .footer {
          margin-top: 30px;
          text-align: center;
          font-size: 13px;
          color: #777;
        }

        .print-btn {
          margin-top: 20px;
          padding: 10px 20px;
          background: #1cc88a;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
        }

        .print-btn:hover {
          background: #17a673;
        }

        @media print {
          .print-btn {
            display: none;
          }
          body {
            background: white;
          }
        }
      </style>
    </head>
    <body>

      <div class="header">
        <img src="${logoUrl}" class="logo" />
        <div class="title-section">
          <h2>Hiring Decision Report</h2>
        </div>
      </div>

      <div class="sub-info">
        <div>Total Records: ${selectedRows.length}</div>
        <div>Printed Date: ${new Date().toLocaleDateString()}</div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Candidate Name</th>
            <th>Job Title</th>
            <th>Department ID</th>
            <th>Country Code</th>
            <th>Final Status</th>
            <th>Decided By</th>
            <th>Decided On</th>
          </tr>
        </thead>
        <tbody>
  `);

    selectedRows.forEach((row) => {
      reportWindow.document.write(`
      <tr>
        <td>${row.candidate_name || ""}</td>
        <td>${row.job_title || ""}</td>
        <td>${row.department_id || ""}</td>
        <td>${row.country_code || ""}</td>
        <td>${row.final_status || ""}</td>
        <td>${row.decided_by || ""}</td>
        <td>${row.decided_on ? formatDate(row.decided_on) : ""}</td>
      </tr>
    `);
    });

    reportWindow.document.write(`
        </tbody>
      </table>

      <div style="text-align:center;">
        <button class="print-btn" onclick="window.print()">Print</button>
      </div>

      <div class="footer">
        © ${new Date().getFullYear()} YJK Technologies | Confidential Report
      </div>

    </body>
    </html>
  `);

    reportWindow.document.close();
  };

  const reloadGridData = () => {
    window.location.reload();
  };

  const exportToPDF = () => {
    if (!gridApi) return;

    const selectedRows = gridApi.getSelectedRows();

    if (selectedRows.length === 0) {
      toast.warning("Please select at least one row to export");
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text("Hiring Decision Report", 14, 15);

    const tableColumn = [
      "Candidate Name",
      "Job Title",
      "Department ID",
      "Country Code",
      "Final Status",
      "Decided By",
      "Decided On",
    ];

    const tableRows = [];

    selectedRows.forEach((row) => {
      const rowData = [
        row.candidate_name || "",
        row.job_title || "",
        row.department_id || "",
        row.country_code || "",
        row.final_status || "",
        row.decided_by || "",
        row.decided_on ? formatDate(row.decided_on) : "",
      ];

      tableRows.push(rowData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("Hiring Decision Report.pdf");
  };

  const transformRowData = (data) => {
    return data.map((row) => ({
      "Candidate Name": row.candidate_name || "",
      "Job Title": row.job_title || "",
      "Department ID": row.department_id || "",
      "Country Code": row.country_code || "",
      "Final Status": row.final_status || "",
      "Decided By": row.decided_by || "",
      "Decided On": row.decided_on ? formatDate(row.decided_on) : "",
    }));
  };

  const handleExportToExcel = () => {
    if (!gridApi) return;

    const selectedRows = gridApi.getSelectedRows();

    if (selectedRows.length === 0) {
      toast.warning("Please select at least one row to export.");
      return;
    }

    const headerData = [["Hiring Decision Report"]];

    const transformedData = transformRowData(selectedRows);

    const worksheet = XLSX.utils.aoa_to_sheet(headerData);

    // Main table starts from row 5 (same pattern as your Task report)
    XLSX.utils.sheet_add_json(worksheet, transformedData, { origin: "A5" });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Hiring Decision Report",
    );

    XLSX.writeFile(workbook, "Hiring_Decision_Report.xlsx");
  };

  return (
    <div className="container-fluid Topnav-screen">
      {loading && <LoadingScreen />}
      <ToastContainer
        position="top-right"
        className="toast-design"
        theme="colored"
      />
      <div className="shadow-lg p-1 bg-light rounded main-header-box">
        <div className="header-flex">
          <h1 className="page-title">Hiring Decision Report</h1>

          <div className="action-wrapper desktop-actions">
            {["all permission", "view"].some((p) =>
              companyPermissions.includes(p),
            ) && (
              <div className="action-icon print" onClick={generateReport}>
                <span className="tooltip">Print</span>
                <i className="fa-solid fa-print"></i>
              </div>
            )}
            {["all permission", "PDF"].some((p) =>
              companyPermissions.includes(p),
            ) && (
              <div className="action-icon print" onClick={exportToPDF}>
                <span className="tooltip">Pdf</span>
                <i className="fa-solid fa-file-pdf"></i>
              </div>
            )}
            {["all permission", "Excel"].some((p) =>
              companyPermissions.includes(p),
            ) && (
              <div className="action-icon print" onClick={handleExportToExcel}>
                <span className="tooltip">Excel</span>
                <i class="fa-solid fa-file-excel"></i>
              </div>
            )}
          </div>

          {/* Mobile Dropdown */}
          <div className="dropdown mobile-actions">
            <button
              className="btn btn-primary dropdown-toggle p-1"
              data-bs-toggle="dropdown"
            >
              <i className="fa-solid fa-list"></i>
            </button>

            <ul className="dropdown-menu dropdown-menu-end text-center">
              {["all permission", "view"].some((p) =>
                companyPermissions.includes(p),
              ) && (
                <li className="dropdown-item" onClick={generateReport}>
                  <i className="fa-solid fa-print fs-4"></i>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="shadow-lg p-3 bg-light rounded mt-2 container-form-box">
        <div className="row g-3">
          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedcandidate_name ? "has-value" : ""} 
              ${isselectedscheduleid ? "is-focused" : ""}`}
            >
              <Select
                id="department"
                placeholder=" "
                onFocus={() => setIsscheduleid(true)}
                onBlur={() => setIsscheduleid(false)}
                classNamePrefix="react-select"
                isClearable
                type="text"
                value={selectedcandidate_name}
                onChange={handlescandidate_name}
                options={filteredOptioncandidate_name}
              />
              <label htmlFor="selecteddpt" className={`floating-label`}>
                Candiate Name
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required
                title="Please enter the Annual Bonus"
                autoComplete="off"
                value={job_titleSC}
                onChange={(e) => setjob_titleSC(e.target.value)}
              />
              <label for="sname" className="exp-form-labels">
                Job Title
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selecteddptSC ? "has-value" : ""} 
              ${isSelectDepartmentSC ? "is-focused" : ""}`}
            >
              <Select
                id="department"
                placeholder=" "
                onFocus={() => setIsSelectDepartmentSC(true)}
                onBlur={() => setIsSelectDepartmentSC(false)}
                classNamePrefix="react-select"
                isClearable
                type="text"
                value={selecteddptSC}
                onChange={handleDPTSC}
                options={filteredOptionDPtSC}
              />
              <label htmlFor="selecteddpt" className={`floating-label`}>
                Department ID
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required
                title="Please Enter the Annual Bonus"
                autoComplete="off"
                value={Country_CodeSC}
                onChange={(e) => setCountry_CodeSC(e.target.value)}
              />
              <label for="sname" className={`exp-form-labels`}>
                Country Code
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedStatusSC ? "has-value" : ""} 
              ${isSelectFocusedSC ? "is-focused" : ""}`}
            >
              <Select
                id="status"
                isClearable
                value={selectedStatusSC}
                onChange={handleChangeStatusSC}
                options={filteredOptionStatus}
                placeholder=""
                classNamePrefix="react-select"
                onFocus={() => setIsSelectFocusedSC(true)}
                onBlur={() => setIsSelectFocusedSC(false)}
              />
              <label for="status" class="floating-label">
                Final Status
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required
                title="Please Enter the Company Contribution"
                autoComplete="off"
                value={decided_bySC}
                onChange={(e) => setdecided_bySC(e.target.value)}
              />
              <label for="sname" className="exp-form-labels">
                Decided By
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="date"
                placeholder=""
                required
                title="Please Enter the Company Contribution"
                autoComplete="off"
                value={decided_on}
                onChange={(e) => setdecided_on(e.target.value)}
              />
              <label for="sname" className="exp-form-labels">
                Decided On
              </label>
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

      <div
        className="shadow-lg pt-3 bg-light rounded mt-2 container-form-box"
        style={{ width: "100%" }}
      >
        <div className="ag-theme-alpine" style={{ height: 455, width: "100%" }}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            onGridReady={onGridReady}
            rowSelection="multiple"
            pagination={true}
            paginationAutoPageSize={true}
          />
        </div>
      </div>
    </div>
  );
}

export default HiringDecisionReport;
