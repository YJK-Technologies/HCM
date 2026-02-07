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

const config = require("./Apiconfig");

function ShiftTypeMaster() {
  const [activeTab, setActiveTab] = useState("Shift Type Master");
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
  const [Shift_Type_ID, setShift_Type_ID] = useState("");
  const [Shift_Type_IDSC, setShift_Type_IDSC] = useState("");
  const [Shift_Type, setShift_Type] = useState("");
  const [Shift_TypeSC, setShift_TypeSC] = useState("");
  const [Description, setDescription] = useState("");
  const [DescriptionSC, setDescriptionSC] = useState("");

  const [createdBy, setCreatedBy] = useState("");
  const [modifiedBy, setModifiedBy] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [modifiedDate, setModifiedDate] = useState("");

  //code added by Harish purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem("permissions")) || {};
  const companyMappingPermission = permissions
    .filter((permission) => permission.screen_type === "Company Mapping")
    .map((permission) => permission.permission_type.toLowerCase());

  const handleSearch = async () => {
    setLoading(true);

    try {
      const company_code = sessionStorage.getItem("selectedCompanyCode");

      const response = await fetch(`${config.apiBaseUrl}/getShift_TypeSC`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Shift_Type_ID: Shift_Type_IDSC || null,
          Shift_Type: Shift_TypeSC || null,
          Description: DescriptionSC || null,
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
      headerName: "Shift Type ID",
      field: "Shift_Type_ID",
      editable: false,
      cellStyle: { textAlign: "left" },
    },
    {
      headerName: "Shift Type",
      field: "Shift_Type",
      editable: true,
    },
    {
      headerName: "Description",
      field: "Description",
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
    { label: "Shift Pattern Master" }
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

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  const generateReport = () => {
    const selectedRows = gridApi.getSelectedRows();
    if (selectedRows.length === 0) {
      toast.warning("Please select at least one row to generate a report");
      return;
    }

    const reportData = selectedRows.map((row) => {
      const safeValue = (val) => (val !== undefined && val !== null ? val : "");

      return {
        "TimeZone ID": safeValue(row.TimeZone_ID),
        "TimeZone Name": safeValue(row.TimeZone_Name),
        "Location No": safeValue(row.location_no),
        Status: safeValue(row.status),
        "Order No": safeValue(row.order_no),
      };
    });

    const reportWindow = window.open("", "_blank");
    reportWindow.document.write(
      "<html><head><title>Company Mapping Report</title>",
    );
    reportWindow.document.write("<style>");
    reportWindow.document.write(`
      body {
          font-family: Arial, sans-serif;
          margin: 20px;
      }
      h1 {
          color: maroon;
          text-align: center;
          font-size: 24px;
          margin-bottom: 30px;
          text-decoration: underline;
      }
      table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
      }
      th, td {
          padding: 10px;
          text-align: left;
          border: 1px solid #ddd;
          vertical-align: top;
      }
      th {
          background-color: maroon;
          color: white;
          font-weight: bold;
      }
      td {
          background-color: #fdd9b5;
      }
      tr:nth-child(even) td {
          background-color: #fff0e1;
      }
      .report-button {
          display: block;
          width: 150px;
          margin: 20px auto;
          padding: 10px;
          background-color: maroon;
          color: white;
          border: none;
          cursor: pointer;
          font-size: 16px;
          text-align: center;
          border-radius: 5px;
      }
      .report-button:hover {
          background-color: darkred;
      }
      @media print {
          .report-button {
              display: none;
          }
          body {
              margin: 0;
              padding: 0;
          }
      }
    `);
    reportWindow.document.write("</style></head><body>");
    reportWindow.document.write("<h1><u>Company Mapping Report</u></h1>");

    // Create table with headers
    reportWindow.document.write("<table><thead><tr>");
    Object.keys(reportData[0]).forEach((key) => {
      reportWindow.document.write(`<th>${key}</th>`);
    });
    reportWindow.document.write("</tr></thead><tbody>");

    // Populate the rows
    reportData.forEach((row) => {
      reportWindow.document.write("<tr>");
      Object.values(row).forEach((value) => {
        reportWindow.document.write(`<td>${value}</td>`);
      });
      reportWindow.document.write("</tr>");
    });

    reportWindow.document.write("</tbody></table>");

    reportWindow.document.write(
      '<button class="report-button" title="Print" onclick="window.print()">Print</button>',
    );
    reportWindow.document.write("</body></html>");
    reportWindow.document.close();
  };

  const onSelectionChanged = () => {
    const selectedNodes = gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    setSelectedRows(selectedData);
  };

  const handleNavigateToForm = () => {
    navigate("/ShiftMaster", { state: { mode: "create" } }); // Pass selectedRows as props to the Input component
  };
  const handleNavigateWithRowData = (selectedRow) => {
    navigate("/ShiftMaster", {
      state: {
        mode: "update",
        selectedRow: {
          ...selectedRow,
          DST_Flag: Number(selectedRow.DST_Flag), // ensures 0 or 1
        },
      },
    });
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
    if (!Shift_Type_ID || !Shift_Type ) {
      toast.warning("Error: Missing required fields");
      setError(" ");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${config.apiBaseUrl}/Shift_Type_MasterInsert`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Shift_Type_ID: Number(Shift_Type_ID),
            Shift_Type: Shift_Type,
            Description: Description,
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
      "Are you sure you want to update the selected shift data?",
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
            `${config.apiBaseUrl}/Shift_TypeMasterUpdate`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                
              },
              body: JSON.stringify(dataToSend),
            },
          );

          if (response.ok) {
            toast.success("Shift updated successfully", {
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
          const company_code = sessionStorage.getItem("selectedCompanyCode");

          const dataToSend = {
            Shift_MasterData: Array.isArray(rowData) ? rowData : [rowData],
          };

          const response = await fetch(
            `${config.apiBaseUrl}/Shift_TypeMasterDelete`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "company_code": company_code
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
            <h1 className="page-title">Shift Type Master</h1>
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
                  type="number"
                  placeholder=" "
                  autoComplete="off"
                  required
                  value={Shift_Type_ID}
                  onChange={(e) => setShift_Type_ID(e.target.value)}
                />
                <label
                  for="state"
                  className={`exp-form-labels ${error && !Shift_Type_ID ? "text-danger" : ""}`}
                >
                  Shift Type ID<span className="text-danger">*</span>
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
                  value={Shift_Type}
                  onChange={(e) => setShift_Type(e.target.value)}
                />
                <label
                  for="state"
                  className={`exp-form-labels ${error && !Shift_Type ? "text-danger" : ""}`}
                >
                  Shift Type<span className="text-danger">*</span>
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
                <label for="state" className={`exp-form-labels`}>
                  Description
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
                  type="number"
                  placeholder=" "
                  autoComplete="off"
                  required
                  value={Shift_Type_IDSC}
                  onChange={(e) => setShift_Type_IDSC(e.target.value)}
                />
                <label htmlFor="fdate" className={`exp-form-labels`}>
                  Shift Type ID
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
                  value={Shift_TypeSC}
                  onChange={(e) => setShift_TypeSC(e.target.value)}
                />
                <label htmlFor="fdate" className={`exp-form-labels`}>
                  Shift Type
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

export default ShiftTypeMaster;
