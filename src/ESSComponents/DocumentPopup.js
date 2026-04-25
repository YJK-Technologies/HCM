
import { useState } from "react";
import * as React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import "ag-grid-enterprise";
import 'ag-grid-autocomplete-editor/dist/main.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { format } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';
import LoadingScreen from '../Loading';
const config = require('../Apiconfig');


// Function to convert binary data to base64 string
const arrayBufferToBase64 = (buffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};


const columnDefs = [
  {
    checkboxSelection: true,
    headerName: "Employee ID",
    field: "EmployeeID",
    editable: false,
  },
  {
    headerName: "Employee First Name",
    field: "First_Name",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "Employee Middle Name",
    field: "Middle_Name",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "Employee Last Name",
    field: "Last_Name",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "Phone Number",
    field: "phone1",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "Email",
    field: "email",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "Document Name",
    field: "document_name",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "Department",
    field: "department_id",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "Designation",
    field: "designation_id",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "Image",
    hide: true,
    field: "Photos",
    editable: false,
    cellStyle: { textAlign: "center" },
    cellRenderer: (params) => {
      if (params.value) {
        return (
          <img
            src={`data:image/jpeg;base64,${params.value}`}
            alt="Item"
            style={{ width: "50px", height: "50px" }}
          />
        );
      } else {
        return "No Image";
      }
    },
  },
  //   {
  //     headerName: "First Name",
  //     field: "First_Name",
  //     editable: false,
  //     // minWidth: 160,
  //     // maxWidth: 160,
  //   },
  //   {
  //     headerName: "Middle Name",
  //     field: "Middle_Name",
  //     editable: false,
  //     // minWidth: 160,
  //     // maxWidth: 160,
  //   },
  //   {
  //     headerName: "Last Name",
  //     field: "Last_Name",
  //     editable: false,
  //     // minWidth: 160,
  //     // maxWidth: 160,
  //   },
  //   {
  //     headerName: "Father Name",
  //     field: "father_name",
  //     editable: false,
  //     // minWidth: 135,
  //     // maxWidth: 200,
  //   },
  //   {
  //     headerName: "Mother Name",
  //     field: "mother_name",
  //     editable: false,
  //     // minWidth: 140,
  //     // maxWidth: 200,
  //   },
  //   {
  //     headerName: "Gender",
  //     field: "Gender",
  //     editable: false,
  //     // minWidth: 150,
  //     // maxWidth: 200,
  //   },
  //   {
  //     headerName: "Email",
  //     field: "email",
  //     editable: false,
  //     // minWidth: 150,
  //     // maxWidth: 200,
  //   },
  //   {
  //     headerName: "Grade ID",
  //     field: "Grade_id",
  //     editable: false,
  //     // minWidth: 120,
  //     // maxWidth: 200,
  //   },
  //   {
  //     headerName: "Phone No",
  //     field: "phone1",
  //     editable: false,
  //     // minWidth: 140,
  //     // maxWidth: 140,
  //   },
  //   {
  //     headerName: "Alter Phone No",
  //     field: "phone2",
  //     editable: false,
  //     minWidth: 130,
  //     maxWidth: 200,
  //   },
  //   {
  //     headerName: "Address 1",
  //     field: "address1",
  //     editable: false,
  //     // minWidth: 120,
  //     // maxWidth: 200,
  //   },
  //   {
  //     headerName: "Address 2",
  //     field: "address2",
  //     editable: false,
  //     // minWidth: 120,
  //     // maxWidth: 200,
  //   },
  //   {
  //     headerName: "Address 3",
  //     field: "address3",
  //     editable: false,
  //     // minWidth: 160,
  //     // maxWidth: 200,
  //   },
  //   {
  //     headerName: "Permanent Address",
  //     field: "PermanantAddress",
  //     editable: false,
  //     minWidth: 160,
  //     maxWidth: 200,
  //   },
  //   {
  //     headerName: "Reference Name",
  //     field: "Reference_name",
  //     editable: false,
  //     // minWidth: 160,
  //     // maxWidth: 200,
  //   },
  //   {
  //     headerName: "Reference Phone No",
  //     field: "Reference_Phone",
  //     editable: false,
  //     // minWidth: 160,
  //     // maxWidth: 200,
  //   },
  //   {
  //     headerName: "Martial Status",
  //     field: "marital_status",
  //     editable: false,
  //     // minWidth: 160,
  //     // maxWidth: 200,
  //   },
  //   {
  //     headerName: "Pan No",
  //     field: "Pan_No",
  //     editable: false,
  //     // minWidth: 160,
  //     // maxWidth: 200,
  //   },
  //   {
  //     headerName: "Aadhaar No",
  //     field: "Aadhar_no",
  //     editable: false,
  //     // minWidth: 160,
  //     // maxWidth: 200,
  //   }, {
  //     headerName: "Kids",
  //     field: "Kids",
  //     editable: false,
  //     // minWidth: 160,
  //     // maxWidth: 200,
  //   }
];
const gridOptions = {
  pagination: true,
  paginationPageSize: 10,
};

export default function DocumentPopup({ open, handleClose, EmployeeInfo }) {

  const [rowData, setRowData] = useState([]);
  const [Employee_Id, setEmployeeId] = useState("");
  const [First_Name, setFirst_Name] = useState("");
  const [document_name, setdocument_name] = useState("");
  const [DOB, setDOB] = useState("");
  const [Name, setname] = useState("");
  const [loading, setLoading] = useState(false);



  const handleSearch = async () => {
    setLoading(true);

    try {
      const company_code = sessionStorage.getItem("selectedCompanyCode");

      const payload = {
        Employee_Id: Employee_Id || null,
        document_name: document_name || null,
        Name: Name || null,
        company_code,
      };

      console.log("Payload:", payload);

      const response = await fetch(
        `${config.apiBaseUrl}/EmployeeDocSC`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        const data = await response.json();

        const updatedData = data.map((item) => ({
          ...item,
          EmployeeID: item.EmployeeID,
          First_Name: item.First_Name,
          Middle_Name: item.Middle_Name,
          Last_Name: item.Last_Name,
          email: item.email,
          phone1: item.phone1,
          document_name: item.document_name,
          department_id: item.department_id,
          designation_id: item.designation_id,
          Photos: item.Photos
            ? arrayBufferToBase64(item.Photos.data)
            : null,
        }));

        setRowData(updatedData);

        if (updatedData.length === 0) {
          toast.info("No records found");
        }

      } else if (response.status === 404) {
        toast.warning("Data Not Found");
        setRowData([]);
      } else {
        const error = await response.json();
        toast.error(error.message || "Something went wrong");
        setRowData([]);
      }

    } catch (error) {
      console.error("Error:", error);
      toast.error("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClosePopup = () => {
    clearInputs();
    setRowData([]);
    setSelectedRows([]);
    handleClose();
  };

  const handleReload = () => {
    clearInputs();
    setRowData([]);
    setSelectedRows([]);
  };

  const clearInputs = () => {
    setEmployeeId("");
    setFirst_Name("");
    setdocument_name("");
    setDOB("");
    setname("");
  };

  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowSelected = (event) => {
    setSelectedRows(event.api.getSelectedRows());
  };

  const handleConfirm = () => {
    if (selectedRows.length === 0) {
      toast.warning("Please select a row");
      return;
    }

    const selectedData = selectedRows.map((row) => ({
      EmployeeId: row.EmployeeID,
      First_Name: row.First_Name,
      Department: row.department_id,
      Designation: row.designation_id,
    }));

    EmployeeInfo(selectedData);

    handleClosePopup(); // ✅ reuse
  };

  return (
    <div>
      {open && (
        <div className="modal-overlay">
          {loading && <LoadingScreen />}
          <div className="custom-modal container-fluid Topnav-screen">
            <div className="custom-modal-body">

              {/* Header */}
              <div className="shadow-lg p-1 bg-light main-header-box">
                <div className="header-flex">
                  <h1 className="custom-modal-title">Documents Help</h1>

                  <div className="action-wrapper">
                    <div className="action-icon delete" onClick={handleClosePopup}>
                      <span className="tooltip">Close</span>
                      <i className="fa-solid fa-xmark"></i>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="form-row shadow-lg p-2 bg-light mt-2 container-form-box">

                <div className="form-block col-md-4">
                  <div className="inputGroup">
                    <input
                      type="text"
                      autoComplete="off"
                      placeholder=" "
                      className="exp-input-field form-control"
                      value={Employee_Id}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      maxLength={18}
                    />
                    <label className="exp-form-labels">Employee ID</label>
                  </div>
                </div>

                <div className="form-block col-md-4">
                  <div className="inputGroup">
                    <input
                      type="text"
                      autoComplete="off"
                      placeholder=" "
                      className="exp-input-field form-control"
                      value={Name}
                      onChange={(e) => setname(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <label className="exp-form-labels">Employee Name</label>
                  </div>
                </div>

                <div className="form-block col-md-4">
                  <div className="inputGroup">
                    <input
                      type="text"
                      autoComplete="off"
                      placeholder=" "
                      className="exp-input-field form-control"
                      value={document_name}
                      onChange={(e) => setdocument_name(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      maxLength={75}
                    />
                    <label className="exp-form-labels">Document Name</label>
                  </div>
                </div>

                {/* Buttons */}
                <div className="form-block col-12">
                  <div className="search-btn-wrapper">

                    <div className="icon-btn search" onClick={handleSearch}>
                      <span className="tooltip">Search</span>
                      <i className="fa-solid fa-magnifying-glass"></i>
                    </div>

                    <div className="icon-btn reload" onClick={handleReload}>
                      <span className="tooltip">Reload</span>
                      <i className="fa-solid fa-rotate-right"></i>
                    </div>

                    <div className="icon-btn save" onClick={handleConfirm}>
                      <span className="tooltip">Confirm</span>
                      <i className="fa-solid fa-check"></i>
                    </div>

                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="shadow-lg p-3 pb-0 bg-light mt-2 container-form-box">
                <div className="ag-theme-alpine" style={{ height: '400px', width: '100%' }}>
                  <AgGridReact
                    rowData={rowData}
                    columnDefs={columnDefs}
                    rowSelection="single"
                    pagination={true}
                    paginationAutoPageSize={true}
                    gridOptions={gridOptions}
                    onSelectionChanged={handleRowSelected}
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}