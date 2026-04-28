import { useState, useEffect } from "react";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-autocomplete-editor/dist/main.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import LoadingScreen from '../Loading';
import Select from 'react-select';
const config = require('../Apiconfig');

const columnDefs = [
  {
    checkboxSelection: true,
    headerName: "Employee Id",
    field: "EmployeeId",
    editable: false,
  },
  {
    headerName: "First Name",
    field: "first_name",
    filter: 'agTextColumnFilter',
    editable: true,
  },
  {
    headerName: "Middle Name",
    field: "middle_name",
    filter: 'agTextColumnFilter',
    editable: true,
  },
  {
    headerName: "Last Name",
    field: "Last_Name",
    filter: 'agTextColumnFilter',
    editable: true,
  },
  {
    headerName: "Phone Number",
    field: "phone1",
    filter: 'agTextColumnFilter',
    editable: true,
  },
  {
    headerName: "Email",
    field: "email",
    filter: 'agTextColumnFilter',
    editable: true,
  },
  {
    headerName: "Relation",
    field: "Relation",
    editable: false,
  },
  {
    headerName: "Name",
    field: "Name",
    editable: false,
  },
  {
    headerName: "Gender",
    field: "Sex",
    editable: false,
  },
  {
    headerName: "DOB",
    field: "Date_of_Birth",
    editable: false,
  },
  {
    headerName: "Age",
    field: "AGE",
    editable: false,
  },
  {
    headerName: "Id",
    field: "aadhar_no",
    editable: false,
  },
  {
    headerName: "Departmeny ID",
    field: "department_id",
    editable: false,
  },
  {
    headerName: "Designation ID",
    field: "designation_id",
    editable: false,
  },
];

const gridOptions = {
  pagination: true,
  paginationPageSize: 10,
};


export default function FinanceDetailsPopup({ open, handleClose, familyDetails }) {

  const [rowData, setRowData] = useState([]);
  const [EmployeeId, setEmployeeId] = useState("");
  const [relation, setRelation] = useState("");
  const [EmployeeName, setEmployeeName] = useState("");
  const [loading, setLoading] = useState(false);

  const [isSelectGender, setIsSelectGender] = useState(false);
  const [Gender, setGender] = useState("");
  const [genderdrop, setgenderdrop] = useState([]);
  const [agefrom, setagefrom] = useState("");
  const [ageto, setageto] = useState("");
  const [Name, setName] = useState("");

  const filteredOptiongender = genderdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const Handlegender = (selectedOption) => {
    setGender(selectedOption);
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

    // ✅ Validation
    if (agefrom && ageto && Number(agefrom) > Number(ageto)) {
      toast.warning("Age From should not be greater than Age To");
      return;
    }

    setLoading(true);

    try {
      const company_code = sessionStorage.getItem("selectedCompanyCode");

      const payload = {
        EmployeeId: EmployeeId || null,
        Relation: relation || null,
        Name: Name || null,
        Sex: Gender ? Gender.value : null,
        EmployeeName: EmployeeName || null,
        agefrom: agefrom ? Number(agefrom) : null,
        ageto: ageto ? Number(ageto) : null,
        company_code,
      };

      console.log("Payload:", payload);

      const response = await fetch(
        `${config.apiBaseUrl}/getFamilyDetailsSearchCretria`,
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
          EmployeeId: item.EmployeeId,
          EmployeeName: item.EmployeeName,
          Relation: item.Relation,
          Name: item.Name,
          Gender: item.Gender,
          AGE: item.AGE,
          department_id: item.department_id,
          designation_id: item.designation_id,
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
    setRelation("");
    setEmployeeName("");
    setName("");
    setGender(null);
    setagefrom("");
    setageto("");
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

    const selectedData = selectedRows.map(row => ({
      employeeId: row.EmployeeId,
      Department: row.department_id,
      Designation: row.designation_id,
    }));

    familyDetails(selectedData);

    handleClosePopup(); // ✅ reuse clean close
  };

  return (
    <div>
      {open && (
        <div className="modal-overlay">
          {loading && <LoadingScreen />}
          <div className="custom-modal container-fluid Topnav-screen">
            <div className="custom-modal-body">

              {/* HEADER */}
              <div className="shadow-lg p-2 bg-light main-header-box">
                <div className="header-flex">
                  <h1 className="custom-modal-title">Family Help</h1>

                  <div className="action-wrapper">
                    <div className="action-icon delete" onClick={handleClosePopup}>
                      <span className="tooltip">Close</span>
                      <i className="fa-solid fa-xmark"></i>
                    </div>
                  </div>
                </div>
              </div>

              {/* FORM SECTION */}
              <div className="form-row shadow-lg p-3 bg-light mt-2 container-form-box">

                <div className="form-block col-md-3">
                  <div className="inputGroup">
                    <input
                      type="text"
                      placeholder=" "
                      className="exp-input-field form-control"
                      value={EmployeeId}
                      maxLength={100}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      // onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      autoComplete="off"
                    />
                    <label className="exp-form-labels">Employee ID</label>
                  </div>
                </div>

                <div className="form-block col-md-3">
                  <div className="inputGroup">
                    <input
                      type="text"
                      placeholder=" "
                      className="exp-input-field form-control"
                      value={EmployeeName}
                      maxLength={250}
                      onChange={(e) => setEmployeeName(e.target.value)}
                      // onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      autoComplete="off"
                    />
                    <label className="exp-form-labels">Employee Name</label>
                  </div>
                </div>

                <div className="form-block col-md-3">
                  <div className="inputGroup">
                    <input
                      type="text"
                      placeholder=" "
                      className="exp-input-field form-control"
                      value={relation}
                      maxLength={100}
                      onChange={(e) => setRelation(e.target.value)}
                      // onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      autoComplete="off"
                    />
                    <label className="exp-form-labels">Relation</label>
                  </div>
                </div>

                <div className="form-block col-md-3">
                  <div className="inputGroup">
                    <input
                      type="text"
                      placeholder=" "
                      className="exp-input-field form-control"
                      value={Name}
                      maxLength={100}
                      onChange={(e) => setName(e.target.value)}
                      // onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      autoComplete="off"
                    />
                    <label className="exp-form-labels">Relation Name</label>
                  </div>
                </div>

                <div className="form-block col-md-3">
                  <div
                    className={`inputGroup selectGroup 
                              ${Gender ? "has-value" : ""} 
                              ${isSelectGender ? "is-focused" : ""}`}
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
                      id="Phone"
                      className="exp-input-field form-control"
                      type="number"
                      placeholder=""
                      required
                      value={agefrom}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.length <= 3) {
                          setagefrom(value);
                        }
                      }}
                      maxLength={13}
                      autoComplete="off"
                    />
                    <label htmlFor="Phone" className={`exp-form-labels`}>Age From</label>
                  </div>
                </div>

                <div className="form-block col-md-3">
                  <div className="inputGroup">
                    <input
                      id="Phone"
                      className="exp-input-field form-control"
                      type="number"
                      placeholder=""
                      required
                      value={ageto}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.length <= 3) {
                          setageto(value);
                        }
                      }}
                      maxLength={13}
                      autoComplete="off"
                    />
                    <label htmlFor="Phone" className={`exp-form-labels`}>Age To</label>
                  </div>
                </div>

                {/* <div className="form-block col-md-3 col-sm-6 mb-2">
                  <div className="inputGroup">
                    <input
                      type="text"
                      placeholder=" "
                      className="exp-input-field form-control"
                      value={name}
                      maxLength={250}
                      onChange={(e) => setName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      autoComplete="off"
                    />
                    <label className="exp-form-labels">Name</label>
                  </div>
                </div> */}

                {/* Action Buttons */}
                <div className="form-block col-12 mt-2">
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

              {/* TABLE SECTION */}
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