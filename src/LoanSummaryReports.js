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

function LoanSummaryReports() {
  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const gridApiRef = useRef(null);

  const [requestNumber, setrequestNumber] = useState("");
  const [FromDate, setFromDate] = useState("");
  const [ToDate, setToDate] = useState("");
  const [EmployeeID, setEmployeeID] = useState("");
  const [First_Name, setFirst_Name] = useState("");
  const [Last_Name, setLast_Name] = useState("");
  const [loan_amount, setloan_amount] = useState("");
  const [repayment_months, setrepayment_months] = useState("");
  const [monthly_installment, setmonthly_installment] = useState("");
  const [selectedLoanTypeNameSc, setSelectedLoanTypeNameSc] = useState("");
  const [loanTypeNameSc, setLoanTypeNameSc] = useState("");
  const [loanTypeNameDropSc, setLoanTypeNameDropSc] = useState([]);
  const [isSelectedLoanTypeNameSc, setIsSelectedLoanTypeNameSc] = useState(false);
  const [selectedReqStatusSc, setSelectedReqStatusSc] = useState("");
  const [isSelectedReqStatusSc, setIsSelectedReqStatusSc] = useState(false);
  const [reqStatusDropSc, setReqStatusDropSc] = useState([]);
  const [reqStatusSc, setReqStatusSc] = useState('');
  const [reqStatusDropGrid, setReqStatusDropGrid] = useState([]);

  //purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem("permissions")) || {};
  const loanSummaryReportsPermissions = permissions
    .filter((permission) => permission.screen_type === "LoanSummaryReports")
    .map((permission) => permission.permission_type.toLowerCase());

  const handleChangeLoanTypeSc = (selectedLoanTypeNameSc) => {
    setSelectedLoanTypeNameSc(selectedLoanTypeNameSc);
    setLoanTypeNameSc(
      selectedLoanTypeNameSc ? selectedLoanTypeNameSc.value : "",
    );
  };

  const filteredOptionLoanTypeSc = Array.isArray(loanTypeNameDropSc)
    ? loanTypeNameDropSc.map((option) => ({
      value: option?.attributedetails_name,
      label: option?.attributedetails_name,
    }))
    : [];

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");
    fetch(`${config.apiBaseUrl}/getLoanTypes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => setLoanTypeNameDropSc(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleChangeReqStatusSc = (selectedReqStatusSc) => {
    setSelectedReqStatusSc(selectedReqStatusSc);
    setReqStatusSc(selectedReqStatusSc ? selectedReqStatusSc.value : "");
  };

  const filteredOptionReqStatusSc = Array.isArray(reqStatusDropSc)
    ? [
      { value: "All", label: "All" },
      ...reqStatusDropSc.map((option) => ({
        value: option?.attributedetails_name,
        label: option?.attributedetails_name,
      })),
    ]
    : [{ value: "All", label: "All" }];

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    fetch(`${config.apiBaseUrl}/getLeaveStatus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setReqStatusDropSc(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    fetch(`${config.apiBaseUrl}/getLeaveStatus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => {
        const reqStatus = val.map(option => option.attributedetails_name);
        setReqStatusDropGrid(reqStatus);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleSearch = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `${config.apiBaseUrl}/GetLoanSummaryReport`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            company_code: sessionStorage.getItem("selectedCompanyCode"),

            // Text filters
            request_number: requestNumber?.trim() || "",
            EmployeeId: EmployeeID?.trim() || "",
            First_Name: First_Name?.trim() || "",
            Last_Name: Last_Name?.trim() || "",
            Loan_Type_Name: loanTypeNameSc?.trim() || "",
            request_status: reqStatusSc || "",

            // Numeric filters
            loan_amount: loan_amount ? Number(loan_amount) : 0,
            repayment_months: repayment_months ? Number(repayment_months) : 0,
            monthly_installment: monthly_installment
              ? Number(monthly_installment)
              : 0,

            // Date filters
            from_date: FromDate || null,
            to_date: ToDate || null,
          }),
        },
      );

      if (response.ok) {
        const searchData = await response.json();
        setRowData(searchData);
        console.log("Loan summary fetched successfully");
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
      headerName: "Request Number",
      field: "request_number",
      editable: false,
    },
    {
      headerName: "Employee ID",
      field: "EmployeeId",
      editable: false,
    },
    {
      headerName: "First Name",
      field: "First_Name",
      editable: false,
    },
    {
      headerName: "Last Name",
      field: "Last_Name",
      editable: false,
    },
    {
      headerName: "Loan Type Name",
      field: "loan_type_name",
      editable: false,
    },
    {
      headerName: "Loan Amount",
      field: "loan_amount",
      editable: false,
    },
    {
      headerName: "Monthly Installment",
      field: "monthly_installment",
      editable: false,
    },
    {
      headerName: "Repayment Months",
      field: "repayment_months",
      editable: false,
    },
    {
      headerName: "Request Status",
      field: "request_status",
      editable: false,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: reqStatusDropGrid,
      },
    },
    {
      headerName: "Created Date",
      field: "created_date",
      editable: false,
    },

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
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    gridApiRef.current = params.api;
  };

  const generateReport = () => {
    const selectedRows = gridApi.getSelectedRows();
    if (selectedRows.length === 0) {
      toast.warning("Please select at least one row to generate a report");
      return;
    }

    const reportData = selectedRows.map((row) => {
      const formatValue = (val) => (val !== undefined && val !== null ? val : '');

      return {
        "Request Number": formatValue(row.request_number),
        "Employee ID": formatValue(row.EmployeeId),
        "First Name": formatValue(row.First_Name),
        "Last Name": formatValue(row.Last_Name),
        "Loan Type Name": formatValue(row.loan_type_name),
        "Loan Amount": formatValue(row.loan_amount),
        "Monthly Installment": formatValue(row.monthly_installment),
        "Repayment Months": formatValue(row.repayment_months),
        "Request Status": formatValue(row.request_status),
        "Created Date": formatValue(row.created_date)
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
    reportWindow.document.write(`<html><head><title>Loan Summary Report</title>`);
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
        <h2>Loan Summary Report</h2>
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
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  };

  const exportToPDF = () => {
    if (!gridApiRef.current || rowData.length === 0) {
      toast.warning("No data to export");
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
      doc.text("Loan Summary Report", pageWidth / 2, 35, { align: "center" });

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

      doc.save("Loan_Summary_Report.pdf");
    });
  };

  const transformRowData = (data) => {
    return data.map((row) => ({
      "Request No": row.request_number || "",
      "Employee ID": row.EmployeeId || "",
      "First Name": row.First_Name || "",
      "Last Name": row.Last_Name || "",
      "Loan Type": row.loan_type_name || "",
      "Loan Amount": row.loan_amount || "",
      "Monthly Installment": row.monthly_installment || "",
      "Repayment Months": row.repayment_months || "",
      "Status": row.request_status || "",
      "Created Date": row.created_date || "",
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

    const screenName = "Loan Summary";
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Loan Summary");

    XLSX.writeFile(workbook, "Loan_Summary_Report.xlsx");
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
          <h1 className="page-title">Loan Summary Report</h1>

          <div className="action-wrapper desktop-actions">
            {["all permission", "view"].some((p) => loanSummaryReportsPermissions.includes(p)) && (
              <div className="action-icon print" onClick={generateReport}>
                <span className="tooltip">Print</span>
                <i className="fa-solid fa-print"></i>
              </div>
            )}
            {["all permission", "PDF"].some((p) => loanSummaryReportsPermissions.includes(p)) && (
              <div className="action-icon print" onClick={exportToPDF}>
                <span className="tooltip">Pdf</span>
                <i className="fa-solid fa-file-pdf"></i>
              </div>
            )}
            {["all permission", "Excel"].some((p) => loanSummaryReportsPermissions.includes(p)) && (
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
              {["all permission", "view"].some((p) => loanSummaryReportsPermissions.includes(p)) && (
                <li>
                  <button className="dropdown-item" onClick={generateReport}>
                    <i className="fa-solid fa-print text-dark fs-4"></i>
                  </button>
                </li>
              )}
              {["all permission", "Pdf"].some((p) => loanSummaryReportsPermissions.includes(p)) && (
                <li>
                  <button className="dropdown-item" onClick={exportToPDF}>
                    <i className="fa-solid fa-file-pdf text-dark fs-4"></i>
                  </button>
                </li>
              )}
              {["all permission", "Excel"].some((p) => loanSummaryReportsPermissions.includes(p)) && (
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
                type="text"
                placeholder=""
                title="Please Enter the Request Number"
                required
                autoComplete="off"
                value={requestNumber}
                onChange={(e) => setrequestNumber(e.target.value)}
              />
              <label for="add1" className={`exp-form-labels`}>
                Request Number
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
                title="Please Enter the Employee ID"
                required
                autoComplete="off"
                value={EmployeeID}
                onChange={(e) => setEmployeeID(e.target.value)}
              />
              <label for="add1" className={`exp-form-labels`}>
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
                title="Please Enter the First Name"
                required
                autoComplete="off"
                value={First_Name}
                onChange={(e) => setFirst_Name(e.target.value)}
              />
              <label for="add1" className={`exp-form-labels`}>
                First Name
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
                title="Please Enter the Last Name"
                required
                autoComplete="off"
                value={Last_Name}
                onChange={(e) => setLast_Name(e.target.value)}
              />
              <label for="add1" className={`exp-form-labels`}>
                Last Name
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
                  ${selectedLoanTypeNameSc ? "has-value" : ""} 
                  ${isSelectedLoanTypeNameSc ? "is-focused" : ""}`}
              title="Please enter the Loan Type Name"
            >
              <Select
                id="country"
                type="text"
                classNamePrefix="react-select"
                placeholder=""
                onFocus={() => setIsSelectedLoanTypeNameSc(true)}
                onBlur={() => setIsSelectedLoanTypeNameSc(false)}
                isClearable
                maxLength={100}
                value={selectedLoanTypeNameSc}
                onChange={handleChangeLoanTypeSc}
                options={filteredOptionLoanTypeSc}
              />
              <label for="sname" className={`floating-label`}>
                Loan Type Name
              </label>
            </div>
          </div>

          {/* <div className="col-md-2">
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
          </div> */}

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="number"
                placeholder=""
                required
                title="Please Enter the Loan Amount"
                autoComplete="off"
                value={loan_amount}
                onChange={(e) => setloan_amount(e.target.value)}
              />
              <label for="sname" className="exp-form-labels">
                Loan Amount
              </label>
            </div>
          </div>
          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="number"
                placeholder=""
                required
                title="Please Enter the Monthly Installment"
                autoComplete="off"
                value={monthly_installment}
                onChange={(e) => setmonthly_installment(e.target.value)}
              />
              <label for="sname" className="exp-form-labels">
                Monthly Installment
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="number"
                placeholder=""
                required
                title="Please Enter the Repayment Months"
                autoComplete="off"
                value={repayment_months}
                onChange={(e) => setrepayment_months(e.target.value)}
              />
              <label for="sname" className="exp-form-labels">
                Repayment Months
              </label>
            </div>
          </div>

          {/* <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedReqStatusSc ? "has-value" : ""} 
              ${isSelectedReqStatusSc ? "is-focused" : ""}`}
              title="Please enter the Request Status"
            >
              <Select
                id="country"
                type="text"
                classNamePrefix="react-select"
                placeholder=""
                onFocus={() => setIsSelectedReqStatusSc(true)}
                onBlur={() => setIsSelectedReqStatusSc(false)}
                isClearable
                value={selectedReqStatusSc}
                onChange={handleChangeReqStatusSc}
                options={filteredOptionReqStatusSc}
              />
              <label for="sname" className={`floating-label`}>
                Request Status
              </label>
            </div>
          </div> */}

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                type="date"
                className="exp-input-field form-control"
                title="Please Enter the From Date"
                value={FromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
              <label className="exp-form-labels">From Date</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                type="date"
                className="exp-input-field form-control"
                title="Please Enter the To Date"
                value={ToDate}
                onChange={(e) => setToDate(e.target.value)}
              />
              <label className="exp-form-labels">To Date</label>
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

export default LoanSummaryReports;
