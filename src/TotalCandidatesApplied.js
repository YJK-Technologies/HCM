import { useState, useEffect, useRef } from "react";
import "./input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import Select from "react-select";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "./apps.css";
import LoadingScreen from "./Loading";
import * as XLSX from "xlsx-js-style";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const config = require("./Apiconfig");

function TotalCandidatesApplied() {
  const [EducationSC, setEducationSC] = useState("");
  const [ExperienceSC, setExperienceSC] = useState("");
  const [JobDescriptionSC, setJobDescriptionSC] = useState("");
  const [Related_experienceSC, setRelated_experienceSC] = useState("");
  const [emailSC, setemailSC] = useState("");
  const [phoneSC, setphoneSC] = useState("");
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isselectedJobIDSC, setisselectedJobIDSC] = useState(false);
  const [selectedJobIDSC, setselectedJobIDSC] = useState("");
  const [JobIDSC, setJobIDSC] = useState("");
  const [Jobdrop, setJobdrop] = useState([]);
  const [JobDrop, setJobDrop] = useState([]);
  const [selectedcandidate_name, setSelectedcandidatename] = useState("");
  const [canditatename, set_candidatename] = useState("");
  const [isselectedscheduleid, setIsscheduleid] = useState("");
  const [canditatenameDrop, setcanditatenameDrop] = useState([]);
  const [currentPdfUrl, setCurrentPdfUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gridApi, setGridApi] = useState(null);
  const [pinnedRowData, setPinnedRowData] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const gridApiRef = useRef(null);

  //purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem("permissions")) || {};
  const totalCandidatesAppliPermissions = permissions
    .filter((permission) => permission.screen_type === "TotalCandidatesAppli")
    .map((permission) => permission.permission_type.toLowerCase());

  const handleJobIDSC = (selectedDPT) => {
    setselectedJobIDSC(selectedDPT);
    setJobIDSC(selectedDPT ? selectedDPT.value : "");
  };

  const filteredOptionJobID = Jobdrop.map((option) => ({
    value: option.job_id,
    label: `${option.job_id} - ${option.job_title}`,
  }));

  const handlescandidate_name = (selectedDPT) => {
    setSelectedcandidatename(selectedDPT);
    set_candidatename(selectedDPT ? selectedDPT.value : "");
  };

  const filteredOptioncandidate_name = canditatenameDrop.map((option) => ({
    value: option.candidate_name,
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

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    fetch(`${config.apiBaseUrl}/JobMaster`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((response) => response.json())
      .then((data) => {
        const jobs = data.map((option) => ({
          value: option.job_id,
          label: `${option.job_id}-${option.job_title}`,
        }));
        setJobDrop(jobs);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    const fetchDept = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/JobMaster`, {
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
        setJobdrop(val);
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
      const body = {
        candidate_name: canditatename,
        email: emailSC,
        phone: phoneSC,
        applied_job_id: JobIDSC,
        Education: EducationSC,
        Experience: ExperienceSC,
        Job_description: JobDescriptionSC,
        Related_experience: Related_experienceSC,
        company_code: sessionStorage.getItem("selectedCompanyCode"),
        from_date: fromDate,
        to_date: toDate,
      };

      const response = await fetch(
        `${config.apiBaseUrl}/CandidateAppliedSearch`,
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
        const newRows = fetchedData.map((matchedItem) => ({
          candidate_id: matchedItem.candidate_id,
          email: matchedItem.email,
          // Canditate_CV: matchedItem.Canditate_CV,
          phone: matchedItem.phone,
          candidate_name: matchedItem.candidate_name,
          applied_job_id: matchedItem.applied_job_id,
          Education: matchedItem.Education,
          Experience: matchedItem.Experience,
          Related_experience: matchedItem.Related_experience,
          Job_description: matchedItem.Job_description,
          keyfield: matchedItem.keyfield,
          company_code: sessionStorage.getItem("selectedCompanyCode"),
        }));
        setRowData(newRows);

        //  Get last column field name dynamically
        const lastColumnField = columnDefs[columnDefs.length - 1].field;

        setPinnedRowData([
          {
            [lastColumnField]: `Total Candidates Applied: ${newRows.length}`,
          },
        ]);
        const totalRow = {
          candidate_id: null,
          candidate_name: "",
          email: "",
          phone: "",
          applied_job_id: null,
          Education: "",
          Experience: "",
          Related_experience: "Total Candidates Applied:",
          Job_description: ` ${newRows.length}`,
          keyfield: "",
        };

        setRowData([...newRows, totalRow]);
      } else if (response.status === 404) {
        console.log("Data Not found");
        toast.warning("Data Not found");
        setRowData([]);
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to insert sales data");
        console.error(errorResponse.details || errorResponse.message);
        setRowData([]);
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
      toast.error("Error fetching search data:", error);
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

  const onFirstDataRendered = (params) => {
  const allColumnIds = params.columnApi
    .getColumns()
    .map((col) => col.getId());

  params.columnApi.autoSizeColumns(allColumnIds);
};

  const columnDefs = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      headerName: "Candidate ID",
      field: "candidate_id",
      editable: false,
    },
    {
      headerName: "Candidate Name",
      field: "candidate_name",
      editable: false,
    },
    {
      headerName: "Email",
      field: "email",
      editable: false,
    },
    {
      headerName: "Phone",
      field: "phone",
      editable: false,
    },
    {
      headerName: "Applied Job ID",
      field: "applied_job_id",
      editable: false,
    },
    {
      headerName: "Education",
      field: "Education",
      editable: false,
    },
    {
      headerName: "Experience",
      field: "Experience",
      editable: false,
    },
    {
      headerName: "Related Experience",
      field: "Related_experience",
      editable: false,
    },
    {
      headerName: "Job Description",
      field: "Job_description",
      editable: false,
    },
  ];

const generateReport = () => {
  if (!gridApi) return;

  const selectedRows = gridApi
    .getSelectedRows()
    .filter((row) => row.candidate_id !== null);

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

      <title>Total Candidates Applied</title>

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
          vertical-align: top;
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
            size: landscape;
            margin: 10mm;
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
            <h2>Total Candidates Applied</h2>
          </div>

          <div style="width:60px;"></div>

        </div>

        <div class="sub-info">

          <div>
            Total Records : ${selectedRows.length}
          </div>

          <div>
            Printed Date : ${new Date().toLocaleDateString()}
          </div>

        </div>

        <table>

          <thead>
            <tr>
              <th>Candidate Id</th>
              <th>Candidate Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Applied Job ID</th>
              <th>Education</th>
              <th>Experience</th>
              <th>Related Experience</th>
              <th>Job Description</th>
            </tr>
          </thead>

          <tbody>

            ${selectedRows
              .map(
                (row) => `
                  <tr>
                    <td>${row.candidate_id || ""}</td>
                    <td>${row.candidate_name || ""}</td>
                    <td>${row.email || ""}</td>
                    <td>${row.phone || ""}</td>
                    <td>${row.applied_job_id || ""}</td>
                    <td>${row.Education || ""}</td>
                    <td>${row.Experience || ""}</td>
                    <td>${row.Related_experience || ""}</td>
                    <td>${row.Job_description || ""}</td>
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
      doc.text("Total Candidates Applied", pageWidth / 2, 35, { align: "center" });

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

      doc.save("Total_Candidates_Applied.pdf");
    });
  };

  const transformRowData = (data) => {
    return data.map((row) => ({
      "Candidate ID": row.candidate_id || "",
      "Candidate Name": row.candidate_name || "",
      "Email": row.email || "",
      "Phone": row.phone || "",
      "Applied Job ID": row.applied_job_id || "",
      "Education": row.Education || "",
      "Experience": row.Experience || "",
      "Related Experience": row.Related_experience || "",
      "Job Description": row.Job_description || "",
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

    const screenName = "Total Candidates Applied";
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Total Candidates Applied");

    XLSX.writeFile(workbook, "Total_Candidates_Applied.xlsx");
  };

  return (
    <div class="container-fluid Topnav-screen ">
      {loading && <LoadingScreen />}
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="shadow-lg p-1 bg-light rounded main-header-box">
        <div className="header-flex">
          <h1 className="page-title">Total Candidates Applied</h1>

          <div className="action-wrapper desktop-actions">
            {["all permission", "view"].some((p) => totalCandidatesAppliPermissions.includes(p)) && (
              <div className="action-icon print" onClick={generateReport}>
                <span className="tooltip">Print</span>
                <i className="fa-solid fa-print"></i>
              </div>
            )}
            {["all permission", "PDF"].some((p) => totalCandidatesAppliPermissions.includes(p)) && (
              <div className="action-icon print" onClick={exportToPDF}>
                <span className="tooltip">Pdf</span>
                <i className="fa-solid fa-file-pdf"></i>
              </div>
            )}
            {["all permission", "Excel"].some((p) => totalCandidatesAppliPermissions.includes(p)) && (
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
              {["all permission", "view"].some((p) => totalCandidatesAppliPermissions.includes(p)) && (
                <li>
                  <button className="dropdown-item" onClick={generateReport}>
                    <i className="fa-solid fa-print text-dark fs-4"></i>
                  </button>
                </li>
              )}
              {["all permission", "Pdf"].some((p) => totalCandidatesAppliPermissions.includes(p)) && (
                <li>
                  <button className="dropdown-item" onClick={exportToPDF}>
                    <i className="fa-solid fa-file-pdf text-dark fs-4"></i>
                  </button>
                </li>
              )}
              {["all permission", "Excel"].some((p) => totalCandidatesAppliPermissions.includes(p)) && (
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
                title="Please Enter the From Date"
                autoComplete="off"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
              <label for="sname" className="exp-form-labels">
                From Date
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
                title="Please Enter the To Date"
                autoComplete="off"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
              <label for="sname" className="exp-form-labels">
                To Date
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedcandidate_name ? "has-value" : ""} 
              ${isselectedscheduleid ? "is-focused" : ""}`}
              title="Please Select the Candidate Name"
            >
              <Select
                id="department"
                placeholder=" "
                onFocus={() => setIsscheduleid(true)}
                onBlur={() => setIsscheduleid(false)}
                classNamePrefix="react-select"
                isClearable
                type="text"
                value={selectedcandidate_name}
                onChange={handlescandidate_name}
                options={filteredOptioncandidate_name}
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
                title="Please Enter the Email"
                autoComplete="off"
                value={emailSC}
                maxLength={30}
                onChange={(e) => setemailSC(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <label for="sname" className="exp-form-labels">
                Email{" "}
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
                autoComplete="off"
                title="Please Enter the Phone Number"
                value={phoneSC}
                maxLength={13}
                inputMode="numeric"
                pattern="[0-9]*"
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setphoneSC(value);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <label for="sname" className="exp-form-labels">
                Phone
              </label>
            </div>
          </div>
          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedJobIDSC ? "has-value" : ""} 
              ${isselectedJobIDSC ? "is-focused" : ""}`}
              title="Please Select the Applied Job ID"
            >
              <Select
                id="department"
                placeholder=" "
                onFocus={() => setisselectedJobIDSC(true)}
                onBlur={() => setisselectedJobIDSC(false)}
                classNamePrefix="react-select"
                isClearable
                type="text"
                value={selectedJobIDSC}
                onChange={handleJobIDSC}
                options={filteredOptionJobID}
              />
              <label htmlFor="selecteddpt" className={`floating-label`}>
                Applied Job ID
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                className="exp-input-field form-control"
                type="text"
                placeholder=""
                required
                title="Please Enter the Education"
                autoComplete="off"
                value={EducationSC}
                maxLength={100}
                onChange={(e) => {
                  setEducationSC(e.target.value);
                }}
              />
              <label htmlFor="fdate" className={`exp-form-labels`}>
                Education
              </label>
            </div>
          </div>
          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                className="exp-input-field form-control"
                type="text"
                placeholder=""
                required
                title="Please Enter the Experience"
                autoComplete="off"
                value={ExperienceSC}
                maxLength={100}
                onChange={(e) => {
                  setExperienceSC(e.target.value);
                }}
              />
              <label htmlFor="fdate" className={`exp-form-labels`}>
                Experience
              </label>
            </div>
          </div>
          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                className="exp-input-field form-control"
                type="text"
                placeholder=""
                required
                title="Please Enter the Related Experience"
                autoComplete="off"
                value={Related_experienceSC}
                maxLength={100}
                onChange={(e) => {
                  setRelated_experienceSC(e.target.value);
                }}
              />
              <label htmlFor="fdate" className={`exp-form-labels`}>
                Related Experience
              </label>
            </div>
          </div>
          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                className="exp-input-field form-control"
                type="text"
                placeholder=""
                required
                title="Please Enter the Job Description"
                autoComplete="off"
                value={JobDescriptionSC}
                maxLength={100}
                onChange={(e) => {
                  setJobDescriptionSC(e.target.value);
                }}
              />
              <label htmlFor="fdate" className={`exp-form-labels`}>
                Job Description
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

          {isModalOpen && (
            <div
              className="modal fade show d-block"
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <div className="shadow-lg p-1 bg-light main-header-box">
                    <div className="header-flex">
                      <h1 className="custom-modal-title">Candidate CV</h1>

                      <div className="action-wrapper">
                        <div
                          className="action-icon delete"
                          onClick={() => {
                            URL.revokeObjectURL(currentPdfUrl);
                            setIsModalOpen(false);
                          }}
                        >
                          <span className="tooltip">Close</span>
                          <i className="fa-solid fa-xmark"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-body" style={{ height: "500px" }}>
                    <iframe
                      src={currentPdfUrl}
                      title="CV Preview"
                      width="100%"
                      height="100%"
                      style={{ border: "none" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        className="shadow-lg pt-3 pb-3 bg-light rounded mt-2 container-form-box"
        style={{ width: "100%" }}
      >
        <div className="ag-theme-alpine" style={{ height: 455, width: "100%" }}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            rowSelection="multiple"
            // onRowClicked={(event) => handleRowSelection(event.data)}
            pagination={true}
            paginationAutoPageSize={true}
            onGridReady={onGridReady}
            onFirstDataRendered={onFirstDataRendered}
          />
        </div>
      </div>
    </div>
  );
}
export default TotalCandidatesApplied;