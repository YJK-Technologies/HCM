import { useState, useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingScreen from "./Loading";
import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import Select from "react-select";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx-js-style";
import { min } from "date-fns";

const config = require("./Apiconfig");

function AgesReport() {

  //purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem("permissions")) || {};
  const agesReportPermissions = permissions
    .filter((permission) => permission.screen_type === "AgesReport")
    .map((permission) => permission.permission_type.toLowerCase());

  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [gridApi, setGridApi] = useState(null);
  const gridApiRef = useRef(null);

  // Filters
  const [first_name, setfirst_name] = useState("");
  const [department_id, setDepartmentId] = useState("");
  const [designation_id, setdesignation_id] = useState("");
  const [from_date, setfrom_date] = useState("");
  const [to_date, setto_date] = useState("");
  const [age_group, setAgeGroup] = useState("");

  const [selectedAGESTypeSc, setSelectedAGESTypeSc] = useState("");
  const [isSelectedAGESTypeSc, setIsSelectedAGESTypeSc] = useState(false);
  const [AGESTypeSc, setAGESTypeSc] = useState("");
  const [AGESTypesDropSc, setAGESTypesDropSc] = useState([]);

  const [selectedEmpIdSc, setSelectedEmpIdSc] = useState("");
  const [isSelectedEmpIdSc, setIsSelectedEmpIdSc] = useState(false);
  const [empIdSc, setEmpIdSc] = useState("");
  const [empIdDropSc, setEmpIdDropSc] = useState([]);

  const [selecteddpt, setselecteddept] = useState("");
  const [isSelectDepartment, setIsSelectDepartment] = useState(false);
  const [dpt, setdpt] = useState("");
  const [DPTdrop, setDPTdrop] = useState([]);

  const location = useLocation();

  //--------------- DEPARTMENT ID-----------------

  const handleDPT = (selectedDPT) => {
    setselecteddept(selectedDPT);
    setDepartmentId(selectedDPT ? selectedDPT.value : "");
  };

  const filteredOptionDPt = DPTdrop.map((option) => ({
    value: option.dept_id,
    label: `${option.dept_id} - ${option.dept_name}`,
  }));

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    const fetchDept = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/DeptID`, {
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
        setDPTdrop(val);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    if (company_code) {
      fetchDept();
    }
  }, []);
  //--------------- Employee ID-----------------
  const handleChangeEmpIdSc = (selectedEmpIdSc) => {
    setSelectedEmpIdSc(selectedEmpIdSc);
    setEmpIdSc(selectedEmpIdSc ? selectedEmpIdSc.value : "");
  };

  const filteredOptionEmpIdSc = Array.isArray(empIdDropSc)
    ? empIdDropSc.map((option) => ({
      value: option?.EmployeeId,
      label: `${option?.EmployeeId}-${option?.First_Name}`,
    }))
    : [];

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

  //---------------AGES Type---------------------
  const handleChangeAGESTypesSc = (selectedAGESTypeSc) => {
    setSelectedAGESTypeSc(selectedAGESTypeSc);
    setAGESTypeSc(selectedAGESTypeSc ? selectedAGESTypeSc.value : "");
  };

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");
    fetch(`${config.apiBaseUrl}/getAGESTypes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => setAGESTypesDropSc(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  //     const filteredOptionAGESTypesSc =[{ value: 'All', label: 'All' },
  //      ...(Array.isArray(AGESTypesDropSc)? AGESTypesDropSc.map((option) => ({
  //         value: option?.attributedetails_name,
  //         label: option?.attributedetails_name,
  //       }))
  //     : [])
  //   ];

  const filteredOptionAGESTypesSc = Array.isArray(AGESTypesDropSc)
    ? AGESTypesDropSc.map((option) => ({
      value: option?.attributedetails_name,
      label: option?.attributedetails_name,
    }))
    : [];



  const handleSearch = async () => {
    // To Date earlier than From Date
    if (new Date(to_date) < new Date(from_date)) {
      toast.warning("To Date should not be earlier than From Date");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/getAGES`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: "AGES",
          company_code: sessionStorage.getItem("selectedCompanyCode"),
          employee_id: empIdSc,
          first_name: first_name,
          department_id: department_id,
          designation_id,
          from_date: from_date,
          to_date: to_date,
          age_group: AGESTypeSc,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setRowData(data);
        } else {
          setRowData([]);
          toast.warning("Data Not Found");
        }
      } else {
        toast.warning("No Data Found");
        setRowData([]);
      }
    } catch (error) {
      toast.error("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const reloadGridData = () => {
    window.location.reload();
  };

  const formatDate = (value) => {
    if (!value) return "";
    const d = new Date(value);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const columnDefs = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 60,
    },
    {
      headerName: "S.No",
      field: "SNo",
      valueGetter: (params) => params.node.rowIndex + 1,
      width: 80,
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
      headerName: "Department",
      field: "department_ID",
      editable: false,
    },
    {
      headerName: "Designation",
      field: "designation_ID",
      editable: false,
    },
    {
      headerName: "DOB",
      field: "DOB",
      editable: false,
    },
    {
      headerName: "Age",
      field: "Age",
      editable: false,
    },
  ];

  const defaultColDef = {
    resizable: true,
    sortable: true,
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    gridApiRef.current = params.api;
  };

  const getCSSVariable = (variableName) => {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(variableName)
      .trim();
  };

  const hexToRgb = (hex) => {
    const cleanHex = hex.replace("#", "");
    const num = parseInt(cleanHex, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  };

  const generateReport = () => {
    if (!gridApi) return;

    const selectedRows = gridApi.getSelectedRows();

    if (selectedRows.length === 0) {
      toast.warning("Please select at least one row to print");
      return;
    }

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

    reportWindow.document.head.appendChild(link);

    reportWindow.document.write(`
  <html>
  <head>
    <title>AGES Report</title>
<style>
  body{
    font-family:'Segoe UI',sans-serif;
    margin:0;
    padding:20px;
    background:#f4f6f9;
    color:${fontColor};
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .header{
    display:flex;
    align-items:center;
    background:${tableHeaderBg};
    padding:15px 20px;
    color:white;
    border-radius:8px;
  }

  .logo{
    height:55px;
  }

  .title-section{
    flex:1;
    text-align:center;
  }

  .title-section h2{
    margin:0;
  }

  .sub-info{
    margin:15px 0;
    font-size:14px;
    display:flex;
    justify-content:space-between;
  }

  table{
    width:100%;
    border-collapse:collapse;
    background:white;
    border-radius:8px;
    overflow:hidden;
    box-shadow:0 4px 8px rgba(0,0,0,0.1);
  }

  th{
    background:${tableHeaderBg};
    color:white;
    padding:10px;
    text-align:left;
  }

  td{
    padding:8px;
    border-bottom:1px solid #ddd;
  }

  tr:nth-child(even){
    background:${rowAltColor};
  }

  tr:hover{
    background:${hoverColor};
  }

  .footer{
    margin-top:30px;
    text-align:center;
    font-size:13px;
    opacity:0.7;
  }

  .print-btn{
    margin-top:20px;
    padding:10px 20px;
    background:${headerGradientStart};
    color:white;
    border:none;
    border-radius:5px;
    cursor:pointer;
    font-size:14px;
  }

  .print-btn:hover{
    opacity:.85;
  }

  @page{
    size:auto;
    margin:12mm;
  }

  @media print{

    html,body{
      width:100%;
      background:white !important;
    }

    body{
      padding:0;
      margin:0;
    }

    .print-btn{
      display:none !important;
    }

    .header{
      background:${tableHeaderBg} !important;
      color:white !important;
    }

    th{
      background:${tableHeaderBg} !important;
      color:white !important;
    }

    tr:nth-child(even){
      background:${rowAltColor} !important;
    }

    table{
      box-shadow:none !important;
    }

    *{
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
  }
</style>
  </head>

  <body>

    <div class="header">
      <img src="${logoUrl}" class="logo"/>
      <div class="title-section">
        <h2>AGES Report</h2>
      </div>
    </div>

    <div class="sub-info">
      <div>Total Records: ${selectedRows.length}</div>
      <div>Printed Date: ${new Date().toLocaleDateString()}</div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Employee ID</th>
          <th>First Name</th>
          <th>Department</th>
          <th>Designation</th>
          <th>DOB</th>
          <th>Age</th>
        </tr>
      </thead>
      <tbody>
  `);

    selectedRows.forEach((row) => {
      reportWindow.document.write(`
      <tr>
        <td>${row.EmployeeId || ""}</td>
        <td>${row.First_Name || ""}</td>
        <td>${row.department_ID || ""}</td>
        <td>${row.designation_ID || ""}</td>
        <td>${row.DOB ? formatDate(row.DOB) : ""}</td>
        <td>${row.Age || ""}</td>
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
      doc.text("Age Report", pageWidth / 2, 35, { align: "center" });

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

      doc.save("Age_Report.pdf");
    });
  };

  const transformRowData = (data) => {
    return data.map((row, index) => ({
      "S.No": index + 1,
      "Employee ID": row.EmployeeId || "",
      "First Name": row.First_Name || "",
      "Department": row.department_ID || "",
      "Designation": row.designation_ID || "",
      "DOB": row.DOB || "",
      "Age": row.Age || "",
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

    const screenName = "Age Report";
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Age Report");

    XLSX.writeFile(workbook, "Age_Report.xlsx");
  };

  return (
    <div className="container-fluid Topnav-screen">
      {loading && <LoadingScreen />}

      <ToastContainer position="top-right" theme="colored" />

      <div className="shadow-lg p-2 bg-light rounded main-header-box">
        <div className="header-flex">
          <h1 className="page-title">Age Group Employee Count</h1>
          <div className="action-wrapper desktop-actions">
            {["all permission", "view"].some((p) => agesReportPermissions.includes(p)) && (
              <div className="action-icon print" onClick={generateReport}>
                <span className="tooltip">Print</span>
                <i className="fa-solid fa-print"></i>
              </div>
            )}
            {["all permission", "PDF"].some((p) => agesReportPermissions.includes(p)) && (
              <div className="action-icon print" onClick={exportToPDF}>
                <span className="tooltip">Pdf</span>
                <i className="fa-solid fa-file-pdf"></i>
              </div>
            )}
            {["all permission", "Excel"].some((p) => agesReportPermissions.includes(p)) && (
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
              {["all permission", "view"].some((p) => agesReportPermissions.includes(p)) && (
                <li>
                  <button className="dropdown-item" onClick={generateReport}>
                    <i className="fa-solid fa-print text-dark fs-4"></i>
                  </button>
                </li>
              )}
              {["all permission", "Pdf"].some((p) => agesReportPermissions.includes(p)) && (
                <li>
                  <button className="dropdown-item" onClick={exportToPDF}>
                    <i className="fa-solid fa-file-pdf text-dark fs-4"></i>
                  </button>
                </li>
              )}
              {["all permission", "Excel"].some((p) => agesReportPermissions.includes(p)) && (
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

      {/* Search Filters */}
      <div className="shadow-lg p-3 bg-light rounded mt-2 container-form-box">
        <div className="row g-3">
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
                className="exp-input-field form-control"
                type="Text"
                title="Please Enter the First Name"
                placeholder=""
                value={first_name}
                onChange={(e) => setfirst_name(e.target.value)}
              />
              <label for="sname" className="exp-form-labels">
                First Name
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selecteddpt ? "has-value" : ""} 
              ${isSelectDepartment ? "is-focused" : ""}`}
            >
              <Select
                id="department"
                placeholder=" "
                onFocus={() => setIsSelectDepartment(true)}
                onBlur={() => setIsSelectDepartment(false)}
                classNamePrefix="react-select"
                isClearable
                type="text"
                value={selecteddpt}
                onChange={handleDPT}
                options={filteredOptionDPt}
              />
              <label htmlFor="selecteddpt" className={`floating-label`}>
                Department ID
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                className="exp-input-field form-control"
                type="Text"
                title="Please Enter the Designation"
                placeholder=""
                value={designation_id}
                onChange={(e) => setdesignation_id(e.target.value)}
              />
              <label for="sname" className="exp-form-labels">
                Designation
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedAGESTypeSc ? "has-value" : ""} 
              ${isSelectedAGESTypeSc ? "is-focused" : ""}`}
              title="Please enter the AGES Type Name"
            >
              <Select
                id="country"
                type="text"
                classNamePrefix="react-select"
                placeholder=""
                onFocus={() => setIsSelectedAGESTypeSc(true)}
                onBlur={() => setIsSelectedAGESTypeSc(false)}
                isClearable
                maxLength={100}
                value={selectedAGESTypeSc}
                onChange={handleChangeAGESTypesSc}
                options={filteredOptionAGESTypesSc}
              />
              <label for="sname" className={`floating-label`}>
                Ages
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                type="date"
                className="exp-input-field form-control"
                title="Please Enter the From Date"
                value={from_date}
                onChange={(e) => setfrom_date(e.target.value)}
              />
              <label for="sname" className="exp-form-labels">
                From Date
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                type="date"
                className="exp-input-field form-control"
                title="Please Enter the To Date"
                value={to_date}
                onChange={(e) => setto_date(e.target.value)}
              />
              <label for="sname" className="exp-form-labels">
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

      {/* Grid */}
      <div className="shadow-lg pt-3 bg-light rounded mt-2 container-form-box">
        <div className="ag-theme-quartz" style={{ height: 500, width: "100%" }}>
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

export default AgesReport;
