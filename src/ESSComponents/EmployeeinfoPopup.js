import { useState, useEffect } from "react";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-autocomplete-editor/dist/main.css';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import LoadingScreen from '../Loading';
import Select from 'react-select';

const config = require('../Apiconfig');

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
    field: "EmployeeId",
    editable: false,
  },
  {
    headerName: "DOB",
    field: "DOB",
    editable: false,
  },
  {
    headerName: "Image",
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
  {
    headerName: "First Name",
    field: "First_Name",
    editable: false,
  },
  {
    headerName: "Middle Name",
    field: "Middle_Name",
    editable: false,
  },
  {
    headerName: "Last Name",
    field: "Last_Name",
    editable: false,
  },
  {
    headerName: "Father Name",
    field: "father_name",
    editable: false,
  },
  {
    headerName: "Mother Name",
    field: "mother_name",
    editable: false,
  },
  {
    headerName: "Gender",
    field: "Gender",
    editable: false,
  },
  {
    headerName: "Email",
    field: "email",
    editable: false,
  },
  {
    headerName: "Grade ID",
    field: "Grade_id",
    editable: false,
  },
  {
    headerName: "Phone No",
    field: "phone1",
    editable: false,
  },
  {
    headerName: "Alter Phone No",
    field: "phone2",
    editable: false,
  },
  {
    headerName: "Address 1",
    field: "address1",
    editable: false,
  },
  {
    headerName: "Address 2",
    field: "address2",
    editable: false,
  },
  {
    headerName: "Address 3",
    field: "address3",
    editable: false,
  },
  {
    headerName: "Permanent Address",
    field: "PermanantAddress",
    editable: false,
    minWidth: 160,
    maxWidth: 200,
  },
  {
    headerName: "Reference Name",
    field: "Reference_name",
    editable: false,
  },
  {
    headerName: "Reference Phone No",
    field: "Reference_Phone",
    editable: false,
  },
  {
    headerName: "Martial Status",
    field: "marital_status",
    editable: false,
  },
  {
    headerName: "PAN No",
    field: "Pan_No",
    editable: false,
  },
  {
    headerName: "ID",
    field: "Aadhar_no",
    editable: false,
  },
  {
    headerName: "Kids",
    field: "Kids",
    editable: false,
  },
  {
    headerName: "Department ID",
    field: "department_id",
    editable: false,
  },
  {
    headerName: "Designation ID",
    field: "designation_id",
    editable: false,
  },
  {
    headerName: "Status",
    field: "Status",
    editable: false,
  },
];

const gridOptions = {
  pagination: true,
  paginationPageSize: 10,
};

  const onFirstDataRendered = (params) => {
  const allColumnIds = params.columnApi
    .getColumns()
    .map((col) => col.getId());

  params.columnApi.autoSizeColumns(allColumnIds);
};


export default function EmployeeInfoPopup({ open, handleClose, EmployeeInfo }) {

  const [rowData, setRowData] = useState([]);
  const [EmployeeId, setEmployeeId] = useState("");
  const [First_Name, setFirst_Name] = useState("");
  const [Last_Name, setLast_Name] = useState("");
  const [DOB, setDOB] = useState("");
  const [loading, setLoading] = useState(false);

  const [isSelectGender, setIsSelectGender] = useState(false);
  const [Gender, setGender] = useState("");
  const [genderdrop, setgenderdrop] = useState([]);
  const [selectedGender, setselectedGender] = useState("");


  const [address, setaddress] = useState("");
  const [Phone, setPhone] = useState("");
  const [designation_id, setdesignation_id] = useState("");
  const [department_id, setdepartment_id] = useState("");

  const [selectedStatus, setSelectedStatus] = useState('');
  const [isSelectStatus, setIsSelectStatus] = useState(false);
  const [Status, setStatus] = useState('');
  const [statusdrop, setStatusdrop] = useState([]);


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

  const filteredOptiongender = genderdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const Handlegender = (selectedgender) => {
    setGender(selectedgender);
    setselectedGender(selectedgender ? selectedgender.value : '');

  };

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/gender`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),

      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setgenderdrop(data); // Store the fetched gender options in state
        }
      })
      .catch((error) => {
        console.error('Error fetching gender data:', error);
      });
  }, []);


  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/EmployeePersonalSC`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          EmployeeId,
          Last_Name,
          First_Name,
          DOB,
          Gender: selectedGender,
          address,
          Phone,
          designation_id,
          department_id,
          Status,
          company_code: sessionStorage.getItem('selectedCompanyCode'),
          Location_Code: sessionStorage.getItem('selectedLocationCode'),
        })
      });
      console.log("Payload:", { Gender, selectedGender });
      if (response.ok) {
        const searchData = await response.json();

        const updatedData = await Promise.all(
          searchData.map(async (item) => ({
            ...item,
            EmployeeId: item.EmployeeId,
            First_Name: item.First_Name,
            Middle_Name: item.Middle_Name,
            Photos: item.Photos ? arrayBufferToBase64(item.Photos.data) : null,
            Father_Name: item.father_name,
            Last_Name: item.Last_Name,
            Mother_Name: item.mother_name,
            DOB: item.DOB,
            selectedGender: item.Gender,
            Email: item.email,
            Phone1: item.phone1,
            Phone2: item.phone2,
            address1: item.Address1,
            address2: item.address2,
            address3: item.address3,
            permanantAddress: item.PermanantAddress,
            reference_Name: item.Reference_name,
            reference_Phone: item.Reference_Phone,
            pan_No: item.Pan_No,
            Aadhaar_no: item.Aadhar_no,
            selectedmartial: item.Marital_Status,
            selectedkids: item.Kids,
            selectedgradeid: item.Grade_id,
            address: item.address,
            Phone: item.Phone,
            Status: item.Status || item.status || "",
            designation_id: item.designation_id,
            department_id: item.department_id,
          }))
        );
        setRowData(updatedData);
        console.log("data fetched successfully")
      } else if (response.status === 404) {
        toast.warning("Data Not found")
        setRowData([]);
        console.log("Data not found"); // Log the message for 404 Not Found
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to insert sales data");
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
      toast.error('Error Deleting Data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClosePopup = () => {
    clearInputs();     // ✅ clear all inputs
    setRowData([]);    // ✅ clear grid
    handleClose();     // ✅ close popup
  };

  const handleReload = () => {
    clearInputs();
    setRowData([]);
  };

  const clearInputs = () => {
    // Text fields
    setEmployeeId("");
    setFirst_Name("");
    setLast_Name("");
    setDOB("");

    // Select fields
    setGender(null);          // react-select value
    setselectedGender("");    // actual value sent to API

    // Other inputs
    setaddress("");
    setPhone("");
    setdesignation_id("");
    setdepartment_id("");
    setSelectedStatus("");
    setStatus("");
  };

  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowSelected = (event) => {
    setSelectedRows(event.api.getSelectedRows());
  };

  const handleConfirm = () => {
    const selectedData = selectedRows.map(row => ({
      EmployeeId: row.EmployeeId,
      DOB: row.DOB,
      First_Name: row.First_Name,
      Middle_Name: row.Middle_Name,
      Last_Name: row.Last_Name,
      Father_Name: row.father_name,
      Mother_Name: row.mother_name,
      Gender: row.Gender,
      Email: row.email,
      Grade_id: row.Grade_id,
      phone1: row.phone1,
      phone2: row.phone2,
      Address1: row.Address1,
      Address2: row.address2,
      Address3: row.address3,
      PermanantAddress: row.PermanantAddress,
      Reference_Name: row.Reference_name,
      Reference_Phone: row.Reference_Phone,
      Marital_Status: row.Marital_Status,
      Pan_No: row.Pan_No,
      Aadhar_no: row.Aadhar_no,
      Kids: row.Kids,
      Photos: row.Photos,
      designation_id: row.designation_id,
      department_id: row.department_id,
      Title: row.Title,
      Place_of_Birth: row.Place_of_Birth,
      Nationality: row.Nationality,
      Religion: row.Religion,
      Blood_Group: row.Blood_Group,
      Spouse_Name: row.Spouse_Name,
      Number_of_Siblings: row.Number_of_Siblings,
      Number_of_Children: row.Number_of_Children,
      Email_Business: row.Email_Business,
      Phone_Alternate: row.Phone_Alternate,
      Emergency_Contact_Name: row.Emergency_Contact_Name,
      Emergency_Contact_Relationship: row.Emergency_Contact_Relationship,
      Emergency_Contact_Phone: row.Emergency_Contact_Phone,
      City: row.City,
      State: row.State,
      Country: row.Country,
      Postal_Code: row.Postal_Code,
      Status: row.Status || row.status || "",
      Passport_No: row.Passport_No,
      Passport_Expiry_Date: row.Passport_Expiry_Date,
      Other_Id_Type: row.Other_Id_Type,
      Other_Id_No: row.Other_Id_No

    }));

    EmployeeInfo(selectedData);
    handleClosePopup();   // ✅ clean and simple
  }

  const onFirstDataRendered = (params) => {
    const allColumnIds = params.columnApi
      .getColumns()
      .map((col) => col.getId());

    params.columnApi.autoSizeColumns(allColumnIds);
  };

  return (
    <div>
      {open && (
        <div className="modal-overlay">
          {loading && <LoadingScreen />}
          <div className="custom-modal con  tainer-fluid Topnav-screen">
            <div className="custom-modal-body">

              <div className="shadow-lg p-1 bg-light main-header-box">
                <div className="header-flex">
                  <h1 className="custom-modal-title">Employee Info Help</h1>

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
                      type="text"
                      autoComplete="off"
                      placeholder=" "
                      className="exp-input-field form-control"
                      title="Please Enter the Employee ID"
                      value={EmployeeId}
                      maxLength={100}
                      onChange={(e) => setEmployeeId(e.target.value)}
                    // onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <label className="exp-form-labels">Employee ID</label>
                  </div>
                </div>

                <div className="form-block col-md-3">
                  <div className="inputGroup">
                    <input
                      type="date"
                      autoComplete="off"
                      placeholder=" "
                      className="exp-input-field form-control"
                      title="Please Select the Date of Birth"
                      value={DOB}
                      onChange={(e) => setDOB(e.target.value)}
                    // onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <label className="exp-form-labels">DOB</label>
                  </div>
                </div>

                <div className="form-block col-md-3">
                  <div className="inputGroup">
                    <input
                      type="text"
                      autoComplete="off"
                      placeholder=" "
                      className="exp-input-field form-control"
                      title="Please Enter the First Name"
                      value={First_Name}
                      maxLength={100}
                      onChange={(e) => setFirst_Name(e.target.value)}
                    // onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <label className="exp-form-labels">First Name</label>
                  </div>
                </div>

                <div className="form-block col-md-3">
                  <div className="inputGroup">
                    <input
                      type="text"
                      autoComplete="off"
                      placeholder=" "
                      className="exp-input-field form-control"
                      title="Please Enter the Last Name"
                      value={Last_Name}
                      maxLength={100}
                      onChange={(e) => setLast_Name(e.target.value)}
                    // onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <label className="exp-form-labels">Last Name</label>
                  </div>
                </div>

                <div className="form-block col-md-3">
                  <div
                    className={`inputGroup selectGroup 
                    ${Gender ? "has-value" : ""} 
                    ${isSelectGender ? "is-focused" : ""}`}
                    title="Please Select the Gender"
                  >
                    <Select
                      inputId="gender"
                      name="gender"
                      type="text"
                      placeholder=" "
                      onFocus={() => setIsSelectGender(true)}
                      onBlur={() => setIsSelectGender(false)}
                      classNamePrefix="react-select"
                      isClearable
                      value={Gender}
                      options={filteredOptiongender}
                      onChange={Handlegender}
                      maxLength={10}
                      autoComplete="off"
                    />
                    <label htmlFor="gender" className={`floating-label`}>Gender</label>
                  </div>
                </div>

                <div className="form-block col-md-3">
                  <div className="inputGroup">
                    <input
                      id="permanantAddress"
                      class="exp-input-field form-control"
                      title="Please Enter the Address"
                      type="text"
                      placeholder=""
                      value={address}
                      onChange={(e) => setaddress(e.target.value)}
                      autoComplete="off"
                      maxLength={300}
                    />
                    <label htmlFor="permanantAddress" className={`exp-form-labels`}>Address</label>
                  </div>
                </div>

                <div className="form-block col-md-3">
                  <div className="inputGroup">
                    <input
                      id="Phone"
                      className="exp-input-field form-control"
                      title="Please Enter the Phone Number"
                      type="number"
                      placeholder=""
                      required
                      value={Phone}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.length <= 13) {
                          setPhone(value);
                        }
                      }}
                      maxLength={13}
                      autoComplete="off"
                    />
                    <label htmlFor="Phone" className={`exp-form-labels`}>Phone No</label>
                  </div>
                </div>

                <div className="form-block col-md-3">
                  <div className="inputGroup">
                    <input
                      id="ReferenceName"
                      class="exp-input-field form-control"
                      title="Please Enter the Designation ID"
                      type="text"
                      placeholder=""
                      value={designation_id}
                      onChange={(e) => setdesignation_id(e.target.value)}
                      autoComplete="off"
                      maxLength={100}
                    />
                    {/* <label htmlFor="ReferenceName" className="exp-form-labels">Reference Name</label> */}
                    <label for="ReferenceName" className={`exp-form-labels`}>Designation ID</label>
                  </div>
                </div>

                <div className="form-block col-md-3">
                  <div className="inputGroup">
                    <input
                      id="ReferenceName"
                      class="exp-input-field form-control"
                      title="Please Enter the Department ID"
                      type="text"
                      placeholder=""
                      value={department_id}
                      onChange={(e) => setdepartment_id(e.target.value)}
                      autoComplete="off"
                      maxLength={100}
                    />
                    {/* <label htmlFor="ReferenceName" className="exp-form-labels">Reference Name</label> */}
                    <label for="ReferenceName" className={`exp-form-labels`}>Department ID</label>
                  </div>
                </div>

                <div className="form-block col-md-3">
                  <div
                    className={`inputGroup selectGroup 
                    ${selectedStatus ? "has-value" : ""} 
                    ${isSelectStatus ? "is-focused" : ""}`}
                    title="Please Select the Status"
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
                    paginationAutoPageSize={true}
                    gridOptions={gridOptions}
                    onFirstDataRendered={onFirstDataRendered}
                    onSelectionChanged={handleRowSelected}
                    onFirstDataRendered={onFirstDataRendered}
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
