import { useState, useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "./App.css";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingScreen from "./Loading";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx-js-style";

const config = require("./Apiconfig");

function CandidateInterviewReport() {
  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [statusdrop, setStatusdrop] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCandidateName, setSelectedCandidateName] = useState("");
  const [isSelectedCandidateName, setIsSelectedCandidateName] = useState("");
  const [canditateName, setCandidateName] = useState("");
  const [canditatenameDrop, setcanditatenameDrop] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [isSelectStatus, setIsSelectStatus] = useState(false);
  const [status, setStatus] = useState("");
  const [rating, setRating] = useState("");
  const [remarks, setRemarks] = useState("");
  const [scheduleFrom, setScheduleFrom] = useState('');
  const [scheduleTo, setScheduleTo] = useState('');
  const [decidedFrom, setDecidedFrom] = useState('');
  const [decidedTo, setDecidedTo] = useState('');
  const gridApiRef = useRef(null);

  //purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem("permissions")) || {};
  const candidateInterviewRePermissions = permissions
    .filter((permission) => permission.screen_type === "CandidateInterviewRe")
    .map((permission) => permission.permission_type.toLowerCase());


  const handleCandidateName = (selectedDPT) => {
    setSelectedCandidateName(selectedDPT);
    setCandidateName(selectedDPT ? selectedDPT.value : "");
  };

  const handleChangeStatus = (selectedStatus) => {
    setSelectedStatus(selectedStatus);
    setStatus(selectedStatus ? selectedStatus.value : "");
  };

  const filteredOptionCandidateName = canditatenameDrop.map((option) => ({
    value: option.candidate_name,
    label: `${option.candidate_id} - ${option.candidate_name}`,
  }));

  const filteredOptionStatus = statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
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

  const handleSearch = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/InterviewProgressSearch`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            candidate_name: canditateName,
            from_date: scheduleFrom,
            to_date: scheduleTo,
            rating: Number(rating),
            remarks: remarks,
            Final_Status: status,
            start_date: decidedFrom,
            end_date: decidedTo,
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
      headerName: "Candidate Name",
      field: "candidate_name",
      editable: false,
    },
    {
      headerName: "Schedule Date",
      field: "scheduled_datetime",
      editable: false,
    },
    {
      headerName: "Rating",
      field: "rating",
      editable: false,
    },
    {
      headerName: "Final Status",
      field: "Final_Status",
      editable: false,
    },
    {
      headerName: "Decided On",
      field: "decided_on",
      editable: false,
    },
    {
      headerName: "Remarks",
      field: "remarks",
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

  const onFirstDataRendered = (params) => {
  const allColumnIds = params.columnApi
    .getColumns()
    .map((col) => col.getId());

  params.columnApi.autoSizeColumns(allColumnIds);
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

  reportWindow.document.write(`
    <html>
    <head>
      <title>Candidate Interview Report</title>

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
          height: 60px;
          width: 60px;
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

        /* ================= PRINT ================= */

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
            <h2>Candidate Interview Report</h2>
          </div>

          <div style="width:60px;"></div>
        </div>

        <div class="sub-info">
          <div>Total Records : ${selectedRows.length}</div>
          <div>Printed Date : ${new Date().toLocaleDateString()}</div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Candidate Name</th>
              <th>Schedule Date</th>
              <th>Rating</th>
              <th>Final Status</th>
              <th>Decided On</th>
              <th>Remarks</th>
            </tr>
          </thead>

          <tbody>

            ${selectedRows.map((row) => `
              <tr>
                <td>${row.candidate_name || ""}</td>
                <td>${row.scheduled_datetime || ""}</td>
                <td>${row.rating || ""}</td>
                <td>${row.Final_Status || ""}</td>
                <td>${row.decided_on || ""}</td>
                <td>${row.remarks || ""}</td>
              </tr>
            `).join("")}

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
      doc.text("Condidate Interview Report", pageWidth / 2, 35, { align: "center" });

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

      doc.save("Condidate_Interview_Report.pdf");
    });
  };

  const transformRowData = (data) => {
    return data.map((row) => ({
      "Candidate Name": row.candidate_name || "",
      "Schedule Date": row.scheduled_datetime || "",
      "Rating": row.rating || "",
      "Final Status": row.Final_Status || "",
      "Decided On": row.decided_on || "",
      "Remarks": row.remarks || "",
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

    const screenName = "Candidate Interview Report";
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Candidate Interview Report");

    XLSX.writeFile(workbook, "Candidate_Interview_Report.xlsx");
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
          <h1 className="page-title">Candidate Interview Report</h1>

          <div className="action-wrapper desktop-actions">
            {["all permission", "view"].some((p) => candidateInterviewRePermissions.includes(p)) && (
              <div className="action-icon print" onClick={generateReport}>
                <span className="tooltip">Print</span>
                <i className="fa-solid fa-print"></i>
              </div>
            )}
            {["all permission", "PDF"].some((p) => candidateInterviewRePermissions.includes(p)) && (
              <div className="action-icon print" onClick={exportToPDF}>
                <span className="tooltip">Pdf</span>
                <i className="fa-solid fa-file-pdf"></i>
              </div>
            )}
            {["all permission", "Excel"].some((p) => candidateInterviewRePermissions.includes(p)) && (
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
              {["all permission", "view"].some((p) => candidateInterviewRePermissions.includes(p)) && (
                <li>
                  <button className="dropdown-item" onClick={generateReport}>
                    <i className="fa-solid fa-print text-dark fs-4"></i>
                  </button>
                </li>
              )}
              {["all permission", "Pdf"].some((p) => candidateInterviewRePermissions.includes(p)) && (
                <li>
                  <button className="dropdown-item" onClick={exportToPDF}>
                    <i className="fa-solid fa-file-pdf text-dark fs-4"></i>
                  </button>
                </li>
              )}
              {["all permission", "Excel"].some((p) => candidateInterviewRePermissions.includes(p)) && (
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
                title="Please Enter the Employee PF"
                required
                autoComplete="off"
                value={scheduleFrom}
                onChange={(e) => setScheduleFrom(e.target.value)}
              />
              <label for="sname" className="exp-form-labels">
                Schedule From
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
                value={scheduleTo}
                onChange={(e) => setScheduleTo(e.target.value)}
              />
              <label for="sname" className="exp-form-labels">
                Schedule To
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
                value={decidedFrom}
                onChange={(e) => setDecidedFrom(e.target.value)}
              />
              <label for="sname" className="exp-form-labels">
                Decided From
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
                value={decidedTo}
                onChange={(e) => setDecidedTo(e.target.value)}
              />
              <label for="sname" className="exp-form-labels">
                Decided To
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
              ${selectedStatus ? "has-value" : ""} 
              ${isSelectStatus ? "is-focused" : ""}`}
            >
              <Select
                id="status"
                isClearable
                value={selectedStatus}
                onChange={handleChangeStatus}
                options={filteredOptionStatus}
                placeholder=""
                classNamePrefix="react-select"
                onFocus={() => setIsSelectStatus(true)}
                onBlur={() => setIsSelectStatus(false)}
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
                required title="Please Enter the Company Contribution"
                autoComplete="off"
                value={remarks}
                onChange={(e) => setRemarks((e.target.value))}
              />
              <label for="sname" className="exp-form-labels">Remarks</label>
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
            onFirstDataRendered={onFirstDataRendered}
            rowSelection="multiple"
            pagination={true}
            paginationAutoPageSize={true}
          />
        </div>
      </div>
    </div>
  );
}

export default CandidateInterviewReport;
