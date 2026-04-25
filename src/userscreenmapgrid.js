import { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import "./apps.css";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { showConfirmationToast } from './ToastConfirmation';
import LoadingScreen from './Loading';

const config = require('./Apiconfig');

function UserScreenMapGrid() {
  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState([]);
  const [screensdrop, setscreensdrop] = useState([]);
  const [permissionsdrop, setpermissionsdrop] = useState([]);
  const [userdrop, setuserdrop] = useState([]);
  const [role_id, setrole_id] = useState("");
  const [screen_type, setscreen_type] = useState("");
  const [permission_type, setpermission_type] = useState("");
  const [editedData, setEditedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [roleiddrop, setroleiddrop] = useState([]);

  const [createdBy, setCreatedBy] = useState("");
  const [modifiedBy, setModifiedBy] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [modifiedDate, setModifiedDate] = useState("");

  //code added by Harish purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem('permissions')) || {};
  const UserScreenPermission = permissions
    .filter(permission => permission.screen_type === 'UserRights')
    .map(permission => permission.permission_type.toLowerCase());

  const reloadGridData = () => {
    window.location.reload();
  };

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/roleid`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((response) => response.json())
      .then((data) => {
        const roleId = data.map(option => option.role_id);
        setroleiddrop(roleId);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/Screens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((response) => response.json())
      .then((data) => {
        const Screens = data.map(option => option.attributedetails_name);
        setscreensdrop(Screens);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/Permissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((response) => response.json())
      .then((data) => {
        const Permissions = data.map(option => option.attributedetails_name);
        setpermissionsdrop(Permissions);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/usercode`)
      .then((response) => response.json())
      .then((data) => {
        const usercode = data.map(option => option.user_code);
        setuserdrop(usercode);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);


  const handleSearch = async () => {
    setLoading(true);
    try {
      const company_code = sessionStorage.getItem('selectedCompanyCode');
      const response = await fetch(`${config.apiBaseUrl}/userscreensearchdata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "company_code": company_code
        },
        body: JSON.stringify({ company_code: company_code, role_id, screen_type, permission_type }) // Send company_no and company_name as search criteria
      });
      if (response.ok) {
        const searchData = await response.json();
        setRowData(searchData);
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
      console.error("Error deleting rows:", error);
      toast.error('Error while Deleting data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const columnDefs = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      headerName: "Role Id",
      field: "role_id",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: roleiddrop,
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
      headerName: "Screen Type",
      field: "screen_type",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: screensdrop,
      },
    },
    {
      headerName: "Permission Type",
      field: "permission_type",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: permissionsdrop,
      },
    },
    {
      headerName: "Keyfield",
      field: "keyfield",
      editable: true,
      cellStyle: { textAlign: "left" },
      editable: false,
      hide: true
    },
  ];

  const defaultColDef = {
    resizable: true,
    wrapText: true,
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
        "Rold ID": safeValue(row.role_id),
        "Screen Type": safeValue(row.screen_type),
        "Permission Type": safeValue(row.permission_type),
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
    reportWindow.document.write("<html><head><title>Role Rights Report</title>");
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
            .print-btn {
              display: none;
            }
            body {
              background: white;
            }
          }
       `);
    reportWindow.document.write("</style></head><body>");
    reportWindow.document.write(`<div class="header">
    <img src="${logoUrl}" class="logo" />
    <div class="title-section">
      <h2>Role Rights Report</h2>
    </div>
    </div>`);
    reportWindow.document.write(`<div style="margin-top:10px;">
    <strong>Total Records: ${selectedRows.length}</strong>
    <span style="float:right;">
      Printed Date: ${new Date().toLocaleDateString()}
    </span>
  </div>`);
    // reportWindow.document.write("<h1><u> Role Rights Report </u></h1>");

    reportWindow.document.write("<table><thead><tr>");
    Object.keys(reportData[0]).forEach((key) => {
      reportWindow.document.write(`<th>${key}</th>`);
    });
    reportWindow.document.write("</tr></thead><tbody>");

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

  const handleNavigatesToForm = () => {
    navigate("/AddUserRights", { state: { mode: "create" } }); // Pass selectedRows as props to the Input component
  };

  const handleNavigateWithRowData = (selectedRow) => {
    navigate("/AddUserRights", { state: { mode: "update", selectedRow } });
  };

  const onSelectionChanged = () => {
    const selectedNodes = gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    setSelectedRows(selectedData);
  };


  // Assuming you have a unique identifier for each row, such as 'id'
  // const onCellValueChanged = (params) => {
  //   const updatedRowData = [...rowData];
  //   const rowIndex = updatedRowData.findIndex(
  //     (row) => row.keyfield === params.data.keyfield // Use the unique identifier 
  //   );
  //   if (rowIndex !== -1) {
  //     updatedRowData[rowIndex][params.colDef.field] = params.newValue;
  //     setRowData(updatedRowData);

  //     // Add the edited row data to the state
  //     setEditedData((prevData) => [...prevData, updatedRowData[rowIndex]]);
  //   }
  // };

  const onCellValueChanged = (params) => {
    const updatedRowData = [...rowData];
    const rowIndex = updatedRowData.findIndex(
      (row) => row.keyfield === params.data.keyfield
    );

    if (rowIndex !== -1) {
      updatedRowData[rowIndex][params.colDef.field] = params.newValue;
      setRowData(updatedRowData);

      setEditedData((prevData) => {
        const existingIndex = prevData.findIndex(
          (item) => item.keyfield === params.data.keyfield
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
    const selectedRowsData = editedData.filter(row => selectedRows.some(selectedRow => selectedRow.keyfield === row.keyfield));

    if (selectedRowsData.length === 0) {
      toast.warning("Please select a row to update its data");
      return;
    }
    showConfirmationToast(
      "Are you sure you want to update the data in the selected rows?",
      async () => {

        try {
          const modified_by = sessionStorage.getItem('selectedUserCode');

          const response = await fetch(`${config.apiBaseUrl}/saveEditeduserscreenmap`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Modified-By": modified_by
            },
            body: JSON.stringify({ editedData: selectedRowsData }),
            "modified_by": modified_by
          });

          if (response.ok) {
            console.log("Data saved successfully!");
            setTimeout(() => {
              toast.success("Data Updated successfully")
              handleSearch();
            }, 1000);
            return;
          } else {
            const errorResponse = await response.json();
            toast.warning(errorResponse.message || "Failed to insert sales data");
          }
        } catch (error) {
          console.error("Error deleting rows:", error);
          toast.error('Error Updating Data: ' + error.message);
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
      toast.warning("Please select atleast One Row to Delete");
      return;
    }

    const modified_by = sessionStorage.getItem('selectedUserCode');
    const keyfieldsToDelete = selectedRows.map((row) => row.keyfield);

    showConfirmationToast(
      "Are you sure you want to Delete the data in the selected rows?",
      async () => {

        try {
          const response = await fetch(`${config.apiBaseUrl}/userscreenmapdeleteData`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Modified-By": modified_by
            },
            body: JSON.stringify({ keyfield: keyfieldsToDelete }),
            "modified_by": modified_by
          });

          if (response.ok) {
            console.log("Rows deleted successfully:", keyfieldsToDelete);
            setTimeout(() => {
              toast.success("Data Deleted successfully")
              handleSearch();
            }, 1000);
          } else {
            const errorResponse = await response.json();
            toast.warning(errorResponse.message || "Failed to insert sales data");
          }
        } catch (error) {
          console.error("Error deleting rows:", error);
          toast.error('Error Deleting Data: ' + error.message);
        }
      },
      () => {
        toast.info("Data Delete cancelled.");
      }
    );
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
          <h1 className="page-title">Role Rights</h1>
          <div className="action-wrapper desktop-actions">
            {['add', 'all permission'].some(permission => UserScreenPermission.includes(permission)) && (
              <div className="action-icon add" onClick={handleNavigatesToForm}>
                <span className="tooltip">Add</span>
                <i class="fa-solid fa-user-plus"></i>
              </div>
            )}
            {['delete', 'all permission'].some(permission => UserScreenPermission.includes(permission)) && (
              <div className="action-icon delete" onClick={deleteSelectedRows}>
                <span className="tooltip">Delete</span>
                <i class="fa-solid fa-user-minus"></i>
              </div>
            )}
            {['update', 'all permission'].some(permission => UserScreenPermission.includes(permission)) && (
              <div className="action-icon update" onClick={saveEditedData}>
                <span className="tooltip">Update</span>
                <i class="fa-solid fa-pen-to-square"></i>
              </div>
            )}
            {['all permission', 'view'].some(permission => UserScreenPermission.includes(permission)) && (
              <div className="action-icon print" onClick={generateReport}>
                <span className="tooltip">Print</span>
                <i class="fa-solid fa-print"></i>
              </div>
            )}
          </div>

          {/* Mobile Dropdown */}
          <div className="dropdown mobile-actions">
            <button className="btn btn-primary dropdown-toggle p-1" data-bs-toggle="dropdown">
              <i className="fa-solid fa-list"></i>
            </button>

            <ul className="dropdown-menu dropdown-menu-end text-center">

              {['add', 'all permission'].some(p => UserScreenPermission.includes(p)) && (
                <li className="dropdown-item" onClick={handleNavigatesToForm}>
                  <i className="fa-solid fa-user-plus text-success fs-4"></i>
                </li>
              )}

              {['delete', 'all permission'].some(p => UserScreenPermission.includes(p)) && (
                <li className="dropdown-item" onClick={deleteSelectedRows}>
                  <i className="fa-solid fa-user-minus text-danger fs-4"></i>
                </li>
              )}

              {['update', 'all permission'].some(p => UserScreenPermission.includes(p)) && (
                <li className="dropdown-item" onClick={saveEditedData}>
                  <i className="fa-solid fa-pen-to-square text-primary fs-4"></i>
                </li>
              )}

              {['all permission', 'view'].some(p => UserScreenPermission.includes(p)) && (
                <li className="dropdown-item" onClick={generateReport}>
                  <i className="fa-solid fa-print fs-4"></i>
                </li>
              )}

            </ul>
          </div>

        </div>
      </div>

      <div className="shadow-lg p-3 bg-light rounded mt-2 container-form-box">
        <div className="row g-3">

          <div className="col-md-2">
            <div class="inputGroup">
              <input
                id="wcode"
                className="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please enter the Role Id"
                value={role_id}
                onChange={(e) => setrole_id(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                maxLength={18}
              />
              <label for="tcode" class="exp-form-labels">Role Id</label>
            </div>
          </div>

          <div className="col-md-2">
            <div class="inputGroup">
              <input
                id="wcode"
                className="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please enter the Screen Type"
                value={screen_type}
                onChange={(e) => setscreen_type(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                maxLength={50}
              />
              <label for="tcode" class="exp-form-labels">Screen Type</label>
            </div>
          </div>
          <div className="col-md-2">
            <div class="inputGroup">
              <input
                id="wcode"
                className="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please enter the Permission Type "
                value={permission_type}
                onChange={(e) => setpermission_type(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                maxLength={50}
              />
              <label for="tcode" class="exp-form-labels">Permission Type</label>
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

      <div className="shadow-lg pt-3 pb-3 bg-light rounded mt-2 container-form-box" style={{ width: "100%" }}>
        <div class="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
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

export default UserScreenMapGrid;