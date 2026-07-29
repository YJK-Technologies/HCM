import React, { useState, useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "./App.css";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showConfirmationToast } from "./ToastConfirmation";
import LoadingScreen from "./Loading";
import TabButtons from "./ESSComponents/Tabs";
import Select from "react-select";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx-js-style";

const config = require("./Apiconfig");

function ShiftSumRep() {
  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const navigate = useNavigate();
  const [editedData, setEditedData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const gridApiRef = useRef(null);

  const [employeeIdDrop, setEmployeeIdDrop] = useState([]);

  const [employeeIdSc, setEmployeeIdSc] = useState("");
  const [selectedEmployeeIdSc, setSelectedEmployeeIdSc] = useState("");
  const [employeeIdDropSc, setEmployeeIdDropSc] = useState([]);
  const [statusSc, setStatusSc] = useState("");
  const [selectedStatusSc, setSelectedStatusSc] = useState("");
  const [statusDropSc, setStatusDropSc] = useState([]);

  const [employeeIdDropGrid, setEmployeeIdDropGrid] = useState([]);
  const [shiftPatternIdDropGrid, setShiftPatternIdDropGrid] = useState([]);

  const [isSelectedEmployeeIdSc, setIsSelectEmployeeIdSc] = useState(false);

  const [createdBy, setCreatedBy] = useState("");
  const [modifiedBy, setModifiedBy] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [modifiedDate, setModifiedDate] = useState("");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [Shift_NameSC, setShift_NameSC] = useState("");
  const [From_Date, setFrom_Date] = useState("");
  const [To_Date, setTo_Date] = useState("");

  //code added by Harish purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem("permissions")) || {};
  const shiftSumRepPermission = permissions
    .filter((permission) => permission.screen_type === "ShiftSumRep")
    .map((permission) => permission.permission_type.toLowerCase());

  const Location_Code = sessionStorage.getItem('selectedLocationCode')

  const searchClearInputFields = () => {
    setSelectedEmployeeIdSc("");
    setEmployeeIdSc("");
    setFrom_Date("");
    setTo_Date("");
    setSelectedStatusSc("");
    setStatusSc("");
  };

  const handleChangeEmployeeIdSc = (selectedEmployeeIdSc) => {
    setSelectedEmployeeIdSc(selectedEmployeeIdSc);
    setEmployeeIdSc(selectedEmployeeIdSc ? selectedEmployeeIdSc.value : "");
  };

  const filteredOptionEmployeeIdSc = employeeIdDropSc.map((option) => ({
    value: option.EmployeeId,
    label: `${option.EmployeeId}-${option.First_Name}`,
  }));

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");
    fetch(`${config.apiBaseUrl}/getEmployeeId`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code, Location_Code }),
    })
      .then((response) => response.json())
      .then((data) => {
        const employeeIdOption = data.map((option) => ({
          value: option.EmployeeId,
          label: `${option.EmployeeId} - ${option.First_Name}`,
        }));
        setEmployeeIdDropGrid(employeeIdOption);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    fetch(`${config.apiBaseUrl}/getEmployeeId`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code, Location_Code }),
    })
      .then((data) => data.json())
      .then((val) => setEmployeeIdDrop(val))
      .catch((error) => console.error("Error fetching data:", error));
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
      .then((val) => setStatusDropSc(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    fetch(`${config.apiBaseUrl}/getEmployeeId`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code, Location_Code }),
    })
      .then((data) => data.json())
      .then((val) => setEmployeeIdDropSc(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleSearch = async () => {
    setLoading(true);

    try {
      const Company_Code = sessionStorage.getItem("selectedCompanyCode");

      const response = await fetch(
        `${config.apiBaseUrl}/shift_summary_report`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            From_Date: From_Date,
            To_Date: To_Date,
            Employee_ID: employeeIdSc,
            Shift_Name: Shift_NameSC,
            Company_Code,
          }),
        },
      );

      if (response.ok) {
        const searchData = await response.json();
        setRowData(searchData);
        console.log("Shift summary data fetched successfully");
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

  const reloadGridData = () => {
    setRowData([]);
    searchClearInputFields();
  };

  const columnDefs = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      headerName: "S.No",
      field: "SNo",
      valueGetter: (params) => params.node.rowIndex + 1,
      width: 100,
    },
    {
      headerName: "Employee ID",
      field: "Employee_ID",
      // filter: true,
      sortable: true,
    },
    {
      headerName: "Department",
      field: "dept_id",
    },
    {
      headerName: "Designation",
      field: "desgination_id",
    },
    {
      headerName: "Shift Date",
      field: "Shift_Date",
    },
    {
      headerName: "Shift Name",
      field: "Shift_Name",
    },
    {
      headerName: "Shift Start",
      field: "Shift_Start_Time",
    },
    {
      headerName: "Shift End",
      field: "Shift_End_Time",
    },
    {
      headerName: "First Checkin",
      field: "First_Checkin",
    },
    {
      headerName: "Last Checkout",
      field: "Last_Checkout",
    },
    {
      headerName: "Early Checkin",
      field: "Early_Checkin",
    },
    {
      headerName: "Late Checkin",
      field: "Late_Checkin",
    },
    {
      headerName: "Early Checkout",
      field: "Early_CheckOut",
    },
    {
      headerName: "Late Checkout",
      field: "Late_CheckOut",
    },
    {
      headerName: "Worked Hours",
      field: "Worked_Hours",
    },
    {
      headerName: "Attendance Status",
      field: "Attendance_Status",
      //   cellStyle: (params) => {
      //     if (params.value === "ABSENT") {
      //       return { color: "red", fontWeight: "bold" };
      //     }
      //     if (params.value === "PRESENT") {
      //       return { color: "green", fontWeight: "bold" };
      //     }
      //     if (params.value === "WEEK OFF") {
      //       return { color: "orange", fontWeight: "bold" };
      //     }
      //     return null;
      //   },
    },
  ];
  const defaultColDef = {
    resizable: true,
    // wrapText: true,
    editable: true,
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    gridApiRef.current = params.api;
  };

  const onFirstDataRendered = (params) => {
  const allColumnIds = params.columnApi
    .getColumns()
    .map((col) => col.getId());

  params.columnApi.autoSizeColumns(allColumnIds);
};

  const onSelectionChanged = () => {
    const selectedNodes = gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    setSelectedRows(selectedData);
  };

  const onCellValueChanged = (params) => {
    const updatedRowData = [...rowData];
    const rowIndex = updatedRowData.findIndex(
      (row) => row.keyfield === params.data.keyfield,
    );

    if (rowIndex !== -1) {
      updatedRowData[rowIndex][params.colDef.field] = params.newValue;
      setRowData(updatedRowData);

      setEditedData((prevData) => {
        const existingIndex = prevData.findIndex(
          (item) => item.keyfield === params.data.keyfield,
        );

        if (existingIndex !== -1) {
          const updatedEdited = [...prevData];
          updatedEdited[existingIndex] = updatedRowData[rowIndex];
          return updatedEdited;
        } else {
          // Add new edited row
          return [...prevData, updatedRowData[rowIndex]];
        }
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return ""; // Return 'N/A' if the date is missing
    const date = new Date(dateString);

    // Format as DD/MM/YYYY
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const handleRowClick = (rowData) => {
    setCreatedBy(rowData.created_by);
    setModifiedBy(rowData.modified_by);
    const formattedCreatedDate = formatDate(rowData.created_date);
    const formattedModifiedDate = formatDate(rowData.modified_date);
    setCreatedDate(formattedCreatedDate);
    setModifiedDate(formattedModifiedDate);
  };

  // Handler for when a row is selected
  const onRowSelected = (event) => {
    if (event.node.isSelected()) {
      handleRowClick(event.data);
    }
  };

  const getCSSVariable = (variableName) => {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(variableName)
      .trim();
  };

  const transformRowData = (data) => {
    return data.map((row, index) => {

      return {
        "S.No": index + 1,
        "Employee ID": row.Employee_ID || "",
        "Department": row.dept_id || "",
        "Designation": row.desgination_id || "",
        "Shift Date": row.Shift_Date || "",
        "Shift Name": row.Shift_Name || "",
        "Shift Start": row.Shift_Start_Time || "",
        "Shift End": row.Shift_End_Time || "",
        "First Checkin": row.First_Checkin || "",
        "Last Checkout": row.Last_Checkout || "",
        "Early Checkin": row.Early_Checkin || "",
        "Late Checkin": row.Late_Checkin || "",
        "Early Checkout": row.Early_CheckOut || "",
        "Late Checkout": row.Late_CheckOut || "",
        "Worked Hours": row.Worked_Hours || "",
        "Attendance Status": row.Attendance_Status || "",
      };
    });
  };

  const handleExportToExcel = () => {
    if (!gridApiRef.current) return;

    const selectedRows = gridApiRef.current.getSelectedRows();

    const dataSource = selectedRows.length > 0 ? selectedRows : rowData;

    if (!dataSource || dataSource.length === 0) {
      toast.warning("No data to export");
      return;
    }

    const screenName = "Shift Summary Report";
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
      {
        s: { r: 0, c: 0 },
        e: { r: 0, c: Object.keys(transformedData[0]).length - 1 },
      },
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
        const cell = worksheet[XLSX.utils.encode_cell({ r: R, c: C })];

        if (!cell) continue;

        cell.s = {
          font: { color: { rgb: fontColor } },
          fill: R % 2 === 0 ? { fgColor: { rgb: altRowBg } } : undefined,
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Shift Summary Report");

    XLSX.writeFile(workbook, "Shift_Summary_Report.xlsx");
  };

  const generateReport = () => {
    const selectedRows = gridApi.getSelectedRows();
    if (selectedRows.length === 0) {
      toast.warning("Please select at least one row to generate a report");
      return;
    }

    const reportData = selectedRows.map((row, index) => {
      const formatValue = (val) => (val !== undefined && val !== null ? val : '');

      return {
        "S.No": index + 1,
        "Employee ID": formatValue(row.Employee_ID),
        "Department": formatValue(row.dept_id),
        "Designation": formatValue(row.desgination_id),
        "Shift Date": formatValue(row.Shift_Date),
        "Shift Name": formatValue(row.Shift_Name),
        "Shift Start": formatValue(row.Shift_Start_Time),
        "Shift End": formatValue(row.Shift_End_Time),
        "First Checkin": formatValue(row.First_Checkin),
        "Last Checkout": formatValue(row.Last_Checkout),
        "Early Checkin": formatValue(row.Early_Checkin),
        "Late Checkin": formatValue(row.Late_Checkin),
        "Early Checkout": formatValue(row.Early_CheckOut),
        "Late Checkout": formatValue(row.Late_CheckOut),
        "Worked Hours": formatValue(row.Worked_Hours),
        "Attendance Status": formatValue(row.Attendance_Status),
      };
    });

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
    reportWindow.document.write(`<html><head><title>Shift Summary Report</title>`);
    reportWindow.document.write("<style>");
    reportWindow.document.write(`
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
            }
    
            th {
              background-color: ${tableHeaderBg};
              color: white;
              padding: 10px;
              text-align: left;
            }
    
            td {
              padding: 8px;
              text-align: left;
              border-bottom: 1px solid #ddd;
            }
    
            tr:nth-child(even) {
              text-align: left;
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
            body {
              background: white;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
              
            th {
              background-color: ${tableHeaderBg} !important;
              color: white !important;
            }
              
            tr:nth-child(even) {
              background-color: ${rowAltColor} !important;
            }
              
            .header {
              background: ${tableHeaderBg} !important;
              color: white !important;
            }
              
            .print-btn {
              display: none;
            }
          }
      `);

    reportWindow.document.write("</style></head><body>");
    reportWindow.document.write(`<div class="header">
      <img src="${logoUrl}" class="logo" />
      <div class="title-section">
        <h2>Shift Summary Report</h2>
      </div>
      </div>`);
    reportWindow.document.write(`<div style="margin-top:10px;">
      <strong>Total Records: ${selectedRows.length}</strong>
      <span style="float:right;">
        Printed Date: ${new Date().toLocaleDateString()}
      </span>
    </div>`);
    // reportWindow.document.write("<h1><u>Company Information</u></h1>");

    // Create table with headers
    reportWindow.document.write("<table><thead><tr>");
    Object.keys(reportData[0]).forEach((key) => {
      reportWindow.document.write(`<th>${key}</th>`);
    });
    reportWindow.document.write("</tr></thead><tbody>");

    // Populate the rows with safe empty strings
    reportData.forEach((row) => {
      reportWindow.document.write("<tr>");
      Object.values(row).forEach((value) => {
        reportWindow.document.write(`<td>${value || ''}</td>`);
      });
      reportWindow.document.write("</tr>");
    });

    reportWindow.document.write("</tbody></table>");
    reportWindow.document.write(`
    <div style="text-align:center;">
      <button class="print-btn" onclick="window.print()">Print</button>
    </div>
  `);
    reportWindow.document.write("</body></html>");
    reportWindow.document.close();
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
      doc.text("Shift Summary Report", pageWidth / 2, 35, { align: "center" });

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

      const body = dataSource.map((row, index) =>
        columnDefs
          .filter(col => col.field)
          .map(col => {
            if (col.field === "SNo") {
              return index + 1;
            }
            return row[col.field] ?? "";
          })
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

      doc.save("Shift_Summary_Report.pdf");
    });
  };

  return (
    <div className="container-fluid Topnav-screen">
      <div align="">
        {loading && <LoadingScreen />}
        <ToastContainer position="top-right" className="toast-design" theme="colored" />
        <div className="shadow-lg p-1 bg-light rounded main-header-box">
          <div className="header-flex">
            <h1 className="page-title">Shift Summary Report</h1>
            <div className="action-wrapper desktop-actions">
              {["all permission", "view"].some((p) => shiftSumRepPermission.includes(p)) && (
                <div className="action-icon print" onClick={generateReport}>
                  <span className="tooltip">Print</span>
                  <i className="fa-solid fa-print"></i>
                </div>
              )}
              {["all permission", "PDF"].some((p) => shiftSumRepPermission.includes(p)) && (
                <div className="action-icon print" onClick={exportToPDF}>
                  <span className="tooltip">Pdf</span>
                  <i className="fa-solid fa-file-pdf"></i>
                </div>
              )}
              {["all permission", "Excel"].some((p) => shiftSumRepPermission.includes(p)) && (
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
                {["all permission", "view"].some((p) => shiftSumRepPermission.includes(p)) && (
                  <li>
                    <button className="dropdown-item" onClick={generateReport}>
                      <i className="fa-solid fa-print text-dark fs-4"></i>
                    </button>
                  </li>
                )}
                {["all permission", "Pdf"].some((p) => shiftSumRepPermission.includes(p)) && (
                  <li>
                    <button className="dropdown-item" onClick={exportToPDF}>
                      <i className="fa-solid fa-file-pdf text-dark fs-4"></i>
                    </button>
                  </li>
                )}
                {["all permission", "Excel"].some((p) => shiftSumRepPermission.includes(p)) && (
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
              <div
                className={`inputGroup selectGroup 
                ${selectedEmployeeIdSc ? "has-value" : ""} 
                ${isSelectedEmployeeIdSc ? "is-focused" : ""}`}
              >
                <Select
                  id="status"
                  isClearable
                  value={selectedEmployeeIdSc}
                  onChange={handleChangeEmployeeIdSc}
                  options={filteredOptionEmployeeIdSc}
                  classNamePrefix="react-select"
                  placeholder=" "
                  onFocus={() => setIsSelectEmployeeIdSc(true)}
                  onBlur={() => setIsSelectEmployeeIdSc(false)}
                />
                <label className={`floating-label`}>Employee ID</label>
              </div>
            </div>

            <div className="col-md-2">
              <div className="inputGroup">
                <input
                  id="UTC_Offset"
                  class="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  autoComplete="off"
                  required
                  value={Shift_NameSC}
                  onChange={(e) => setShift_NameSC(e.target.value)}
                />
                <label htmlFor="fdate" className={`exp-form-labels`}>
                  Shift Name
                </label>
              </div>
            </div>

            <div className="col-md-2">
              <div className="inputGroup">
                <input
                  id="TimeZone_ID"
                  class="exp-input-field form-control"
                  type="date"
                  placeholder=" "
                  autoComplete="off"
                  required
                  value={From_Date}
                  onChange={(e) => setFrom_Date(e.target.value)}
                />
                <label for="state" className={`exp-form-labels`}>
                  From Date
                </label>
              </div>
            </div>

            <div className="col-md-2">
              <div className="inputGroup">
                <input
                  id="TimeZone_ID"
                  class="exp-input-field form-control"
                  type="date"
                  placeholder=" "
                  autoComplete="off"
                  required
                  value={To_Date}
                  onChange={(e) => setTo_Date(e.target.value)}
                />
                <label for="state" className={`exp-form-labels`}>
                  To Date
                </label>
              </div>
            </div>

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
          <div class="ag-theme-alpine" style={{ height: 450, width: "100%" }}>
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              onGridReady={onGridReady}
              onFirstDataRendered={onFirstDataRendered}            
              onCellValueChanged={onCellValueChanged}
              rowSelection="multiple"
              onSelectionChanged={onSelectionChanged}
              pagination={true}
              paginationAutoPageSize={true}
              onRowSelected={onRowSelected}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShiftSumRep;
