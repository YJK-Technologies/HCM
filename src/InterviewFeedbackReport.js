import { useState, useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "./App.css";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingScreen from "./Loading";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx-js-style";

const config = require("./Apiconfig");

function InterviewFeedbackReport() {
  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState("");
  const [isSelectedScheduleId, setIsSelectedScheduleId] = useState("");
  const [scheduleidDrop, setscheduleidDrop] = useState([]);
  const [scheduleId, setscheduleId] = useState("");
  const [selectedCandidateName, setSelectedCandidateName] = useState("");
  const [isSelectedCandidateName, setIsSelectedCandidateName] = useState("");
  const [canditateName, setCandidateName] = useState("");
  const [canditatenameDrop, setcanditatenameDrop] = useState([]);
  const [selectedInterviewId, setselectedInterviewId] = useState("");
  const [isSelectInterviewId, setIsSelectInterviewId] = useState(false);
  const [interviewId, setInterviewId] = useState("");
  const [EmployeeIDdrop, setEmployeeIDdrop] = useState([]);
  const [role, setRole] = useState("");
  const [rating, setRating] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [selectedRecommendation, setselectedRecommendation] = useState("");
  const [isSelectRecommendation, setIsSelectRecommendation] = useState(false);
  const [RecommendationDrop, setRecommendationDrop] = useState([]);
  const [comments, setComments] = useState("");
  const gridApiRef = useRef(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  //purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem("permissions")) || {};
  const companyPermissions = permissions
    .filter((permission) => permission.screen_type === "Company")
    .map((permission) => permission.permission_type.toLowerCase());

  const handleScheduleId = (selectedDPT) => {
    setSelectedScheduleId(selectedDPT);
    setscheduleId(selectedDPT ? selectedDPT.value : "");
  };

  const handleCandidateName = (selectedDPT) => {
    setSelectedCandidateName(selectedDPT);
    setCandidateName(selectedDPT ? selectedDPT.value : "");
  };

  const handleEmployeeId = (selectedDPT) => {
    setselectedInterviewId(selectedDPT);
    setInterviewId(selectedDPT ? selectedDPT.value : "");
  };

  const handleRecommendation = (selectedDPT) => {
    setselectedRecommendation(selectedDPT);
    setRecommendation(selectedDPT ? selectedDPT.value : "");
  };

  const filteredOptionScheduleId = scheduleidDrop.map((option) => ({
    value: option.schedule_id,
    label: option.schedule_id,
  }));

  const filteredOptionCandidateName = canditatenameDrop.map((option) => ({
    value: option.candidate_name,
    label: `${option.candidate_id} - ${option.candidate_name}`,
  }));

  const filteredOptionEmployeeId = EmployeeIDdrop.map((option) => ({
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
            schedule_id: Number(scheduleId),
            candidate_name: canditateName,
            employee_id: interviewId,
            role: role,
            rating: Number(rating),
            recommendation: recommendation,
            comments: comments,
            from_date: fromDate,
            to_date: toDate,
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
      headerCheckboxSelection: true,
      checkboxSelection: true,
      headerName: "Schedule Id",
      field: "schedule_id",
      editable: false,
    },
    {
      headerName: "Interviewer Id",
      field: "interviewer_id",
      editable: false,
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
      editable: false,
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
    gridApiRef.current = params.api;
  };

  const generateReport = () => {
    if (!gridApi) return;

    const selectedRows = gridApi.getSelectedRows();

    if (selectedRows.length === 0) {
      toast.warning("Please select at least one row to print");
      return;
    }

    /* ================= READ THEME COLORS ================= */

    const headerGradientStart = getCSSVariable("--but");
    const tableHeaderBg = getCSSVariable("--ag-header");
    const fontColor = getCSSVariable("--font-color");
    const rowAltColor = getCSSVariable("--ag-row");
    const hoverColor = getCSSVariable("--ag-hover");

    const logoUrl = window.location.origin + "/favicon.ico";
    const reportWindow = window.open("", "_blank");

    const link = reportWindow.document.createElement("link");
    link.rel = "icon";
    link.type = "image/x-icon";
    link.href = logoUrl;

    // 🔥 append to HEAD
    reportWindow.document.head.appendChild(link);

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
          color: ${fontColor};
        }

        .header {
          display: flex;
          align-items: center;
          background: ${tableHeaderBg};
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
          background-color: ${tableHeaderBg};
          color: white;
          padding: 10px;
          text-align: left;
        }

        td {
          padding: 8px;
          border-bottom: 1px solid #ddd;
        }

        tr:nth-child(even) {
          background-color: ${rowAltColor};
        }

        tr:hover {
          background-color: ${hoverColor};
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
          background: ${headerGradientStart};
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
        }

        .print-btn:hover {
          opacity: 0.85;
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

  const getCSSVariable = (variableName) => {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(variableName)
      .trim();
  };

  // Convert HEX color to RGB array (jsPDF needs RGB)
  const hexToRgb = (hex) => {
    const cleanHex = hex.replace("#", "");
    const num = parseInt(cleanHex, 16);
    return [
      (num >> 16) & 255,
      (num >> 8) & 255,
      num & 255,
    ];
  };

  const exportToPDF = () => {
    if (!gridApiRef.current) return;

    if (!rowData || rowData.length === 0) {
      toast.warning("There is no data to export.");
      return;
    }

    const selectedRows = gridApiRef.current.getSelectedRows();
    const dataSource = selectedRows.length > 0 ? selectedRows : rowData;

    const headerBgColor = hexToRgb(getCSSVariable("--but"));
    const tableHeaderColor = hexToRgb(getCSSVariable("--ag-header"));
    const fontColor = hexToRgb(getCSSVariable("--font-color"));
    const rowAltColor = hexToRgb(getCSSVariable("--ag-row"));

    const headers = [
      [
        "Schedule ID",
        "Interviewer Id",
        "Candidate Name",
        "Submitted On",
        "Recommendation",
        "Comments",
        "Role",
        "Rating",
      ],
    ];

    // ✅ Table body
    const body = dataSource.map((row) => [
      row.schedule_id,
      row.interviewer_id,
      row.candidate_name,
      row.submitted_on,
      row.recommendation,
      row.comments,
      row.role,
      row.rating,
    ]);

    const doc = new jsPDF("l", "pt", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();

    /* ================= HEADER DESIGN ================= */

    // Header background bar
    doc.setFillColor(...headerBgColor);
    doc.roundedRect(20, 15, pageWidth - 40, 55, 8, 8, "F");

    // Title (centered)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(255);
    doc.text("Interview Feedback Report", pageWidth / 2, 40, {
      align: "center",
    });

    // Sub-title
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(
      `Generated on: ${new Date().toLocaleDateString()} | Total Records: ${dataSource.length}`,
      pageWidth / 2,
      60,
      { align: "center" }
    );

    /* ================= TABLE DESIGN ================= */

    autoTable(doc, {
      startY: 90,
      head: headers,
      body: body,

      styles: {
        fontSize: 10,
        cellPadding: 8,
        textColor: fontColor,
        valign: "middle",
      },

      headStyles: {
        fillColor: tableHeaderColor,
        textColor: [255, 255, 255],
        fontStyle: "bold",
        halign: "center",
      },

      alternateRowStyles: {
        fillColor: rowAltColor,
      },

      columnStyles: {
        7: { halign: "center", fontStyle: "bold" }, // Status column alignment only
      },

      margin: { left: 20, right: 20 },
    });

    doc.save("Interview_Feedback_Report.pdf");
  };

  const transformRowData = (data) => {
    return data.map((row) => ({
      "Schedule ID": row.schedule_id || "",
      "Interviewer Id": row.interviewer_id || "",
      "Candidate Name": row.candidate_name || "",
      "Submitted On": row.submitted_on || "",
      "Recommendation": row.recommendation || "",
      "Comments": row.comments || "",
      "Role": row.role || "",
      "Rating": row.rating || "",
    }));
  };

  const handleExportToExcel = () => {
    if (!rowData || rowData.length === 0) {
      toast.warning("There is no data to export.");
      return;
    }

    const screenName = "Interview Feedback Report";
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Interview Feedback");

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
            {["all permission", "view"].some((p) => companyPermissions.includes(p)) && (
              <div className="action-icon print" onClick={generateReport}>
                <span className="tooltip">Print</span>
                <i className="fa-solid fa-print"></i>
              </div>
            )}
            {["all permission", "PDF"].some((p) => companyPermissions.includes(p)) && (
              <div className="action-icon print" onClick={exportToPDF}>
                <span className="tooltip">Pdf</span>
                <i className="fa-solid fa-file-pdf"></i>
              </div>
            )}
            {["all permission", "Excel"].some((p) => companyPermissions.includes(p)) && (
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
              {["all permission", "view"].some((p) => companyPermissions.includes(p)) && (
                <li className="dropdown-item" onClick={generateReport}>
                  <i className="fa-solid fa-print text-dark fs-4"></i>
                </li>
              )}
              {["all permission", "Pdf"].some((p) => companyPermissions.includes(p)) && (
                <li className="dropdown-item" onClick={exportToPDF}>
                  <i className="fa-solid fa-file-pdf text-dark"></i>
                </li>
              )}
              {["all permission", "Excel"].some((p) => companyPermissions.includes(p)) && (
                <li className="dropdown-item" onClick={handleExportToExcel}>
                  <i class="fa-solid fa-file-excel text-success"></i>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="shadow-lg p-3 bg-light rounded mt-2 container-form-box">
        <div className="row g-3">

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="date"
                placeholder=""
                title="Please Enter the Employee PF"
                required
                isClearable
                autoComplete="off"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
              <label htmlFor="add1" className={`exp-form-labels`}>
                Submitted From
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
                isClearable
                autoComplete="off"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
              <label htmlFor="add1" className={`exp-form-labels`}>
                Submitted To
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedScheduleId ? "has-value" : ""} 
              ${isSelectedScheduleId ? "is-focused" : ""}`}
            >
              <Select
                id="department"
                placeholder=" "
                onFocus={() => setIsSelectedScheduleId(true)}
                onBlur={() => setIsSelectedScheduleId(false)}
                classNamePrefix="react-select"
                isClearable
                type="text"
                value={selectedScheduleId}
                onChange={handleScheduleId}
                options={filteredOptionScheduleId}
              />
              <label htmlFor="selecteddpt" className={`floating-label`}>
                Schedule ID
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedCandidateName ? "has-value" : ""} 
              ${isSelectedCandidateName ? "is-focused" : ""}`}
            >
              <Select
                id="department"
                placeholder=" "
                onFocus={() => setIsSelectedCandidateName(true)}
                onBlur={() => setIsSelectedCandidateName(false)}
                classNamePrefix="react-select"
                isClearable
                type="text"
                value={selectedCandidateName}
                onChange={handleCandidateName}
                options={filteredOptionCandidateName}
              />
              <label htmlFor="selecteddpt" className={`floating-label`}>
                Candiate Name
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedInterviewId ? "has-value" : ""} 
              ${isSelectInterviewId ? "is-focused" : ""}`}
            >
              <Select
                id="department"
                placeholder=" "
                onFocus={() => setIsSelectInterviewId(true)}
                onBlur={() => setIsSelectInterviewId(false)}
                classNamePrefix="react-select"
                isClearable
                type="text"
                value={selectedInterviewId}
                onChange={handleEmployeeId}
                options={filteredOptionEmployeeId}
              />
              <label htmlFor="selecteddpt" className={`floating-label`}>
                Interview ID
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
                value={role}
                onChange={(e) => setRole(e.target.value)}
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
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              />
              <label for="add1" className={`exp-form-labels`}>
                Rating
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedRecommendation ? "has-value" : ""} 
              ${isSelectRecommendation ? "is-focused" : ""}`}
            >
              <Select
                id="department"
                placeholder=" "
                onFocus={() => setIsSelectRecommendation(true)}
                onBlur={() => setIsSelectRecommendation(false)}
                classNamePrefix="react-select"
                isClearable
                type="text"
                value={selectedRecommendation}
                onChange={handleRecommendation}
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
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
              <label for="sname" className="exp-form-labels">
                Comments
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
