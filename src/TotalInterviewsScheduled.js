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

function TotalInterviewsScheduled({ }) {
  const [rowData, setRowData] = useState([]);
  const [location, setLocation] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [status, setStatus] = useState("");
  const [isSelectStatus, setIsSelectStatus] = useState(false);
  const [PanelDrop, setPanelDrop] = useState([]);
  const [isSelectPanelId, setisSelectPanelId] = useState(false);
  const [selectedPanelId, setselectedPanelId] = useState("");
  const [panelId, setPanelId] = useState("");
  const [selectedScheduleId, setSelectedScheduleId] = useState("");
  const [scheduleId, setScheduleId] = useState("");
  const [isSelectedScheduleId, setIsSelectedScheduleId] = useState("");
  const [scheduleidDrop, setscheduleidDrop] = useState([]);
  const [isSelectedCanditateId, setIsSelectedCanditateId] = useState("");
  const [canditatenameDrop, setcanditatenameDrop] = useState([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState("");
  const [canditateId, setCandidateId] = useState("");
  const [InterviewModedrop, setInterviewModeDrop] = useState([]);
  const [selectedInterviewMode, setselectedInterviewMode] = useState("");
  const [interviewMode, setInterviewMode] = useState("");
  const [isSelectInterviewMode, setisSelectInterviewMode] = useState(false);
  const [statusgriddrop, setStatusGriddrop] = useState([]);
  const [Paneldrop, setPaneldrop] = useState([]);
  const [candidatedrop, setcandidatedrop] = useState([]);
  const [interviewmodeDrop, setInterviewmodeDrop] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusdrop, setStatusdrop] = useState([]);
  const gridRef = useRef();
  const [gridApi, setGridApi] = useState(null);
  const gridApiRef = useRef(null);

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  //purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem("permissions")) || {};
  const companyPermissions = permissions
    .filter((permission) => permission.screen_type === "TotalInterviewsSched")
    .map((permission) => permission.permission_type.toLowerCase());

  const handleInterviewMode = (selectedDPT) => {
    setselectedInterviewMode(selectedDPT);
    setInterviewMode(selectedDPT ? selectedDPT.value : "");
  };

  const filteredOptionInterviewMode = InterviewModedrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");
    fetch(`${config.apiBaseUrl}/InterviewStatus`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((response) => response.json())
      .then((data) => {
        const statusOption = data.map((option) => option.attributedetails_name);
        setStatusGriddrop(statusOption);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");
    fetch(`${config.apiBaseUrl}/InterviewPanelData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((response) => response.json())
      .then((data) => {
        const statusOption = data.map((option) => ({
          value: option.panel_id,
          label: `${option.panel_id}-${option.panel_name}`,
        }));
        setPaneldrop(statusOption);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");
    fetch(`${config.apiBaseUrl}/CanditateID`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((response) => response.json())
      .then((data) => {
        const statusOption = data.map((option) => ({
          value: option.candidate_id,
          label: `${option.candidate_id}-${option.candidate_name}`,
        }));
        setcandidatedrop(statusOption);
      })
      .catch((error) => console.error("Error fetching data:", error));
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

    fetch(`${config.apiBaseUrl}/InterviewMode`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((response) => response.json())
      .then((data) => {
        const interviewMode = data.map(
          (option) => option.attributedetails_name,
        );
        setInterviewmodeDrop(interviewMode);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleCandidateId = (selectedDPT) => {
    setSelectedCandidateId(selectedDPT);
    setCandidateId(selectedDPT ? selectedDPT.value : "");
  };

  const filteredOptionCandidateId = canditatenameDrop.map((option) => ({
    value: option.candidate_id,
    label: `${option.candidate_id} - ${option.candidate_name}`,
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

  const handleScheduleId = (selectedDPT) => {
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

  const handlePanelId = (selectedDPT) => {
    setselectedPanelId(selectedDPT);
    setPanelId(selectedDPT ? selectedDPT.value : "");
  };

  const handleChangeStatus = (selectedStatus) => {
    setSelectedStatus(selectedStatus);
    setStatus(selectedStatus ? selectedStatus.value : "");
  };

  const filteredOptionPanelId = PanelDrop.map((option) => ({
    value: option.panel_id,
    label: `${option.panel_id} - ${option.panel_name}`,
  }));

  const filteredOptionStatus = statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    const fetchDept = async () => {
      try {
        const response = await fetch(
          `${config.apiBaseUrl}/InterviewPanelData`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ company_code }),
          },
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const val = await response.json();
        setPanelDrop(val);
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
    fetch(`${config.apiBaseUrl}/InterviewStatus`, {
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

  const columnDefs = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      headerName: "Schedule ID",
      field: "schedule_id",
      editable: false,
    },
    {
      headerName: "Candidate ID",
      field: "candidate_id",
      editable: false,
    },
    {
      headerName: "Panel ID",
      field: "panel_id",
      editable: false,
    },
    {
      headerName: "Schedule Date",
      field: "scheduled_datetime",
      editable: false,
    },
    {
      headerName: "Time Zone",
      field: "timezone",
      editable: false,
    },
    {
      headerName: "Location",
      field: "location",
      editable: false,
    },
    {
      headerName: "Interview Mode",
      field: "Interview_Mode",
      editable: false,
    },
    {
      headerName: "Meeting Link",
      field: "meeting_link",
      editable: false,
    },
    {
      headerName: "Status",
      field: "Status",
      editable: false,
    },
  ];

  const gridOptions = {
    pagination: true,
    paginationPageSize: 10,
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const body = {
        candidate_id: Number(canditateId),
        schedule_id: Number(scheduleId),
        panel_id: Number(panelId),
        Interview_Mode: interviewMode,
        Status: status,
        from_date: fromDate,
        to_date: toDate,
        location: location,
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      };

      const response = await fetch(`${config.apiBaseUrl}/TotalInterviewSchedule`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );

      if (response.ok) {
        const fetchedData = await response.json();

        const newRows = fetchedData.map((item) => ({
          schedule_id: item.schedule_id,
          candidate_id: item.candidate_id,
          panel_id: item.panel_id,
          scheduled_datetime: item.scheduled_datetime,
          timezone: item.timezone,
          location: item.location,
          meeting_link: item.meeting_link,
          Status: item.Status,
          Interview_Mode: item.Interview_Mode,
          keyfield: item.keyfield,
        }));

        const totalRow = {
          schedule_id: null,
          candidate_id: "",
          panel_id: "",
          scheduled_datetime: "",
          timezone: "",
          location: "",
          meeting_link: "",
          Status: "",
          Interview_Mode: "",
          keyfield: "",
        };

        setRowData([...newRows, totalRow]);
      } else {
        toast.warning("Data Not found");
        setRowData([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const reloadGridData = () => {
    setRowData([]);
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    gridApiRef.current = params.api;
  };

  const generateReport = () => {
    if (!gridApi) return;

    const selectedRows = gridApi
      .getSelectedRows()
      .filter((row) => row.schedule_id !== null);

    if (selectedRows.length === 0) {
      toast.warning("Please select at least one row to print");
      return;
    }

    const logoUrl = "/favicon.ico";
    const reportWindow = window.open("", "_blank");

    reportWindow.document.write(`
  <html>
      <head>
        <title>Total Candidates Applied</title>
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
      <h2>Total Interviews Scheduled</h2>
    </div>
  </div>

  <div style="margin-top:10px;">
    <strong>Total Records: ${selectedRows.length}</strong>
    <span style="float:right;">
      Printed Date: ${new Date().toLocaleDateString()}
    </span>
  </div>

  <table>
    <thead>
      <tr>
        <th>Schedule ID</th>
        <th>Candidate ID</th>
        <th>Panel ID</th>
        <th>Scheduled Datetime</th>
        <th>Time Zone</th>
        <th>Location</th>
        <th>Mode</th>
        <th>Meeting Link</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
  `);

    selectedRows.forEach((row) => {
      reportWindow.document.write(`
      <tr>
        <td>${row.schedule_id || ""}</td>
        <td>${row.candidate_id || ""}</td>
        <td>${row.panel_id || ""}</td>
        <td>${formatDate(row.scheduled_datetime)}</td>
        <td>${row.timezone || ""}</td>
        <td>${row.location || ""}</td>
        <td>${row.Interview_Mode || ""}</td>
        <td>${row.meeting_link || ""}</td>
        <td>${row.Status || ""}</td>
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
        "Candidate ID",
        "Panel ID",
        "Schedule Date",
        "Time Zone",
        "Location",
        "Interview Mode",
        "Meeting Link",
        "Status",
      ],
    ];

    // ✅ Table body
    const body = dataSource.map((row) => [
      row.schedule_id || "",
      row.candidate_id || "",
      row.panel_id || "",
      row.scheduled_datetime || "",
      row.timezone || "",
      row.location || "",
      row.Interview_Mode || "",
      row.meeting_link || "",
      row.Status || "",
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
    doc.text("Total Interviews Scheduled", pageWidth / 2, 40, {
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

    doc.save("Total_Interviews_Scheduled.pdf");
  };

  const transformRowData = (data) => {
    return data.map((row) => ({
      "Schedule ID": row.schedule_id || "",
      "Candidate ID": row.candidate_id || "",
      "Panel ID": row.panel_id || "",
      "Schedule Date": row.scheduled_datetime
        ? formatDate(row.scheduled_datetime)
        : "",
      "Time Zone": row.timezone || "",
      Location: row.location || "",
      "Interview Mode": row.Interview_Mode || "",
      "Meeting Link": row.meeting_link || "",
      Status: row.Status || "",
    }));
  };

  const handleExportToExcel = () => {
    if (!rowData || rowData.length === 0) {
      toast.warning("There is no data to export.");
      return;
    }

    const screenName = "Total Interviews Scheduled";
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
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Interview Schedule"
    );

    XLSX.writeFile(workbook, "Total_Interviews_Scheduled.xlsx");
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
          <h1 className="page-title">Total Interviews Schedule</h1>
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
                required
                title="Please Enter the Company Contribution"
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
              ${selectedCandidateId ? "has-value" : ""} 
              ${isSelectedCanditateId ? "is-focused" : ""}`}
            >
              <Select
                id="department"
                placeholder=" "
                onFocus={() => setIsSelectedCanditateId(true)}
                onBlur={() => setIsSelectedCanditateId(false)}
                classNamePrefix="react-select"
                isClearable
                type="text"
                value={selectedCandidateId}
                onChange={handleCandidateId}
                options={filteredOptionCandidateId}
              />
              <label htmlFor="selecteddpt" className={`floating-label`}>
                Candiate ID
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedPanelId ? "has-value" : ""} 
              ${isSelectPanelId ? "is-focused" : ""}`}
            >
              <Select
                id="department"
                placeholder=" "
                onFocus={() => setisSelectPanelId(true)}
                onBlur={() => setisSelectPanelId(false)}
                classNamePrefix="react-select"
                isClearable
                type="text"
                value={selectedPanelId}
                onChange={handlePanelId}
                options={filteredOptionPanelId}
              />
              <label htmlFor="selecteddpt" className={`floating-label`}>
                Panel ID
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
        className="shadow-lg pt-3 pb-3 bg-light rounded mt-2 container-form-box"
        style={{ width: "100%" }}
      >
        <div class="ag-theme-alpine" style={{ height: 455, width: "100%" }}>
          <AgGridReact
            columnDefs={columnDefs}
            rowData={rowData}
            pagination={true}
            paginationAutoPageSize={true}
            gridOptions={gridOptions}
            rowSelection="multiple"
            onGridReady={onGridReady}
          />
        </div>
      </div>
    </div>
  );
}
export default TotalInterviewsScheduled;
