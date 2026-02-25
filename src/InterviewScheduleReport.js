import { useState, useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import "./App.css";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingScreen from "./Loading";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx-js-style";

const config = require("./Apiconfig");

function InterviewScheduleReport() {
  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [statusdrop, setStatusdrop] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState("");
  const [isSelectedScheduleId, setIsSelectedScheduleId] = useState("");
  const [scheduleidDrop, setscheduleidDrop] = useState([]);
  const [scheduleId, setScheduleId] = useState("");
  const [selectedCandidateName, setSelectedCandidateName] = useState("");
  const [isSelectedCandidateName, setIsSelectedCandidateName] = useState("");
  const [canditateName, setCandidateName] = useState("");
  const [canditatenameDrop, setcanditatenameDrop] = useState([]);
  const [email, setEmail] = useState("");
  const [panelName, setPanelName] = useState("");
  const [selectedInterviewMode, setselectedInterviewMode] = useState("");
  const [isSelectInterviewMode, setisSelectInterviewMode] = useState(false);
  const [InterviewModedrop, setInterviewModeDrop] = useState([]);
  const [InterviewMode, setInterviewMode] = useState("");
  const [location, setLocation] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [isSelectFocused, setIsSelectFocused] = useState(false);
  const [status, setStatus] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const gridApiRef = useRef(null);

  //code added by Pavun purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem("permissions")) || {};
  const companyPermissions = permissions
    .filter((permission) => permission.screen_type === "InterviewScheduleRep")
    .map((permission) => permission.permission_type.toLowerCase());

  const handleScheduleId = (selectedDPT) => {
    setSelectedScheduleId(selectedDPT);
    setScheduleId(selectedDPT ? selectedDPT.value : "");
  };

  const handlesCandidateName = (selectedDPT) => {
    setSelectedCandidateName(selectedDPT);
    setCandidateName(selectedDPT ? selectedDPT.value : "");
  };

  const handleInterviewMode = (selectedDPT) => {
    setselectedInterviewMode(selectedDPT);
    setInterviewMode(selectedDPT ? selectedDPT.value : "");
  };

  const handleChangeStatus = (selectedStatus) => {
    setSelectedStatus(selectedStatus);
    setStatus(selectedStatus ? selectedStatus.value : "");
  };

  const filteredOptionScheduleId = scheduleidDrop.map((option) => ({
    value: option.schedule_id,
    label: option.schedule_id,
  }));

  const filteredOptionCandidateName = canditatenameDrop.map((option) => ({
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

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    fetch(`${config.apiBaseUrl}/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setStatusdrop(val))
      .catch((error) => console.error('Error fetching data:', error));
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

  const onSelectionChanged = () => {
    const selectedNodes = gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    setSelectedRows(selectedData);
  };

  const handleSearch = async () => {
    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      toast.warning("From Date cannot be greater than To Date");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/InterviewScheduleSearch`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            schedule_id: scheduleId,
            candidate_name: canditateName,
            email: email,
            panel_name: panelName,
            from_date: fromDate,
            to_date: toDate,
            Interview_Mode: InterviewMode,
            Status: status,
            location: location,
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
      headerName: "Schedule ID",
      field: "schedule_id",
      editable: false,
    },
    {
      headerName: "Interview Mode",
      field: "Interview_Mode",
      editable: false,
    },
    {
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
      headerName: "Email",
      field: "email",
      editable: false,
    },
    {
      headerName: "Location",
      field: "location",
      editable: false,
    },
    {
      headerName: "Panel Name",
      field: "panel_name",
      editable: false,
    },
    {
      headerName: "Status",
      field: "Status",
      editable: false,
    },
  ];

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

    const logoUrl = "/favicon.ico"; //

    const reportWindow = window.open("", "_blank");

    reportWindow.document.write(`
    <html>
    <head>
      <title>Interview Schedule Report</title>
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
          <h2>Interview Schedule Report</h2>
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
            <th>Candidate Name</th>
            <th>Interview Mode</th>
            <th>Status</th>
            <th>Schedule Date</th>
            <th>Email</th>
            <th>Location</th>
            <th>Panel Name</th>
          </tr>
        </thead>
        <tbody>
  `);

    selectedRows.forEach((row) => {
      reportWindow.document.write(`
      <tr>
        <td>${row.schedule_id || ""}</td>
        <td>${row.candidate_name || ""}</td>
        <td>${row.Interview_Mode || ""}</td>
        <td>${row.Status || ""}</td>
        <td>${row.scheduled_datetime ? formatDate(row.scheduled_datetime) : ""}</td>
        <td>${row.email || ""}</td>
        <td>${row.location || ""}</td>
        <td>${row.panel_name || ""}</td>
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

  // const exportToPDF = () => {
  //   if (!gridApi) return;

  //   const selectedRows = gridApi.getSelectedRows();

  //   if (selectedRows.length === 0) {
  //     toast.warning("Please select at least one row to export");
  //     return;
  //   }

  //   const doc = new jsPDF();

  //   doc.setFontSize(14);
  //   doc.text("Interview Schedule Report", 14, 15);

  //   const tableColumn = [
  //     "Schedule ID",
  //     "Candidate Name",
  //     "Interview Mode",
  //     "Status",
  //     "Schedule Date",
  //     "Email",
  //     "Location",
  //     "Panel Name",
  //   ];

  //   const tableRows = [];

  //   selectedRows.forEach((row) => {
  //     const rowData = [
  //       row.schedule_id || "",
  //       row.candidate_name || "",
  //       row.Interview_Mode || "",
  //       row.Status || "",
  //       row.scheduled_datetime ? formatDate(row.scheduled_datetime) : "",
  //       row.email || "",
  //       row.location || "",
  //       row.panel_name || "",
  //     ];

  //     tableRows.push(rowData);
  //   });

  //   autoTable(doc, {
  //     head: [tableColumn],
  //     body: tableRows,
  //     startY: 20,
  //   });

  //   doc.save("Interview_Schedule_Report.pdf");
  // };

  // Get CSS variable value from current theme
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

    /* ================= READ THEME COLORS ================= */

    const headerBgColor = hexToRgb(getCSSVariable("--but"));
    const tableHeaderColor = hexToRgb(getCSSVariable("--ag-header"));
    const fontColor = hexToRgb(getCSSVariable("--font-color"));
    const rowAltColor = hexToRgb(getCSSVariable("--ag-row"));

    /* ================= TABLE DATA ================= */

    const headers = [[
      "Schedule ID",
      "Interview Mode",
      "Candidate Name",
      "Schedule Date",
      "Email",
      "Location",
      "Panel Name",
      "Status",
    ]];

    const body = dataSource.map((row) => [
      row.schedule_id,
      row.Interview_Mode,
      row.candidate_name,
      row.scheduled_datetime,
      row.email,
      row.location,
      row.panel_name,
      row.Status,
    ]);

    const doc = new jsPDF("l", "pt", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();

    /* ================= PDF HEADER ================= */

    doc.setFillColor(...headerBgColor);
    doc.roundedRect(20, 15, pageWidth - 40, 55, 8, 8, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.text("Interview Schedule Report", pageWidth / 2, 40, {
      align: "center",
    });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(
      `Generated on: ${new Date().toLocaleDateString()} | Total Records: ${dataSource.length}`,
      pageWidth / 2,
      60,
      { align: "center" }
    );

    /* ================= PDF TABLE ================= */

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
        7: { halign: "center", fontStyle: "bold" },
      },

      margin: { left: 20, right: 20 },
    });

    doc.save("Interview_Schedule_Report.pdf");
  };

  const transformRowData = (data) => {
    return data.map((row) => ({
      "Schedule ID": row.schedule_id || "",
      "Candidate Name": row.candidate_name || "",
      "Interview Mode": row.Interview_Mode || "",
      Status: row.Status || "",
      "Schedule Date": row.scheduled_datetime || "",
      Email: row.email || "",
      Location: row.location || "",
      "Panel Name": row.panel_name || "",
    }));
  };

  // const handleExportToExcel = () => {
  //   if (!rowData || rowData.length === 0) {
  //     toast.warning("There is no data to export.");
  //     return;
  //   }

  //   const screenName = "Interview Schedule Report";
  //   const company = sessionStorage.getItem('selectedCompanyName');
  //   // const startDate = DateRange_Start;
  //   // const endDate = DateRange_End;

  //   /* ================= HEADER SECTION ================= */

  //   const headerData = [
  //     [screenName],
  //     company ? [`Company Name: ${company}`] : [],
  //   ];

  //   // 👉 Add Date Range ONLY if both dates exist
  //   // if (startDate && endDate) {
  //   //   headerData.push([
  //   //     `Date Range: ${formatDate(startDate)} to ${formatDate(endDate)}`,
  //   //   ]);
  //   // }

  //   headerData.push([]);

  //   const transformedData = transformRowData(rowData);

  //   const worksheet = XLSX.utils.aoa_to_sheet(headerData);
  //   XLSX.utils.sheet_add_json(worksheet, transformedData, {
  //     origin: `A${headerData.length + 1}`,
  //   });

  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(
  //     workbook,
  //     worksheet,
  //     "Interview Schedule"
  //   );

  //   XLSX.writeFile(workbook, "Interview_Schedule_Report.xlsx");
  // };

  const handleExportToExcel = () => {
    if (!rowData || rowData.length === 0) {
      toast.warning("There is no data to export.");
      return;
    }

    /* ================= READ THEME COLORS ================= */

    const headerBg = getCSSVariable("--but").replace("#", "");
    const tableHeaderBg = getCSSVariable("--ag-header").replace("#", "");
    const fontColor = getCSSVariable("--font-color").replace("#", "");
    const altRowBg = getCSSVariable("--ag-row").replace("#", "");

    /* ================= HEADER ================= */

    const title = "Interview Schedule Report";
    const company = sessionStorage.getItem("selectedCompanyName") || "";

    const headerData = [
      [title],
      company ? [`Company Name: ${company}`] : [],
      [],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(headerData);

    /* ================= TABLE DATA ================= */

    const tableData = rowData.map((row) => ({
      "Schedule ID": row.schedule_id || "",
      "Interview Mode": row.Interview_Mode || "",
      "Candidate Name": row.candidate_name || "",
      "Schedule Date": row.scheduled_datetime || "",
      Email: row.email || "",
      Location: row.location || "",
      "Panel Name": row.panel_name || "",
      Status: row.Status || "",
    }));

    XLSX.utils.sheet_add_json(worksheet, tableData, {
      origin: `A${headerData.length + 1}`,
    });

    const range = XLSX.utils.decode_range(worksheet["!ref"]);

    /* ================= TITLE STYLE ================= */

    worksheet["A1"].s = {
      font: { bold: true, sz: 16, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: headerBg } },
      alignment: { horizontal: "center", vertical: "center" },
    };

    worksheet["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } },
    ];

    /* ================= TABLE HEADER STYLE ================= */

    const headerRowIndex = headerData.length;

    for (let C = 0; C <= 7; C++) {
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
      for (let C = 0; C <= 7; C++) {
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

    worksheet["!cols"] = [
      { wch: 15 },
      { wch: 18 },
      { wch: 22 },
      { wch: 20 },
      { wch: 25 },
      { wch: 18 },
      { wch: 20 },
      { wch: 15 },
    ];

    /* ================= EXPORT ================= */

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Interview Schedule");

    XLSX.writeFile(workbook, "Interview_Schedule_Report.xlsx");
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
          <h1 className="page-title">Interview Schedule Report</h1>

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
                autoComplete="off"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
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
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
              <label for="sname" className="exp-form-labels">
                Schedule To
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
                onChange={handlesCandidateName}
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
                required
                title="Please Enter the Eligibility Salary Days"
                autoComplete="off"
                value={email}
                maxLength={30}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <label for="sname" className="exp-form-labels">
                Email
              </label>
            </div>
          </div>

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
                value={panelName}
                onChange={(e) => setPanelName(e.target.value)}
              />
              <label For="city" className="exp-form-labels">
                Panel Name
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedInterviewMode ? "has-value" : ""} 
              ${isSelectInterviewMode ? "is-focused" : ""}`}
            >
              <Select
                id="department"
                placeholder=" "
                onFocus={() => setisSelectInterviewMode(true)}
                onBlur={() => setisSelectInterviewMode(false)}
                classNamePrefix="react-select"
                isClearable
                type="text"
                value={selectedInterviewMode}
                onChange={handleInterviewMode}
                options={filteredOptionInterviewMode}
              />
              <label htmlFor="selecteddpt" className={`floating-label`}>
                Interview Mode
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
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <label for="sname" className="exp-form-labels">
                Location
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedStatus ? "has-value" : ""} 
              ${isSelectFocused ? "is-focused" : ""}`}
            >
              <Select
                id="status"
                isClearable
                value={selectedStatus}
                onChange={handleChangeStatus}
                options={filteredOptionStatus}
                placeholder=""
                classNamePrefix="react-select"
                onFocus={() => setIsSelectFocused(true)}
                onBlur={() => setIsSelectFocused(false)}
              />
              <label for="status" class="floating-label">
                Status
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
            onSelectionChanged={onSelectionChanged}
          />
        </div>
      </div>
    </div>
  );
}

export default InterviewScheduleReport;