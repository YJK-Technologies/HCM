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


const config = require("./Apiconfig");

function ShiftPatternMaster() {
  const [activeTab, setActiveTab] = useState("Shift Pattern Master");
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
  const [Pattern_Code, setPattern_Code] = useState("");
  const [Pattern_CodeSC, setPattern_CodeSC] = useState("");
  const [Pattern_Name, setPattern_Name] = useState("");
  const [Pattern_NameSC, setPattern_NameSC] = useState("");
  const [Rotation_Days, setRotation_Days] = useState("");
  const [Rotation_DaysSC, setRotation_DaysSC] = useState("");
  const [Description, setDescription] = useState("");
  const [DescriptionSC, setDescriptionSC] = useState("");
  const [hasValueChanged, setHasValueChanged] = useState(false);
  const [hasValueChangedSC, setHasValueChangedSC] = useState(false);
  const [selectedStatusSC, setSelectedStatusSC] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [isSelectFocused, setIsSelectFocused] = useState(false);
  const [isSelectFocusedSC, setIsSelectFocusedSC] = useState(false);
  const [statusdrop, setStatusdrop] = useState([]);
  const [statusdropSC, setStatusdropSC] = useState([]);
  const [statusgriddrop, setStatusGriddrop] = useState([]);
  const [Status, setStatus] = useState("");
  const [StatusSC, setStatusSC] = useState("");

  const [createdBy, setCreatedBy] = useState("");
  const [modifiedBy, setModifiedBy] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [modifiedDate, setModifiedDate] = useState("");

  //code added by Harish purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem("permissions")) || {};
  const companyMappingPermission = permissions
    .filter((permission) => permission.screen_type === "Company Mapping")
    .map((permission) => permission.permission_type.toLowerCase());

  const handleChangeStatusSC = (selectedStatusSC) => {
    setSelectedStatusSC(selectedStatusSC);
    setStatusSC(selectedStatusSC ? selectedStatusSC.value : "");
    setHasValueChangedSC(true);
  };
  const handleChangeStatus = (selectedStatus) => {
    setSelectedStatus(selectedStatus);
    setStatus(selectedStatus ? selectedStatus.value : "");
    setHasValueChanged(true);
  };

  const filteredOptionStatusSC = statusdropSC.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));
  const filteredOptionStatus = statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

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
      .then((val) => setStatusdrop(val))
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
      .then((val) => setStatusdropSC(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleKeyDownStatus = async (e) => {
    if (e.key === "Enter" && hasValueChanged) {
      await handleSearch();
      setHasValueChanged(false);
    }
  };
  const handleKeyDownStatusSC = async (e) => {
    if (e.key === "Enter" && hasValueChangedSC) {
      await handleSearch();
      setHasValueChangedSC(false);
    }
  };


  const handleSearch = async () => {
    setLoading(true);

    try {
      const company_code = sessionStorage.getItem("selectedCompanyCode");

      const response = await fetch(`${config.apiBaseUrl}/ShiftPattern_SC`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Shift_Pattern_ID: Shift_Pattern_IDSC || null,
          Pattern_Code: Pattern_CodeSC || null,
          Pattern_Name: Pattern_NameSC || null,
          Rotation_Days: Rotation_DaysSC || null,
          Description: DescriptionSC || null,
          Status: StatusSC || null,

          company_code,
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
    window.location.reload();
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
      editable: false,
      cellStyle: { textAlign: "left" },
    },
    {
      headerName: "Pattern Code",
      field: "Pattern_Code",
      editable: true,
    },
    {
      headerName: "Pattern Name",
      field: "Pattern_Name",
      editable: true,
    },
    {
      headerName: "Rotation Days",
      field: "Rotation_Days",
      editable: true,
    },
    {
      headerName: "Description",
      field: "Description",
      editable: true,
    },
    {
      headerName: "Status",
      field: "Status",
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: statusgriddrop,
      },
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
    // if (!Shift_ID || !Shift_Code || !Shift_Name ) {
    //   toast.warning("Error: Missing required fields");
    //   return;
    // }

    setLoading(true);

    try {
      const response = await fetch(
        `${config.apiBaseUrl}/ShiftPattern_Insert`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Shift_Pattern_ID: Shift_Pattern_ID,
            Pattern_Code: Pattern_Code,
            Pattern_Name: Pattern_Name,
            Rotation_Days: Number(Rotation_Days),
            Description: Description,
            Status: Status,
            company_code: sessionStorage.getItem("selectedCompanyCode"),
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
          const company_code = sessionStorage.getItem("selectedCompanyCode");
          const modified_by = sessionStorage.getItem("selectedUserCode");

          const dataToSend = {
            Shift_MasterData: Array.isArray(rowData)
              ? rowData.map((row) => ({
                ...row,
                company_code,
                modified_by,
              }))
              : [
                {
                  ...rowData,
                  company_code,
                  modified_by,
                },
              ],
          };

          const response = await fetch(
            `${config.apiBaseUrl}/ShiftPattern_Update`,
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
            Shift_MasterData: Array.isArray(rowData) ? rowData : [rowData],
          };

          const response = await fetch(
            `${config.apiBaseUrl}/ShiftPattern_Delete`,
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
            <h1 className="page-title">Shift Pattern Master</h1>
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
                  id="TimeZone_ID"
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
                  value={Pattern_Code}
                  onChange={(e) => setPattern_Code(e.target.value)}
                />
                <label
                  for="state"
                  className={`exp-form-labels ${error && !Pattern_Code ? "text-danger" : ""}`}
                >
                  Pattern Code<span className="text-danger">*</span>
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
                  value={Pattern_Name}
                  onChange={(e) => setPattern_Name(e.target.value)}
                />
                <label
                  for="state"
                  className={`exp-form-labels ${error && !Pattern_Name ? "text-danger" : ""}`}
                >
                  Pattern Name<span className="text-danger">*</span>
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
                  value={Rotation_Days}
                  onChange={(e) => setRotation_Days(e.target.value)}
                />
                <label
                  for="state"
                  className={`exp-form-labels ${error && !Rotation_Days ? "text-danger" : ""}`}
                >
                  Rotation Days<span className="text-danger">*</span>
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
                  value={Description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <label
                  for="state"
                  className={`exp-form-labels ${error && !Description ? "text-danger" : ""}`}
                >
                  Description<span className="text-danger">*</span>
                </label>
              </div>
            </div>

            <div className="col-md-2">
              <div
                className={`inputGroup selectGroup 
              ${selectedStatus ? "has-value" : ""} 
              ${isSelectFocused ? "is-focused" : ""}`}
              >
                <Select
                  id="status"
                  isClearable
                  value={selectedStatus}
                  onChange={handleChangeStatus}
                  options={filteredOptionStatus}
                  classNamePrefix="react-select"
                  placeholder=""
                  onFocus={() => setIsSelectFocused(true)}
                  onBlur={() => setIsSelectFocused(false)}
                  onKeyDown={handleKeyDownStatus}
                />
                <label class="floating-label">Status</label>
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
                  value={Pattern_CodeSC}
                  onChange={(e) => setPattern_CodeSC(e.target.value)}
                />
                <label htmlFor="fdate" className={`exp-form-labels`}>
                  Pattern Code
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
                  value={Pattern_NameSC}
                  onChange={(e) => setPattern_NameSC(e.target.value)}
                />
                <label htmlFor="fdate" className={`exp-form-labels`}>
                  Pattern Name
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
                  value={Rotation_DaysSC}
                  onChange={(e) => setRotation_DaysSC(e.target.value)}
                />
                <label htmlFor="fdate" className={`exp-form-labels`}>
                  Rotation Days
                </label>
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
                  value={DescriptionSC}
                  onChange={(e) => setDescriptionSC(e.target.value)}
                />
                <label htmlFor="fdate" className={`exp-form-labels`}>
                  Description
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
                  options={filteredOptionStatusSC}
                  classNamePrefix="react-select"
                  placeholder=""
                  onFocus={() => setIsSelectFocusedSC(true)}
                  onBlur={() => setIsSelectFocusedSC(false)}
                  onKeyDown={handleKeyDownStatusSC}
                />
                <label class="floating-label">Status</label>
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

export default ShiftPatternMaster;
