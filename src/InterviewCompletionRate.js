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
  const interviewCompletionRPermissions = permissions
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
      cellRenderer: params => {
        if (params.data?.totalRow) {
          return (
            <strong>
              {params.data.totalText}
            </strong>
          );
        }
        return params.value;
      },
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

        const totalCount = fetchedData.length;

        let totalLabel = "Total Candidate";
        if (recommendation) {
          totalLabel = `Total ${recommendation} Candidate`;
        }

        const rows = fetchedData.map((item) => ({
          ...item,
          totalRow: false,
        }));

        // ✅ Add TOTAL ROW
        rows.push({
          totalRow: true,
          totalText: `${totalLabel} : ${totalCount}`,
        });

        setRowData(rows);
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

  /* ================= THEME COLORS ================= */

  const headerGradientStart = getCSSVariable("--but");
  const tableHeaderBg = getCSSVariable("--ag-header");
  const fontColor = getCSSVariable("--font-color");
  const rowAltColor = getCSSVariable("--ag-row");
  const hoverColor = getCSSVariable("--ag-hover");

  /* ================= TITLE ================= */

  const selectedRecommendation = recommendation || "";

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
      <title>Interview Completion Report</title>

      <link rel="icon" type="image/x-icon" href="${logoUrl}" />

      <style>

        *{
          box-sizing:border-box;
        }

        body {
          font-family: 'Segoe UI', sans-serif;
          margin: 0;
          padding: 20px;
          background-color: #f4f6f9;
          color: ${fontColor};
        }

        .report-container{
          width:100%;
        }

        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: ${tableHeaderBg};
          padding: 15px 20px;
          color: white;
          border-radius: 10px;
          margin-bottom: 20px;
        }

        .logo {
          width: 60px;
          height: 60px;
          object-fit: contain;
        }

        .title-section {
          flex: 1;
          text-align: center;
        }

        .title-section h2 {
          margin: 0;
          font-size: 24px;
          letter-spacing: 0.5px;
        }

        .sub-info {
          margin: 15px 0 20px;
          font-size: 14px;
          color: #555;
          display: flex;
          justify-content: space-between;
          font-weight: 600;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 10px rgba(0,0,0,0.08);
        }

        thead {
          display: table-header-group;
        }

        th {
          background-color: ${tableHeaderBg};
          color: white;
          padding: 12px 10px;
          text-align: left;
          font-size: 14px;
          border: 1px solid #dcdcdc;
        }

        td {
          padding: 10px;
          border: 1px solid #e0e0e0;
          font-size: 13px;
          word-break: break-word;
        }

        tr:nth-child(even) {
          background-color: ${rowAltColor};
        }

        tr:hover {
          background-color: ${hoverColor};
        }

        .footer {
          margin-top: 25px;
          text-align: center;
          font-size: 13px;
          color: #777;
          font-weight: 500;
        }

        .print-btn-wrapper{
          text-align:center;
          margin-top:20px;
        }

        .print-btn {
          padding: 10px 24px;
          background: ${headerGradientStart};
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
        }

        .print-btn:hover {
          opacity: 0.9;
        }

        /* ================= PRINT STYLES ================= */

        @media print {

          @page {
            size: auto;
            margin: 12mm;
          }

          body {
            background: white !important;
            padding: 0;
            margin: 0;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .print-btn-wrapper {
            display: none !important;
          }

          .header {
            background: ${tableHeaderBg} !important;
            color: white !important;
            border-radius: 0;
          }

          table {
            box-shadow: none;
          }

          th {
            background: ${tableHeaderBg} !important;
            color: white !important;
          }

          tr:nth-child(even) {
            background-color: ${rowAltColor} !important;
          }

          .footer {
            margin-top: 15px;
          }
        }

      </style>
    </head>

    <body>

      <div class="report-container">

        <div class="header">

          <img src="${logoUrl}" class="logo" />

          <div class="title-section">
            <h2>Interview Completion Report</h2>
          </div>

          <div style="width:60px;"></div>

        </div>

        <div class="sub-info">
          <div>
            Total ${recommendationText} : ${selectedRows.length}
          </div>

          <div>
            Printed Date : ${new Date().toLocaleDateString()}
          </div>
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

            ${selectedRows
              .map(
                (row) => `
                <tr>
                  <td>${row.schedule_id || ""}</td>
                  <td>${row.employee_id || ""}</td>
                  <td>${row.rating || ""}</td>
                  <td>${row.comments || ""}</td>
                  <td>${row.submitted_on || ""}</td>
                  <td>${row.Recommendation || ""}</td>
                </tr>
              `
              )
              .join("")}

          </tbody>

        </table>

        <div class="print-btn-wrapper">
          <button class="print-btn" onclick="window.print()">
            Print
          </button>
        </div>

        <div class="footer">
          © ${new Date().getFullYear()} YJK Technologies | Confidential Report
        </div>

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
    if (!gridApiRef.current || rowData.length === 0) {
      toast.warning("Please select at least one row to export pdf");
      return;
    }

    const selectedRows = gridApiRef.current.getSelectedRows();
    const dataSource = selectedRows.length > 0 ? selectedRows : rowData;

    /* 🎨 Theme colors */
    const headerBg = getCSSVariable("--ag-header") || "#6a1b9a";
    const fontColor = getCSSVariable("--font-color") || "#000";

    const hexToRgb = (hex) => {
      hex = hex.replace("#", "");
      if (hex.length === 3) {
        hex = hex.split("").map(c => c + c).join("");
      }
      const bigint = parseInt(hex, 16);
      return [
        (bigint >> 16) & 255,
        (bigint >> 8) & 255,
        bigint & 255
      ];
    };

    const headerRGB = hexToRgb(headerBg);

    const doc = new jsPDF("l", "pt", "a4");
    const pageWidth = doc.internal.pageSize.width;

    /* ================= HEADER DESIGN ================= */

    // 🎨 Header background bar
    doc.setFillColor(...headerRGB);
    doc.rect(0, 0, pageWidth, 60, "F");

    // 🖼 Logo (left side)
    const logoUrl = window.location.origin + "/favicon.ico";

    // NOTE: image must be base64 for jsPDF
    const loadImage = (url, callback) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = function () {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL("image/png");
        callback(dataURL);
      };
      img.src = url;
    };

    loadImage(logoUrl, (logoBase64) => {

      // Add logo
      doc.addImage(logoBase64, "PNG", 20, 10, 40, 40);

      // 📝 Title (center)
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont(undefined, "bold");
      doc.text("Interview Completion Report", pageWidth / 2, 35, { align: "center" });

      /* ================= SUB HEADER ================= */

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);

      doc.text(`Total Records: ${dataSource.length}`, 40, 80);

      doc.text(
        `Printed Date: ${new Date().toLocaleDateString()}`,
        pageWidth - 180,
        80
      );

      /* ================= TABLE ================= */

      const headers = [
        columnDefs
          .filter(col => col.field)
          .map(col => col.headerName)
      ];

      const body = dataSource.map(row =>
        columnDefs
          .filter(col => col.field)
          .map(col => row[col.field] ?? "")
      );

      autoTable(doc, {
        startY: 100,
        head: headers,
        body: body,

        styles: {
          fontSize: 9,
        },

        headStyles: {
          fillColor: headerRGB,
          textColor: [255, 255, 255],
        },

        margin: { left: 40, right: 40 },
      });

      doc.save("Interview_Completion_Report.pdf");
    });
  };

  const transformRowData = (data) => {
    return data.map((row) => ({
      "Schedule ID": row.schedule_id || "",
      "Employee ID": row.employee_id || "",
      "Rating": row.rating || "",
      "Comments": row.comments || "",
      "Submitted On": row.submitted_on || "",
      "Recommendation": row.Recommendation || "",
    }));
  };

  const handleExportToExcel = () => {
    if (!gridApiRef.current) return;

    const selectedRows = gridApiRef.current.getSelectedRows();

    const dataSource = selectedRows.length > 0 ? selectedRows : rowData;

    if (!dataSource || dataSource.length === 0) {
      toast.warning("No data to export");
      return;
    }

    const screenName = "Interview Completion Report";
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Interview Completion Report");

    XLSX.writeFile(workbook, "Interview_Completion_Report.xlsx");
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
            {["all permission", "view"].some((p) => interviewCompletionRPermissions.includes(p)) && (
              <div className="action-icon print" onClick={generateReport}>
                <span className="tooltip">Print</span>
                <i className="fa-solid fa-print"></i>
              </div>
            )}
            {["all permission", "PDF"].some((p) => interviewCompletionRPermissions.includes(p)) && (
              <div className="action-icon print" onClick={exportToPDF}>
                <span className="tooltip">Pdf</span>
                <i className="fa-solid fa-file-pdf"></i>
              </div>
            )}
            {["all permission", "Excel"].some((p) => interviewCompletionRPermissions.includes(p)) && (
              <div className="action-icon add" onClick={handleExportToExcel}>
                <span className="tooltip">Excel</span>
                <i class="fa-solid fa-file-excel"></i>
              </div>
            )}
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
              {["all permission", "view"].some((p) => interviewCompletionRPermissions.includes(p)) && (
                <li>
                  <button className="dropdown-item" onClick={generateReport}>
                    <i className="fa-solid fa-print text-dark fs-4"></i>
                  </button>
                </li>
              )}
              {["all permission", "Pdf"].some((p) => interviewCompletionRPermissions.includes(p)) && (
                <li>
                  <button className="dropdown-item" onClick={exportToPDF}>
                    <i className="fa-solid fa-file-pdf text-dark fs-4"></i>
                  </button>
                </li>
              )}
              {["all permission", "Excel"].some((p) => interviewCompletionRPermissions.includes(p)) && (
                <li>
                  <button className="dropdown-item" onClick={handleExportToExcel}>
                    <i className="fa-solid fa-file-excel add fs-4"></i>
                  </button>
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