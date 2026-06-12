import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
// import "./apps.css";
import './App.css';
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import labels from "./Labels";
import { showConfirmationToast } from './ToastConfirmation';
import LoadingScreen from './Loading';

const config = require("./Apiconfig");

function CompanyMappingGrid() {
  const [open2, setOpen2] = React.useState(false);
  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const navigate = useNavigate();
  const [editedData, setEditedData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [user_code, setuser_code] = useState("");
  const [company_no, setcompany_no] = useState("");
  const [location_no, setlocation_no] = useState("");
  const [status, setstatus] = useState("");
  const [companynodrop, setcompanynodrop] = useState([]);
  const [locationnodrop, setlocationnodrop] = useState([]);
  const [statusdrop, setStatusdrop] = useState([]);
  const [statusgriddrop, setStatusGriddrop] = useState([]);
  const [usercodedrop, setusercodedrop] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [hasValueChanged, setHasValueChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSelectFocused, setIsSelectFocused] = useState(false);

  const [createdBy, setCreatedBy] = useState("");
  const [modifiedBy, setModifiedBy] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [modifiedDate, setModifiedDate] = useState("");

  const location = useLocation();

  //code added by Harish purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem("permissions")) || {};
  const companyMappingPermission = permissions
    .filter((permission) => permission.screen_type === "CompanyMapping")
    .map((permission) => permission.permission_type.toLowerCase());

  useEffect(() => {
    const handleKeyDown = (event) => {
      const isReloadShortcut =
        (event.ctrlKey && event.key.toLowerCase() === "r") ||
        (event.altKey && event.key.toLowerCase() === "r") ||
        event.key === "F5";

      if (isReloadShortcut) {
        event.preventDefault();
        clearInputFields();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (location.state?.preservedInputs) {

      const inputs = location.state.preservedInputs;

      setuser_code(inputs.user_code || "");
      setcompany_no(inputs.company_no || "");
      setlocation_no(inputs.location_no || "");
      setstatus(inputs.status || "");

      if (inputs.status) {
        setSelectedStatus({
          label: inputs.status,
          value: inputs.status,
        });
      }

      if (location.state?.refreshGrid) {
        handleSearch(inputs); 
      }
    }
  }, [location.state]);

  const clearInputFields = () => {
    setuser_code("");
    setcompany_no("");
    setlocation_no("");
    setSelectedStatus("");
    setstatus("");
    setRowData([]);
  };

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/usercode`)
      .then((response) => response.json())
      .then((data) => {
        const UserOption = data.map((option) => option.user_code);
        setusercodedrop(UserOption);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/Companyno`)
      .then((response) => response.json())
      .then((data) => {
        const CompanyOption = data.map((option) => option.company_no);
        setcompanynodrop(CompanyOption);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/locationno`)
      .then((response) => response.json())
      .then((data) => {
        const LocationOption = data.map((option) => option.location_no);
        setlocationnodrop(LocationOption);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    fetch(`${config.apiBaseUrl}/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((response) => response.json())
      .then((data) => {
        const statusOption = data.map(option => option.attributedetails_name);
        setStatusGriddrop(statusOption);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    fetch(`${config.apiBaseUrl}/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setStatusdrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);


  const filteredOptionStatus = statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleChangeStatus = (selectedStatus) => {
    setSelectedStatus(selectedStatus);
    setstatus(selectedStatus ? selectedStatus.value : "");
    setHasValueChanged(true);
  };

  const handleSearch = async (searchParams = null) => {
    setLoading(true);
    try {
      const company_code = sessionStorage.getItem("selectedCompanyCode");
      const response = await fetch(`${config.apiBaseUrl}/companymappingsearchdata`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            company_no: searchParams?.company_no ?? company_no,
            user_code: searchParams?.user_code ?? user_code,
            company_code,
            location_no: searchParams?.location_no ?? location_no,
            status: searchParams?.status ?? status,
          }),
        }
      );
      if (response.ok) {
        const searchData = await response.json();
        setRowData(searchData);
        console.log("data fetched successfully");
      } else if (response.status === 404) {
        console.log("Data not found");
        toast.warning("Data not found")
        setRowData([]);
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to insert sales data");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Error updating data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const reloadGridData = () => {
    window.location.reload();
  };

  const columnDefs = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      headerName: "User Code",
      field: "user_code",
      cellClass: "ag-link-cell",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        maxLength: 18,
        values: usercodedrop,
      },
      cellRenderer: (params) => {
        const handleClick = () => {
          handleNavigateWithRowData(params.data);
        };

        return (
          <span
            style={{ cursor: "pointer" }}
            onClick={handleClick}
          >
            {params.value}
          </span>
        );
      }
    },
    {
      headerName: "Company Code",
      field: "company_no",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        maxLength: 18,
        values: companynodrop,
      },
    },
    {
      headerName: "Location No",
      field: "location_no",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        maxLength: 18,
        values: locationnodrop,
      },
    },
    {
      headerName: "Status",
      field: "status",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: statusgriddrop,
      },
    },
    {
      headerName: "Order No",
      field: "order_no",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditorParams: {
        maxLength: 50,
      },
    },
    {
      headerName: "Keyfiels",
      field: "keyfiels",
      editable: true,
      filter: true,
      hide: true,
      sortable: false,
    },
  ];

  const defaultColDef = {
    resizable: true,
    wrapText: false,
    editable: true,
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  const getCSSVariable = (variableName) => {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(variableName)
      .trim();
  };

  const generateReport = () => {
    const selectedRows = gridApi.getSelectedRows();
    if (selectedRows.length === 0) {
      toast.warning("Please select at least one row to generate a report");
      return
    };

    const reportData = selectedRows.map((row) => {
      const safeValue = (val) => (val !== undefined && val !== null ? val : '');

      return {
        "User Code": safeValue(row.user_code),
        "Company No": safeValue(row.company_no),
        "Location No": safeValue(row.location_no),
        Status: safeValue(row.status),
        "Order No": safeValue(row.order_no),
      };
    });

    /* ================= READ THEME COLORS ================= */

    const headerGradientStart = getCSSVariable("--but");
    const tableHeaderBg = getCSSVariable("--ag-header");
    const fontColor = getCSSVariable("--font-color");
    const rowAltColor = getCSSVariable("--ag-row");
    const hoverColor = getCSSVariable("--ag-hover");

    const logoUrl = window.location.origin + "/favicon.ico";
    const reportWindow = window.open("", "_blank");
    const link = reportWindow.document.createElement("link");
    link.rel = "icon";
    link.type = "image/x-icon";
    link.href = logoUrl;

    // 🔥 append to HEAD
    reportWindow.document.head.appendChild(link);
    reportWindow.document.write("<html><head><title>Company Mapping Report</title>");
    reportWindow.document.write("<style>");
    reportWindow.document.write(`
      body {
            font-family: 'Segoe UI', sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f4f6f9;
            color: ${fontColor};
          }
  
          .header {
            display: flex;
            align-items: center;
            background: ${tableHeaderBg};
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
            background-color: ${tableHeaderBg};
            color: white;
            padding: 10px;
            text-align: left;
          }
  
          td {
            padding: 8px;
            border-bottom: 1px solid #ddd;
          }
  
          tr:nth-child(even) {
            background-color: ${rowAltColor};
          }
  
          tr:hover {
            background-color: ${hoverColor};
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
            background: ${headerGradientStart};
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
          }
  
          .print-btn:hover {
            opacity: 0.85;
          }
  
          @media print {
          body {
            background: white;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
            
          th {
            background-color: ${tableHeaderBg} !important;
            color: white !important;
          }
            
          tr:nth-child(even) {
            background-color: ${rowAltColor} !important;
          }
            
          .header {
            background: ${tableHeaderBg} !important;
            color: white !important;
          }
            
          .print-btn {
            display: none;
          }
        }
    `);
    reportWindow.document.write("</style></head><body>");
    reportWindow.document.write(`<div class="header">
    <img src="${logoUrl}" class="logo" />
    <div class="title-section">
      <h2>Company Mapping Report</h2>
    </div>
    </div>`);
    reportWindow.document.write(`<div style="margin-top:10px;">
    <strong>Total Records: ${selectedRows.length}</strong>
    <span style="float:right;">
      Printed Date: ${new Date().toLocaleDateString()}
    </span>
  </div>`);
    // reportWindow.document.write("<h1><u>Company Mapping Report</u></h1>");

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

    reportWindow.document.write(`
  <div style="text-align:center;">
    <button class="print-btn" onclick="window.print()">Print</button>
  </div>
`);
    reportWindow.document.write("</body></html>");
    reportWindow.document.close();
  };

  const onSelectionChanged = () => {
    const selectedNodes = gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    setSelectedRows(selectedData);
  };

  const handleNavigateToForm = () => {
    navigate("/AddCompanyMapping", { state: { mode: "create" } }); // Pass selectedRows as props to the Input component
  };

  const handleNavigateWithRowData = (selectedRow) => {
    navigate("/AddCompanyMapping", {
      state: {
        mode: "update", selectedRow, preservedRowData: rowData,
        preservedInputs: { user_code, company_no, location_no, status }
      }
    });
  };

  const onCellValueChanged = (params) => {
    const updatedRowData = [...rowData];
    const rowIndex = updatedRowData.findIndex(
      (row) => row.keyfiels === params.data.keyfiels
    );

    if (rowIndex !== -1) {
      updatedRowData[rowIndex][params.colDef.field] = params.newValue;
      setRowData(updatedRowData);

      setEditedData((prevData) => {
        const existingIndex = prevData.findIndex(
          (item) => item.keyfiels === params.data.keyfiels
        );

        if (existingIndex !== -1) {
          const updatedEdited = [...prevData];
          updatedEdited[existingIndex] = updatedRowData[rowIndex];
          return updatedEdited;
        } else {
          return [...prevData, updatedRowData[rowIndex]];
        }
      });
    }
  };

  const saveEditedData = async () => {
    const selectedRowsData = editedData.filter((row) =>
      selectedRows.some(
        (selectedRow) => selectedRow.keyfiels === row.keyfiels
      )
    );

    if (selectedRowsData.length === 0) {
      toast.warning("Please select a row to update its data")
      return;
    }

    showConfirmationToast(
      "Are you sure you want to update the data in the selected rows?",
      async () => {

        try {
          const company_code = sessionStorage.getItem("selectedCompanyCode");
          const modified_by = sessionStorage.getItem("selectedUserCode");


          const response = await fetch(`${config.apiBaseUrl}/updcompanymapping`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              company_code: company_code,
              "modified-by": modified_by,
            },
            body: JSON.stringify({ editedData: selectedRowsData }),
          });

          if (response.status === 200) {
            setTimeout(() => {
              toast.success("Data Updated Successfully")
              handleSearch();
            }, 1000);
            return;
          } else {
            const errorResponse = await response.json();
            toast.warning(errorResponse.message || "Failed to insert sales data");
          }
        } catch (error) {
          console.error("Error saving data:", error);
          toast.error("Error Updating Data: " + error.message);
        }
      },
      () => {
        toast.info("Data update cancelled.");
      }
    );
  };

  const deleteSelectedRows = async () => {
    const selectedRows = gridApi.getSelectedRows();

    if (selectedRows.length === 0) {
      toast.warning("Please select atleast One Row to Delete");
      return;
    }

    const company_code = sessionStorage.getItem("selectedCompanyCode");
    const modified_by = sessionStorage.getItem("selectedUserCode");
    const keyfielsToDelete = selectedRows.map((row) => row.keyfiels);

    showConfirmationToast(
      "Are you sure you want to Delete the data in the selected rows?",
      async () => {

        try {
          const response = await fetch(
            `${config.apiBaseUrl}/commappingdeleteData`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                company_code: company_code,
                "Modified-By": modified_by,
              },
              body: JSON.stringify({ keyfiels: keyfielsToDelete }),
              company_code: company_code,
              modified_by: modified_by,
            }
          );

          if (response.ok) {
            console.log("Rows deleted successfully:", keyfielsToDelete);
            setTimeout(() => {
              toast.success("Data Deleted successfully")
              handleSearch();
            }, 1000);
          } else {
            const errorResponse = await response.json();
            toast.warning(errorResponse.message || "Failed to insert sales data");
          }
        } catch (error) {
          console.error("Error saving data:", error);
          toast.error("Error Deleting Data: " + error.message);
        }
      },
      () => {
        toast.info("Data Delete cancelled.");
      }
    );
  };

  const handleKeyDownStatus = async (e) => {
    if (e.key === "Enter" && hasValueChanged) {
      await handleSearch();
      setHasValueChanged(false);
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


  return (
    <div className="container-fluid Topnav-screen">
      <div align="">
        {loading && <LoadingScreen />}
        <ToastContainer position="top-right" className="toast-design" theme="colored" />
        <div className="shadow-lg p-1 bg-light rounded main-header-box">
          <div className="header-flex">
            <h1 className="page-title">Company Mapping</h1>
            <div className="action-wrapper desktop-actions">
              {["add", "all permission"].some((permission) => companyMappingPermission.includes(permission)) && (
                <div className="action-icon add" onClick={handleNavigateToForm}>
                  <span className="tooltip">Add</span>
                  <i class="fa-solid fa-user-plus"></i>
                </div>
              )}
              {["delete", "all permission"].some((permission) => companyMappingPermission.includes(permission)) && (
                <div className="action-icon delete" onClick={deleteSelectedRows}>
                  <span className="tooltip">Delete</span>
                  <i class="fa-solid fa-user-minus"></i>
                </div>
              )}
              {["update", "all permission"].some((permission) => companyMappingPermission.includes(permission)) && (
                <div className="action-icon update" onClick={saveEditedData}>
                  <span className="tooltip">Update</span>
                  <i class="fa-solid fa-pen-to-square"></i>
                </div>
              )}
              {["all permission", "view"].some((permission) => companyMappingPermission.includes(permission)) && (
                <div className="action-icon print" onClick={generateReport}>
                  <span className="tooltip">Print</span>
                  <i class="fa-solid fa-print"></i>
                </div>
              )}
            </div>

            {/* Mobile Dropdown */}
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

                {['add', 'all permission'].some(p => companyMappingPermission.includes(p)) && (
                  <li>
                    <button className="dropdown-item" onClick={handleNavigateToForm}>
                      <i className="fa-solid fa-user-plus add fs-4"></i>
                    </button>
                  </li>
                )}

                {['delete', 'all permission'].some(p => companyMappingPermission.includes(p)) && (
                  <li>
                    <button className="dropdown-item" onClick={deleteSelectedRows}>
                      <i className="fa-solid fa-user-minus delete fs-4"></i>
                    </button>
                  </li>
                )}

                {['update', 'all permission'].some(p => companyMappingPermission.includes(p)) && (
                  <li>
                    <button className="dropdown-item" onClick={saveEditedData}>
                      <i className="fa-solid fa-pen-to-square update fs-4"></i>
                    </button>
                  </li>
                )}

                {['all permission', 'view'].some(p => companyMappingPermission.includes(p)) && (
                  <li>
                    <button className="dropdown-item" onClick={generateReport}>
                      <i className="fa-solid fa-print text-dark fs-4"></i>
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="shadow-lg p-3 bg-light rounded mt-2 container-form-box">
          <div className="row g-3">

            <div className="col-md-2">
              <div className="inputGroup">
                <input
                  id="uscode"
                  className="exp-input-field form-control"
                  type="text"
                  placeholder=" "
                  required
                  title="Please Enter the User Code"
                  value={user_code}
                  onChange={(e) => setuser_code(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  maxLength={18}
                />
                <label for="uscode" class="exp-form-labels">User Code</label>
              </div>
            </div>

            <div className="col-md-2">
              <div className="inputGroup">
                <input
                  id="cno"
                  className="exp-input-field form-control"
                  type="text"
                  placeholder=" "
                  required
                  title="Please Enter the Company Code"
                  value={company_no}
                  onChange={(e) => setcompany_no(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  maxLength={18}
                />
                <label for="cno" class="exp-form-labels">Company Code</label>
              </div>
            </div>

            <div className="col-md-2">
              <div className="inputGroup">
                <input
                  id="locno"
                  className="exp-input-field form-control"
                  type="text"
                  placeholder=" "
                  required
                  title="Please Enter the Location No"
                  value={location_no}
                  onChange={(e) => setlocation_no(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  maxLength={18}
                />
                <label for="locno" class="exp-form-labels">Location No</label>
              </div>
            </div>

            <div className="col-md-2">
              <div
                className={`inputGroup selectGroup 
              ${selectedStatus ? "has-value" : ""} 
              ${isSelectFocused ? "is-focused" : ""}`}
                title="Please Select the Status"
              >
                <Select
                  id="status"
                  isClearable
                  value={selectedStatus}
                  onChange={handleChangeStatus}
                  options={filteredOptionStatus}
                  placeholder=""
                  classNamePrefix="react-select"
                  onKeyDown={handleKeyDownStatus}
                  onFocus={() => setIsSelectFocused(true)}
                  onBlur={() => setIsSelectFocused(false)}
                />
                <label for="status" class="floating-label">Status</label>
              </div>
            </div>

            <div className="col-md-2 d-flex justify-content-md-start justify-content-end align-items-center">
              <div className="search-btn-wrapper">
                <div className="icon-btn search" onClick={handleSearch}>
                  <span className="tooltip">Search</span>
                  <i className="fa-solid fa-magnifying-glass"></i>
                </div>

                <div className="icon-btn reload" onClick={clearInputFields}>
                  <span className="tooltip">Reload</span>
                  <i className="fa-solid fa-rotate-right"></i>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="shadow-lg pt-3 pb-3 bg-light rounded mt-2 container-form-box" style={{ width: "100%" }}>
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

      {/* <div className="shadow-lg p-2 bg-body-tertiary rounded mt-2 mb-2">
        <div className="row ms-2">
          <div className="d-flex justify-content-start">
            <p className="col-md-6">{labels.createdBy}: {createdBy}</p>
            <p className="col-md-6">
              {labels.createdDate}: {createdDate}
            </p>
          </div>
          <div className="d-flex justify-content-start">
            <p className="col-md-6">
              {labels.modifiedBy}: {modifiedBy}
            </p>
            <p className="col-md-6">
              {labels.modifiedDate}: {modifiedDate}
            </p>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default CompanyMappingGrid;
