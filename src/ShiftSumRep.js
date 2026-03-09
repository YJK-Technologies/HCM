import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import "./App.css";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showConfirmationToast } from "./ToastConfirmation";
import LoadingScreen from "./Loading";
import TabButtons from "./ESSComponents/Tabs";
import Select from "react-select";
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
  const companyMappingPermission = permissions
    .filter((permission) => permission.screen_type === "Company Mapping")
    .map((permission) => permission.permission_type.toLowerCase());

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
      body: JSON.stringify({ company_code }),
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
      body: JSON.stringify({ company_code }),
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
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => setEmployeeIdDropSc(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // const handleSearch = async () => {
  //     setLoading(true);

  //     try {
  //         const Company_Code = sessionStorage.getItem("selectedCompanyCode");

  //         const response = await fetch(`${config.apiBaseUrl}/Employee_shift_mappingSc`, {
  //             method: "POST",
  //             headers: {
  //                 "Content-Type": "application/json",
  //             },
  //             body: JSON.stringify({
  //                 // Emp_Shift_ID: employeeShiftIdSc,
  //                 Employee_ID: employeeIdSc,
  //                 Shift_Pattern_ID: shiftPatternIdSc,
  //                 Effective_From: effectiveFromSc,
  //                 Effective_To: effectiveToSc,
  //                 Is_Current: statusSc,
  //                 Company_Code,
  //             }),
  //         });

  //         if (response.ok) {
  //             const searchData = await response.json();
  //             setRowData(searchData);
  //             console.log("data fetched successfully");
  //         } else if (response.status === 404) {
  //             toast.warning("Data not found");
  //             setRowData([]);
  //         } else {
  //             const errorResponse = await response.json();
  //             toast.warning(errorResponse.message || "Search failed");
  //         }
  //     } catch (error) {
  //         console.error("Error fetching data:", error);
  //         toast.error("Error fetching data: " + error.message);
  //     } finally {
  //         setLoading(false);
  //     }
  // };

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
      headerName: "Employee ID",
      field: "Employee_ID",
      filter: true,
      sortable: true,
      headerCheckboxSelection: true,
      checkboxSelection: true,
    },
    {
      headerName: "Department",
      field: "dept_id",
      filter: true,
    },
    {
      headerName: "Designation",
      field: "desgination_id",
      filter: true,
    },
    {
      headerName: "Shift Date",
      field: "Shift_Date",
      valueFormatter: (params) => {
        if (!params.value) return "";
        return new Date(params.value).toLocaleDateString();
      },
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
    wrapText: true,
    editable: true,
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
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
    return data.map((row) => {

      return {
        "Employee ID": row.Employee_ID || "",
        "Department ID": row.dept_id || "", 
        "Designation ID": row.desgination_id || "",
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

    if (!gridApi) {
    toast.warning("Grid not ready.");
    return;
  }

     const selectedData = gridApi.getSelectedRows();

    if (!selectedData  || selectedData.length === 0) {
      toast.warning("There is no data to export.");
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

    const transformedData = transformRowData(selectedData);

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

  return (
    <div className="container-fluid Topnav-screen">
      <div align="">
        {loading && <LoadingScreen />}
        <ToastContainer
          position="top-right"
          className="toast-design"
          theme="colored"
        />
        <div className="shadow-lg p-1 bg-light rounded main-header-box">
          <div className="header-flex">
            <h1 className="page-title">Shift Summary Report</h1>
            <div className="action-wrapper"></div>
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

                <div className="icon-btn excel" onClick={handleExportToExcel}>
                  <span className="tooltip">Excel</span>
                  <i className="fa-solid fa-file-excel"></i>
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
