import React, { useState, useEffect } from "react";
import "../input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { AgGridReact } from "ag-grid-react";
import { useNavigate } from "react-router-dom";
import TabButtons from "../ESSComponents/Tabs";
import { showConfirmationToast } from "../ToastConfirmation";
import LoadingScreen from "../Loading";
import Select from "react-select";
import * as XLSX from "xlsx-js-style";
const config = require("../Apiconfig");

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
const { FirstDate, LastDate } = getFinancialYearDates();

function InterviewPanelMem({ }) {
  const [rowData, setRowData] = useState([]);
  const [error, setError] = useState("");
  const [member_id, setmember_id] = useState("");
  const [Role, setRole] = useState("");
  const [RoleSC, setRoleSC] = useState("");
  const [selectedPanelID, setselectedPanelID] = useState("");
  const [PanelID, setPanelID] = useState("");
  const [selectedPanelIDSC, setselectedPanelIDSC] = useState("");
  const [PanelIDSC, setPanelIDSC] = useState("");
  const [PanelDrop, setPanelDrop] = useState([]);
  const [isSelectPanelID, setIsisSelectPanelID] = useState(false);
  const [isSelectPanelSC, setisSelectPanelSC] = useState(false);
  const [selectedEmployeeID, setselectedEmployeeID] = useState([]);
  const [EmployeeID, setEmployeeID] = useState("");
  const [selectedEmployeeIDSC, setselectedEmployeeIDSC] = useState([]);
  const [EmployeeIDSC, setEmployeeIDSC] = useState("");
  const [EmployeeIDdrop, setEmployeeIDdrop] = useState([]);
  const [isSelectEmployeeID, setisSelectEmployeeID] = useState(false);
  const [isSelectEmployeeIDSC, setisSelectEmployeeIDSC] = useState(false);
  const [panelDrop, setPaneldrop] = useState([]);
  const [empColSize, setEmpColSize] = useState(2);
  const [empColSizeSc, setEmpColSizeSc] = useState(2);

  const [activeTab, setActiveTab] = useState("Panel Members");
  const [loading, setLoading] = useState(false);

  const searchClearInputFields = () => {
    setmember_id("");
    setselectedPanelIDSC("");
    setPanelIDSC("");
    setselectedEmployeeIDSC("");
    setEmployeeIDSC("");
    setRoleSC("");
  };

  const navigate = useNavigate();

  const handleEmployeeID = (selected) => {
    const safeSelected = selected || [];
    setselectedEmployeeID(safeSelected);

    // comma-separated IDs (already you have)
    const employeeIds = safeSelected.map(emp => emp.value).join(",");
    setEmployeeID(employeeIds);

    // 🔥 DYNAMIC COLUMN SIZE LOGIC
    const count = safeSelected.length;

    if (count <= 1) setEmpColSize(2);
    else if (count === 2) setEmpColSize(3);
    else if (count === 3) setEmpColSize(4);
    else if (count === 4) setEmpColSize(5);
    else if (count === 5) setEmpColSize(6);
    else if (count === 6) setEmpColSize(7);
    else if (count === 7) setEmpColSize(8);
    else if (count === 8) setEmpColSize(9);
    else if (count >= 9) setEmpColSize(10);
  };

  const handleEmployeeIDSC = (selected) => {
    const safeSelected = selected || [];
    setselectedEmployeeIDSC(safeSelected);

    // comma-separated IDs (already you have)
    const employeeIds = safeSelected.map(emp => emp.value).join(",");
    setEmployeeIDSC(employeeIds);

    // 🔥 DYNAMIC COLUMN SIZE LOGIC
    const count = safeSelected.length;

    if (count <= 1) setEmpColSizeSc(2);
    else if (count === 2) setEmpColSizeSc(3);
    else if (count === 3) setEmpColSizeSc(4);
    else if (count === 4) setEmpColSizeSc(5);
    else if (count === 5) setEmpColSizeSc(6);
    else if (count === 6) setEmpColSizeSc(7);
    else if (count >= 7) setEmpColSizeSc(8);
  };

  // const handleEmployeeIDSC = (selectedDPT) => {
  //   setselectedEmployeeIDSC(selectedDPT);

  //   if (!selectedDPT || selectedDPT.length === 0) {
  //     setEmployeeIDSC("");
  //     return;
  //   }

  //   const values = selectedDPT.map((opt) => opt.value);

  //   setEmployeeIDSC(values.join(","));
  // };

  const filteredOptionEmployeeID = EmployeeIDdrop.map((option) => ({
    value: option.EmployeeId,
    label: `${option.EmployeeId} - ${option.First_Name}`,
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

    fetch(`${config.apiBaseUrl}/InterviewPanelData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((response) => response.json())
      .then((data) => {
        const panel = data.map((option) => ({
          value: option.panel_id,
          label: `${option.panel_id}-${option.panel_name}`,
        }));
        setPaneldrop(panel);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handlePanelID = (selectedDPT) => {
    setselectedPanelID(selectedDPT);
    setPanelID(selectedDPT ? selectedDPT.value : "");
  };
  const handlePanelIDSC = (selectedDPT) => {
    setselectedPanelIDSC(selectedDPT);
    setPanelIDSC(selectedDPT ? selectedDPT.value : "");
  };

  const filteredOptionPanelID = PanelDrop.map((option) => ({
    value: option.panel_id,
    label: `${option.panel_id} - ${option.panel_name}`,
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

  const columnDefs = [
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params) => {
        const cellWidth = params.column.getActualWidth();
        const isWideEnough = cellWidth > 20;
        const showIcons = isWideEnough;

        return (
          <div
            className="position-relative d-flex align-items-center"
            style={{ minHeight: "100%", justifyContent: "center" }}
          >
            {showIcons && (
              <>
                <span
                  className="icon mx-2"
                  onClick={() => handleUpdate(params.data, params.node.data)}
                  style={{ cursor: "pointer" }}
                >
                  <i className="fa-regular fa-floppy-disk"></i>
                </span>

                <span
                  className="icon mx-2"
                  onClick={() => handleDelete(params.data)}
                  style={{ cursor: "pointer" }}
                >
                  <i className="fa-solid fa-trash"></i>
                </span>
              </>
            )}
          </div>
        );
      },
    },
    {
      headerName: "Member ID",
      field: "member_id",
      editable: true,
    },
    {
      headerName: "Panel ID",
      field: "panel_id",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: panelDrop.map((d) => d.value),
      },
      valueFormatter: (params) => {
        const dept = panelDrop.find((d) => d.value === params.value);
        return dept ? dept.label : params.value;
      },
    },
    {
      headerName: "Employee ID",
      field: "employee_id",
      editable: true,
    },
    {
      headerName: "Role",
      field: "Role",
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

  const handleSave = async () => {
    if (!Role || !PanelID || !EmployeeID) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }

    try {
      const Header = {
        panel_id: PanelID,
        Role: Role,
        employee_id: EmployeeID,
        company_code: sessionStorage.getItem("selectedCompanyCode"),
        created_by: sessionStorage.getItem("selectedUserCode"),
      };

      const response = await fetch(`${config.apiBaseUrl}/interview_panel_membersInsert`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(Header),
        },
      );
      if (response.ok) {
        console.log("Data inserted successfully");
        toast.success("Data inserted successfully!", {
          onClose: () => window.location.reload(),
        });
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to insert sales data");
        console.error(errorResponse.details || errorResponse.message);
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error("Error inserting data: " + error.message);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const body = {
        member_id: member_id,
        panel_id: PanelIDSC,
        employee_id: EmployeeIDSC,
        Role: RoleSC,
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      };

      const response = await fetch(
        `${config.apiBaseUrl}/InterviewPanelMembers`,
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
          member_id: matchedItem.member_id,
          Role: matchedItem.Role,
          employee_id: matchedItem.employee_id,
          panel_id: matchedItem.panel_id,
          keyfield: matchedItem.keyfield,
        }));
        setRowData(newRows);
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
    } finally {
      setLoading(false);
    }
  };

  const reloadGridData = () => {
    setRowData([]);
    searchClearInputFields();
  };

  const handleUpdate = async (rowData) => {
    setLoading(true);
    showConfirmationToast(
      "Are you sure you want to update the data in the selected rows?",
      async () => {
        try {
          const company_code = sessionStorage.getItem("selectedCompanyCode");
          const modified_by = sessionStorage.getItem("selectedUserCode");

          const dataToSend = {
            interview_panel_membersData: Array.isArray(rowData)
              ? rowData
              : [rowData],
          };

          const response = await fetch(
            `${config.apiBaseUrl}/interview_panel_membersLoopUpdate`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                company_code: company_code,
                "modified-by": modified_by,
              },
              body: JSON.stringify(dataToSend),
            },
          );

          if (response.ok) {
            toast.success("Data updated successfully", {
              onClose: () => handleSearch(), // Runs handleSearch when toast closes
            });
          } else {
            const errorResponse = await response.json();
            toast.warning(
              errorResponse.message || "Failed to insert sales data",
            );
          }
        } catch (error) {
          console.error("Error deleting rows:", error);
          toast.error("Error Deleting Data: " + error.message);
        } finally {
          setLoading(false);
        }
      },
      () => {
        toast.info("Data updated cancelled.");
      },
    );
  };

  const handleDelete = async (rowData) => {
    setLoading(true);
    showConfirmationToast(
      "Are you sure you want to Delete the data in the selected rows?",
      async () => {
        try {
          const company_code = sessionStorage.getItem("selectedCompanyCode");

          const dataToSend = {
            interview_panel_membersData: Array.isArray(rowData)
              ? rowData
              : [rowData],
          };

          const response = await fetch(
            `${config.apiBaseUrl}/interview_panel_membersLoopDelete`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                company_code: company_code,
              },
              body: JSON.stringify(dataToSend),
            },
          );

          if (response.ok) {
            toast.success("Data deleted successfully", {
              onClose: () => handleSearch(),
            });
          } else {
            const errorResponse = await response.json();
            toast.warning(
              errorResponse.message || "Failed to insert sales data",
            );
          }
        } catch (error) {
          console.error("Error deleting rows:", error);
          toast.error("Error Deleting Data: " + error.message);
        } finally {
          setLoading(false);
        }
      },
      () => {
        toast.info("Data Delete cancelled.");
      },
    );
  };

  const tabs = [
    { label: "Job Master" },
    { label: "Candidate Master" },
    { label: "Interview Panel" },
    { label: "Panel Members" },
    { label: "Interview schedule" },
    { label: "Interview Feedback" },
    { label: "Interview Decision" },
  ];

  const handleTabClick = (tabLabel) => {
    setActiveTab(tabLabel);
    switch (tabLabel) {
      case "Candidate Master":
        CandidateMaster();
        break;

      case "Job Master":
        JobMaster();
        break;
      case "Interview Panel":
        InterviewPanel();
        break;
      case "Panel Members":
        InterviewPanelMembers();
        break;

      case "Interview schedule":
        InterviewSchedule();
        break;
      case "Interview Feedback":
        InterviewFeedback();
        break;
      case "Interview Decision":
        InterviewDecision();
        break;
      default:
        break;
    }
  };

  const CandidateMaster = () => {
    navigate("/CandidateMaster");
  };

  const JobMaster = () => {
    navigate("/JobMaster");
  };

  const InterviewPanel = () => {
    navigate("/InterviewPanel");
  };

  const InterviewPanelMembers = () => {
    navigate("/InterviewPanelMem");
  };

  const InterviewSchedule = () => {
    navigate("/InterviewSchedule");
  };

  const InterviewFeedback = () => {
    navigate("/InterviewFeedback");
  };

  const InterviewDecision = () => {
    navigate("/InterviewDecision");
  };

  const getCSSVariable = (variableName) => {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(variableName)
      .trim();
  };

  const transformRowData = (data) => {
    return data.map((row) => ({
      "Member ID": row.member_id || "",
      "Panel ID": row.panel_id || "",
      "Employee ID": row.employee_id || "",
      "Role": row.Role || "",
    }));
  };

  const handleExportToExcel = () => {
    if (!rowData || rowData.length === 0) {
      toast.warning("There is no data to export.");
      return;
    }

    const screenName = "Panel Members Search Report";
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Panel Members");

    XLSX.writeFile(workbook, "Panel_Members_Search_Report.xlsx");
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
          <h1 className="page-title">Panel Members</h1>
          <div className="action-wrapper">
            <div onClick={handleSave} className="action-icon add">
              <span className="tooltip">Save</span>
              <i class="fa-solid fa-floppy-disk"></i>
            </div>
          </div>
        </div>
      </div>
      <TabButtons
        tabs={tabs}
        activeTab={activeTab}
        onTabClick={handleTabClick}
      />
      <div className="shadow-lg p-3 bg-light rounded mt-2 container-form-box">
        <div className="row g-3">
          {/* <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="number"
                placeholder=""
                title="Please Enter the Company Contribution"
                required
                autoComplete="off"
                value={member_id}
                onChange={(e) => setmember_id((e.target.value))}
              />
              <label for="sname" className={`exp-form-labels ${error && !member_id ? 'text-danger' : ''}`}>Member ID<span className="text-danger">*</span></label>
            </div>
          </div> */}

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedPanelID ? "has-value" : ""} 
              ${isSelectPanelID ? "is-focused" : ""}`}
            >
              <Select
                id="department"
                placeholder=" "
                onFocus={() => setIsisSelectPanelID(true)}
                onBlur={() => setIsisSelectPanelID(false)}
                classNamePrefix="react-select"
                isClearable
                type="text"
                value={selectedPanelID}
                onChange={handlePanelID}
                options={filteredOptionPanelID}
              />
              <label
                htmlFor="selecteddpt"
                className={`floating-label ${error && !selectedPanelID ? "text-danger" : ""}`}
              >
                Panel ID<span className="text-danger">*</span>
              </label>
            </div>
          </div>

          <div className={`col-md-${empColSize}`}>
            <div
              className={`inputGroup selectGroup
              ${selectedEmployeeID.length > 0 ? "has-value" : ""}
              ${isSelectEmployeeID ? "is-focused" : ""}`}
            >
              <Select
                id="employee"
                isMulti
                isClearable
                placeholder=" "
                value={selectedEmployeeID}
                onChange={handleEmployeeID}
                onFocus={() => setisSelectEmployeeID(true)}
                onBlur={() => setisSelectEmployeeID(false)}
                options={filteredOptionEmployeeID}
                classNamePrefix="react-select"
              />

              <label className={`floating-label ${error && selectedEmployeeID.length === 0 ? "text-danger" : ""}`}>
                Employee ID<span className="text-danger">*</span>
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
                title="Please Enter the Employee PF"
                required
                autoComplete="off"
                value={Role}
                maxLength={50}
                onChange={(e) => setRole(e.target.value)}
              />
              <label
                for="add1"
                className={`exp-form-labels ${error && !Role ? "text-danger" : ""}`}
              >
                Role<span className="text-danger">*</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="shadow-lg p-3 bg-light rounded mt-2 container-form-box">
        <div className="header-flex">
          <h6 className="">Search Criteria:</h6>
        </div>
        <div className="row g-3">
          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="add3"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required
                title="Please Choose the Start Year"
                autoComplete="off"
                value={member_id}
                onChange={(e) => setmember_id(e.target.value)}
              />
              <label For="city" className="exp-form-labels">
                Member ID
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

          <div className={`col-md-${empColSizeSc}`}>
            <div
              className={`inputGroup selectGroup 
              ${selectedEmployeeIDSC.length > 0 ? "has-value" : ""} 
              ${isSelectEmployeeIDSC ? "is-focused" : ""}`}
            >
              <Select
                id="employee"
                placeholder=" "
                isMulti
                classNamePrefix="react-select"
                isClearable
                value={selectedEmployeeIDSC}
                onChange={handleEmployeeIDSC}
                options={filteredOptionEmployeeID}
                onFocus={() => setisSelectEmployeeIDSC(true)}
                onBlur={() => setisSelectEmployeeIDSC(false)}
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
                title="Please Enter the Employee PF"
                required
                autoComplete="off"
                value={RoleSC}
                onChange={(e) => setRoleSC(e.target.value)}
              />
              <label for="add1" className={`exp-form-labels`}>
                Role
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
        <div class="ag-theme-alpine" style={{ height: 455, width: "100%" }}>
          <AgGridReact
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
export default InterviewPanelMem;
