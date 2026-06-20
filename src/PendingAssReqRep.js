import React, { useState, useEffect, useRef } from "react";
import "./input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { AgGridReact } from "ag-grid-react";
import { showConfirmationToast } from "./ToastConfirmation";
import LoadingScreen from "./Loading";
import Select from "react-select";
import * as XLSX from "xlsx-js-style";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
const config = require("./Apiconfig");

function PendingAssReqRep({ }) {
  const [rowData, setRowData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [gridApi, setGridApi] = useState(null);
  const gridApiRef = useRef(null);
  const [ReqIdSc, setReqIdSc] = useState("");
  const [reqNumberSc, setReqNumberSc] = useState("");
  const [empIdDropSc, setEmpIdDropSc] = useState([]);
  const [empIdSc, setEmpIdSc] = useState("");
  const [selectedEmpIdSc, setSelectedEmpIdSc] = useState("");
  const [loanTypeIdDropSc, setLoanTypeIdDropSc] = useState([]);
  const [loanTypeIdSc, setLoanTypeIdSc] = useState("");
  const [selectedLoanTypeIdSc, setSelectedLoanIypeIdSc] = useState("");
  const [loanAmountSc, setLoanAmountSc] = useState("");
  const [interestRateSc, setInterestRateSc] = useState("");
  const [repayMonthSc, setRepayMonthSc] = useState("");
  const [monthlyInstallmentSc, setMonthlyInstallmentSc] = useState("");
  const [currencyCodeSc, setCurrencyCodeSc] = useState("");
  const [purposeSc, setPurposeSc] = useState("");
  const [reqStatusDropSc, setReqStatusDropSc] = useState([]);
  const [reqStatusSc, setReqStatusSc] = useState("");
  const [selectedReqStatusSc, setSelectedReqStatusSc] = useState("");
  const [repaymentDateSc, setRepaymentDateSc] = useState("");
  const [totalItemsSc, setTotalItemsSc] = useState("");
  const [pendingItemsSc, setPendingItemsSc] = useState("");
  const [approvedItemsSc, setApprovedItemsSc] = useState("");

  const [isSelectedEmpIdSc, setIsSelectedEmpIdSc] = useState(false);
  const [isSelectedReqStatusSc, setIsSelectedReqStatusSc] = useState(false);

  const [empIdDropGrid, setEmpIdDropGrid] = useState([]);
  const [loanTypeIdDropGrid, setLoanTypeIdDropGrid] = useState([]);
  const [reqStatusDropGrid, setReqStatusDropGrid] = useState([]);

  const [currencyDropGrid, setCurrencyDropGrid] = useState([]);
  //purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem("permissions")) || {};
  const pendingAssReqRepPermissions = permissions
    .filter((permission) => permission.screen_type === "PendingAssReqRep")
    .map((permission) => permission.permission_type.toLowerCase());

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

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    fetch(`${config.apiBaseUrl}/getEmployeeId`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => setEmpIdDropSc(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");
    fetch(`${config.apiBaseUrl}/LoanTypeIdDropDown`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => setLoanTypeIdDropSc(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");
    fetch(`${config.apiBaseUrl}/getLeaveStatus`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => setReqStatusDropSc(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const filteredOptionEmpIdSc = Array.isArray(empIdDropSc)
    ? empIdDropSc.map((option) => ({
      value: option?.EmployeeId,
      label: `${option?.EmployeeId}-${option?.First_Name}`,
    }))
    : [];

  const handleChangeEmpIdSc = (selectedEmpIdSc) => {
    setSelectedEmpIdSc(selectedEmpIdSc);
    setEmpIdSc(selectedEmpIdSc ? selectedEmpIdSc.value : "");
  };

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
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    fetch(`${config.apiBaseUrl}/getEmployeeId`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => {
        const emp = val.map((option) => ({
          value: option.EmployeeId,
          label: `${option.EmployeeId} - ${option.First_Name}`,
        }));
        setEmpIdDropGrid(emp);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    fetch(`${config.apiBaseUrl}/LoanTypeIdDropDown`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((response) => response.json())
      .then((data) => {
        const loanTypeOptions = data.map((option) => ({
          value: option.Loan_Type_ID, // adjust based on your DB column
          label: `${option.Loan_Type_ID} - ${option.Loan_Type_Name}`,
        }));

        setLoanTypeIdDropGrid(loanTypeOptions);
      })
      .catch((error) => console.error("Error fetching loan types:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");
    fetch(`${config.apiBaseUrl}/getLeaveStatus`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => {
        const reqStatus = val.map((option) => option.attributedetails_name);
        setReqStatusDropGrid(reqStatus);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");
    fetch(`${config.apiBaseUrl}/getCurrenyCode`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => {
        const currency = val.map((option) => option.attributedetails_name);
        setCurrencyDropGrid(currency);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const searchClearInputFields = () => {
    setReqIdSc("");
    setReqNumberSc("");
    setEmpIdSc("");
    setSelectedEmpIdSc("");
    setLoanTypeIdSc("");
    setSelectedLoanIypeIdSc("");
    setLoanAmountSc("");
    setInterestRateSc("");
    setRepayMonthSc("");
    setMonthlyInstallmentSc("");
    setCurrencyCodeSc("");
    setPurposeSc("");
    setReqStatusSc("");
    setSelectedReqStatusSc("");
    setRepaymentDateSc("");
    setTotalItemsSc("");
    setPendingItemsSc("");
    setApprovedItemsSc("");
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
      headerName: "Request ID",
      field: "info_request_id",
      sortable: true,
      // filter: true,
      width: 130,
    },
    {
      headerName: "Employee ID",
      field: "EmployeeId",
      sortable: true,
      // filter: true,
      width: 140,
    },
    {
      headerName: "Purpose",
      field: "purpose",
      sortable: true,
      // filter: true,
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
      headerName: "Total Items",
      field: "TotalItems",
      sortable: true,
      // filter: true,
      width: 140,
    },
    {
      headerName: "Pending Items",
      field: "PendingItems",
      sortable: true,
      // filter: true,
      width: 150,
    },
    {
      headerName: "Approved Items",
      field: "ApprovedItems",
      sortable: true,
      // filter: true,
      width: 160,
    },
    // {
    //   headerName: "Company Code",
    //   field: "company_code",
    //   sortable: true,
    //   // filter: true,
    //   hide: true,
    //   width: 140,
    // },
    {
      headerName: "Created Date",
      field: "created_date",
      sortable: true,
      // filter: true,
      width: 150,
      hide: true,
      valueFormatter: (params) => {
        if (!params.value) return "";
        return new Date(params.value).toLocaleDateString("en-GB");
      },
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
        info_request_id: ReqIdSc,
        EmployeeId: empIdSc,
        purpose: purposeSc,
        request_status: reqStatusSc,
        TotalItems: totalItemsSc,
        PendingItems: pendingItemsSc,
        ApprovedItems: approvedItemsSc,
        created_by: sessionStorage.getItem("selectedUserCode"),
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      };

      const response = await fetch(
        `${config.apiBaseUrl}/PendingAssetRequests_SC`,
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
        setRowData(fetchedData);
      } else if (response.status === 404) {
        toast.warning("Data Not found");
        setRowData([]);
      } else {
        const errorResponse = await response.json();
        toast.error(errorResponse.message || "Something went wrong");
        setRowData([]);
      }
    } catch (error) {
      console.error("Error fetching asset search data:", error);
      toast.error("Error fetching asset search data");
      setRowData([]);
    } finally {
      setLoading(false);
    }
  };
  const reloadGridData = () => {
    setRowData([]);
    searchClearInputFields();
  };

  const getCSSVariable = (variableName) => {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(variableName)
      .trim();
  };

  const getSafeData = () => {
    if (!rowData || rowData.length === 0) {
      return [
        {
          info_request_id: "",
          EmployeeId: "",
          purpose: "No Data Found",
          request_status: "",
          TotalItems: "",
          PendingItems: "",
          ApprovedItems: "",
          company_code: "",
          created_date: "",
        },
      ];
    }
    return rowData;
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
        "S.No": formatValue(row.SNo),
        "Request ID": formatValue(row.info_request_id),
        "Employee ID": formatValue(row.EmployeeId),
        "Purpose": formatValue(row.purpose),
        "Request Status": formatValue(row.request_status),
        "Total Items": formatValue(row.TotalItems),
        "Pending Items": formatValue(row.PendingItems),
        "Approved Items": formatValue(row.ApprovedItems),
        "Created Date": formatValue(row.created_date),
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
    reportWindow.document.write(`<html><head><title>Pending Asset Requests Report</title>`);
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
        <h2>Pending Asset Requests Report</h2>
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

  const hexToRgb = (hex) => {
    const cleanHex = hex.replace("#", "");
    const num = parseInt(cleanHex, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
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
      doc.text("Pending Asset Requests Report", pageWidth / 2, 35, { align: "center" });

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

      doc.save("Pending_Asset_Requests_Report.pdf");
    });
  };

  const transformRowData = (data) => {
    return data.map((row, index) => ({
      "S.No": index + 1,
      "Request ID": row.info_request_id || "",
      "Employee ID": row.EmployeeId || "",
      "Purpose": row.purpose || "",
      "Request Status": row.request_status || "",
      "Total Items": row.TotalItems || "",
      "Pending Items": row.PendingItems || "",
      "Approved Items": row.ApprovedItems || "",
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

    const screenName = "Pending Asset Requests Report";
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pending Asset Requests Report");

    XLSX.writeFile(workbook, "Pending_Asset_Requests_Report.xlsx");
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
          <h1 className="page-title">Pending Asset Requests Report</h1>
          <div className="action-wrapper desktop-actions">
            {["all permission", "view"].some((p) => pendingAssReqRepPermissions.includes(p)) && (
              <div className="action-icon print" onClick={generateReport}>
                <span className="tooltip">Print</span>
                <i className="fa-solid fa-print"></i>
              </div>
            )}
            {["all permission", "PDF"].some((p) => pendingAssReqRepPermissions.includes(p)) && (
              <div className="action-icon print" onClick={exportToPDF}>
                <span className="tooltip">Pdf</span>
                <i className="fa-solid fa-file-pdf"></i>
              </div>
            )}
            {["all permission", "Excel"].some((p) => pendingAssReqRepPermissions.includes(p)) && (
              <div className="action-icon print" onClick={handleExportToExcel}>
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

            <ul className="dropdown-menu dropdown-menu-end">
              {["all permission", "view"].some((p) => pendingAssReqRepPermissions.includes(p)) && (
                <li>
                  <button className="dropdown-item" onClick={generateReport}>
                    <i className="fa-solid fa-print text-dark fs-4"></i>
                  </button>
                </li>
              )}
              {["all permission", "Pdf"].some((p) => pendingAssReqRepPermissions.includes(p)) && (
                <li>
                  <button className="dropdown-item" onClick={exportToPDF}>
                    <i className="fa-solid fa-file-pdf text-dark fs-4"></i>
                  </button>
                </li>
              )}
              {["all permission", "Excel"].some((p) => pendingAssReqRepPermissions.includes(p)) && (
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
                maxLength={15}
                inputMode="numeric"
                pattern="[0-9]*"
                required
                title="Please enter the Request ID"
                autoComplete="off"
                value={ReqIdSc}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setReqIdSc(value);
                }}
              />
              <label for="sname" className={`exp-form-labels`}>
                {" "}
                Request ID
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedEmpIdSc ? "has-value" : ""} 
              ${isSelectedEmpIdSc ? "is-focused" : ""}`}
              title="Please enter the Employee ID"
            >
              <Select
                id="department"
                placeholder=" "
                onFocus={() => setIsSelectedEmpIdSc(true)}
                onBlur={() => setIsSelectedEmpIdSc(false)}
                classNamePrefix="react-select"
                isClearable
                type="text"
                value={selectedEmpIdSc}
                onChange={handleChangeEmpIdSc}
                options={filteredOptionEmpIdSc}
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
                required
                title="Please Enter the Purpose"
                autoComplete="off"
                value={purposeSc}
                maxLength={100}
                onChange={(e) => setPurposeSc(e.target.value)}
              />
              <label for="sname" className={`exp-form-labels`}>
                Purpose
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
                            <label for="sname" className={`floating-label`}>Request Status</label>
                        </div>
                    </div> */}

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="Number"
                placeholder=""
                required
                title="Please Enter the Total Items"
                autoComplete="off"
                value={totalItemsSc}
                maxLength={100}
                onChange={(e) => setTotalItemsSc(e.target.value)}
              />
              <label for="sname" className={`exp-form-labels`}>
                Total Items
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="Number"
                placeholder=""
                required
                title="Please Enter the Pending Items"
                autoComplete="off"
                value={pendingItemsSc}
                maxLength={100}
                onChange={(e) => setPendingItemsSc(e.target.value)}
              />
              <label for="sname" className={`exp-form-labels`}>
                Pending Items
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="Number"
                placeholder=""
                required
                title="Please Enter the Approved Items"
                autoComplete="off"
                value={approvedItemsSc}
                maxLength={100}
                onChange={(e) => setApprovedItemsSc(e.target.value)}
              />
              <label for="sname" className={`exp-form-labels`}>
                Approved Items
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
            onGridReady={onGridReady}
            onFirstDataRendered={onFirstDataRendered}
          />
        </div>
      </div>
    </div>
  );
}
export default PendingAssReqRep;