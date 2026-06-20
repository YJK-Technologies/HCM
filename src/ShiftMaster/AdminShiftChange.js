import { useState, useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "../App.css";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingScreen from "../Loading";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx-js-style";
import ShiftRequestModal from "../ESSDashboard/ShiftRequestModal";

const config = require("../Apiconfig");

function AdminShiftChange() {

  const [shiftEmpId, setShiftEmpId] = useState("");
  const [selectedShiftEmpId, setSelectedShiftEmpId] = useState("");
  const [shiftEmpIdDrop, setShiftEmpIdDrop] = useState([]);
  const [shiftEmpIdDropGrid, setShiftEmpIdDropGrid] = useState([]);
  const [shiftDeptId, setShiftDeptId] = useState("");
  const [selectedShiftDeptId, setSelectedShiftDeptId] = useState("");
  const [shiftDeptIdDrop, setShiftDeptIdDrop] = useState([]);
  const [shiftDeptIdDropGrid, setShiftDeptIdDropGrid] = useState([]);
  const [shiftDesigId, setShiftDesigId] = useState("");
  const [selectedShiftDesigId, setSelectedShiftDesigId] = useState("");
  const [shiftDesigIdDrop, setShiftDesigIdDrop] = useState([]);
  const [shiftDesigIdDropGrid, setShiftDesigIdDropGrid] = useState([]);
  const [shiftPatternId, setShiftPatternId] = useState("");
  const [selectedShiftPatternId, setSelectedShiftPatternId] = useState("");
  const [shiftPatternIdDrop, setShiftPatternIdDrop] = useState([]);
  const [shiftPatternIdDropGrid, setShiftPatternIdDropGrid] = useState([]);
  const [shiftDay, setShiftDay] = useState("");
  const [shiftFromDate, setShiftFromDate] = useState("");
  const [shiftToDate, setShiftToDate] = useState("");
  const [shiftCode, setShiftCode] = useState("");
  const [selectedShiftCode, setSelectedShiftCode] = useState("");
  const [shiftCodeDrop, setShiftCodeDrop] = useState([]);
  const [shiftCodeDropGrid, setShiftCodeDropGrid] = useState([]);
  const [shiftStartTime, setShiftStartTime] = useState("");
  const [shiftEndTime, setShiftEndTime] = useState("");
  const [shiftRowData, setShiftRowData] = useState([]);
  const [isSelectedShiftEmpId, setIsSelectedShiftEmpId] = useState(false);
  const [isSelectedShiftDeptId, setIsSelectedShiftDeptId] = useState(false);
  const [isSelectedShiftDesigId, setIsSelectedShiftDesigId] = useState(false);
  const [isSelectedShiftPatternId, setIsSelectedShiftPatternId] =
    useState(false);
  const [isSelectedShiftCode, setIsSelectedShiftCode] = useState(false);
  const [rowData, setRowData] = useState([]);
  const gridApiRef = useRef(null);
  const gridColumnApiRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const [ToDate, setToDate] = useState("");
  const [rempShiftRowData, setEmpShiftRowData] = useState([]);



  const handleShiftSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/getAdEmpShiftReport`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          From_Date: shiftFromDate,
          To_Date: shiftToDate,
          Employee_ID: shiftEmpId,
          department_ID: shiftDeptId,
          designation_ID: shiftDesigId,
          Shift_Pattern_ID: shiftPatternId,
          Shift_Code: shiftCode,
          Day_Sequence: shiftDay,
          Start_Time: shiftStartTime,
          End_Time: shiftEndTime,
          company_code: sessionStorage.getItem("selectedCompanyCode"),
        }),
      });
      if (response.ok) {
        const searchData = await response.json();
        setShiftRowData(searchData);
        console.log(searchData);
      } else if (response.status === 404) {
        console.log("Data not found");
        toast.warning("Data not found");
        setShiftRowData([]);
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to data");
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
      toast.error("Error fetching search data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const Company_Code = sessionStorage.getItem("selectedCompanyCode");
    fetch(`${config.apiBaseUrl}/ShiftPatternMasterDropDown`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Company_Code }),
    })
      .then((response) => response.json())
      .then((data) => {
        const shiftPatternIdOption = data.map((option) => ({
          value: option.Pattern_Code,
          label: `${option.Pattern_Code} - ${option.Pattern_Name}`,
        }));
        setShiftPatternIdDropGrid(shiftPatternIdOption);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");
    fetch(`${config.apiBaseUrl}/ShiftMasterDropDown`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((response) => response.json())
      .then((data) => {
        const shiftOption = data.map((option) => ({
          value: option.Shift_Code,
          label: `${option.Shift_Code} - ${option.Shift_Name}`,
        }));
        setShiftCodeDropGrid(shiftOption);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    fetch(`${config.apiBaseUrl}/getDepartment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((response) => response.json())
      .then((data) => {
        const deptOptions = data.map((option) => ({
          value: option.dept_id,
          label: `${option.dept_id} - ${option.dept_name}`,
        }));
        setShiftDeptIdDropGrid(deptOptions);
      })
      // .then((val) => setDPTdrop(val))
      .catch((error) =>
        console.error("Error fetching department data:", error),
      );
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
      .then((response) => response.json())
      .then((data) => {
        const employeeIdOption = data.map((option) => ({
          value: option.EmployeeId,
          label: `${option.EmployeeId} - ${option.First_Name}`,
        }));
        setShiftEmpIdDropGrid(employeeIdOption);
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
      .then((val) => setShiftEmpIdDrop(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    fetch(`${config.apiBaseUrl}/getDepartment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => setShiftDeptIdDrop(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const Company_Code = sessionStorage.getItem("selectedCompanyCode");

    fetch(`${config.apiBaseUrl}/ShiftPatternMasterDropDown`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Company_Code }),
    })
      .then((data) => data.json())
      .then((val) => setShiftPatternIdDrop(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    fetch(`${config.apiBaseUrl}/ShiftMasterDropDown`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => setShiftCodeDrop(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleChangeDeptId = (selectedShiftDeptId) => {
    setSelectedShiftDeptId(selectedShiftDeptId);
    setShiftDeptId(selectedShiftDeptId ? selectedShiftDeptId.value : "");
    fetchDesignation(selectedShiftDeptId ? selectedShiftDeptId.value : "");
  };

  const filteredOptionEmpId = shiftEmpIdDrop.map((option) => ({
    value: option.EmployeeId,
    label: `${option.EmployeeId} - ${option.First_Name}`,
  }));

  const handleChangeEmpId = (selectedShiftEmpId) => {
    setSelectedShiftEmpId(selectedShiftEmpId);
    setShiftEmpId(selectedShiftEmpId ? selectedShiftEmpId.value : "");
  };

  const filteredOptionDeptId = shiftDeptIdDrop.map((option) => ({
    value: option.dept_id,
    label: `${option.dept_id} - ${option.dept_name}`,
  }));

  const fetchDesignation = async (selectedValue) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getDesgination`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dept_id: selectedValue,
          company_code: sessionStorage.getItem("selectedCompanyCode"),
        }),
      });

      const data = await response.json();
      const formattedData = [
        { value: "All", label: "All" },
        ...data.map((product) => ({
          value: product.Desgination,
          label: product.Desgination,
        })),
      ];

      setShiftDesigIdDrop(formattedData);
      return formattedData;
    } catch (error) {
      console.error("Error fetching product codes:", error);
      return [];
    }
  };

  const handleChangeDesigId = (selectedShiftDesigId) => {
    setSelectedShiftDesigId(selectedShiftDesigId);
    setShiftDesigId(selectedShiftDesigId ? selectedShiftDesigId.value : "");
  };

  const filteredOptionShiftPatternId = shiftPatternIdDrop.map((option) => ({
    value: option.Pattern_Code,
    label: `${option.Pattern_Code} - ${option.Pattern_Name}`,
  }));

  const handleChangeShiftPatternId = (selectedShiftPatternId) => {
    setSelectedShiftPatternId(selectedShiftPatternId);
    setShiftPatternId(
      selectedShiftPatternId ? selectedShiftPatternId.value : "",
    );
  };

  const filteredOptionShiftCode = shiftCodeDrop.map((option) => ({
    value: option.Shift_Code,
    label: `${option.Shift_Code} - ${option.Shift_Name}`,
  }));

  const handleChangeShiftCode = (selectedShiftCode) => {
    setSelectedShiftCode(selectedShiftCode);
    setShiftCode(selectedShiftCode ? selectedShiftCode.value : "");
  };

  const reloadGridDatas = () => {
    clearInputsField([])
    setRowData([])
    setShiftRowData([])
  };

  const clearInputsField = () => {
    setShiftEndTime('');
    setShiftStartTime('');
    setShiftDay('');
    setSelectedShiftCode('');
    setShiftCode('');
    setSelectedShiftPatternId('');
    setShiftPatternId('');
    setSelectedShiftDesigId('');
    setShiftDesigId('');
    setSelectedShiftDeptId('');
    setShiftDeptId('');
    setSelectedShiftEmpId('');
    setShiftEmpId('');
    setShiftToDate('');
    setShiftFromDate('');
  };

  const handleExportToExcelShift = () => {
    if (!shiftRowData || shiftRowData.length === 0) {
      toast.warning("There is no data to export.");
      return;
    }

    const screenName = "Employee Shift Detail Search Report";
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

    const transformedData = transformShiftRowData(shiftRowData);

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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employee Shift Detail");

    XLSX.writeFile(workbook, "Employee_Shift_Detail_Search_Report.xlsx");
  };

  const getCSSVariable = (variableName) => {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(variableName)
      .trim();
  };

  const transformShiftRowData = (data) => {
    return data.map((row) => {
      const patternObj = shiftPatternIdDropGrid.find(
        (d) => d.value === row.Shift_Pattern_ID,
      );

      const patternName = patternObj
        ? patternObj.label.split(" - ").slice(1).join(" - ")
        : "";

      const shiftObj = shiftCodeDropGrid.find(
        (d) => d.value === row.Shift_Code,
      );

      const shiftName = shiftObj
        ? shiftObj.label.split(" - ").slice(1).join(" - ")
        : "";

      const empObj = shiftEmpIdDropGrid.find(
        (d) => d.value === row.Employee_ID,
      );

      const empName = empObj
        ? empObj.label.split(" - ").slice(1).join(" - ")
        : "";

      const deptObj = shiftDeptIdDropGrid.find((d) => d.value === row.dept_id);

      const deptName = deptObj
        ? deptObj.label.split(" - ").slice(1).join(" - ")
        : "";

      return {
        Date: row.Date || "",
        "Shift Pattern": `${row.Shift_Pattern_ID} - ${patternName}` || "",
        "Day Sequence": row.Day_Sequence || "",
        Shift: `${row.Shift_Code} - ${shiftName}` || "",
        "Employee ID": `${row.Employee_ID} - ${empName}` || "",
        Department: `${row.dept_id} - ${deptName}` || "",
        Designation: row.desgination_id || "",
        "Start Time": row.Start_Time || "",
        "End Time": row.End_Time || "",
      };
    });
  };

  const ShiftColDefs = [
    {
      headerName: "Date",
      field: "Date",
      minWidth: 130,
    },
    {
      headerName: "Shift Pattern",
      field: "Shift_Pattern_ID",
      minWidth: 130,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: shiftPatternIdDropGrid.map((d) => d.value),
      },
      valueFormatter: (params) => {
        const dept = shiftPatternIdDropGrid.find(
          (d) => d.value === params.value,
        );
        return dept ? dept.label : params.value;
      },
    },
    {
      headerName: "Day Sequence",
      field: "Day_Sequence",
      minWidth: 130,
    },
    {
      headerName: "Shift Code",
      field: "Shift_Code",
      minWidth: 130,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: shiftCodeDropGrid.map((d) => d.value),
      },
      valueFormatter: (params) => {
        const dept = shiftCodeDropGrid.find((d) => d.value === params.value);
        return dept ? dept.label : params.value;
      },
    },
    {
      headerName: "Employee ID",
      field: "Employee_ID",
      minWidth: 130,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: shiftEmpIdDropGrid.map((d) => d.value),
      },
      valueFormatter: (params) => {
        const dept = shiftEmpIdDropGrid.find((d) => d.value === params.value);
        return dept ? dept.label : params.value;
      },
    },
    {
      headerName: "Department",
      field: "dept_id",
      minWidth: 130,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: shiftDeptIdDropGrid.map((d) => d.value),
      },
      valueFormatter: (params) => {
        const dept = shiftDeptIdDropGrid.find((d) => d.value === params.value);
        return dept ? dept.label : params.value;
      },
    },
    {
      headerName: "Designation",
      field: "desgination_id",
      minWidth: 130,
    },
    {
      headerName: "Start Time",
      field: "Start_Time",
      minWidth: 100,
    },
    {
      headerName: "End Time",
      field: "End_Time",
      minWidth: 100,
    },
    {
      headerName: "Action",
      field: "action",
      minWidth: 200,
      maxWidth: 200,
      cellClass: "d-flex align-items-center justify-content-center",
      cellRenderer: (params) => {
        const canRequest = params.data.Can_Request === 1;

        return (
          <button
            className={`shift-action-btn ${canRequest ? 'active-btn' : 'locked-btn'}`}
            disabled={!canRequest}
            title={`${canRequest ? "Request Shift Change" : "Locked"}`}
            onClick={() => handleShiftRequest(params.data)}
          >
            <span className="btn-icon">
              {canRequest ? (
                <i className="bi bi-arrow-left-right"></i>
              ) : (
                <i className="bi bi-lock-fill"></i>
              )}
            </span>
            <span className="btn-text">
              {canRequest ? "Request Shift Change" : "Locked"}
            </span>
          </button>
        );
      }
    }
  ];

  const onFirstDataRendered = (params) => {
  const allColumnIds = params.columnApi
    .getColumns()
    .map((col) => col.getId());

  params.columnApi.autoSizeColumns(allColumnIds);
};

  const handleShiftRequest = (rowData) => {
    if (!rowData) return;
    setSelectedRow(rowData);
    setIsModalOpen(true);
  };

  const handleEmpShiftReportSearch = async (fromDate, toDate) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getEmpShiftReport`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          From_Date: fromDate || ToDate,
          To_Date: toDate || ToDate,
          Employee_ID: sessionStorage.getItem('selectedUserCode'),
          company_code: sessionStorage.getItem('selectedCompanyCode')
        }),
      });

      if (response.ok) {
        const searchData = await response.json();
        setEmpShiftRowData(searchData);
      } else if (response.status === 404) {
        setEmpShiftRowData([]);
        toast.warning("Data not found");
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to fetch data");
        setEmpShiftRowData([]);
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
      toast.error("Error fetching search data: " + error.message);
    }
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
          <h1 className="page-title">Admin Shift Change</h1>
        </div>
      </div>
      <div className="shadow-lg p-3 bg-light rounded mt-2 container-form-box">


        <div className="row g-3">
          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="status"
                className="exp-input-field form-control"
                title="Please enter the From Date"
                type="date"
                autoComplete="off"
                placeholder=" "
                value={shiftFromDate}
                onKeyDown={(e) => e.key === "Enter" && handleShiftSearch()}
                onChange={(e) => setShiftFromDate(e.target.value)}
              />
              <label className="exp-form-labels">From Date</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="status"
                className="exp-input-field form-control"
                title="Please enter the To Date"
                type="date"
                autoComplete="off"
                placeholder=" "
                value={shiftToDate}
                onKeyDown={(e) => e.key === "Enter" && handleShiftSearch()}
                onChange={(e) => setShiftToDate(e.target.value)}
              />
              <label className="exp-form-labels">To Date</label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
                  ${selectedShiftEmpId ? "has-value" : ""} 
                  ${isSelectedShiftEmpId ? "is-focused" : ""}`}
                  title="Please select the Employee ID"
            >
              <Select
                id="status"
                placeholder=" "
                onFocus={() => setIsSelectedShiftEmpId(true)}
                onBlur={() => setIsSelectedShiftEmpId(false)}
                classNamePrefix="react-select"
                isClearable
                type="text"
                options={filteredOptionEmpId}
                onChange={handleChangeEmpId}
                onKeyDown={(e) => e.key === "Enter" && handleShiftSearch()}
                value={selectedShiftEmpId}
              />
              <label className="floating-label">Employee ID</label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
                  ${selectedShiftDeptId ? "has-value" : ""} 
                  ${isSelectedShiftDeptId ? "is-focused" : ""}`}
                  title="Please select the Department ID"
            >
              <Select
                id="status"
                placeholder=" "
                onFocus={() => setIsSelectedShiftDeptId(true)}
                onBlur={() => setIsSelectedShiftDeptId(false)}
                classNamePrefix="react-select"
                isClearable
                type="text"
                options={filteredOptionDeptId}
                onChange={handleChangeDeptId}
                onKeyDown={(e) => e.key === "Enter" && handleShiftSearch()}
                value={selectedShiftDeptId}
              />
              <label className="floating-label">Department ID</label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
                  ${selectedShiftDesigId ? "has-value" : ""} 
                  ${isSelectedShiftDesigId ? "is-focused" : ""}`}
                  title="Please select the Designation ID"
            >
              <Select
                id="status"
                placeholder=" "
                onFocus={() => setIsSelectedShiftDesigId(true)}
                onBlur={() => setIsSelectedShiftDesigId(false)}
                classNamePrefix="react-select"
                isClearable
                type="text"
                options={shiftDesigIdDrop}
                onChange={handleChangeDesigId}
                onKeyDown={(e) => e.key === "Enter" && handleShiftSearch()}
                value={selectedShiftDesigId}
              />
              <label className="floating-label">Designation ID</label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
                  ${selectedShiftPatternId ? "has-value" : ""} 
                  ${isSelectedShiftPatternId ? "is-focused" : ""}`}
                  title="Please select the Shift Pattern ID"
            >
              <Select
                id="status"
                placeholder=" "
                onFocus={() => setIsSelectedShiftPatternId(true)}
                onBlur={() => setIsSelectedShiftPatternId(false)}
                classNamePrefix="react-select"
                isClearable
                type="text"
                options={filteredOptionShiftPatternId}
                onChange={handleChangeShiftPatternId}
                onKeyDown={(e) => e.key === "Enter" && handleShiftSearch()}
                value={selectedShiftPatternId}
              />
              <label className="floating-label">Shift Pattern ID</label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
                  ${selectedShiftCode ? "has-value" : ""} 
                  ${isSelectedShiftCode ? "is-focused" : ""}`}
                  title="Please select the Shift Code"
            >
              <Select
                id="status"
                placeholder=" "
                onFocus={() => setIsSelectedShiftCode(true)}
                onBlur={() => setIsSelectedShiftCode(false)}
                classNamePrefix="react-select"
                isClearable
                type="text"
                options={filteredOptionShiftCode}
                onChange={handleChangeShiftCode}
                onKeyDown={(e) => e.key === "Enter" && handleShiftSearch()}
                value={selectedShiftCode}
              />
              <label className="floating-label">Shift Code</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="status"
                className="exp-input-field form-control"
                title="Please enter the Day Sequence"
                type="number"
                autoComplete="off"
                placeholder=" "
                value={shiftDay}
                onKeyDown={(e) => e.key === "Enter" && handleShiftSearch()}
                onChange={(e) => setShiftDay(e.target.value)}
              />
              <label className="exp-form-labels">Day Sequence</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="status"
                className="exp-input-field form-control"
                title="Please enter the Start Time"
                type="time"
                autoComplete="off"
                placeholder=" "
                value={shiftStartTime}
                onKeyDown={(e) => e.key === "Enter" && handleShiftSearch()}
                onChange={(e) => setShiftStartTime(e.target.value)}
              />
              <label className="exp-form-labels">Start Time</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="status"
                className="exp-input-field form-control"
                title="Please enter the End Time"
                type="time"
                autoComplete="off"
                placeholder=" "
                value={shiftEndTime}
                onKeyDown={(e) => e.key === "Enter" && handleShiftSearch()}
                onChange={(e) => setShiftEndTime(e.target.value)}
              />
              <label className="exp-form-labels">End Time</label>
            </div>
          </div>

          <div className="ms-2">
            <div className="search-btn-wrapper">
              <div className="icon-btn search" onClick={handleShiftSearch}>
                <span className="tooltip">Search</span>
                <i className="fa-solid fa-magnifying-glass"></i>
              </div>
              <div className="icon-btn reload" onClick={reloadGridDatas}>
                <span className="tooltip">Reload</span>
                <i className="fa-solid fa-rotate-right"></i>
              </div>
              <div
                className="icon-btn excel"
                onClick={handleExportToExcelShift}
              >
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
        <div class="ag-theme-alpine" style={{ height: 455, width: "100%" }}>
          <AgGridReact
            columnDefs={ShiftColDefs}
            rowData={shiftRowData}
            onFirstDataRendered={onFirstDataRendered}
            suppressRowClickSelection={true}
            pagination={true}
            paginationAutoPageSize={true}
            onGridReady={(params) => {
              gridApiRef.current = params.api;
              gridColumnApiRef.current = params.columnApi;
            }}
          />
          <ShiftRequestModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            rowData={selectedRow}
            screenType="Admin"
            onSuccess={handleEmpShiftReportSearch}
          />
        </div>
      </div>
    </div>


  );

}

export default AdminShiftChange;
