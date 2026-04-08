import { useState, useEffect} from "react";
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
import Select from 'react-select';
const config = require('../Apiconfig');


const columnDefs = [
  {
    checkboxSelection: true,
    headerName: "Employee ID",
    field: "EmployeeId",
    filter: 'agTextColumnFilter',
    editable: false,
  },
  {
    headerName: "Employee First Name",
    field: "first_name",
    filter: 'agTextColumnFilter',
    editable: false,
  },
  {
    headerName: "Employee Middle Name",
    field: "middle_name",
    filter: 'agTextColumnFilter',
    editable: false,
  },
  {
    headerName: "Employee Last  Name",
    field: "Last_Name",
    filter: 'agTextColumnFilter',
    editable: false,
  },
  {
    headerName: "Phone Number",
    field: "phone1",
    filter: 'agTextColumnFilter',
    editable: false,
  },
  {
    headerName: "Email",
    field: "email",
    filter: 'agTextColumnFilter',
    editable: false,
  },
  {
    headerName: "Department",
    field: "department_ID",
    filter: 'agTextColumnFilter',
    editable: false,
  },
  {
    headerName: "Designation",
    field: "designation_ID",
    filter: 'agTextColumnFilter',
    editable: false,
  },
  {
    headerName: "DOJ",
    field: "DOJ",
    filter: 'agTextColumnFilter',
    editable: false,
    valueFormatter: params => format(new Date(params.value), 'dd-MM-yyyy'),
  },
  {
    headerName: "DOL",
    field: "DOL",
    filter: 'agTextColumnFilter',
    editable: false,
    valueFormatter: params => format(new Date(params.value), 'dd-MM-yyyy'),
  },
  {
    headerName: "Manager",
    field: "manager",
    filter: 'agTextColumnFilter',
    editable: false,
  },
  {
    headerName: "Shift",
    field: "shift",
    editable: false,
  },
  {
    headerName: "Status",
    field: "status",
    filter: 'agTextColumnFilter',
    editable: false,
  },
  {
    headerName: "Employee Type",
    field: "Employee_Type",
    filter: 'agTextColumnFilter',
    editable: false,
  },
];

const gridOptions = {
  pagination: true,
  paginationPageSize: 10,
};

export default function Companydetailpopup({ open, handleClose, CompanyDetails }) {

  const [rowData, setRowData] = useState([]);
  const [EmployeeId, setEmployeeId] = useState("");
  const [Department, setDepartment] = useState("");
  const [Designation, setDesignation] = useState("");
  const [DOJ, setDOJ] = useState("");
  const [manager, setManager] = useState("");
  const [Name, setname] = useState("");
  const [loading, setLoading] = useState(false);

  const [selectedmanager, setselectedmanager] = useState('');
  const [isSelectManager, setIsSelectManager] = useState(false);
  const [Managerdrop, setManagerdrop] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isSelectStatus, setIsSelectStatus] = useState(false);
  const [status, setStatus] = useState('');
  const [statusdrop, setStatusdrop] = useState([]);
  const [from_date, setfrom_date] = useState("");
  const [to_date, setto_date] = useState("");
  const [selectedEmpType, setSelectedEmpType] = useState('');
  const [isSelectEmpType, setIsSelectEmpType] = useState(false);
  const [empType, setEmpType] = useState('');
  const [empTypeDrop, setEmpTypeDrop] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const filteredOptionManager = Array.isArray(Managerdrop)
    ? Managerdrop.map((option) => ({
      value: option.EmployeeId,
      label: `${option.EmployeeId}-${option.full_name}`,
    }))
    : [];

    const handleChangeCode = (selectedOption) => {
    setselectedmanager(selectedOption);
    setManager(selectedOption ? selectedOption.value : '');
  };

  useEffect(() => {
      fetch(`${config.apiBaseUrl}/getESSmanager`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem("selectedCompanyCode"),
        }),
      })
        .then((response) => response.json())
        .then(setManagerdrop)
        .catch((error) => console.error("Error fetching warehouse:", error));
    }, []);

    const handleStatusChange = (selectedStatus) => {
    setSelectedStatus(selectedStatus);
    setStatus(selectedStatus ? selectedStatus.value : '');
  };

  const filteredOptionStatus = statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),

      }),
    })
      .then((data) => data.json())
      .then((val) => setStatusdrop(val));
  }, []);

  const handleChangeEmpType = (selectedEmpType) => {
    setSelectedEmpType(selectedEmpType);
    setEmpType(selectedEmpType ? selectedEmpType.value : '');
  };

  const filteredOptionEmpType = empTypeDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getEmployeeType`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((data) => data.json())
      .then((val) => setEmpTypeDrop(val));
  }, []);

  const handleSearch = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${config.apiBaseUrl}/EmployeeCompanyISC`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          EmployeeId, Department, Designation, Name, manager, status, from_date, to_date, 
          Employee_Type: selectedEmpType ? selectedEmpType.value : null, 
          company_code: sessionStorage.getItem('selectedCompanyCode')

        })
      });
      if (response.ok) {
        const searchData = await response.json();

        const updatedData = await Promise.all(
          searchData.map(async (item) => ({
            ...item,
            EmployeeId: item.EmployeeId,
            Department: item.Department,
            designation_Id: item.Designation,
            DOJ: item.DOJ,
            DOL: item.DOL,
            selectedmanager: item.manager,
            shift: item.shift,
            selectedstatus: item.status,
            selectedEmpType: item.selectedEmpType,
            from_date: from_date || null,
            to_date: to_date || null,
            Employee_Type: item.Employee_Type,
            // First_Name: item.First_Name,
            // Photos: item.Photos ? arrayBufferToBase64(item.Photos.data) : null,

          }))
        );
        setRowData(updatedData);
        console.log("data fetched successfully")
      } else if (response.status === 404) {
        toast.warning("Data Not found")
        setRowData([]);
        console.log("Data not found"); // Log the message for 404 Not Found
      } else {
        console.log("Bad request"); // Log the message for other errors
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
    } finally {
      setLoading(false);
    }
  };

const handleClosePopup = () => {
  clearInputs();     // ✅ clear all inputs
  setRowData([]);    // ✅ clear grid
  handleClose();     // ✅ close parent popup
};

const handleReload = () => {
  clearInputs();   // ❌ remove []
  setRowData([]);
};

const clearInputs = () => {
  setEmployeeId("");
  setname("");
  setDepartment("");
  setDesignation("");

  setselectedmanager(null);
  setSelectedStatus(null);
  setSelectedEmpType(null);

  setManager("");   // ✅ important
  setStatus("");    // ✅ important
  setEmpType("");

  setfrom_date("");
  setto_date("");
};

  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowSelected = (event) => {
    setSelectedRows(event.api.getSelectedRows());
  };

  const handleConfirm = () => {
    const selectedData = selectedRows.map(row => ({
      EmployeeId: row.EmployeeId,
      department_ID: row.department_ID,
      designation_ID: row.designation_ID,
      DOJ: row.DOJ,
      DOL: row.DOL,
      manager: row.manager,
      shift: row.shift,
      status: row.status,
      First_name: row.first_name,
      Section: row.Section,
      Work_Location: row.Work_Location,
      Employee_Type: row.Employee_Type
    }));
    CompanyDetails(selectedData);
    handleClosePopup();
  }

  return (
    <div>
      {open && (
        <div className="modal-overlay">
      {loading && <LoadingScreen />}
          <div className="custom-modal container-fluid Topnav-screen">
            <div className="custom-modal-body">

              <div className="shadow-lg p-1 bg-light main-header-box">
                <div className="header-flex">
                  <h1 className="custom-modal-title">Company Details Help</h1>

                  <div className="action-wrapper">
                    <div className="action-icon delete" onClick={handleClosePopup}>
                      <span className="tooltip">Close</span>
                      <i className="fa-solid fa-xmark"></i>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-row shadow-lg p-2 bg-light mt-2 container-form-box">

                <div className="form-block col-md-3">
                  <div className="inputGroup">
                    <input
                      className="exp-input-field form-control"
                      type="text"
                      placeholder=" "
                      autoComplete="off"
                      value={EmployeeId}
                      maxLength={100}
                      onChange={(e) => setEmployeeId(e.target.value)}
                    />
                    <label className="exp-form-labels">Employee ID</label>
                  </div>
                </div>

                <div className="form-block col-md-3">
                  <div className="inputGroup">
                    <input
                      type="text"
                      placeholder=" "
                      autoComplete="off"
                      className="exp-input-field form-control"
                      value={Name}
                      maxLength={100}
                      onChange={(e) => setname(e.target.value)}
                    />
                    <label className="exp-form-labels">Employee Name</label>
                  </div>
                </div>

                <div className="form-block col-md-3">
                  <div className="inputGroup">
                    <input
                      className="exp-input-field form-control"
                      type="text"
                      autoComplete="off"
                      placeholder=" "
                      maxLength={100}
                      value={Department}
                      onChange={(e) => setDepartment(e.target.value)}
                    />
                    <label className="exp-form-labels">Department</label>
                  </div>
                </div>

                <div className="form-block col-md-3">
                  <div className="inputGroup">
                    <input
                      className="exp-input-field form-control"
                      type="text"
                      autoComplete="off"
                      placeholder=" "
                      value={Designation}
                      maxLength={100}
                      onChange={(e) => setDesignation(e.target.value)}
                    />
                    <label className="exp-form-labels">Designation</label>
                  </div>
                </div>

                <div className="form-block col-md-3">
            <div
              className={`inputGroup selectGroup 
              ${selectedmanager ? "has-value" : ""} 
              ${isSelectManager ? "is-focused" : ""}`}
            >
              <Select
                id="manager"
                placeholder=" "
                onFocus={() => setIsSelectManager(true)}
                onBlur={() => setIsSelectManager(false)}
                classNamePrefix="react-select"
                isClearable
                type="text"
                name="manager"
                value={selectedmanager}
                options={filteredOptionManager}
                onChange={handleChangeCode}
                required
              />
              <label htmlFor="selectedmanager" className={`floating-label`}>
                Manager
              </label>
            </div>
          </div>

          <div className="form-block col-md-3">
            <div
              className={`inputGroup selectGroup 
              ${selectedStatus ? "has-value" : ""} 
              ${isSelectStatus ? "is-focused" : ""}`}
            >
              <Select
                id="status"
                type="text"
                placeholder=" "
                onFocus={() => setIsSelectStatus(true)}
                onBlur={() => setIsSelectStatus(false)}
                classNamePrefix="react-select"
                isClearable
                value={selectedStatus}
                onChange={handleStatusChange}
                options={filteredOptionStatus}
              />
              <label htmlFor="Status" className={`floating-label`}>
                Status
              </label>
            </div>
          </div>

          <div className="form-block col-md-3">
            <div className="inputGroup">
              <input
                id="DOJ"
                className="exp-input-field form-control"
                type="date"
                name="DOJ"
                placeholder=" "
                value={from_date}
                onChange={(e) => setfrom_date(e.target.value)}
                required
              />
              <label htmlFor="DOJ" className={`exp-form-labels`}>
                From Date
              </label>
            </div>
          </div>

          <div className="form-block col-md-3">
            <div className="inputGroup">
              <input
                id="DOL"
                className="exp-input-field form-control"
                type="date"
                name="DOL"
                placeholder=" "
                value={to_date}
                onChange={(e) => setto_date(e.target.value)}
              />
              <label htmlFor="DOL" className="exp-form-labels">To Date</label>
            </div>
          </div>

          <div className="form-block col-md-3">
            <div
              className={`inputGroup selectGroup 
              ${selectedEmpType ? "has-value" : ""} 
              ${isSelectEmpType ? "is-focused" : ""}`}
            >
              <Select
                id="shift"
                type="text"
                value={selectedEmpType}
                onChange={handleChangeEmpType}
                options={filteredOptionEmpType}
                 placeholder=" "
                onFocus={() => setIsSelectEmpType(true)}
                onBlur={() => setIsSelectEmpType(false)}
                classNamePrefix="react-select"
                isClearable
              />
          
            <label htmlFor="selectedshift" className={`floating-label`}>
              Employee Type
            </label>
            </div>
          
          </div>

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

              <div className="shadow-lg p-3 pb-0 bg-light mt-2 container-form-box">
                <div className="ag-theme-alpine" style={{ height: '400px', width: '100%' }}>
                  <AgGridReact
                    rowData={rowData}
                    columnDefs={columnDefs}
                    rowSelection="single"
                    pagination={true}
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