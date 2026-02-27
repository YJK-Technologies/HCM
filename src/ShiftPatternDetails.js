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
import * as XLSX from "xlsx-js-style";

const config = require("./Apiconfig");

function ShiftPatternDetails() {
  const [activeTab, setActiveTab] = useState("Shift Pattern Details");
  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const navigate = useNavigate();
  const [editedData, setEditedData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [key_field, setkey_field] = useState("");
  const modified_by = sessionStorage.getItem("selectedUserCode");
  const [Shift_Pattern_ID, setShift_Pattern_ID] = useState("");
  const [Shift_Pattern_IDSC, setShift_Pattern_IDSC] = useState("");
  const [Pattern_Detail_ID, setPattern_Detail_ID] = useState("");
  const [Pattern_CodeSC, setPattern_CodeSC] = useState("");
  const [Day_Sequence, setDay_Sequence] = useState("");
  const [Pattern_Detail_IDSC, setPattern_Detail_IDSC] = useState("");
  const [Shift_ID, setShift_ID] = useState("");
  const [Day_SequenceSC, setDay_SequenceSC] = useState("");
  const [Is_Off_Day, setIs_Off_Day] = useState("");
  const [Is_Off_DaySC, setIs_Off_DaySC] = useState("");
  const [Shift_IDSC, setShift_IDSC] = useState("");
  const [statusgriddrop, setStatusGriddrop] = useState([]);

  const [createdBy, setCreatedBy] = useState("");
  const [modifiedBy, setModifiedBy] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [modifiedDate, setModifiedDate] = useState("");

  //code added by Harish purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem("permissions")) || {};
  const companyMappingPermission = permissions
    .filter((permission) => permission.screen_type === "Company Mapping")
    .map((permission) => permission.permission_type.toLowerCase());

  const searchClearInputFields = () => {
    setShift_Pattern_IDSC("");
    setPattern_Detail_IDSC("");
    setDay_SequenceSC("");
    setShift_IDSC("");
    setIs_Off_DaySC("");
  };


  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");
    fetch(`${config.apiBaseUrl}/status`, {
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


  const handleSearch = async () => {
    setLoading(true);

    try {
      const Company_Code = sessionStorage.getItem("selectedCompanyCode");

      const response = await fetch(`${config.apiBaseUrl}/ShiftPatternDetail_SC`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Shift_Pattern_ID: Shift_Pattern_IDSC || null,
          Pattern_Detail_ID: Pattern_Detail_IDSC || null,
          Day_Sequence: Day_SequenceSC || null,
          RotationShift_ID_Days: Shift_IDSC || null,
          Is_Off_Day: Is_Off_DaySC || null,
          Company_Code,
        }),
      });

      if (response.ok) {
        const searchData = await response.json();
        setRowData(searchData);
        console.log("data fetched successfully");
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
                  title="Update"
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
      headerName: "Shift Pattern ID",
      field: "Shift_Pattern_ID",
      editable: true,
      cellStyle: { textAlign: "left" },
    },
    {
      headerName: "Pattern Detail ID",
      field: "Pattern_Detail_ID",
      editable: false,
    },
    {
      headerName: "Day Sequence",
      field: "Day_Sequence",
      editable: true,
    },
    {
      headerName: "Shift ID",
      field: "Shift_ID",
      editable: true,
    },
    {
      headerName: "Is Off Day",
      field: "Is_Off_Day",
      editable: true,
    },
    {
      headerName: "keyfield",
      field: "keyfield",
      editable: true,
      filter: true,
      hide: true,
      sortable: false,
    },
  ];

  const defaultColDef = {
    resizable: true,
    wrapText: true,
    editable: true,
  };

  const tabs = [
    { label: "Shift Master" },
    { label: "Shift Type Master" },
    { label: "Shift Pattern Master" },
    { label: "Shift Pattern Details" },
    { label: "Employment Type Master" },
    { label: "Employee Shift Mapping" },
  ];

  const handleTabClick = (tabLabel) => {
    setActiveTab(tabLabel);
    switch (tabLabel) {
      case "Shift Master":
        ShiftMaster();
        break;
      case "Shift Type Master":
        ShiftTypeMaster();
        break;
      case "Shift Pattern Master":
        ShiftPatternMaster();
        break;
      case "Shift Pattern Details":
        ShiftPatternDetails();
        break;
      case "Employment Type Master":
        EmploymentTypeMaster();
        break;
      case "Employee Shift Mapping":
        EmployeeShiftMapping();
        break;
      default:
        break;
    }
  };

  const ShiftMaster = () => {
    navigate("/ShiftMasterGrid");
  };

  const ShiftTypeMaster = () => {
    navigate("/ShiftTypeMaster");
  };

  const ShiftPatternMaster = () => {
    navigate("/ShiftPatternMaster");
  };

  const ShiftPatternDetails = () => {
    navigate("/ShiftPatternDetails");
  };

  const EmploymentTypeMaster = () => {
    navigate("/EmployeeTypeMaster");
  };

  const EmployeeShiftMapping = () => {
    navigate("/EmployeeShiftMapping");
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

  const handleSave = async () => {
    if (!Shift_Pattern_ID || !Pattern_Detail_ID || !Day_Sequence || !Shift_ID || !Is_Off_Day) {
      toast.warning("Error: Missing required fields");
      setError(" ");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${config.apiBaseUrl}/Shift_Pattern_DetailInsert`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Shift_Pattern_ID: Shift_Pattern_ID,
            Pattern_Detail_ID: Pattern_Detail_ID,
            Day_Sequence: Day_Sequence,
            Shift_ID: Shift_ID,
            Is_Off_Day: Is_Off_Day,
            Company_Code: sessionStorage.getItem("selectedCompanyCode"),
            created_by: sessionStorage.getItem("selectedUserCode"),
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Data inserted successfully", {
          onClose: () => window.location.reload(),
        });
      } else {
        toast.warning(data.message || "Insert failed");
      }
    } catch (error) {
      console.error("Error inserting timezone:", error);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (rowData) => {
    setLoading(true);

    showConfirmationToast(
      "Are you sure you want to update the selected Shift Pattern data?",
      async () => {
        try {
          const Company_Code = sessionStorage.getItem("selectedCompanyCode");
          const Modified_by = sessionStorage.getItem("selectedUserCode");

          const dataToSend = {
            Shift_DetailData: Array.isArray(rowData)
              ? rowData.map((row) => ({
                ...row,
                Company_Code,
                Modified_by,
              }))
              : [
                {
                  ...rowData,
                  Company_Code,
                  Modified_by,
                },
              ],
          };

          const response = await fetch(
            `${config.apiBaseUrl}/Shift_Pattern_DetailUpdate`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(dataToSend),
            },
          );

          if (response.ok) {
            toast.success("ShiftPattern updated successfully", {
              onClose: () => handleSearch(),
            });
          } else {
            const errorResponse = await response.json();
            toast.warning(errorResponse.message || "Update failed");
          }
        } catch (error) {
          console.error("Update error:", error);
          toast.error("Error updating data: " + error.message);
        } finally {
          setLoading(false);
        }
      },
      () => toast.info("Update cancelled"),
    );
  };

  const handleDelete = async (rowData) => {
    setLoading(true);

    showConfirmationToast(
      "Are you sure you want to delete the selected shift data?",
      async () => {
        try {
          const Company_Code = sessionStorage.getItem("selectedCompanyCode");

          const dataToSend = {
            Shift_Pattern_DetailData: Array.isArray(rowData) ? rowData : [rowData],
          };

          const response = await fetch(
            `${config.apiBaseUrl}/Shift_Pattern_DetailLoopDelete`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Company_Code": Company_Code
              },
              body: JSON.stringify(dataToSend),
            },
          );

          if (response.ok) {
            toast.success("Shift deleted successfully", {
              onClose: () => handleSearch(), // refresh data
            });
          } else {
            const errorResponse = await response.json();
            toast.warning(errorResponse.message || "Delete failed");
          }
        } catch (error) {
          console.error("Error deleting shift rows:", error);
          toast.error("Error deleting shift data: " + error.message);
        } finally {
          setLoading(false);
        }
      },
      () => toast.info("Delete cancelled"),
    );
  };

  const getCSSVariable = (variableName) => {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(variableName)
      .trim();
  };

  const transformRowData = (data) => {
    return data.map((row) => ({
      "Shift Pattern ID": row.Shift_Pattern_ID || "",
      "Pattern Detail ID": row.Pattern_Detail_ID || "",
      "Day Sequence": row.Day_Sequence || "",
      "Shift ID": row.Shift_ID || "",
      "Is Off Day": row.Is_Off_Day || "",
    }));
  };

  const handleExportToExcel = () => {
    if (!rowData || rowData.length === 0) {
      toast.warning("There is no data to export.");
      return;
    }

    const screenName = "Shift Pattern Details Search Report";
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Shift Pattern Details");

    XLSX.writeFile(workbook, "Shift_Pattern_Details_Search_Report.xlsx");
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
            <h1 className="page-title">Shift Pattern Details</h1>
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
            <div className="col-md-2">
              <div className="inputGroup">
                <input
                  id="ShiftPatternID"
                  class="exp-input-field form-control"
                  type="text"
                  placeholder=" "
                  autoComplete="off"
                  required
                  value={Shift_Pattern_ID}
                  onChange={(e) => setShift_Pattern_ID(e.target.value)}
                />
                <label
                  for="state"
                  className={`exp-form-labels ${error && !Shift_Pattern_ID ? "text-danger" : ""}`}
                >
                  Shift Pattern ID<span className="text-danger">*</span>
                </label>
              </div>
            </div>

            <div className="col-md-2">
              <div className="inputGroup">
                <input
                  id="TimeZone_ID"
                  class="exp-input-field form-control"
                  type="text"
                  placeholder=" "
                  autoComplete="off"
                  required
                  value={Pattern_Detail_ID}
                  onChange={(e) => setPattern_Detail_ID(e.target.value)}
                />
                <label
                  for="state"
                  className={`exp-form-labels ${error && !Pattern_Detail_ID ? "text-danger" : ""}`}
                >
                  Pattern Detail ID<span className="text-danger">*</span>
                </label>
              </div>
            </div>

            <div className="col-md-2">
              <div className="inputGroup">
                <input
                  id="TimeZone_ID"
                  class="exp-input-field form-control"
                  type="number"
                  placeholder=" "
                  autoComplete="off"
                  required
                  value={Day_Sequence}
                  onChange={(e) => setDay_Sequence(e.target.value)}
                />
                <label
                  for="state"
                  className={`exp-form-labels ${error && !Day_Sequence ? "text-danger" : ""}`}
                >
                  Day Sequence<span className="text-danger">*</span>
                </label>
              </div>
            </div>

            <div className="col-md-2">
              <div className="inputGroup">
                <input
                  id="TimeZone_ID"
                  class="exp-input-field form-control"
                  type="number"
                  placeholder=" "
                  autoComplete="off"
                  required
                  value={Shift_ID}
                  onChange={(e) => setShift_ID(e.target.value)}
                />
                <label
                  for="state"
                  className={`exp-form-labels ${error && !Shift_ID ? "text-danger" : ""}`}
                >
                  Shift ID<span className="text-danger">*</span>
                </label>
              </div>
            </div>

            <div className="col-md-2">
              <div className="inputGroup">
                <input
                  id="TimeZone_ID"
                  class="exp-input-field form-control"
                  type="number"
                  placeholder=" "
                  autoComplete="off"
                  required
                  value={Is_Off_Day}
                  onChange={(e) => setIs_Off_Day(e.target.value)}
                />
                <label
                  for="state"
                  className={`exp-form-labels ${error && !Is_Off_Day ? "text-danger" : ""}`}
                >
                  Is Off Day<span className="text-danger">*</span>
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
                  id="TimeZone_ID"
                  class="exp-input-field form-control"
                  type="text"
                  placeholder=" "
                  autoComplete="off"
                  required
                  value={Shift_Pattern_IDSC}
                  onChange={(e) => setShift_Pattern_IDSC(e.target.value)}
                />
                <label htmlFor="fdate" className={`exp-form-labels`}>
                  Shift Pattern ID
                </label>
              </div>
            </div>

            <div className="col-md-2">
              <div className="inputGroup">
                <input
                  id="TimeZone_Name"
                  class="exp-input-field form-control"
                  type="text"
                  placeholder=" "
                  autoComplete="off"
                  required
                  value={Pattern_Detail_IDSC}
                  onChange={(e) => setPattern_Detail_IDSC(e.target.value)}
                />
                <label htmlFor="fdate" className={`exp-form-labels`}>
                  Pattern Detail ID
                </label>
              </div>
            </div>

            <div className="col-md-2">
              <div className="inputGroup">
                <input
                  id="TimeZone_Name"
                  class="exp-input-field form-control"
                  type="number"
                  placeholder=" "
                  autoComplete="off"
                  required
                  value={Day_SequenceSC}
                  onChange={(e) => setDay_SequenceSC(e.target.value)}
                />
                <label htmlFor="fdate" className={`exp-form-labels`}>
                  Day Sequence
                </label>
              </div>
            </div>

            <div className="col-md-2">
              <div className="inputGroup">
                <input
                  id="UTC_Offset"
                  class="exp-input-field form-control"
                  type="number"
                  placeholder=""
                  autoComplete="off"
                  required
                  value={Shift_IDSC}
                  onChange={(e) => setShift_IDSC(e.target.value)}
                />
                <label htmlFor="fdate" className={`exp-form-labels`}>
                  Shift ID
                </label>
              </div>
            </div>

            <div className="col-md-2">
              <div className="inputGroup">
                <input
                  id="TimeZone_ID"
                  class="exp-input-field form-control"
                  type="number"
                  placeholder=" "
                  autoComplete="off"
                  required
                  value={Is_Off_DaySC}
                  onChange={(e) => setIs_Off_DaySC(e.target.value)}
                />
                <label htmlFor="state" className={`exp-form-labels`}>
                  Is Off Day
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

export default ShiftPatternDetails;