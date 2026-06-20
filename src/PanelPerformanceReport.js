import { useState, useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "./App.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingScreen from "./Loading";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx-js-style";

const config = require("./Apiconfig");

function PanelPerformanceReport() {
  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [ratingSC, setratingSC] = useState("");
  const [panel_nameSC, setpanel_nameSC] = useState("");
  const [selectedscheduleidSC, setselectedscheduleidSC] = useState("");
  const [scheduleidSC, setscheduleidSC] = useState("");
  const [isselectedscheduleidSC, setIsscheduleidSC] = useState("");
  const [scheduleidDrop, setscheduleidDrop] = useState([]);
  const [totalInterviewsSC, settotalInterviewsSC] = useState("");
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const gridApiRef = useRef(null);

  //purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem("permissions")) || {};
  const panelPerformanceRepoPermissions = permissions
    .filter((permission) => permission.screen_type === "PanelPerformanceRepo")
    .map((permission) => permission.permission_type.toLowerCase());

  const handleschedule_idSC = (selectedDPT) => {
    setselectedscheduleidSC(selectedDPT);
    setscheduleidSC(selectedDPT ? selectedDPT.value : "");
  };

  const filteredOptionschedule_id = scheduleidDrop.map((option) => ({
    value: option.schedule_id,
    label: option.schedule_id,
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

  const handleSearch = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/PanelPerformanceSearch`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            schedule_id: totalInterviewsSC,
            panel_name: panel_nameSC,
            rating: Number(ratingSC),
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
      headerName: "Panel Name",
      field: "panel_name",
      editable: false,
      minWidth: 350,   // 👈 increase this value
      // flex: 2          // 👈 gives more space compared to other columns
    },
    {
      headerName: "Average Rating",
      field: "avg_rating",
      editable: false,
    },
    {
      headerName: "Total Interviews",
      field: "total_interviews",
      editable: false,
    },
    {
      headerName: "Submitted On",
      field: "submitted_on",
      editable: false,
    },
  ];

  const gridOptions = {
    pagination: true,
    paginationPageSize: 10,
  };

  const defaultColDef = {
    resizable: true,
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

    const link = reportWindow.document.createElement("link");
    link.rel = "icon";
    link.type = "image/x-icon";
    link.href = logoUrl;

    // 🔥 append to HEAD
    reportWindow.document.head.appendChild(link);

    reportWindow.document.write(`
    <html>
    <head>
      <title>Panel Performance Report</title>
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
          <h2>Panel Performance Report</h2>
        </div>
      </div>

      <div class="sub-info">
        <div>Total Records: ${selectedRows.length}</div>
        <div>Printed Date: ${new Date().toLocaleDateString()}</div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Panel Name</th>
            <th>Average Rating</th>
            <th>Total Interviews</th>
          </tr>
        </thead>
        <tbody>
  `);

    selectedRows.forEach((row) => {
      reportWindow.document.write(`
      <tr>
        <td>${row.panel_name || ""}</td>
        <td>${row.avg_rating || ""}</td>
        <td>${row.total_interviews || ""}</td>
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
      doc.text("Panel Performance Report", pageWidth / 2, 35, { align: "center" });

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

      doc.save("Panel_Performance_Report.pdf");
    });
  };

  const transformRowData = (data) => {
    return data.map((row) => ({
      "Panel Name": row.panel_name || "",
      "Average Rating": row.avg_rating || "",
      "Total Interviews": row.total_interviews || "",
      "Submitted On": row.submitted_on || "",
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

    const screenName = "Panel Performance Report";
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Panel Performance Report");

    XLSX.writeFile(workbook, "Panel_Performance_Report.xlsx");
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
          <h1 className="page-title">Panel Performance Report</h1>

          <div className="action-wrapper desktop-actions">
            {["all permission", "view"].some((p) => panelPerformanceRepoPermissions.includes(p)) && (
              <div className="action-icon print" onClick={generateReport}>
                <span className="tooltip">Print</span>
                <i className="fa-solid fa-print"></i>
              </div>
            )}
            {["all permission", "PDF"].some((p) => panelPerformanceRepoPermissions.includes(p)) && (
              <div className="action-icon print" onClick={exportToPDF}>
                <span className="tooltip">Pdf</span>
                <i className="fa-solid fa-file-pdf"></i>
              </div>
            )}
            {["all permission", "Excel"].some((p) => panelPerformanceRepoPermissions.includes(p)) && (
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
              {["all permission", "view"].some((p) => panelPerformanceRepoPermissions.includes(p)) && (
                <li>
                  <button className="dropdown-item" onClick={generateReport}>
                    <i className="fa-solid fa-print text-dark fs-4"></i>
                  </button>
                </li>
              )}
              {["all permission", "Pdf"].some((p) => panelPerformanceRepoPermissions.includes(p)) && (
                <li>
                  <button className="dropdown-item" onClick={exportToPDF}>
                    <i className="fa-solid fa-file-pdf text-dark fs-4"></i>
                  </button>
                </li>
              )}
              {["all permission", "Excel"].some((p) => panelPerformanceRepoPermissions.includes(p)) && (
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
                id="add3"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required
                title="Please Choose the Start Year"
                autoComplete="off"
                value={panel_nameSC}
                onChange={(e) => setpanel_nameSC(e.target.value)}
              />
              <label For="city" className="exp-form-labels">
                Panel Name
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
                Average Rating
              </label>
            </div>
          </div>

          {/* <div className="col-md-2">
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
          </div> */}

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
                value={totalInterviewsSC}
                onChange={(e) => settotalInterviewsSC(e.target.value)}
              />
              <label for="add1" className={`exp-form-labels`}>
                Total Interviews
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
                value={fromDate}
                onChange={(e) => setFromDate((e.target.value))}
              />
              <label for="add1" className={`exp-form-labels`}>Submitted From</label>
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
                value={toDate}
                onChange={(e) => setToDate((e.target.value))}
              />
              <label for="add1" className={`exp-form-labels`}>Submitted To</label>
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

export default PanelPerformanceReport;
