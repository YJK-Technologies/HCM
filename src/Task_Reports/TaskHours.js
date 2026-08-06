import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Select from 'react-select';
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx-js-style";
import LoadingScreen from '../Loading';
const config = require('../Apiconfig');


const MyAgGridComponent = () => {
  const today = new Date().toISOString().split("T")[0];
  const [rowDataEmployee, setRowDataEmployee] = useState([]);
  const [rowDataTask, setRowDataTask] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [user, setUser] = useState("");
  const [Start_date, setStart_date] = useState(today);
  const [End_date, setEnd_date] = useState(today);
  const [userDrop, setUserDrop] = useState([]);
  const [Status, setstatus] = useState("");
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [statusdrop, setStatusdrop] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSelectUser, setIsSelectUser] = useState(false);
  const [isSelectStatus, setIsSelectStatus] = useState(false);


  const columnEmployee = [
    { headerName: 'Date', field: 'work_date', sort: 'asc', width: '110' },
    { headerName: 'Employee ID', field: 'user', editable: true, width: '170' },
    { headerName: 'Shift Code', field: 'Shift_Code', editable: true, width: '170' },
    // { headerName: 'Employee Name', field: 'user' },
    { headerName: 'Status', field: 'Status', width: '90' },
    { headerName: 'Check In', field: 'First_CheckIn', width: '100' },
    { headerName: 'Check Out', field: 'Last_CheckOut', width: '110' },
    { headerName: 'Total Login  Hours', field: 'Total_login_Hours', width: '150' },
    { headerName: 'Total Worked Hours', field: 'total_worked_hours', width: '150' },
    { headerName: 'Balance Hours', field: 'Balance_Hours', width: '150' },
  ];

  const onFirstDataRendered = (params) => {
  const allColumnIds = params.columnApi
    .getColumns()
    .map((col) => col.getId());

  params.columnApi.autoSizeColumns(allColumnIds);
};

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const columnTask = [
    {headerName: 'Task Date', field: 'TaskDate', width: '150'},
    { headerName: 'Project ID', field: 'ProjectID', width: '150' },
    { headerName: 'Task Master ID', field: 'TaskMasterID', width: '150' },
    { headerName: 'Task ID', field: 'DailyTaskID', width: '150' },
    { headerName: 'Daily Task Title', field: 'DailyTaskTiltle', width: '150' },
    { headerName: 'Description', field: 'TaskDescription', width: '170' },
    { headerName: 'User', field: 'userID', width: '150' },
    { headerName: 'Spend Hours', field: 'HourseTaken', width: '150' },
    { headerName: 'Task Hours Per Ticket', field: 'TotalHours_per_Ticket', width: '150' },
    { headerName: 'Status', field: 'TaskStauts' },
  ];

  const handleChangeUser = async (selectedUser) => {
    setSelectedUser(selectedUser);
    setUser(selectedUser ? selectedUser.value : '');
  };

  //  useEffect(() => {
  //     const company_code = sessionStorage.getItem('selectedCompanyCode');

  //     fetch(`${config.apiBaseUrl}/status`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ company_code })
  //     })
  //       .then((data) => data.json())
  //       .then((val) => setStatusdrop(val))
  //       .catch((error) => console.error('Error fetching data:', error));
  //   }, []);

  //    useEffect(() => {
  //       fetch(`${config.apiBaseUrl}/status`)
  //         .then((data) => data.json())
  //         .then((val) => {
  //           setStatusdrop(val);

  //           if (val.length > 0) {
  //             const firstOption = {
  //               value: val[0].attributedetails_name,
  //               label: val[0].attributedetails_name,
  //             };
  //             setSelectedStatus(firstOption);
  //             setstatus(firstOption.value);
  //           }
  //         });
  //     }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code }),
    })
      .then((response) => response.json())
      .then((val) => {
        setStatusdrop(val);

        if (val.length > 0) {
          const firstOption = {
            value: val[0].attributedetails_name,
            label: val[0].attributedetails_name,
          };
          setSelectedStatus(firstOption);
          setstatus(firstOption.value);
        }
      })
      .catch((error) => {
        console.error('Error fetching status data:', error);
      });
  }, []);



  const handleChangeStatus = (selectedStatus) => {
    setSelectedStatus(selectedStatus);
    setstatus(selectedStatus ? selectedStatus.value : '');
  };

  const filteredOptionStatus = statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));


  const handleChange = async () => {
    try {
      setLoading(true);
      const body = {
        start_date: Start_date, // Assuming startDate is already available in state
        end_date: End_date,   // Assuming endDate is already available in state
        userid: user,
        Status: Status,
        company_code: sessionStorage.getItem('selectedCompanyCode'),
        Location_Code: sessionStorage.getItem('selectedLocationCode'),
      };

      const response = await fetch(`${config.apiBaseUrl}/getTaskHourReport`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const formattedRows = await response.json();

        if (formattedRows.length > 0) {
          const formatted = formattedRows.map((task) => ({
            First_CheckIn: task.First_CheckIn,
            Last_CheckOut: task.Last_CheckOut,
            total_worked_hours: task.total_worked_hours,
            Total_login_Hours: task.Total_login_Hours,
            user: `${task.user} - ${task.user_name}`, // Combine user and user_name
            userid: task.TaskTitle,
            Shift_Code: task.Shift_Code,
            work_date: task.work_date,
            Status: task.Status,
            Balance_Hours: task.Balance_Hours,
          }));

          setRowDataEmployee(formatted);
        }
      } else if (response.status === 404) {
        console.log("User details not found");
        toast.warning("User details not found");
        setRowDataEmployee([]);
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to fetch user details");
        console.error(errorResponse.details || errorResponse.message);
        setRowDataEmployee([]);
      }
    } catch (error) {
      console.error("Error updating user details:", error);
    } finally {
      setLoading(false);
    }
  };

  const reloadGridData = () => {
    window.location.reload();
  };

  // const filteredOptionUser = Array.isArray(userDrop)
  //   ? userDrop.map((option) => ({
  //     value: option.user_code,
  //     label: `${option.user_code} - ${option.user_name}`,
  //   }))
  //   : [];

  const filteredOptionUser = Array.isArray(userDrop)
    ? userDrop.map((option) => ({
      value: option.user_code,
      label: `${option.user_code} - ${option.user_name}`,
    }))
    : [];

  useEffect(() => {
    const fetchUserCodes = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/usercode`);
        const data = await response.json();
        console.log("Fetched user codes:", data);

        if (response.ok) {
          const updatedData = [{ user_code: "ALL", user_name: "All" }, ...data];
          setUserDrop(updatedData);

          const defaultOption = {
            value: "ALL",
            label: "All"
          };
          setSelectedUser(defaultOption);
          setUser(defaultOption.value);
        } else {
          console.warn("No data found for user codes");
          setUserDrop([]);
        }
      } catch (error) {
        console.error("Error fetching user codes:", error);
      }
    };

    fetchUserCodes();
  }, []);

  // useEffect(() => {
  //   const fetchUserCodes = async () => {
  //     try {
  //       const response = await fetch(`${config.apiBaseUrl}/getTaskUserID`, {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({ company_code: sessionStorage.getItem('selectedCompanyCode') })
  //       });
  //       const data = await response.json();

  //       if (response.ok) {
  //         const updatedData = [{ user_code: "ALL", user_Name: "All" }, ...data];
  //         setUserDrop(updatedData);

  //         const defaultOption = {
  //           value: "ALL",
  //           label: "All"
  //         };
  //         setSelectedUser(defaultOption);
  //         setUser(defaultOption.value);
  //       } else {
  //         console.warn("No data found for user codes");
  //         setUserDrop([]);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching user codes:", error);
  //     }
  //   };

  //   fetchUserCodes();
  // }, []);

  // const handleCellClick = async (params) => {
  //   const taskDate = params.data.work_date;
  //   const userID = params.data.user.split(" - ")[0]; // Extract only the userID

  //   try {
  //     const requestBody = {
  //       start_date: taskDate,
  //       userid: userID, // Send only userID
  //       company_code: sessionStorage.getItem('selectedCompanyCode')
  //     };

  //     const response = await fetch(`${config.apiBaseUrl}/getTaskHourReportDetail`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(requestBody),
  //     });

  //     if (response.ok) {
  //       const projectData = await response.json();

  //       if (projectData.length > 0) {
  //         const formatted = projectData.map((task) => ({
  //           DailyTaskID: task.DailyTaskID,
  //           ProjectID: `${task.ProjectID}-${task.ProjectName}`,
  //           DailyTaskTiltle: task.DailyTaskTiltle,
  //           TaskDescription: task.TaskDescription,
  //           userID: task.userID,
  //           HourseTaken: task.HourseTaken,
  //           TaskStauts: task.TaskStauts,
  //           TaskDate: task.TaskDate,
  //           TaskMasterID: task.TaskMasterID,
  //         }));
  //         setRowDataTask(formatted);
  //       }
  //     } else if (response.status === 404) {
  //       console.log("User details not found");
  //       toast.warning("User details not found");
  //     } else {
  //       const errorResponse = await response.json();
  //       toast.warning(errorResponse.message || "Failed to fetch user details");
  //       console.error(errorResponse.details || errorResponse.message);
  //     }
  //   } catch (error) {
  //     console.error("Error updating user details:", error);
  //   }
  // };

  const handleCellClick = async (params) => {
    const taskDate = params.data.work_date;
    const userID = params.data.user.split(" - ")[0];
    const companyCode = sessionStorage.getItem('selectedCompanyCode');

    const requestBody = {
      start_date: taskDate,
      userid: userID,
      company_code: companyCode
    };

    try {
      const taskResponse = await fetch(`${config.apiBaseUrl}/getTaskHourReportDetail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (taskResponse.ok) {
        const projectData = await taskResponse.json();
        if (projectData.length > 0) {
          const formatted = projectData.map((task) => ({
            DailyTaskID: task.DailyTaskID,
            ProjectID: `${task.ProjectID}-${task.ProjectName}`,
            DailyTaskTiltle: task.DailyTaskTiltle,
            TaskDescription: task.TaskDescription,
            userID: task.userID,
            HourseTaken: task.HourseTaken,
            TaskStauts: task.TaskStauts,
            TaskDate: task.TaskDate,
            TaskMasterID: task.TaskMasterID,
            TotalHours_per_Ticket: task.TotalHours_per_Ticket,
          }));
          setRowDataTask(formatted);
        }
      } else if (taskResponse.status === 404) {
        toast.warning("Task details not found");
        setRowDataTask([]);
      } else {
        const errorResponse = await taskResponse.json();
        toast.warning(errorResponse.message || "Failed to insert sales data");
        setRowDataTask([]);
      }

      const checkInResponse = await fetch(`${config.apiBaseUrl}/getEmployeeCheckInCheckOut`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (checkInResponse.ok) {
        const checkInData = await checkInResponse.json();
        setRowDataEmployeeTime(checkInData);
      } else if (checkInResponse.status === 404) {
        toast.warning("Check-in/out details not found");
        setRowDataEmployeeTime([]);
      } else {
        const errorResponse = await checkInResponse.json();
        toast.warning(errorResponse.message || "Failed to insert sales data");
        setRowDataEmployeeTime([]);
      }

    } catch (error) {
      console.error("Error while handling cell click:", error);
      toast.error("Something went wrong while fetching details.");
    }
  };

  const handleNavigateWithRowData = (selectedRow) => {
    if (!selectedRow || !selectedRow.ProjectID) {
      console.error("Invalid selected row");
      return;
    }

    const pureProjectID = selectedRow.ProjectID.split("-").slice(0, 2).join("-"); // "YJKT-1"

    const cleanedRow = {
      ...selectedRow,
      ProjectID: pureProjectID,
      TaskMasterID: selectedRow.TaskMasterID, // Add this line
    };

    navigate("/ProjectDetails", { state: { selectedRow: cleanedRow } });
  };

  const getCSSVariable = (variableName) => {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(variableName)
      .trim();
  };

const transformRowData = (data) => {
  return data.map((row) => ({
    "Date": row.work_date || "",
    "Employee ID": row.user || "",
    "Check IN": row.First_CheckIn || "",
    "Check Out": row.Last_CheckOut || "",
    "Total Login Hours": row.Total_login_Hours || "",
    "Total Worked Hours": row.total_worked_hours || "",
  }));
};

const handleExportToExcel = () => {
  if (!rowDataEmployee || rowDataEmployee.length === 0) {
    toast.warning("There is no data to export.");
    return;
  }

  const screenName = "Task Hours & Time Tracking Report";
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

  const transformedData = transformRowData(rowDataEmployee);

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

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Task Hours & Time Tracking"
  );

  XLSX.writeFile(
    workbook,
    "Task_Hours_&_Time_Tracking_Report.xlsx"
  );
};

  const getRowStyle = (params) => {
    if (params.data.Status?.toLowerCase() === 'Absent') {
      return { backgroundColor: 'red', color: 'white' };
    }
    return null;
  };

const transformData = (data) => {
  return data.map((row) => ({
    "Date": row.TaskDate || "",
    "Project ID": row.ProjectID || "",
    "Task Master ID": row.TaskMasterID || "",
    "Task ID": row.DailyTaskID || "",
    "Daily Task Title": row.DailyTaskTiltle || "",
    "Description": row.TaskDescription || "",
    "User": row.userID || "",
    "Spend Hours": row.HourseTaken || "",
    "Status": row.TaskStauts || "",
  }));
};

const handleExcel = () => {
  if (!rowDataTask || rowDataTask.length === 0) {
    toast.warning("There is no data to export.");
    return;
  }

  const screenName = "Task Hours & Time Tracking Report";
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

  const transformedData = transformData(rowDataTask);

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
      e: {r: 0,c: Object.keys(transformedData[0]).length - 1,},
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
  worksheet["!cols"] = [{ wch: 16 }, { wch: 18 }, { wch: 18 }, { wch: 16 }, { wch: 35 }, { wch: 40 }, { wch: 20 }, { wch: 15 }, { wch: 18 },];
  /* ================= EXPORT ================= */

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook,worksheet,"Task Hours & Time Tracking");

  XLSX.writeFile(workbook,"Task_Hours_&_Time_Tracking_Report.xlsx");
};

  // Code for how many times check in and check out per employee
  const [rowDataEmployeeTime, setRowDataEmployeeTime] = useState([]);

  const columnEmployeeTime = [
    { headerName: 'Date', field: 'DayofLogin', width: '110' },
    { headerName: 'Employee ID', field: 'userID', width: '120' },
    { headerName: 'Check In', field: 'Checkin', sort: "asc", width: '120' },
    { headerName: 'Check Out', field: 'CheckOut', width: '120' },
    { headerName: 'Total Login  Hours', field: 'TotalHours', width: '150' }
  ];


  return (
    <div class="container-fluid Topnav-screen">
      {loading && <LoadingScreen />}
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="shadow-lg p-1 bg-light rounded main-header-box">
        <div className="header-flex">
          <h1 className="page-title">Task Hours & Time Tracking</h1>
          <div className="action-wrapper desktop-actions">
            <div className="action-icon add" onClick={handleExportToExcel}>
              <span className="tooltip">Excel</span>
              <i className="fa-solid fa-file-excel"></i>
            </div>
          </div>

          {/* Mobile Action Bar */}
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
                <li>
                  <button className="dropdown-item" onClick={handleExportToExcel}>
                    <i className="fa-solid fa-file-excel add fs-4"></i>
                  </button>
                </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="shadow-lg p-3 bg-light rounded mt-2 container-form-box">
        <div className="row g-3">

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                placeholder=" "
                autoComplete="off"
                type='date'
                value={Start_date}
                onChange={(e) => setStart_date(e.target.value)}
                className='exp-input-field form-control'
              />
              <label className="exp-form-labels">Start Date</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                type='date'
                placeholder=" "
                autoComplete="off"
                value={End_date}
                onChange={(e) => setEnd_date(e.target.value)}
                className='exp-input-field form-control'
              />
              <label className="exp-form-labels">End Date</label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedUser ? "has-value" : ""} 
              ${isSelectUser ? "is-focused" : ""}`}
            >
              <Select
                type='Text'
                placeholder=" "
                onFocus={() => setIsSelectUser(true)}
                onBlur={() => setIsSelectUser(false)}
                classNamePrefix="react-select"
                isClearable
                onChange={handleChangeUser}
                value={selectedUser}
                options={filteredOptionUser}
                onKeyDown={(e) => e.key === "Enter" && handleChange()}
              />
              <label className='floating-label'>User</label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedStatus ? "has-value" : ""} 
              ${isSelectStatus ? "is-focused" : ""}`}
            >
              <Select
                type='Text'
                placeholder=" "
                onFocus={() => setIsSelectStatus(true)}
                onBlur={() => setIsSelectStatus(false)}
                classNamePrefix="react-select"
                isClearable
                onChange={handleChangeStatus}
                value={selectedStatus}
                options={filteredOptionStatus}
                onKeyDown={(e) => e.key === "Enter" && handleChange()}
              />
              <label className='floating-label'>Status</label>
            </div>
          </div>

          {/* Search + Reload Buttons */}
          <div className="col-12">
            <div className="search-btn-wrapper">
              <div className="icon-btn search" onClick={handleChange}>
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

      <div className="shadow-lg pt-3 bg-light rounded mt-2 container-form-box" style={{ width: "100%" }}>
        <div className="ag-row-layout">

          <div className="ag-grid-left">
            <div className="ag-theme-alpine" style={{ width: "100%", height: 300 }}>
              <AgGridReact
                columnDefs={columnEmployee}
                getRowStyle={getRowStyle}
                rowData={rowDataEmployee}
                rowHeight={27}
                headerHeight={27}
                onCellClicked={handleCellClick}
                onFirstDataRendered={onFirstDataRendered}
              />
            </div>
          </div>

          <div className="ag-grid-right">
            <div className="ag-theme-alpine" style={{ width: "100%", height: 300 }}>
              <AgGridReact
                columnDefs={columnEmployeeTime}
                rowData={rowDataEmployeeTime}
                onFirstDataRendered={onFirstDataRendered}
                rowHeight={27}
                headerHeight={27}
              />
            </div>
          </div>

        </div>
      </div>

      <div className="shadow-lg pt-3 bg-light rounded mt-2 container-form-box" style={{ width: "100%" }}>
        <div className="d-flex justify-content-end me-2">

          <div className="action-wrapper">
            <div className="icon-btn excel" onClick={handleExcel}>
              <span className="tooltip">Excel</span>
              <i className="fa-solid fa-file-excel"></i>
            </div>
          </div>

        </div>

        <div className='pt-3 ms-2'>
          <div className="ag-theme-alpine" style={{ height: 300, width: '100%' }}>
            <AgGridReact
              columnDefs={columnTask}
              rowData={rowDataTask}
              onFirstDataRendered={onFirstDataRendered}
              rowHeight={27}
              headerHeight={27}
              onCellClicked={(params) => handleNavigateWithRowData(params.data)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAgGridComponent;