import { useState, useEffect, useRef } from "react";
import "./input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { AgGridReact } from "ag-grid-react";
import LoadingScreen from "./Loading";
import Select from "react-select";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx-js-style";

const config = require("./Apiconfig");

function InterviewCompletionRate({ }) {
  const [rowData, setRowData] = useState([]);
  const [comments, setComments] = useState("");
  const [hasValueChanged, setHasValueChanged] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState("");
  const [scheduleId, setScheduleId] = useState("");
  const [isSelectedScheduleId, setIsSelectedScheduleId] = useState("");
  const [isSelectedFeedbackId, setIsSelectedFeedbackId] = useState(false);
  const [scheduleidDrop, setscheduleidDrop] = useState([]);
  const [feedback_idDrop, setfeedback_idDrop] = useState([]);
  const [RecommendationDrop, setRecommendationDrop] = useState([]);
  const [recommendationDrop, setRecommendationdrop] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFeedbackId, setSelectedFeedbackId] = useState("");
  const [feedbackId, setFeedbackId] = useState("");
  const [selectedEmployeeId, setselectedEmployeeId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [EmployeeIDdrop, setEmployeeIDdrop] = useState([]);
  const [isSelectEmployeeId, setIsSelectEmployeeId] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [isSelectRecommendation, setIsSelectRecommendation] = useState(false);
  const [employeeDrop, setEmployeeDrop] = useState([]);
  const gridRef = useRef(null);
  const gridApiRef = useRef(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const formatDate = (isoDateString) => {
    if (!isoDateString) return ""; // ✅ null / undefined / empty handle

    const date = new Date(isoDateString);

    if (isNaN(date.getTime())) return ""; // ✅ Invalid date handle

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  //purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem("permissions")) || {};
  const companyPermissions = permissions
    .filter((permission) => permission.screen_type === "InterviewCompletionR")
    .map((permission) => permission.permission_type.toLowerCase());

  const handleFeedbackId = (selectedDPT) => {
    setSelectedFeedbackId(selectedDPT);
    setFeedbackId(selectedDPT ? selectedDPT.value : "");
  };
  const filteredOptionFeedbackId = feedback_idDrop.map((option) => ({
    value: option.feedback_id,
    label: option.feedback_id,
  }));

  const handleRecommendation = (selectedDPT) => {
    setSelectedRecommendation(selectedDPT);
    setRecommendation(selectedDPT ? selectedDPT.value : "");
  };
  const filteredOptionRecommendation = RecommendationDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleEmployeeId = (selectedDPT) => {
    setselectedEmployeeId(selectedDPT);
    setEmployeeId(selectedDPT ? selectedDPT.value : "");
  };

  const filteredOptionEmployeeId = EmployeeIDdrop.map((option) => ({
    value: option.EmployeeId,
    label: `${option.EmployeeId} - ${option.First_Name}`,
  }));

  const handleCcheduleId = (selectedDPT) => {
    setSelectedScheduleId(selectedDPT);
    setScheduleId(selectedDPT ? selectedDPT.value : "");
  };

  const filteredOptionScheduleId = scheduleidDrop.map((option) => ({
    value: option.schedule_id,
    label: option.schedule_id,
  }));

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

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    fetch(`${config.apiBaseUrl}/Recommendation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((response) => response.json())
      .then((data) => {
        const recommendation = data.map(
          (option) => option.attributedetails_name,
        );
        setRecommendationdrop(recommendation);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

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
        const response = await fetch(`${config.apiBaseUrl}/Feedback_ID`, {
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
        setfeedback_idDrop(val);
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

    fetch(`${config.apiBaseUrl}/Employee_ID`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((response) => response.json())
      .then((data) => {
        const employee = data.map((option) => option.EmployeeId);
        setEmployeeDrop(employee);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const columnDefs = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      headerName: "Schedule ID",
      field: "schedule_id",
      editable: false,
    },
    {
      headerName: "Employee ID",
      field: "employee_id",
      editable: false,
    },
    {
      headerName: "Rating",
      field: "rating",
      editable: false,
    },
    {
      headerName: "Comments",
      field: "comments",
      editable: false,
    },
    {
      headerName: "Submitted On",
      field: "submitted_on",
      editable: false,
    },
    {
      headerName: "Recommendation",
      field: "Recommendation",
      editable: false,
    },
  ];

  const onGridReady = (params) => {
    gridApiRef.current = params.api;
  };

  const gridOptions = {
    pagination: true,
    paginationPageSize: 10,
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const body = {
        schedule_id: Number(scheduleId),
        feedback_id: Number(feedbackId),
        employee_id: employeeId,
        Recommendation: recommendation,
        rating: 0,
        comments: comments,
        from_date: fromDate,
        to_date: toDate,
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      };

      const response = await fetch(`${config.apiBaseUrl}/InterviewCompletionRateSC`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        },
      );

      if (response.ok) {
        const fetchedData = await response.json();

        const newRows = fetchedData.map((item) => ({
          schedule_id: item.schedule_id,
          employee_id: item.employee_id,
          rating: item.rating,
          comments: item.comments,
          Recommendation: item.Recommendation,
          submitted_on: item.submitted_on,
          keyfield: item.keyfield,
        }));

        // ✅ Count records
        const totalCount = newRows.length;

        // ✅ Decide label dynamically based on selected combo
        let totalLabel = "Total Candidate";

        if (recommendation) {
          totalLabel = `Total ${recommendation} Candidate`;
        }

        // ✅ Push Total Row
        newRows.push({
          schedule_id: null,
          employee_id: "",
          rating: null,
          comments: "",
          Recommendation: "",
          submitted_on: null,
          keyfield: "",
          totalRow: true,
          totalText: `${totalLabel} : ${totalCount}`,
        });

        setRowData(newRows);
      } else if (response.status === 404) {
        toast.warning("Data Not found");
        setRowData([]);
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to fetch data");
        setRowData([]);
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
    } finally {
      setLoading(false);
    }
  };

  const reloadGridData = () => {
    setRowData([]);
  };

  const generateReport = () => {
    const api = gridRef.current?.api;
    if (!api) return;

    const selectedRows = api
      .getSelectedRows()
      .filter((row) => row.schedule_id !== null);

    if (selectedRows.length === 0) {
      toast.warning("Please select at least one row to print");
      return;
    }

    // ✅ Get Selected Recommendation
    const selectedRecommendation = recommendation || "";

    // ✅ Dynamic Title Text
    let recommendationText = "Candidates";

    if (selectedRecommendation.toLowerCase() === "select") {
      recommendationText = "Selected Candidate";
    } else if (selectedRecommendation.toLowerCase() === "hold") {
      recommendationText = "Hold Candidate";
    } else if (selectedRecommendation.toLowerCase() === "next round") {
      recommendationText = "Next Round Candidate";
    } else if (selectedRecommendation.toLowerCase() === "reject") {
      recommendationText = "Reject Candidate";
    }

    const reportWindow = window.open("", "_blank");

    reportWindow.document.write(`
  <html>
  <head>
    <title>Interview Completion Report</title>
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

      .title-section {
        flex: 1;
        text-align: center;
      }

      .title-section h2 {
        margin: 0;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        margin-top: 15px;
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
    <div class="title-section">
      <h2>Interview Completion Report</h2>
    </div>
  </div>

  <div style="margin-top:15px;">
    <strong>Total ${recommendationText} : ${selectedRows.length}</strong>
    <span style="float:right;">
      Printed Date: ${new Date().toLocaleDateString()}
    </span>
  </div>

  <table>
    <thead>
      <tr>
        <th>Schedule ID</th>
        <th>Employee ID</th>
        <th>Rating</th>
        <th>Comments</th>
        <th>Submitted On</th>
        <th>Recommendation</th>
      </tr>
    </thead>
    <tbody>
  `);

    selectedRows.forEach((row) => {
      reportWindow.document.write(`
      <tr>
        <td>${row.schedule_id || ""}</td>
        <td>${row.employee_id || ""}</td>
        <td>${row.rating || ""}</td>
        <td>${row.comments || ""}</td>
        <td>${row.submitted_on ? formatDate(row.submitted_on) : ""}</td>
        <td>${row.Recommendation || ""}</td>
      </tr>
    `);
    });

    reportWindow.document.write(`
    </tbody>
  </table>

  <div style="text-align:center;">
    <button class="print-btn" onclick="window.print()">Print</button>
  </div>

  </body>
  </html>
  `);

    reportWindow.document.close();
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
        "Employee ID",
        "Rating",
        "Comments",
        "Submitted On",
        "Recommendation",
      ],
    ];

    // ✅ Table body
    const body = dataSource.map((row) => [
      row.schedule_id || "",
      row.employee_id || "",
      row.rating || "",
      row.comments || "",
      row.submitted_on || "",
      row.Recommendation || "",
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
    doc.text("Interview Completion Report", pageWidth / 2, 40, {
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

    doc.save("Interview_Completion_Report.pdf");
  };

  const transformRowData = (data) => {
    return data.map((row) => ({
      "Schedule ID": row.schedule_id || "",
      "Employee ID": row.employee_id || "",
      Rating: row.rating || "",
      Comments: row.comments || "",
      "Submitted On": row.submitted_on ? formatDate(row.submitted_on) : "",
      Recommendation: row.Recommendation || "",
    }));
  };

  const handleExportToExcel = () => {
    if (!rowData || rowData.length === 0) {
      toast.warning("There is no data to export.");
      return;
    }

    const screenName = "Interview Completion Report";
    const company = sessionStorage.getItem("selectedCompanyName") || "";

    /* ================= READ THEME COLORS ================= */

    const titleBg = getCSSVariable("--but").replace("#", "");
    const tableHeaderBg = getCSSVariable("--ag-header").replace("#", "");
    const fontColor = getCSSVariable("--font-color").replace("#", "");
    const altRowBg = getCSSVariable("--ag-row").replace("#", "");

    /* ================= HEADER DATA ================= */

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
    const totalColumns = Object.keys(transformedData[0]).length;

    /* ================= TITLE STYLE ================= */

    worksheet["A1"].s = {
      font: { bold: true, sz: 16, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: titleBg } },
      alignment: { horizontal: "center", vertical: "center" },
    };

    worksheet["!merges"] = [
      {
        s: { r: 0, c: 0 },
        e: { r: 0, c: totalColumns - 1 },
      },
    ];

    /* ================= TABLE HEADER STYLE ================= */

    for (let C = 0; C < totalColumns; C++) {
      const cell = worksheet[
        XLSX.utils.encode_cell({ r: headerRowIndex, c: C })
      ];

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
        const cell = worksheet[
          XLSX.utils.encode_cell({ r: R, c: C })
        ];

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
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Interview Completion"
    );

    XLSX.writeFile(
      workbook,
      "Interview_Completion_Report.xlsx"
    );
  };

  return (
    <div class="container-fluid Topnav-screen ">
      {loading && <LoadingScreen />}
      <ToastContainer
        position="top-right"
        className="toast-design"
        theme="colored"
      />
      <div className="shadow-lg p-1 bg-light rounded main-header-box">
        <div className="header-flex">
          <h1 className="page-title">Interview Completion Rate</h1>
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
                required
                title="Please Enter the Company Contribution"
                autoComplete="off"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
              <label for="sname" className="exp-form-labels">
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
                required
                title="Please Enter the Company Contribution"
                autoComplete="off"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
              <label for="sname" className="exp-form-labels">
                Submitted To
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedFeedbackId ? "has-value" : ""} 
              ${isSelectedFeedbackId ? "is-focused" : ""}`}
            >
              <Select
                id="department"
                placeholder=" "
                onFocus={() => setIsSelectedFeedbackId(true)}
                onBlur={() => setIsSelectedFeedbackId(false)}
                classNamePrefix="react-select"
                isClearable
                type="text"
                value={selectedFeedbackId}
                onChange={handleFeedbackId}
                options={filteredOptionFeedbackId}
              />
              <label htmlFor="selecteddpt" className={`floating-label`}>
                Feedback ID
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
                onChange={handleCcheduleId}
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
              ${selectedEmployeeId ? "has-value" : ""} 
              ${isSelectEmployeeId ? "is-focused" : ""}`}
            >
              <Select
                id="department"
                placeholder=" "
                onFocus={() => setIsSelectEmployeeId(true)}
                onBlur={() => setIsSelectEmployeeId(false)}
                classNamePrefix="react-select"
                isClearable
                type="text"
                value={selectedEmployeeId}
                onChange={handleEmployeeId}
                options={filteredOptionEmployeeId}
              />
              <label htmlFor="selecteddpt" className={`floating-label`}>
                Employee ID
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
        className="shadow-lg pt-3 pb-3 bg-light rounded mt-2 container-form-box"
        style={{ width: "100%" }}
      >
        <div class="ag-theme-alpine" style={{ height: 455, width: "100%" }}>
          <AgGridReact
            ref={gridRef}
            rowSelection="multiple"
            columnDefs={columnDefs}
            rowData={rowData}
            pagination={true}
            paginationAutoPageSize={true}
            gridOptions={gridOptions}
            onGridReady={onGridReady}
          />
        </div>
      </div>
    </div>
  );
}
export default InterviewCompletionRate;