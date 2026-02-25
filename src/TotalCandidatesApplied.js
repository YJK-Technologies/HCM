import { useState, useEffect, useRef } from "react";
import "./input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import Select from "react-select";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
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
  const gridApiRef = useRef(null);

  //purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem("permissions")) || {};
  const companyPermissions = permissions
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
          Canditate_CV: matchedItem.Canditate_CV,
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
          applied_job_id: "",
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

  const columnDefs = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      headerName: "Candidate Id",
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

    const logoUrl = "/favicon.ico"; // <-- put your logo inside public folder

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
            <h2>Total Candidates Applied</h2>
          </div>
        </div>
  
        <div class="sub-info">
          <div>Total Records: ${selectedRows.length}</div>
          <div>Printed Date: ${new Date().toLocaleDateString()}</div>
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
    `);

    selectedRows.forEach((row) => {
      reportWindow.document.write(`
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
        "Candidate Id",
        "Candidate Name",
        "Email",
        "Phone",
        "Applied Job ID",
        "Education",
        "Experience",
        "Related Experience",
        "Job Description",
      ],
    ];

    // ✅ Table body
    const body = dataSource.map((row) => [
      row.candidate_id || "",
      row.candidate_name || "",
      row.email || "",
      row.phone || "",
      row.applied_job_id || "",
      row.Education || "",
      row.Experience || "",
      row.Related_experience || "",
      row.Job_description || "",
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
    doc.text("Total Candidates Applied", pageWidth / 2, 40, {
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

    doc.save("Total_Candidates_Applied.pdf");
  };

  const transformRowData = (data) => {
    return data.map((row) => ({
      "Candidate Id": row.candidate_id || "",
      "Candidate Name": row.candidate_name || "",
      Email: row.email || "",
      Phone: row.phone || "",
      "Applied Job ID": row.applied_job_id || "",
      Education: row.Education || "",
      Experience: row.Experience || "",
      "Related Experience": row.Related_experience || "",
      "Job Description": row.Job_description || "",
    }));
  };

  const handleExportToExcel = () => {
    if (!rowData || rowData.length === 0) {
      toast.warning("There is no data to export.");
      return;
    }

    const screenName = "Total Candidates Applied";
    const company = sessionStorage.getItem("selectedCompanyName") || "";

    /* ================= READ THEME COLORS ================= */

    const titleBg = getCSSVariable("--but").replace("#", "");
    const tableHeaderBg = getCSSVariable("--ag-header").replace("#", "");
    const fontColor = getCSSVariable("--font-color").replace("#", "");
    const altRowBg = getCSSVariable("--ag-row").replace("#", "");

    /* ================= HEADER DATA ================= */

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

    for (let c = 0; c < totalColumns; c++) {
      const cell = worksheet[
        XLSX.utils.encode_cell({ r: headerRowIndex, c })
      ];
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

    const range = XLSX.utils.decode_range(worksheet["!ref"]);

    for (let r = headerRowIndex + 1; r <= range.e.r; r++) {
      for (let c = 0; c < totalColumns; c++) {
        const cell = worksheet[
          XLSX.utils.encode_cell({ r, c })
        ];
        if (!cell) continue;

        cell.s = {
          font: { color: { rgb: fontColor } },
          fill:
            r % 2 === 0
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
      "Total Candidates"
    );

    XLSX.writeFile(workbook, "Total_Candidates_Applied.xlsx");
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
          <h1 className="page-title">Total Candidates Applied</h1>

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
              ${selectedcandidate_name ? "has-value" : ""} 
              ${isselectedscheduleid ? "is-focused" : ""}`}
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
                title="Please Enter the Eligibility Salary Days"
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
                title="Please Enter the Applied Job ID"
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
                title="Please Enter the Applied Job ID"
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
                title="Please Enter the Applied Job ID"
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
                title="Please Enter the Applied Job ID"
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
          />
        </div>
      </div>
    </div>
  );
}
export default TotalCandidatesApplied;