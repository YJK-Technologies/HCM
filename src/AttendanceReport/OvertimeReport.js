import { useState, useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import "../App.css";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingScreen from "../Loading";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx-js-style";

const config = require("../Apiconfig");

function OvertimeReport() {
    const [rowData, setRowData] = useState([]);
    const [gridApi, setGridApi] = useState(null);
    const [loading, setLoading] = useState(false);
    const gridApiRef = useRef(null);

    const today = new Date().toISOString().split('T')[0];

    const [employeeID, setEmployeeID] = useState('');
    const [selectedDpt, setSelectedDpt] = useState("");
    const [designation, setDesignation] = useState("");
    const [fromDate, setFromDate] = useState(today);
    const [toDate, setToDate] = useState(today);
    const [department, setDepartment] = useState("");
    const [selectedDsg, setSelectedDsg] = useState('');
    const [selectedEmp, setSelectedEmp] = useState('');
    const [empDrop, setEmpDrop] = useState([]);
    const [DptDrop, setDptDrop] = useState([]);
    const [dynamicOptions, setDynamicOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [isSelectedEmp, setIsSelectedEmp] = useState(false);
    const [isSelectDepartment, setIsSelectDepartment] = useState(false);
    const [isSelectDesignation, setIsSelectDesignation] = useState(false);

    //purpose of set user permisssion
    const permissions = JSON.parse(sessionStorage.getItem("permissions")) || {};
    const companyPermissions = permissions
        .filter((permission) => permission.screen_type === "OvertimeReport")
        .map((permission) => permission.permission_type.toLowerCase());

    const company_code = sessionStorage.getItem('selectedCompanyCode')

    useEffect(() => {
        const company_code = sessionStorage.getItem('selectedCompanyCode');

        const fetchDept = async () => {
            try {
                const response = await fetch(`${config.apiBaseUrl}/getDept`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ company_code }),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const val = await response.json();
                setDptDrop(val);

            } catch (error) {
                console.error('Error fetching departments:', error);
            }
        };

        if (company_code) {
            fetchDept();
        }
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`${config.apiBaseUrl}/getEmployeeId`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ company_code: sessionStorage.getItem('selectedCompanyCode') })
                });

                const val = await response.json();
                setEmpDrop(val);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    const filteredOptionDpt = [
        { value: 'All', label: 'All' },
        ...(Array.isArray(DptDrop)
            ? DptDrop.map((option) => ({
                value: option.Department,
                label: option.Department,
            }))
            : [])
    ];

    const handleChangeDpt = (selectedDpt) => {
        setSelectedDpt(selectedDpt);
        setDepartment(selectedDpt ? selectedDpt.value : '');
        fetchDesignation(selectedDpt ? selectedDpt.value : '');
    };

    const handleChangedesgination = (selecteddesg) => {
        setSelectedDsg(selecteddesg);
        setDesignation(selecteddesg ? selecteddesg.value : '');
    };

    const fetchDesignation = async (selectedValue) => {
        try {
            const response = await fetch(`${config.apiBaseUrl}/getDesgination`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ dept_id: selectedValue, company_code }),
            });

            const data = await response.json();
            const formattedData = [
                { value: 'All', label: 'All' },
                ...data.map((product) => ({
                    value: product.Desgination,
                    label: product.Desgination,
                }))
            ];

            setDynamicOptions(formattedData);
            return formattedData;
        } catch (error) {
            console.error('Error fetching product codes:', error);
            return [];
        }
    };

    const filteredOptionEmp = [{ value: 'All', label: 'All' },
    ...(Array.isArray(empDrop) ? empDrop.map((option) => ({
        value: option.EmployeeId,
        label: `${option.EmployeeId} - ${option.First_Name}`,
    }))
        : [])
    ];

    const handleChangeEmp = (selectedUser) => {
        setSelectedEmp(selectedUser);
        setEmployeeID(selectedUser ? selectedUser.value : '');
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
            headerName: "Attendance Date",
            field: "AttendanceDate",
            editable: false,
        },
        {
            headerName: "Employee ID",
            field: "EmployeeId",
            editable: false,
        },
        {
            headerName: "Employee Name",
            field: "EmployeeName",
            editable: false,
        },
        {
            headerName: "Department ID",
            field: "department_ID",
            editable: false,
        },
        {
            headerName: "Department Name",
            field: "DepartmentName",
            editable: false,
        },
        {
            headerName: "Designation ID",
            field: "designation_ID",
            editable: false,
        },
        {
            headerName: "Designation Name",
            field: "DesignationName",
            editable: false,
        },
        {
            headerName: "Check In",
            field: "FirstCheckIn",
            editable: false,
        },
        {
            headerName: "Check Out",
            field: "LastCheckOut",
            editable: false,
        },
        {
            headerName: "Total Hours",
            field: "TotalHours",
            editable: false,
        },
        {
            headerName: "Standard Hours",
            field: "StandardHours",
            editable: false,
        },
        {
            headerName: "Overtime Hours",
            field: "OvertimeHours",
            editable: false,
        },
    ];

    const defaultColDef = {
        resizable: true,
    };

    const onGridReady = (params) => {
        setGridApi(params.api);
        gridApiRef.current = params.api;
    };

    const handleSearch = async () => {

        if (!fromDate || !toDate) {
            toast.warning("Please select both From Date and To Date to search");
            return;
        }

        const fromDateObj = new Date(fromDate);
        const toDateObj = new Date(toDate);

        if (fromDateObj > toDateObj) {
            toast.warning("From Date should not be after To Date");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${config.apiBaseUrl}/GetOvertimeReport`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    CompanyCode: sessionStorage.getItem("selectedCompanyCode"),
                    FromDate: fromDate,
                    ToDate: toDate,
                    EmployeeId: employeeID,
                    Department: department,
                    Designation: designation
                }),
            });

            if (response.ok) {
                const searchData = await response.json();
                setRowData(searchData);
            } else if (response.status === 404) {
                console.log("Data not found");
                setRowData([]);
                toast.warning("Data not found");
            } else {
                const errorResponse = await response.json();
                toast.warning(errorResponse.message || "Failed to fetch data");
            }
        } catch (error) {
            console.error("Error fetching search data:", error);
            toast.error("Error fetching search data:", error);
        }
        finally {
            setLoading(false);
        }
    };

    const generateReport = () => {
        const selectedRows = gridApi.getSelectedRows();
        if (selectedRows.length === 0) {
            toast.warning("Please select at least one row to generate a report");
            return
        };

        const reportData = selectedRows.map((row) => {
            const formatValue = (val) => (val !== undefined && val !== null ? val : '');

            return {
                "Attendance Date": formatValue(row.AttendanceDate),
                "Employee ID": formatValue(row.EmployeeId),
                "Employee Name": formatValue(row.EmployeeName),
                "Department ID": formatValue(row.department_ID),
                "Department Name": formatValue(row.DepartmentName),
                "Designation ID": formatValue(row.designation_ID),
                "Designation Name": formatValue(row.DesignationName),
                "Check In": formatValue(row.FirstCheckIn),
                "Check Out": formatValue(row.LastCheckOut),
                "Total Hours": formatValue(row.TotalHours),
                "Standard Hours": formatValue(row.StandardHours),
                "Overtime Hours": formatValue(row.OvertimeHours),
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

        reportWindow.document.head.appendChild(link);
        reportWindow.document.write("<html><head><title>Overtime Report</title>");
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
        `);
        reportWindow.document.write("</style></head><body>");
        reportWindow.document.write(`
        <div class="header">
            <img src="${logoUrl}" class="logo" />
            <div class="title-section">
              <h2>Overtime Report</h2>
            </div>
            </div>`);
        reportWindow.document.write(`<div style="margin-top:10px;">
            <strong>Total Records: ${selectedRows.length}</strong>
            <span style="float:right;">
              Printed Date: ${new Date().toLocaleDateString()}
            </span>
        </div>`);

        reportWindow.document.write("<table><thead><tr>");
        Object.keys(reportData[0]).forEach((key) => {
            reportWindow.document.write(`<th>${key}</th>`);
        });
        reportWindow.document.write("</tr></thead><tbody>");

        reportData.forEach((row) => {
            reportWindow.document.write("<tr>");
            Object.values(row).forEach((value) => {
                reportWindow.document.write(`<td>${value}</td>`);
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

    const handleReload = () => {
        clearInputsSearch([])
        setRowData([])
    };

    const clearInputsSearch = () => {
        setEmployeeID('');
        setSelectedDpt('');
        setDesignation('');
        setFromDate('');
        setToDate('');
        setDepartment('');
        setSelectedDsg('');
        setSelectedEmp('');
        setDepartment('');
    };

    const getCSSVariable = (variableName) => {
        return getComputedStyle(document.documentElement)
            .getPropertyValue(variableName)
            .trim();
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
            doc.text("Overtime Report", pageWidth / 2, 35, { align: "center" });

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

            doc.save("Overtime_Report.pdf");
        });
    };

    const transformRowData = (data) => {
        return data.map((row) => ({
            "Attendance Date": row.AttendanceDate || "",
            "Employee ID": row.EmployeeId || "",
            "Employee Name": row.EmployeeName || "",
            "Department ID": row.department_ID || "",
            "Department Name": row.DepartmentName || "",
            "Designation ID": row.designation_ID || "",
            "Designation Name": row.DesignationName || "",
            "Check In": row.FirstCheckIn || "",
            "Check Out": row.LastCheckOut || "",
            "Total Hours": row.TotalHours || "",
            "Standard Hours": row.StandardHours || "",
            "Overtime Hours": row.OvertimeHours || "",
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

        const screenName = "Overtime Report";
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
        XLSX.utils.book_append_sheet(workbook, worksheet, "Overtime Report");

        XLSX.writeFile(workbook, "Overtime_Report.xlsx");
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
                    <h1 className="page-title">Overtime Report</h1>

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
                        <div
                            className={`inputGroup selectGroup 
                            ${selectedDpt ? "has-value" : ""} 
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
                                value={selectedDpt}
                                onChange={handleChangeDpt}
                                options={filteredOptionDpt}
                            />
                            <label htmlFor="selecteddpt" className={`floating-label`}>
                                Department
                            </label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div
                            className={`inputGroup selectGroup 
                            ${selectedDsg ? "has-value" : ""} 
                            ${isSelectDesignation ? "is-focused" : ""}`}
                        >
                            <Select
                                id="designation"
                                placeholder=" "
                                onFocus={() => setIsSelectDesignation(true)}
                                onBlur={() => setIsSelectDesignation(false)}
                                classNamePrefix="react-select"
                                isClearable
                                name="designation_ID"
                                value={selectedDsg}
                                options={dynamicOptions}
                                onChange={handleChangedesgination}
                            />
                            <label htmlFor="selecteddpt" className={`floating-label`}>
                                Designation
                            </label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div
                            className={`inputGroup selectGroup 
                            ${selectedEmp ? "has-value" : ""} 
                            ${isSelectedEmp ? "is-focused" : ""}`}
                        >
                            <Select
                                id="cno"
                                type="text"
                                isClearable
                                classNamePrefix="react-select"
                                placeholder=" "
                                onFocus={() => setIsSelectedEmp(true)}
                                onBlur={() => setIsSelectedEmp(false)}
                                required
                                title="Please enter the employee id"
                                onChange={handleChangeEmp}
                                value={selectedEmp}
                                options={filteredOptionEmp}
                            />
                            <label for="state" className={`floating-label`}>
                                Employee ID
                            </label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div className="inputGroup">
                            <input
                                id="SalaryDate"
                                className="exp-input-field form-control"
                                type="date"
                                placeholder=""
                                required
                                title="Please Enter the Salary Month"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                            />
                            <label htmlFor="SalaryDate" className={`exp-form-labels`}>From Date</label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div className="inputGroup">
                            <input
                                id="SalaryDate"
                                className="exp-input-field form-control"
                                type="date"
                                placeholder=""
                                required
                                title="Please Enter the Salary Month"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                            />
                            <label htmlFor="SalaryDate" className={`exp-form-labels`}>To Date</label>
                        </div>
                    </div>

                    {/* Search + Reload Buttons */}
                    <div className="col-12">
                        <div className="search-btn-wrapper">
                            <div className="icon-btn search" onClick={handleSearch}>
                                <span className="tooltip">Search</span>
                                <i className="fa-solid fa-magnifying-glass"></i>
                            </div>

                            <div className="icon-btn reload" onClick={handleReload}>
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

export default OvertimeReport;