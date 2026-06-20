import React, { useState, useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "./apps.css";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { showConfirmationToast } from './ToastConfirmation';
import LoadingScreen from './Loading';
const config = require('./Apiconfig');


function Desgination() {
  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const navigate = useNavigate();
  const [editedData, setEditedData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [statusdrop, setStatusdrop] = useState([]);
  const [statusgriddrop, setStatusGriddrop] = useState([]);
  const [dept_id, setdept_id] = useState("");
  const [desgination_id, setdesgination_id] = useState("");
  const [status, setStatus] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(null);
  const Status = useRef(null);
  const [hasValueChanged, setHasValueChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createdBy, setCreatedBy] = useState("");
  const [modifiedBy, setModifiedBy] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [modifiedDate, setModifiedDate] = useState("");
  const [isSelectFocused, setIsSelectFocused] = useState(false);

  const location = useLocation();

  //code added by Pavun purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem('permissions')) || {};
  const desgiantionInfoPermissions = permissions
    .filter(permission => permission.screen_type === 'DesgiantionInfo')
    .map(permission => permission.permission_type.toLowerCase());

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
    // if (location.state?.preservedRowData) {
    //   setRowData(location.state.preservedRowData);
    // }

    if (location.state?.preservedInputs) {
      const inputs = location.state.preservedInputs;

      setdept_id(inputs.dept_id || "");
      setdesgination_id(inputs.desgination_id || "");
      setStatus(inputs.status || "");

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
    setdept_id("");
    setdesgination_id("");
    setSelectedStatus("");
    setStatus("");
    setRowData([]);
  }

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    }).then((response) => response.json())
      .then((data) => {
        // Extract city names from the fetched data
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

  const filteredOptionStatus = Array.isArray(statusdrop)
    ? statusdrop.map((option) => ({
      value: option.attributedetails_name,
      label: option.attributedetails_name,
    }))
    : [];

  const handleChangeStatus = (selectedStatus) => {
    setSelectedStatus(selectedStatus);
    setStatus(selectedStatus ? selectedStatus.value : '');
    setHasValueChanged(true);
  };

  const handleSearch = async (searchParams = null) => {
    const company_code = sessionStorage.getItem('selectedCompanyCode')
    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/DesginationSerachData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          dept_id: searchParams?.dept_id ?? dept_id, 
          desgination_id: searchParams?.desgination_id ?? desgination_id, 
          status: searchParams?.status ?? status, 
          company_code 
        })
      });
      if (response.ok) {
        const searchData = await response.json();
        setRowData(searchData);
        console.log(searchData)
        console.log("data fetched successfully")

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
      headerName: "Department ID",
      field: "dept_id",
      cellStyle: { textAlign: "left" },
      // minWidth: 180,
      cellClass: "ag-link-cell",
      checkboxSelection: true,
      cellEditorParams: {
        maxLength: 20,
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
      },
    },
    {
      headerName: "Desgination ID",
      field: "desgination_id",
      editable: true,
      cellStyle: { textAlign: "left" },
      // minWidth: 200,
      editable: false,
      cellEditorParams: {
        maxLength: 20,
      },
    },
    {
      headerName: "Desgination",
      field: "desgination",
      editable: true,
      cellStyle: { textAlign: "left" },
      // minWidth: 150,
      cellEditorParams: {
        maxLength: 50,
      },
    },
    {
      headerName: "Status",
      field: "status",
      editable: true,
      cellStyle: { textAlign: "left" },
      // minWidth: 150,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: statusgriddrop
      },
    },
    {
      headerName: 'Keyfield',
      field: 'keyfield',
      editable: true,
      // maxWidth: 150,
      filter: true,
      hide: true,
      sortable: false
    },
  ];

  const defaultColDef = {
    resizable: true,
    wrapText: true,
    // sortable: true,
    //editable: true,
    // flex: 1,
    // filter: true,
    // floatingFilter: true,
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  const onFirstDataRendered = (params) => {
  const allColumnIds = params.columnApi
    .getColumns()
    .map((col) => col.getId());

  params.columnApi.autoSizeColumns(allColumnIds);
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
      const formatValue = (val) => (val !== undefined && val !== null ? val : '');

      return {
        "Department ID": formatValue(row.dept_id),
        "Desgination ID": formatValue(row.desgination_id),
        "Desgination": formatValue(row.desgination),
        "Status": formatValue(row.status),
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
    reportWindow.document.write("<html><head><title>Desgiantion Report</title>");
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
      <h2>Desgination Report</h2>
    </div>
    </div>`);
    reportWindow.document.write(`<div style="margin-top:10px;">
    <strong>Total Records: ${selectedRows.length}</strong>
    <span style="float:right;">
      Printed Date: ${new Date().toLocaleDateString()}
    </span>
  </div>`);
    // reportWindow.document.write("<h1><u>Desgination Report</u></h1>");

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

  const handleNavigateToForm = () => {
    navigate("/AddDesgination", { state: { mode: "create" } }); // Pass selectedRows as props to the Input component
  };

  // const handleNavigateWithRowData = (selectedRow) => {
  //   navigate("/AddDesgination", {
  //     state: {
  //       mode: "update",
  //       selectedRow,

  //       preservedRowData: rowData,

  //       preservedInputs: {
  //         dept_id,
  //         desgination_id,
  //         status,
  //       },
  //     },
  //   });
  // };

  const handleNavigateWithRowData = (selectedRow) => {
    navigate("/AddDesgination", {
      state: {
        mode: "update",
        keyfield: selectedRow.keyfield,
        preservedInputs: {
          dept_id,
          desgination_id,
          status,
        },
      },
    });
  };

  const onSelectionChanged = () => {
    const selectedNodes = gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    setSelectedRows(selectedData);
  };
  // Assuming you have a unique identifier for each row, such as 'id'
  const onCellValueChanged = (params) => {
    const updatedRowData = [...rowData];
    const rowIndex = updatedRowData.findIndex(
      (row) => row.keyfield === params.data.keyfield // Use the unique identifier 
    );
    if (rowIndex !== -1) {
      updatedRowData[rowIndex][params.colDef.field] = params.newValue;
      setRowData(updatedRowData);

      // Add the edited row data to the state
      setEditedData((prevData) => [...prevData, updatedRowData[rowIndex]]);
    }
  };


  const saveEditedData = async () => {
    const modified_by = sessionStorage.getItem('selectedUserCode');
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    const selectedRowsData = editedData.filter(row => selectedRows.some(selectedRow => selectedRow.keyfield === row.keyfield));
    if (selectedRowsData.length === 0) {
      toast.warning("Please select and modify at least one row to update its data");
      return;
    }
    showConfirmationToast(
      "Are you sure you want to update the data in the selected rows?",
      async () => {

        setLoading(true);

        try {
          const response = await fetch(`${config.apiBaseUrl}/UpdateDesgintion`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
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
            toast.warning(errorResponse.message || "Failed to Update  data");
          }
        } catch (error) {
          console.error("Error saving data:", error);
          toast.error("Error Updating Data: " + error.message);
        } finally {
          setLoading(false);
        }

      },
      () => {
        toast.info("Data updated cancelled.");
      }
    );
  };

  const deleteSelectedRows = async () => {
    const selectedRows = gridApi.getSelectedRows();

    if (selectedRows.length === 0) {
      toast.warning("Please select atleast One Row to Delete")
      return;
    }

    const modified_by = sessionStorage.getItem('selectedUserCode');
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    const keyfieldsToDelete = selectedRows.map((row) => row.keyfield);

    showConfirmationToast(
      "Are you sure you want to Delete the data in the selected rows?",
      async () => {

        setLoading(true);

        try {
          const response = await fetch(`${config.apiBaseUrl}/desginationDelete`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Modified-By": modified_by
            },
            body: JSON.stringify({ keyfield: keyfieldsToDelete, company_code: company_code, modified_by: modified_by })
          });

          if (response.ok) {
            setTimeout(() => {
              toast.success("Data Deleted successfully")
              handleSearch();
            }, 1000);

          } else {
            const errorResponse = await response.json();
            toast.warning(errorResponse.message || "Failed to Delete data");
          }
        } catch (error) {
          console.error("Error deleting rows:", error);
          toast.error('Error Deleting Data: ' + error.message);
        }
        finally {
          setLoading(false);
        }

      },
      () => {
        toast.info("Data Delete cancelled.");
      }
    );
  };


  const handleKeyDownStatus = async (e) => {
    if (e.key === 'Enter' && hasValueChanged) { // Only trigger search if the value has changed
      await handleSearch(); // Trigger the search function
      setHasValueChanged(false); // Reset the flag after search
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
      {loading && <LoadingScreen />}
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="shadow-lg p-1 bg-light rounded main-header-box">
        <div className="header-flex">
          <h1 className="page-title">Designation Info</h1>

          <div className="action-wrapper desktop-actions">
            {['add', 'all permission'].some(permission => desgiantionInfoPermissions.includes(permission)) && (
              <div className="action-icon add" onClick={handleNavigateToForm}>
                <span className="tooltip">Add</span>
                <i class="fa-solid fa-user-plus"></i>
              </div>
            )}
            {['delete', 'all permission'].some(permission => desgiantionInfoPermissions.includes(permission)) && (
              <div className="action-icon delete"
                onClick={deleteSelectedRows}
              >
                <span className="tooltip">Delete</span>
                <i class="fa-solid fa-user-minus"></i>
              </div>
            )}
            {['update', 'all permission'].some(permission => desgiantionInfoPermissions.includes(permission)) && (
              <div className="action-icon update"
                onClick={saveEditedData}
              >
                <span className="tooltip">Update</span>
                <i class="fa-solid fa-pen-to-square"></i>
              </div>
            )}


            {['all permission', 'view'].some(permission => desgiantionInfoPermissions.includes(permission)) && (
              <div className="action-icon print"
                onClick={generateReport}
              >
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

              {['add', 'all permission'].some(p => desgiantionInfoPermissions.includes(p)) && (
                <li>
                  <button className="dropdown-item" onClick={handleNavigateToForm}>
                    <i className="fa-solid fa-user-plus add fs-4"></i>
                  </button>
                </li>
              )}

              {['delete', 'all permission'].some(p => desgiantionInfoPermissions.includes(p)) && (
                <li>
                  <button className="dropdown-item" onClick={deleteSelectedRows}>
                    <i className="fa-solid fa-user-minus delete fs-4"></i>
                  </button>
                </li>
              )}

              {['update', 'all permission'].some(p => desgiantionInfoPermissions.includes(p)) && (
                <li>
                  <button className="dropdown-item" onClick={saveEditedData}>
                    <i className="fa-solid fa-pen-to-square update fs-4"></i>
                  </button>
                </li>
              )}

              {['all permission', 'view'].some(p => desgiantionInfoPermissions.includes(p)) && (
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
                id="depID"
                className="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the Department ID "
                value={dept_id}
                onChange={(e) => setdept_id(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                maxLength={18}
              />
              <label for="cname" class="exp-form-labels">Department ID</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="desID"
                className="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the Designation ID "
                value={desgination_id}
                onChange={(e) => setdesgination_id(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                maxLength={250}
              />
              <label for="cname" class="exp-form-labels">Designation ID</label>
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
                classNamePrefix="react-select"
                placeholder=""
                onFocus={() => setIsSelectFocused(true)}
                onBlur={() => setIsSelectFocused(false)}
                onKeyDown={handleKeyDownStatus}
                ref={Status}
              />
              <label class="floating-label">Status</label>
            </div>
          </div>

          {/* Search + Reload Buttons */}
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

      {/* <p >Result Set</p> */}


      <div className="shadow-lg pt-3 pb-3 bg-light rounded mt-2 container-form-box" style={{ width: "100%" }}>
        <div class="ag-theme-alpine" style={{ height: 455, width: "100%" }}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            onGridReady={onGridReady}
            onFirstDataRendered={onFirstDataRendered}
            onCellValueChanged={onCellValueChanged}
            rowSelection="multiple"
            onSelectionChanged={onSelectionChanged}
            pagination={true}
            paginationAutoPageSize={true}
            onRowSelected={onRowSelected}
          />
        </div>
      </div>

      {/* <div className="shadow-lg p-2 bg-body-tertiary rounded mt-2 mb-2">
        <div className="row ms-2">
          <div className="d-flex justify-content-start">
            <p className="col-md-6">{labels.createdBy}: {createdBy}</p>
            <p className="col-md-">
              {labels.createdDate}: {createdDate}
            </p>
          </div>
          <div className="d-flex justify-content-start">
            <p className="col-md-6">
              {labels.modifiedBy} : {modifiedBy}
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

export default Desgination;
