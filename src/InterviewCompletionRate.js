import React, { useState, useEffect } from "react";
import "./input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { AgGridReact } from "ag-grid-react";
import { useNavigate } from "react-router-dom";
import TabButtons from "./ESSComponents/Tabs";
import { showConfirmationToast } from "./ToastConfirmation";
import LoadingScreen from "./Loading";
import Select from "react-select";
import { useRef } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const config = require("./Apiconfig");

const getFinancialYearDates = () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // getMonth() is 0-based
  console.log(currentMonth);
  let startYear, endYear;

  if (currentMonth < 4) {
    startYear = currentYear - 1;
    endYear = currentYear;
  } else {
    startYear = currentYear;
    endYear = currentYear + 1;
  }

  const FirstDate = `${startYear}-04-01`;
  const LastDate = `${endYear}-03-31`;

  return { FirstDate, LastDate };
};

const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0]; // YYYY-MM-DD
};
function InterviewCompletionRate({}) {
  const [rowData, setRowData] = useState([]);
  const [commentsSC, setcommentsSC] = useState("");
  const [hasValueChanged, setHasValueChanged] = useState(false);
  const [selectedscheduleidSC, setselectedscheduleidSC] = useState("");
  const [scheduleidSC, setscheduleidSC] = useState("");
  const [isselectedscheduleidSC, setIsscheduleidSC] = useState("");
  const [isselectedfeedback_id, setIsfeedback_id] = useState("");
  const [scheduleidDrop, setscheduleidDrop] = useState([]);
  const [feedback_idDrop, setfeedback_idDrop] = useState([]);
  const [RecommendationDrop, setRecommendationDrop] = useState([]);
  const [recommendationDrop, setRecommendationdrop] = useState([]);

  const [loading, setLoading] = useState(false);
  const [selectedfeedback_id, setselectedfeedback_id] = useState("");
  const [feedback_id, setfeedback_id] = useState("");
  const [selectedEmployeeIDSC, setselectedEmployeeIDSC] = useState("");
  const [EmployeeIDSC, setEmployeeIDSC] = useState("");
  const [EmployeeIDdrop, setEmployeeIDdrop] = useState([]);
  const [isSelectEmployeeIDSC, setisSelectEmployeeIDSC] = useState(false);
  const [selectedRecommendationSC, setselectedRecommendationSC] = useState("");
  const [RecommendationSC, setRecommendationSC] = useState("");
  const [isSelectRecommendationSC, setisSelectRecommendationSC] =
    useState(false);
  const [employeeDrop, setEmployeeDrop] = useState([]);
  const gridRef = useRef(null);

  const formatDate = (isoDateString) => {
    if (!isoDateString) return ""; // ✅ null / undefined / empty handle

    const date = new Date(isoDateString);

    if (isNaN(date.getTime())) return ""; // ✅ Invalid date handle

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  //purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem("permissions")) || {};
  const companyPermissions = permissions
    .filter((permission) => permission.screen_type === "Company")
    .map((permission) => permission.permission_type.toLowerCase());

  const handlefeedback_id = (selectedDPT) => {
    setselectedfeedback_id(selectedDPT);
    setfeedback_id(selectedDPT ? selectedDPT.value : "");
  };
  const filteredOptionfeedback_id = feedback_idDrop.map((option) => ({
    value: option.feedback_id,
    label: option.feedback_id,
  }));

  const handleRecommendationSC = (selectedDPT) => {
    setselectedRecommendationSC(selectedDPT);
    setRecommendationSC(selectedDPT ? selectedDPT.value : "");
  };
  const filteredOptionRecommendation = RecommendationDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleEmployeeIDSC = (selectedDPT) => {
    setselectedEmployeeIDSC(selectedDPT);
    setEmployeeIDSC(selectedDPT ? selectedDPT.value : "");
  };

  const filteredOptionEmployeeID = EmployeeIDdrop.map((option) => ({
    value: option.EmployeeId,
    label: `${option.EmployeeId} - ${option.First_Name}`,
  }));

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
        const response = await fetch(`${config.apiBaseUrl}/Employee_ID`, {
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
        setEmployeeIDdrop(val);
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
        const response = await fetch(`${config.apiBaseUrl}/Recommendation`, {
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
        setRecommendationDrop(val);
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

    fetch(`${config.apiBaseUrl}/Recommendation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((response) => response.json())
      .then((data) => {
        const recommendation = data.map(
          (option) => option.attributedetails_name,
        );
        setRecommendationdrop(recommendation);
      })
      .catch((error) => console.error("Error fetching data:", error));
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
        const response = await fetch(`${config.apiBaseUrl}/Feedback_ID`, {
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
        setfeedback_idDrop(val);
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

    fetch(`${config.apiBaseUrl}/Employee_ID`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((response) => response.json())
      .then((data) => {
        const employee = data.map((option) => option.EmployeeId);
        setEmployeeDrop(employee);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleKeyDownStatus = async (e) => {
    if (e.key === "Enter" && hasValueChanged) {
      await handleSearch();
      setHasValueChanged(false);
    }
  };

  const columnDefs = [
    {
      headerName: "Schedule ID",
      field: "schedule_id",
      editable: false,
    },
    {
      headerName: "Employee ID",
      field: "employee_id",
      editable: false,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: employeeDrop,
      },
    },
    {
      headerName: "Rating",
      field: "rating",
      editable: false,
    },
    {
      headerName: "Comments",
      field: "comments",
      editable: false,
    },
    {
      headerName: "Submitted On",
      field: "submitted_on",
      editable: false,
      valueFormatter: (params) => {
        if (!params.value) return ""; // ✅ If null → empty
        return formatDate(params.value);
      },
    },
    {
      headerName: "Recommendation",
      field: "Recommendation",
      editable: false,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: recommendationDrop,
      },
      cellRenderer: (params) => {
        if (params.data.totalRow) {
          return `${params.data.totalText}`;
        }
        return params.value;
      },
    },
    {
      headerName: "Keyfield",
      field: "keyfield",
      editable: false,
      hide: true,
      // hide: true
    },
  ];

  const gridOptions = {
    pagination: true,
    paginationPageSize: 10,
  };

  //   const handleSearch = async () => {
  //     setLoading(true);
  //     try {
  //       const body = {
  //         schedule_id: scheduleidSC,
  //         feedback_id: feedback_id,
  //         employee_id: EmployeeIDSC,
  //         Recommendation: RecommendationSC,
  //         rating: Number.rating,
  //         comments: commentsSC,
  //         company_code: sessionStorage.getItem("selectedCompanyCode"),
  //       };

  //       const response = await fetch(`${config.apiBaseUrl}/InterviewCompletionRateSC`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(body),
  //       });

  //       if (response.ok) {
  //         const fetchedData = await response.json();
  //         const newRows = fetchedData.map((matchedItem) => ({
  //           schedule_id: matchedItem.schedule_id,
  //           employee_id: matchedItem.employee_id,
  //           rating: matchedItem.rating,
  //           comments: matchedItem.comments,
  //           Recommendation: matchedItem.Recommendation,
  //           submitted_on: matchedItem.submitted_on,
  //           keyfield: matchedItem.keyfield,
  //         }));
  //         setRowData(newRows);
  //       } else if (response.status === 404) {
  //         console.log("Data Not found");
  //         toast.warning("Data Not found");
  //         setRowData([]);
  //       } else {
  //         const errorResponse = await response.json();
  //         toast.warning(errorResponse.message || "Failed to insert sales data");
  //         console.error(errorResponse.details || errorResponse.message);
  //         setRowData([]);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching search data:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  const handleSearch = async () => {
    setLoading(true);
    try {
      const body = {
        schedule_id: scheduleidSC || 0,
        feedback_id: feedback_id || 0,
        employee_id: EmployeeIDSC || "",
        Recommendation: RecommendationSC || "",
        rating: 0,
        comments: commentsSC || "",
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      };

      const response = await fetch(
        `${config.apiBaseUrl}/InterviewCompletionRateSC`,
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

        const newRows = fetchedData.map((item) => ({
          schedule_id: item.schedule_id,
          employee_id: item.employee_id,
          rating: item.rating,
          comments: item.comments,
          Recommendation: item.Recommendation,
          submitted_on: item.submitted_on,
          keyfield: item.keyfield,
        }));

        // ✅ Count records
        const totalCount = newRows.length;

        // ✅ Decide label dynamically based on selected combo
        let totalLabel = "Total Candidate";

        if (RecommendationSC) {
          totalLabel = `Total ${RecommendationSC} Candidate`;
        }

        // ✅ Push Total Row
        newRows.push({
          schedule_id: null,
          employee_id: "",
          rating: null,
          comments: "",
          Recommendation: "",
          submitted_on: null,
          keyfield: "",
          totalRow: true,
          totalText: `${totalLabel} : ${totalCount}`,
        });

        setRowData(newRows);
      } else if (response.status === 404) {
        toast.warning("Data Not found");
        setRowData([]);
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to fetch data");
        setRowData([]);
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
    } finally {
      setLoading(false);
    }
  };

  const reloadGridData = () => {
    setRowData([]);
  };

const generateReport = () => {
  const api = gridRef.current?.api;
  if (!api) return;

  const selectedRows = api
    .getSelectedRows()
    .filter((row) => row.schedule_id !== null);

  if (selectedRows.length === 0) {
    toast.warning("Please select at least one row to print");
    return;
  }

  // ✅ Get Selected Recommendation
  const selectedRecommendation = RecommendationSC || "";

  // ✅ Dynamic Title Text
  let recommendationText = "Candidates";

  if (selectedRecommendation.toLowerCase() === "select") {
    recommendationText = "Selected Candidate";
  } else if (selectedRecommendation.toLowerCase() === "hold") {
    recommendationText = "Hold Candidate";
  } else if (selectedRecommendation.toLowerCase() === "next round") {
    recommendationText = "Next Round Candidate";
  } else if (selectedRecommendation.toLowerCase() === "reject") {
    recommendationText = "Reject Candidate";
  }

  const reportWindow = window.open("", "_blank");

  reportWindow.document.write(`
  <html>
  <head>
    <title>Interview Completion Report</title>
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

      .title-section {
        flex: 1;
        text-align: center;
      }

      .title-section h2 {
        margin: 0;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        margin-top: 15px;
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
    <div class="title-section">
      <h2>Interview Completion Report</h2>
    </div>
  </div>

  <div style="margin-top:15px;">
    <strong>Total ${recommendationText} : ${selectedRows.length}</strong>
    <span style="float:right;">
      Printed Date: ${new Date().toLocaleDateString()}
    </span>
  </div>

  <table>
    <thead>
      <tr>
        <th>Schedule ID</th>
        <th>Employee ID</th>
        <th>Rating</th>
        <th>Comments</th>
        <th>Submitted On</th>
        <th>Recommendation</th>
      </tr>
    </thead>
    <tbody>
  `);

  selectedRows.forEach((row) => {
    reportWindow.document.write(`
      <tr>
        <td>${row.schedule_id || ""}</td>
        <td>${row.employee_id || ""}</td>
        <td>${row.rating || ""}</td>
        <td>${row.comments || ""}</td>
        <td>${row.submitted_on ? formatDate(row.submitted_on) : ""}</td>
        <td>${row.Recommendation || ""}</td>
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


  const exportToPDF = () => {
    const api = gridRef.current?.api;
    if (!api) return;

    const selectedRows = api
      .getSelectedRows()
      .filter((row) => row.schedule_id !== null);

    if (selectedRows.length === 0) {
      toast.warning("Please select at least one row to export");
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text("Interview Completion Report", 14, 15);

    doc.setFontSize(11);
    doc.text(`Total Records: ${selectedRows.length}`, 14, 22);

    const tableColumn = [
      "Schedule ID",
      "Employee ID",
      "Rating",
      "Comments",
      "Submitted On",
      "Recommendation",
    ];

    const tableRows = selectedRows.map((row) => [
      row.schedule_id || "",
      row.employee_id || "",
      row.rating || "",
      row.comments || "",
      row.submitted_on ? formatDate(row.submitted_on) : "",
      row.Recommendation || "",
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 28,
    });

    doc.save("Interview_Completion_Report.pdf");
  };

  const transformRowData = (data) => {
    return data.map((row) => ({
      "Schedule ID": row.schedule_id || "",
      "Employee ID": row.employee_id || "",
      Rating: row.rating || "",
      Comments: row.comments || "",
      "Submitted On": row.submitted_on ? formatDate(row.submitted_on) : "",
      Recommendation: row.Recommendation || "",
    }));
  };

  const handleExportToExcel = () => {
    const api = gridRef.current?.api;
    if (!api) return;

    const selectedRows = api
      .getSelectedRows()
      .filter((row) => row.schedule_id !== null);

    if (selectedRows.length === 0) {
      toast.warning("Please select at least one row to export.");
      return;
    }

    const headerData = [
      ["Interview Completion Report"],
      [`Total Records: ${selectedRows.length}`],
    ];

    const transformedData = transformRowData(selectedRows);

    const worksheet = XLSX.utils.aoa_to_sheet(headerData);

    XLSX.utils.sheet_add_json(worksheet, transformedData, {
      origin: "A5",
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Interview Completion Report",
    );

    XLSX.writeFile(workbook, "Interview_Completion_Report.xlsx");
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
          <h1 className="page-title">Interview Feedback</h1>
          <div className="action-wrapper desktop-actions">
            {["all permission", "view"].some((p) =>
              companyPermissions.includes(p),
            ) && (
              <div className="action-icon print" onClick={generateReport}>
                <span className="tooltip">Print</span>
                <i className="fa-solid fa-print"></i>
              </div>
            )}
            {["all permission", "PDF"].some((p) =>
              companyPermissions.includes(p),
            ) && (
              <div className="action-icon print" onClick={exportToPDF}>
                <span className="tooltip">Pdf</span>
                <i className="fa-solid fa-file-pdf"></i>
              </div>
            )}
            {["all permission", "Excel"].some((p) =>
              companyPermissions.includes(p),
            ) && (
              <div className="action-icon print" onClick={handleExportToExcel}>
                <span className="tooltip">Excel</span>
                <i className="fa-solid fa-file-excel"></i>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="shadow-lg p-3 bg-light rounded mt-2 container-form-box">
        <div className="row g-3">
          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedfeedback_id ? "has-value" : ""} 
              ${isselectedfeedback_id ? "is-focused" : ""}`}
            >
              <Select
                id="department"
                placeholder=" "
                onFocus={() => setIsfeedback_id(true)}
                onBlur={() => setIsfeedback_id(false)}
                classNamePrefix="react-select"
                isClearable
                type="text"
                value={selectedfeedback_id}
                onChange={handlefeedback_id}
                options={filteredOptionfeedback_id}
              />
              <label htmlFor="selecteddpt" className={`floating-label`}>
                Feedback ID
              </label>
            </div>
          </div>

          <div className="col-md-2">
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
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedEmployeeIDSC ? "has-value" : ""} 
              ${isSelectEmployeeIDSC ? "is-focused" : ""}`}
            >
              <Select
                id="department"
                placeholder=" "
                onFocus={() => setisSelectEmployeeIDSC(true)}
                onBlur={() => setisSelectEmployeeIDSC(false)}
                classNamePrefix="react-select"
                isClearable
                type="text"
                value={selectedEmployeeIDSC}
                onChange={handleEmployeeIDSC}
                options={filteredOptionEmployeeID}
              />
              <label htmlFor="selecteddpt" className={`floating-label`}>
                Employee ID
              </label>
            </div>
          </div>
          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedRecommendationSC ? "has-value" : ""} 
              ${isSelectRecommendationSC ? "is-focused" : ""}`}
            >
              <Select
                id="department"
                placeholder=" "
                onFocus={() => setisSelectRecommendationSC(true)}
                onBlur={() => setisSelectRecommendationSC(false)}
                classNamePrefix="react-select"
                isClearable
                type="text"
                value={selectedRecommendationSC}
                onChange={handleRecommendationSC}
                options={filteredOptionRecommendation}
              />
              <label htmlFor="selecteddpt" className={`floating-label`}>
                Recommendation
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
                value={commentsSC}
                onChange={(e) => setcommentsSC(e.target.value)}
              />
              <label for="sname" className="exp-form-labels">
                Comments
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
            ref={gridRef}
            rowSelection="multiple"
            columnDefs={columnDefs}
            rowData={rowData}
            pagination={true}
            paginationAutoPageSize={true}
            gridOptions={gridOptions}
          />
        </div>
      </div>
    </div>
  );
}
export default InterviewCompletionRate;