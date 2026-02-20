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

function InterviewFeedbackReport() {
  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const navigate = useNavigate();
  const [statusdrop, setStatusdrop] = useState([]);
  const [statusgriddrop, setStatusGriddrop] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rowDataReport, setrowDataReport] = useState(" ");

  const [selectedscheduleidSC, setselectedscheduleidSC] = useState("");
  const [isselectedscheduleidSC, setIsscheduleidSC] = useState("");
  const [scheduleidDrop, setscheduleidDrop] = useState([]);
  const [scheduleidSC, setscheduleidSC] = useState("");
  const [selectedcandidate_name, setSelectedcandidatename] = useState("");
  const [isselectedscheduleid, setIsscheduleid] = useState("");
  const [canditatename, set_candidatename] = useState("");
  const [canditatenameDrop, setcanditatenameDrop] = useState([]);
  const [emailSC, setemailSC] = useState("");
  const [panel_nameSC, setpanel_nameSC] = useState("");
  const [selectedInterviewModeSC, setselectedInterviewModeSC] = useState("");
  const [isSelectInterviewModeSC, setisSelectInterviewModeSC] = useState(false);
  const [InterviewModedrop, setInterviewModeDrop] = useState([]);
  const [InterviewModeSC, setInterviewModeSC] = useState("");
  const [locationSC, setlocationSC] = useState("");
  const [selectedStatusSC, setSelectedStatusSC] = useState(null);
  const [isSelectFocusedSC, setIsSelectFocusedSC] = useState(false);
  const [statusSC, setstatusSC] = useState("");
  const [scheduled_datetimeSC, setscheduled_datetimeSC] = useState("");
  const [selectedEmployeeIDSC, setselectedEmployeeIDSC] = useState("");
  const [isSelectEmployeeIDSC, setisSelectEmployeeIDSC] = useState(false);
  const [EmployeeIDSC, setEmployeeIDSC] = useState("");
  const [EmployeeIDdrop, setEmployeeIDdrop] = useState([]);
  const [RoleSC, setRoleSC] = useState("");
  const [ratingSC, setratingSC] = useState("");
  const [RecommendationSC, setRecommendationSC] = useState("");
  const [selectedRecommendationSC, setselectedRecommendationSC] = useState("");
  const [isSelectRecommendationSC, setisSelectRecommendationSC] =useState(false);
  const [RecommendationDrop, setRecommendationDrop] = useState([]);
  const [commentsSC, setcommentsSC] = useState("");
  const [submitted_onSC, setsubmitted_onSC] = useState("");
 
  //purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem("permissions")) || {};
  const companyPermissions = permissions
    .filter((permission) => permission.screen_type === "Company")
    .map((permission) => permission.permission_type.toLowerCase());

  const handleschedule_idSC = (selectedDPT) => {
    setselectedscheduleidSC(selectedDPT);
    setscheduleidSC(selectedDPT ? selectedDPT.value : "");
  };

  const handlescandidate_name = (selectedDPT) => {
    setSelectedcandidatename(selectedDPT);
    set_candidatename(selectedDPT ? selectedDPT.value : "");
  };

  const handleInterviewModeSC = (selectedDPT) => {
    setselectedInterviewModeSC(selectedDPT);
    setInterviewModeSC(selectedDPT ? selectedDPT.value : "");
  };

  const handleChangeStatusSC = (selectedStatus) => {
    setSelectedStatusSC(selectedStatus);
    setstatusSC(selectedStatus ? selectedStatus.value : "");
  };

  const handleEmployeeIDSC = (selectedDPT) => {
    setselectedEmployeeIDSC(selectedDPT);
    setEmployeeIDSC(selectedDPT ? selectedDPT.value : "");
  };

  const handleRecommendationSC = (selectedDPT) => {
    setselectedRecommendationSC(selectedDPT);
    setRecommendationSC(selectedDPT ? selectedDPT.value : "");
  };

  const filteredOptionschedule_id = scheduleidDrop.map((option) => ({
    value: option.schedule_id,
    label: option.schedule_id,
  }));

  const filteredOptioncandidate_name = canditatenameDrop.map((option) => ({
    value: option.candidate_name,
    label: `${option.candidate_id} - ${option.candidate_name}`,
  }));

  const filteredOptionInterviewMode = InterviewModedrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionStatus = statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionEmployeeID = EmployeeIDdrop.map((option) => ({
    value: option.EmployeeId,
    label: `${option.EmployeeId} - ${option.First_Name}`,
  }));

  const filteredOptionRecommendation = RecommendationDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    const fetchDept = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/ScheduleID`, {
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
        setscheduleidDrop(val);
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

    const fetchDept = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/InterviewMode`, {
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
        setInterviewModeDrop(val);
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

    const fetchDept = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/Employee_ID`, {
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
        setEmployeeIDdrop(val);
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

    const fetchDept = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/Recommendation`, {
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
        setRecommendationDrop(val);
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
        `${config.apiBaseUrl}/InterviewFeedbackSearch`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            schedule_id: scheduleidSC,
            candidate_name: canditatename,
            // email: emailSC,
            // panel_name: panel_nameSC,
            // scheduled_datetime: scheduled_datetimeSC,
            // Interview_Mode: InterviewModeSC,
            // Status: statusSC,
            // location: locationSC,
            employee_id: EmployeeIDSC,
            Role: RoleSC,
            rating: Number(ratingSC),
            Recommendation: RecommendationSC,
            comments: commentsSC,
            submitted_on: submitted_onSC,
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
      headerName: "Schedule Id",
      field: "schedule_id",
      editable: false,
    },
    {
      headerName: "Interviewer Id",
      field: "interviewer_id",
      editable: true,
    },
    {
      headerName: "Candidate Name",
      field: "candidate_name",
      editable: false,
    },
    {
      headerName: "Submitted On",
      field: "submitted_on",
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
    {
      headerName: "Recommendation Mode",
      field: "recommendation",
      editable: false,
    },
    {
      headerName: "Comments",
      field: "comments",
      editable: true,
    },
    {
      headerName: "Role",
      field: "role",
      editable: false,
    },

    {
      headerName: "Rating",
      field: "rating",
      editable: true,
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
      <title>Interview Feedback Report</title>
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
          <h2>Interview Feedback Report</h2>
        </div>
      </div>

      <div class="sub-info">
        <div>Total Records: ${selectedRows.length}</div>
        <div>Printed Date: ${new Date().toLocaleDateString()}</div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Schedule ID</th>
            <th>Interviewer Id</th>
            <th>Candidate Name</th>
            <th>Submitted On</th>
            <th>Recommendation Mode</th>
            <th>Comments</th>
            <th>Role</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
  `);

    selectedRows.forEach((row) => {
      reportWindow.document.write(`
      <tr>
        <td>${row.schedule_id || ""}</td>
        <td>${row.interviewer_id || ""}</td>
        <td>${row.candidate_name || ""}</td>
        <td>${row.submitted_on ? formatDate(row.submitted_on) : ""}</td>
        <td>${row.recommendation || ""}</td>
        <td>${row.comments || ""}</td>
        <td>${row.role || ""}</td>
        <td>${row.rating || ""}</td>
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
    doc.text("Interview Feedback Report", 14, 15);

    const tableColumn = [
      "Schedule ID",
      "Interviewer Id",
      "Candidate Name",
      "Submitted On",
      "Recommendation",
      "Comments",
      "Role",
      "Rating",
    ];

    const tableRows = [];

    selectedRows.forEach((row) => {
      const rowData = [
        row.schedule_id || "",
        row.interviewer_id || "",
        row.candidate_name || "",
        row.submitted_on ? formatDate(row.submitted_on) : "",
        row.recommendation || "",
        row.comments || "",
        row.role || "",
        row.rating || "",
      ];

      tableRows.push(rowData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("Interview_Feedback_Report.pdf");
  };

  const transformRowData = (data) => {
    return data.map((row) => ({
      "Schedule ID": row.schedule_id || "",
      "Interviewer Id": row.interviewer_id || "",
      "Candidate Name": row.candidate_name || "",
      "Submitted On": row.submitted_on ? formatDate(row.submitted_on) : "",
      "Recommendation": row.recommendation || "", 
      "Comments": row.comments || "",
      "Role": row.role || "",
      "Rating": row.rating || "",
    }));
  };

  const handleExportToExcel = () => {
    if (!gridApi) return;

    const selectedRows = gridApi.getSelectedRows();

    if (selectedRows.length === 0) {
      toast.warning("Please select at least one row to export.");
      return;
    }

    const headerData = [["Interview Feedback Report"]];

    const transformedData = transformRowData(selectedRows);

    const worksheet = XLSX.utils.aoa_to_sheet(headerData);

    // Main table starts from row 5 (same pattern as your Task report)
    XLSX.utils.sheet_add_json(worksheet, transformedData, { origin: "A5" });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Interview Feedback Report");

    XLSX.writeFile(workbook, "Interview_Feedback_Report.xlsx");
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
          <h1 className="page-title">Interview Feedback Report</h1>

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
              ${selectedscheduleidSC ? "has-value" : ""} 
              ${isselectedscheduleidSC ? "is-focused" : ""}`}
            >
              <Select
                id="department"
                placeholder=" "
                onFocus={() => setIsscheduleidSC(true)}
                onBlur={() => setIsscheduleidSC(false)}
                classNamePrefix="react-select"
                isClearable
                type="text"
                value={selectedscheduleidSC}
                onChange={handleschedule_idSC}
                options={filteredOptionschedule_id}
              />
              <label htmlFor="selecteddpt" className={`floating-label`}>
                Schedule ID
              </label>
            </div>
          </div>

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
            <div
              className={`inputGroup selectGroup 
              ${selectedEmployeeIDSC ? "has-value" : ""} 
              ${isSelectEmployeeIDSC ? "is-focused" : ""}`}
            >
              <Select
                id="department"
                placeholder=" "
                onFocus={() => setisSelectEmployeeIDSC(true)}
                onBlur={() => setisSelectEmployeeIDSC(false)}
                classNamePrefix="react-select"
                isClearable
                type="text"
                value={selectedEmployeeIDSC}
                onChange={handleEmployeeIDSC}
                options={filteredOptionEmployeeID}
              />
              <label htmlFor="selecteddpt" className={`floating-label`}>
                Employee ID
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
                title="Please Enter the Employee PF"
                required
                autoComplete="off"
                value={RoleSC}
                onChange={(e) => setRoleSC(e.target.value)}
              />
              <label for="add1" className={`exp-form-labels`}>
                Role
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
                title="Please Enter the Employee PF"
                required
                autoComplete="off"
                value={ratingSC}
                onChange={(e) => setratingSC(e.target.value)}
              />
              <label for="add1" className={`exp-form-labels`}>
                Rating
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedRecommendationSC ? "has-value" : ""} 
              ${isSelectRecommendationSC ? "is-focused" : ""}`}
            >
              <Select
                id="department"
                placeholder=" "
                onFocus={() => setisSelectRecommendationSC(true)}
                onBlur={() => setisSelectRecommendationSC(false)}
                classNamePrefix="react-select"
                isClearable
                type="text"
                value={selectedRecommendationSC}
                onChange={handleRecommendationSC}
                options={filteredOptionRecommendation}
              />
              <label htmlFor="selecteddpt" className={`floating-label`}>
                Recommendation
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
                value={commentsSC}
                onChange={(e) => setcommentsSC(e.target.value)}
              />
              <label for="sname" className="exp-form-labels">
                Comments
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
                title="Please Enter the Employee PF"
                required
                autoComplete="off"
                value={submitted_onSC}
                onChange={(e) => setsubmitted_onSC(e.target.value)}
              />
              <label htmlFor="add1" className={`exp-form-labels`}>
                Submitted On
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

export default InterviewFeedbackReport;
