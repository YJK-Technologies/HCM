import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import './App.css'
import { useNavigate } from "react-router-dom";
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { showConfirmationToast } from './ToastConfirmation';
const config = require('./Apiconfig');


function Grid() {
  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const [transactiondrop, setTransactiondrop] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [LockGridDrop, setLockGriddrop] = useState([]);
  const [TransactionGriddrop, setTransactionGriddrop] = useState([])

  const [transactionType, setTransactionType] = useState('');
  const [start_year, setstart_year] = useState('');
  const [end_year, setend_year] = useState('');
  const [error, setError] = useState('');
  const [selectedLockType, setSelectedLockType] = useState("");
  const [Lockdrop, setLockdrop] = useState([]);
  const [LockType, setLockType] = useState("");
  const [editedData, setEditedData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const [pincode, setPincode] = useState("");

  const [hasValueChanged, setHasValueChanged] = useState(false);

  const [createdBy, setCreatedBy] = useState("");
  const [modifiedBy, setModifiedBy] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [modifiedDate, setModifiedDate] = useState("");
  const [isSelectedTransaction, setIsSelectedTransaction] = useState(false);
  const [isSelectedLockType, setIsSelectedLockType] = useState(false);

  //code added by Pavun purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem('permissions')) || {};
  const companyPermissions = permissions
    .filter(permission => permission.screen_type === 'Company')
    .map(permission => permission.permission_type.toLowerCase());

  const [selectedCompanyNo, setselectedCompanyNo] = useState(null);
  const [selectedCompanyLogo, setSelectedCompanyLogo] = useState(null);
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeLockType = (selectedLockType) => {
    setSelectedLockType(selectedLockType);
    setLockType(selectedLockType ? selectedLockType.value : '');
  };
  const filteredOptionLockType = Lockdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/getLockType`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setLockdrop(val));
  }, []);

  const handleChangeTransaction = (selectedTransaction) => {
    setSelectedTransaction(selectedTransaction);
    setTransactionType(selectedTransaction ? selectedTransaction.value : '');
  };
  const filteredOptionTransaction = transactiondrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));
  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/Transaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setTransactiondrop(val));
  }, []);


  //grid option

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/getLockType`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    }).then((response) => response.json())
      .then((data) => {
        // Extract city names from the fetched data
        const LockOption = data.map(option => option.attributedetails_name);
        setLockGriddrop(LockOption);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  //  useEffect(() => {
  //   const company_code = sessionStorage.getItem('selectedCompanyCode');

  //   fetch(`${config.apiBaseUrl}/Transaction`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ company_code })
  //   })      .then((response) => response.json())
  //     .then((data) => {
  //       // Extract city names from the fetched data
  //       const TransactionOption = data.map(option => option.attributedetails_name);
  //       setTransactionGriddrop(TransactionOption);
  //     })
  //     .catch((error) => console.error('Error fetching data:', error));
  // }, []);

  // useEffect(() => {
  //   const company_code = sessionStorage.getItem('selectedCompanyCode');

  //   fetch(`${config.apiBaseUrl}/city`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ company_code })
  //   }) 
  //     .then((response) => response.json())
  //     .then((data) => {
  //       const cityNames = data.map(option => option.attributedetails_name);
  //       setDrop(cityNames);
  //     })
  //     .catch((error) => console.error('Error fetching data:', error));
  // }, []);

  // useEffect(() => {
  //   const company_code = sessionStorage.getItem('selectedCompanyCode');

  //   fetch(`${config.apiBaseUrl}/country`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ company_code })
  //   }) 
  //     .then((response) => response.json())
  //     .then((data) => {
  //       // Extract city names from the fetched data
  //       const countries = data.map(option => option.attributedetails_name);
  //       setCondrop(countries);
  //     })
  //     .catch((error) => console.error('Error fetching data:', error));
  // }, []);

  // useEffect(() => {
  //   const company_code = sessionStorage.getItem('selectedCompanyCode');

  //   fetch(`${config.apiBaseUrl}/state`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ company_code })
  //   })  
  //     .then((response) => response.json())
  //     .then((data) => {
  //       // Extract city names from the fetched data
  //       const States = data.map(option => option.attributedetails_name);
  //       setStatedrop(States);
  //     })
  //     .catch((error) => console.error('Error fetching data:', error));
  // }, []);

  // useEffect(() => {

  //   fetch(`${config.apiBaseUrl}/locationno`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       // Extract city names from the fetched data
  //       const LocationOption = data.map(option => option.location_no);
  //       setLocationdrop(LocationOption);
  //     })
  //     .catch((error) => console.error('Error fetching data:', error));
  // }, []);

  // useEffect(() => {
  //   const company_code = sessionStorage.getItem('selectedCompanyCode');

  //   fetch(`${config.apiBaseUrl}/status`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ company_code })
  //   })     
  //    .then((response) => response.json())
  //     .then((data) => {
  //       // Extract city names from the fetched data
  //       const statusOption = data.map(option => option.attributedetails_name);
  //       setStatusGriddrop(statusOption);
  //     })
  //     .catch((error) => console.error('Error fetching data:', error));
  // }, []);


  // useEffect(() => {
  //   const company_code = sessionStorage.getItem('selectedCompanyCode');

  //   fetch(`${config.apiBaseUrl}/status`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ company_code })
  //   })
  //     .then((data) => data.json())
  //     .then((val) => setStatusdrop(val))
  //     .catch((error) => console.error('Error fetching data:', error));
  // }, []);


  // const filteredOptionStatus = statusdrop.map((option) => ({
  //   value: option.attributedetails_name,
  //   label: option.attributedetails_name,
  // }));

  // const handleChangeStatus = (selectedStatus) => {
  //   setSelectedStatus(selectedStatus);
  //   setStatus(selectedStatus ? selectedStatus.value : '');
  //   setHasValueChanged(true);
  // };

  // const handleCompanyNoChange = (event) => {
  //   setCompany_no(event.target.value);
  // };

  // const handleCompanyNameChange = (event) => {
  //   setCompany_name(event.target.value);
  // };


  const handleSearch = async () => {
    try {
      const company_code = sessionStorage.getItem('selectedCompanyCode');
      const response = await fetch(`${config.apiBaseUrl}/getFinacnialyearlockscreenSearchCriteria`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "company_code": company_code,
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem('selectedCompanyCode'),
          start_year: start_year,
          end_year: end_year,
          transaction_type: transactionType,
          locked: LockType
        }) // Send company_no and company_name as search criteria
      });
      if (response.ok) {
        const searchData = await response.json();
        setRowData(searchData);
        console.log(searchData)
        console.log("data fetched successfully")
      } else if (response.status === 404) {
        console.log("Data not found");
        toast.warning("Data not found");
        setRowData([]);
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to insert sales data");
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
      toast.error("Error fetching search data:", error);
    }
  };

  const reloadGridData = () => {
    window.location.reload();
  };


  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  // Handle cell click and open popup
  const handleClickOpen = (params) => {
    const companyNo = params.data.company_no;
    const companyLogo = params.data.company_logo;
    setselectedCompanyNo(companyNo);
    setSelectedCompanyLogo(companyLogo);
    setOpen(true);
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

  const columnDefs = [
    // {
    //   headerCheckboxSelection: true,
    //   headerName: "S.No",
    //   field: "S.No",
    //   cellStyle: { textAlign: "left" },
    //   // minWidth: 180,
    //   checkboxSelection: true,
    //   cellEditorParams: {
    //     maxLength: 18,
    //   },
    //   cellRenderer: (params) => {
    //     const handleClick = () => {
    //       handleNavigateWithRowData(params.data);
    //     };

    //     return (
    //       <span
    //         style={{ cursor: "pointer" }}
    //         onClick={handleClick}
    //       >
    //         {params.value}
    //       </span>
    //     );
    //   },
    // },

    {
      headerName: "Start Year",
      field: "start_year",
      editable: true,
      cellStyle: { textAlign: "left" },
      checkboxSelection: true,
      cellEditorParams: {
        maxLength: 18,
      },
      cellRenderer: (params) => {
        const handleClick = () => {
          handleNavigateWithRowData(params.data);
        };

        return (
          <span style={{ cursor: "pointer" }} onClick={handleClick}>
            {formatDate(params.value)}
          </span>
        );
      },
      valueFormatter: (params) => formatDate(params.value),
      filter: "agDateColumnFilter",
      filterParams: {
        comparator: (filterLocalDateAtMidnight, cellValue) => {
          const cellDate = new Date(cellValue);
          // Remove time for correct comparison
          const cellDateOnly = new Date(cellDate.getFullYear(), cellDate.getMonth(), cellDate.getDate());
          if (cellDateOnly < filterLocalDateAtMidnight) return -1;
          if (cellDateOnly > filterLocalDateAtMidnight) return 1;
          return 0;
        },
        browserDatePicker: true,
      },
    },


    {
      headerName: "End Year",
      field: "end_year",
      editable: true,
      cellStyle: { textAlign: "left" },
      // minWidth: 200,
      cellEditorParams: {
        maxLength: 250,
      },
      valueFormatter: (params) => formatDate(params.value),
      filterParams: {
        comparator: (filterLocalDateAtMidnight, cellValue) => {
          const cellDate = new Date(cellValue.split('/').join('-'));
          if (cellDate < filterLocalDateAtMidnight) {
            return -1;
          } else if (cellDate > filterLocalDateAtMidnight) {
            return 1;
          }
          return 0;
        },
      },

    },
    {
      headerName: "Transaction Type ",
      field: "transaction_type",
      editable: true,
      cellStyle: { textAlign: "left" },
      minWidth: 150,
      cellEditorParams: {
        maxLength: 250,
      },

    },

    {
      headerName: "Locked",
      field: "locked",
      editable: true,
      minWidth: 1000,
      cellStyle: { textAlign: "left" },
      // minWidth: 150,
      cellEditorParams: {
        maxLength: 250,

      },
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: LockGridDrop,
      },
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

      const addressParts = [
        row.address1,
        row.address2,
        row.address3,
        row.city,
        row.pincode,
        row.state,
        row.country
      ].map(formatValue);

      const formattedAddress = `
        ${addressParts[0]},
        ${addressParts[1]},
        ${addressParts[2]}<br>
        ${addressParts[3]}<br>
        ${addressParts[4]}<br>
        ${addressParts[5]}<br>
        ${addressParts[6]}
      `;

      return {
        "Start Year": formatValue(row.start_year),
        "End Year": formatValue(row.end_year),
        "Transaction Type": formatValue(row.transaction_type),
        "Locked": formatValue(row.locked),
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
    reportWindow.document.write("<html><head><title>Financial Year Access Report</title>");
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
      <h2>Financial Year Access Report</h2>
    </div>
    </div>`);
    reportWindow.document.write(`<div style="margin-top:10px;">
    <strong>Total Records: ${selectedRows.length}</strong>
    <span style="float:right;">
      Printed Date: ${new Date().toLocaleDateString()}
    </span>
  </div>`);
    // reportWindow.document.write("<h1><u>Financial Year Access Report</u></h1>");

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
    navigate("/AddFYA", { state: { mode: "create" } }); // Pass selectedRows as props to the Input component
  };

  const handleNavigateWithRowData = (selectedRow) => {
    navigate("/AddFYA", { state: { mode: "update", selectedRow } });
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
      (row) => row.company_no === params.data.company_no // Use the unique identifier 
    );
    if (rowIndex !== -1) {
      updatedRowData[rowIndex][params.colDef.field] = params.newValue;
      setRowData(updatedRowData);

      // Add the edited row data to the state
      setEditedData((prevData) => [...prevData, updatedRowData[rowIndex]]);
    }
  };


  const saveEditedData = async () => {
    const selectedRowsData = editedData
      .filter(row => selectedRows.some(selectedRow => selectedRow.keyfield === row.keyfield))

    if (selectedRowsData.length === 0) {
      toast.warning("Please select and modify at least one row to update its data");
      return;
    }

    showConfirmationToast(
      "Are you sure you want to update the data in the selected rows?",
      async () => {
        try {
          const company_code = sessionStorage.getItem("selectedCompanyCode");
          const modified_by = sessionStorage.getItem('selectedUserCode');

          const response = await fetch(`${config.apiBaseUrl}/UpdateFinacnialyearlockscreen`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Modified-By": modified_by
            },
            body: JSON.stringify({ editedData: selectedRowsData }), // Send only the selected rows for saving
            "modified_by": modified_by
          });

          if (response.status === 200) {
            toast.success("Data Updated Successfully", {
              onClose: () => handleSearch(),
              autoClose: 1000,
            });
            return;
          } else {
            const errorResponse = await response.json();
            toast.warning(errorResponse.message || "Failed to Updating data");
          }
        } catch (error) {
          console.error("Error Updating data:", error);
          toast.error("Error Updating Data: " + error.message);
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
      toast.warning("Please select at least one row to delete");
      return;
    }

    const company_code = sessionStorage.getItem("selectedCompanyCode");
    const modified_by = sessionStorage.getItem("selectedUserCode");
    const keyfieldToDelete = selectedRows.map((row) => row.keyfield);

    showConfirmationToast(
      "Are you sure you want to delete the data in the selected rows?",
      async () => {
        try {
          const response = await fetch(`${config.apiBaseUrl}/deleteFinacnialyearlockscreen`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              company_code: company_code,
              "Modified-By": modified_by,
            },
            body: JSON.stringify({ keyfield: keyfieldToDelete }),
          });

          if (response.ok) {
            console.log("Rows deleted successfully:", keyfieldToDelete);
            toast.success("Data deleted successfully");


            handleSearch();
          } else {
            const errorResponse = await response.json();
            toast.warning(errorResponse.message || "Failed to delete data");
          }
        } catch (error) {
          console.error("Error deleting rows:", error);
          toast.error("Error deleting data: " + error.message);
        }
      },
      () => {
        toast.info("Data delete cancelled.");
      }
    );
  };

  const handlesetPincode = (e) => {
    const value = e.target.value;
    if (value.length <= 10) {  // Ensure length is 10 or less
      setPincode(value);
    }
  };
  const handleKeyDownStatus = async (e) => {
    if (e.key === 'Enter' && hasValueChanged) { // Only trigger search if the value has changed
      await handleSearch(); // Trigger the search function
      setHasValueChanged(false); // Reset the flag after search
    }
  };


  // Handler for when a row is selected
  const onRowSelected = (event) => {
    if (event.node.isSelected()) {
      handleRowClick(event.data);
    }
  };


  return (
    <div className="container-fluid Topnav-screen">
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="shadow-lg p-1 bg-body-tertiary rounded main-header-box">
        <div className="header-flex">
          <h1 className="page-title"> Financial Year Access</h1>

          <div className="action-wrapper desktop-actions">
            {['add', 'all permission'].some(permission => companyPermissions.includes(permission)) && (
              <div className="action-icon add" onClick={handleNavigateToForm}>
                <span className="tooltip">Add</span>
                <i class="fa-solid fa-user-plus"></i>
              </div>
            )}
            {['delete', 'all permission'].some(permission => companyPermissions.includes(permission)) && (
              <div className="action-icon delete" onClick={deleteSelectedRows}>
                <span className="tooltip">Delete</span>
                <i class="fa-solid fa-user-minus"></i>
              </div>
            )}
            {['update', 'all permission'].some(permission => companyPermissions.includes(permission)) && (
              <div className="action-icon update"
                onClick={saveEditedData}
              >
                <span className="tooltip">Update</span>
                <i class="fa-solid fa-pen-to-square"></i>
              </div>
            )}
            {['all permission', 'view'].some(permission => companyPermissions.includes(permission)) && (
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
            <button className="btn btn-primary dropdown-toggle p-1" data-bs-toggle="dropdown">
              <i className="fa-solid fa-list"></i>
            </button>

            <ul className="dropdown-menu dropdown-menu-end text-center">

              {['add', 'all permission'].some(p => companyPermissions.includes(p)) && (
                <li className="dropdown-item" onClick={handleNavigateToForm}>
                  <i className="fa-solid fa-user-plus text-success fs-4"></i>
                </li>
              )}

              {['delete', 'all permission'].some(p => companyPermissions.includes(p)) && (
                <li className="dropdown-item" onClick={deleteSelectedRows}>
                  <i className="fa-solid fa-user-minus text-danger fs-4"></i>
                </li>
              )}

              {['update', 'all permission'].some(p => companyPermissions.includes(p)) && (
                <li className="dropdown-item" onClick={saveEditedData}>
                  <i className="fa-solid fa-pen-to-square text-primary fs-4"></i>
                </li>
              )}

              {['all permission', 'view'].some(p => companyPermissions.includes(p)) && (
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
            <div className="inputGroup">
              <input
                id="cno"
                className="exp-input-field form-control"
                type="date"
                placeholder=""
                required title="Please fill the company number here"
                value={start_year}
                onChange={(e) => setstart_year(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <label for="cname" class="exp-form-labels">Start Year</label>
              {error && !start_year && <div className="text-danger">Start Year should not be blank</div>}

            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="cname"
                className="exp-input-field form-control"
                type="date"
                placeholder=""
                required title="Please fill the company name here"
                value={end_year}
                onChange={(e) => setend_year(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <label for="cname" class="exp-form-labels">End Year</label>
              {error && !end_year && <div className="text-danger">End Year should not be blank</div>}
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedTransaction ? "has-value" : ""} 
              ${isSelectedTransaction ? "is-focused" : ""}`}
            >
              <Select
                isClearable
                type="text"
                value={selectedTransaction}
                onChange={handleChangeTransaction}
                options={filteredOptionTransaction}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                classNamePrefix="react-select"
                placeholder=""
                onFocus={() => setIsSelectedTransaction(true)}
                onBlur={() => setIsSelectedTransaction(false)}
              />
              <label for="city" class="floating-label">Transactions Type</label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedLockType ? "has-value" : ""} 
              ${isSelectedLockType ? "is-focused" : ""}`}
            >
              <Select
                isClearable
                value={selectedLockType}
                onChange={handleChangeLockType}
                options={filteredOptionLockType}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                classNamePrefix="react-select"
                placeholder=""
                onFocus={() => setIsSelectedLockType(true)}
                onBlur={() => setIsSelectedLockType(false)}
              />
              <label for="state" class="floating-label">Locked</label>
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
        <div class="ag-theme-alpine" style={{ height: 455, width: "100%" }}>
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
          /></div>
  
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

export default Grid;
