import React, { useState, useEffect } from "react";
import "./input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { AgGridReact } from "ag-grid-react";
import LoadingScreen from "./Loading";
import { useRef } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Select from "react-select";

const config = require("./Apiconfig");

function TotalInterviewsScheduled({}) {
  const [rowData, setRowData] = useState([]);
  const [locationSC, setlocationSC] = useState("");
  const [department_idSC, setdepartment_idSC] = useState("");
  const [selectedStatusSC, setSelectedStatusSC] = useState(null);
  const [statusSC, setstatusSC] = useState("");
  const [isSelectFocusedSC, setIsSelectFocusedSC] = useState(false);
  const [PanelDrop, setPanelDrop] = useState([]);
  const [isSelectPanelSC, setisSelectPanelSC] = useState(false);
  const [selectedPanelIDSC, setselectedPanelIDSC] = useState("");
  const [PanelIDSC, setPanelIDSC] = useState("");
  const [selectedscheduleidSC, setselectedscheduleidSC] = useState("");
  const [scheduleidSC, setscheduleidSC] = useState("");
  const [isselectedscheduleidSC, setIsscheduleidSC] = useState("");
  const [scheduleidDrop, setscheduleidDrop] = useState([]);
  const [isselectedcanditateidSC, setIscanditateidSC] = useState("");
  const [canditatenameDrop, setcanditatenameDrop] = useState([]);
  const [selectedcandidate_nameSC, setSelectedcandidatenameSC] = useState("");
  const [canditatenameSC, set_candidatenameSC] = useState("");
  const [InterviewModedrop, setInterviewModeDrop] = useState([]);
  const [selectedInterviewModeSC, setselectedInterviewModeSC] = useState("");
  const [InterviewModeSC, setInterviewModeSC] = useState("");
  const [isSelectInterviewModeSC, setisSelectInterviewModeSC] = useState(false);
  const [statusgriddrop, setStatusGriddrop] = useState([]);
  const [Paneldrop, setPaneldrop] = useState([]);
  const [candidatedrop, setcandidatedrop] = useState([]);
  const [interviewmodeDrop, setInterviewmodeDrop] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusdrop, setStatusdrop] = useState([]);
  const gridRef = useRef();
  const [gridApi, setGridApi] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

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
    .filter((permission) => permission.screen_type === "Company")
    .map((permission) => permission.permission_type.toLowerCase());

  const handleInterviewModeSC = (selectedDPT) => {
    setselectedInterviewModeSC(selectedDPT);
    setInterviewModeSC(selectedDPT ? selectedDPT.value : "");
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

  const handlescandidate_nameSC = (selectedDPT) => {
    setSelectedcandidatenameSC(selectedDPT);
    set_candidatenameSC(selectedDPT ? selectedDPT.value : "");
  };

  const filteredOptioncandidate_name = canditatenameDrop.map((option) => ({
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

  const handlePanelIDSC = (selectedDPT) => {
    setselectedPanelIDSC(selectedDPT);
    setPanelIDSC(selectedDPT ? selectedDPT.value : "");
  };

  const handleChangeStatusSC = (selectedStatus) => {
    setSelectedStatusSC(selectedStatus);
    setstatusSC(selectedStatus ? selectedStatus.value : "");
  };

  const filteredOptionPanelID = PanelDrop.map((option) => ({
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
      headerName: "Schedule ID",
      field: "schedule_id",
      editable: false,
    },
    {
      headerName: "Candidate ID",
      field: "candidate_id",
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: candidatedrop.map((d) => d.value),
      },
      valueFormatter: (params) => {
        const dept = candidatedrop.find((d) => d.value === params.value);
        return dept ? dept.label : params.value;
      },
      editable: true,
    },
    {
      headerName: "Panel ID",
      field: "panel_id",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: Paneldrop.map((d) => d.value),
      },
      valueFormatter: (params) => {
        const dept = Paneldrop.find((d) => d.value === params.value);
        return dept ? dept.label : params.value;
      },
    },
    {
      headerName: "Schedule Date",
      field: "scheduled_datetime",
      editable: true,
      valueFormatter: (params) => formatDate(params.value),
      filterParams: {
        comparator: (filterLocalDateAtMidnight, cellValue) => {
          const cellDate = new Date(cellValue.split("/").join("-"));
          if (cellDate < filterLocalDateAtMidnight) {
            return -1;
          } else if (cellDate > filterLocalDateAtMidnight) {
            return 1;
          }
          return 0;
        },
      },
    },
    {
      headerName: "Time Zone",
      field: "timezone",
      editable: true,
    },
    {
      headerName: "Location",
      field: "location",
      editable: true,
    },
    {
      headerName: "Interview Mode",
      field: "Interview_Mode",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: interviewmodeDrop,
      },
    },
    {
      headerName: "Meeting Link",
      field: "meeting_link",
      editable: true,
    },
    {
      headerName: "Status",
      field: "Status",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: statusgriddrop,
      },
      editable: true,
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
  //         candidate_id: canditatenameSC,
  //         schedule_id: scheduleidSC,
  //         panel_id: PanelIDSC,
  //         department_id: department_idSC,
  //         Interview_Mode: InterviewModeSC,
  //         Status: statusSC,
  //         company_code: sessionStorage.getItem("selectedCompanyCode"),
  //       };

  //       const response = await fetch(`${config.apiBaseUrl}/TotalInterviewSchedule`, {
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
  //           candidate_id: matchedItem.candidate_id,
  //           panel_id: matchedItem.panel_id,
  //           scheduled_datetime: matchedItem.scheduled_datetime,
  //           timezone: matchedItem.timezone,
  //           location: matchedItem.location,
  //           timezone: matchedItem.timezone,
  //           meeting_link: matchedItem.meeting_link,
  //           Status: matchedItem.Status,
  //           keyfield: matchedItem.keyfield,
  //           Interview_Mode: matchedItem.Interview_Mode,
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
        candidate_id: canditatenameSC,
        schedule_id: scheduleidSC,
        panel_id: PanelIDSC,
        department_id: department_idSC,
        Interview_Mode: InterviewModeSC,
        Status: statusSC,
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      };

      const response = await fetch(
        `${config.apiBaseUrl}/TotalInterviewSchedule`,
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

const exportToPDF = () => {
  const api = gridRef.current?.api;

  if (!api) {
    toast.warning("Grid not ready");
    return;
  }

  const selectedRows = api
    .getSelectedRows()
    .filter((row) => row.schedule_id !== null);

  if (selectedRows.length === 0) {
    toast.warning("Please select at least one row to export");
    return;
  }

  const doc = new jsPDF();

  doc.setFontSize(14);
  doc.text("Total Interviews Scheduled", 14, 15);

  doc.setFontSize(11);
  doc.text(`Total Records: ${selectedRows.length}`, 14, 22);

  const tableColumn = [
    "Schedule ID",
    "Candidate ID",
    "Panel ID",
    "Schedule Date",
    "Time Zone",
    "Location",
    "Interview Mode",
    "Meeting Link",
    "Status",
  ];

  const tableRows = selectedRows.map((row) => [
    row.schedule_id || "",
    row.candidate_id || "",
    row.panel_id || "",
    row.scheduled_datetime ? formatDate(row.scheduled_datetime) : "",
    row.timezone || "",
    row.location || "",
    row.Interview_Mode || "",
    row.meeting_link || "",
    row.Status || "",
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 28,
  });

  doc.save("Total_Interviews_Scheduled.pdf");
};

  const transformInterviewRowData = (data) => {
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
  const api = gridRef.current?.api;

  if (!api) {
    toast.warning("Grid not ready");
    return;
  }

  const selectedRows = api
    .getSelectedRows()
    .filter((row) => row.schedule_id !== null);

  if (selectedRows.length === 0) {
    toast.warning("Please select at least one row to export.");
    return;
  }

  // Title row
  const headerData = [
    ["Total Interviews Scheduled"],
    [`Total Records: ${selectedRows.length}`],
  ];

  const transformedData = transformInterviewRowData(selectedRows);

  const worksheet = XLSX.utils.aoa_to_sheet(headerData);

  // Start table from row 5
  XLSX.utils.sheet_add_json(worksheet, transformedData, {
    origin: "A5",
  });

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Total Interviews Scheduled"
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
          <h1 className="page-title">Interview Completion Rate</h1>
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
              ${selectedcandidate_nameSC ? "has-value" : ""} 
              ${isselectedcanditateidSC ? "is-focused" : ""}`}
            >
              <Select
                id="department"
                placeholder=" "
                onFocus={() => setIscanditateidSC(true)}
                onBlur={() => setIscanditateidSC(false)}
                classNamePrefix="react-select"
                isClearable
                type="text"
                value={selectedcandidate_nameSC}
                onChange={handlescandidate_nameSC}
                options={filteredOptioncandidate_name}
              />
              <label htmlFor="selecteddpt" className={`floating-label`}>
                Candiate ID
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedPanelIDSC ? "has-value" : ""} 
              ${isSelectPanelSC ? "is-focused" : ""}`}
            >
              <Select
                id="department"
                placeholder=" "
                onFocus={() => setisSelectPanelSC(true)}
                onBlur={() => setisSelectPanelSC(false)}
                classNamePrefix="react-select"
                isClearable
                type="text"
                value={selectedPanelIDSC}
                onChange={handlePanelIDSC}
                options={filteredOptionPanelID}
              />
              <label htmlFor="selecteddpt" className={`floating-label`}>
                Panel ID
              </label>
            </div>
          </div>
          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedInterviewModeSC ? "has-value" : ""} 
              ${isSelectInterviewModeSC ? "is-focused" : ""}`}
            >
              <Select
                id="department"
                placeholder=" "
                onFocus={() => setisSelectInterviewModeSC(true)}
                onBlur={() => setisSelectInterviewModeSC(false)}
                classNamePrefix="react-select"
                isClearable
                type="text"
                value={selectedInterviewModeSC}
                onChange={handleInterviewModeSC}
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
                value={locationSC}
                onChange={(e) => setlocationSC(e.target.value)}
              />
              <label for="sname" className="exp-form-labels">
                Location
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedStatusSC ? "has-value" : ""} 
              ${isSelectFocusedSC ? "is-focused" : ""}`}
            >
              <Select
                id="status"
                isClearable
                value={selectedStatusSC}
                onChange={handleChangeStatusSC}
                options={filteredOptionStatus}
                placeholder=""
                classNamePrefix="react-select"
                onFocus={() => setIsSelectFocusedSC(true)}
                onBlur={() => setIsSelectFocusedSC(false)}
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
