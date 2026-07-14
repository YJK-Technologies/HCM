import { useState } from "react";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-autocomplete-editor/dist/main.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import LoadingScreen from '../Loading';
const config = require('../Apiconfig');

const columnDefs = [
  {
    checkboxSelection: true,
    headerName: "Employee ID",
    field: "EmployeeId",
    // filter: 'agTextColumnFilter',
    editable: false,
  },
  {
    headerName: "First Name",
    field: "first_name",
    // filter: 'agTextColumnFilter',
    editable: false,
  },
  {
    headerName: "Middle Name",
    field: "middle_name",
    // filter: 'agTextColumnFilter',
    editable: false,
  },
  {
    headerName: "Last Name",
    field: "Last_Name",
    // filter: 'agTextColumnFilter',
    editable: false,
  },
  {
    headerName: "Phone Number",
    field: "phone1",
    // filter: 'agTextColumnFilter',
    editable: false,
  },
  {
    headerName: "Email",
    field: "email",
    // filter: 'agTextColumnFilter',
    editable: false,
  },
  {
    headerName: "Salary Type",
    field: "salaryType",
    // filter: 'agTextColumnFilter',
    editable: false,
  },
  {
    headerName: "Pay Scale",
    field: "Payscale",
    // filter: 'agTextColumnFilter',
    editable: false,
  },
  {
    headerName: "PF No",
    field: "PFNo",
    // filter: 'agTextColumnFilter',
    editable: false,
  },
  {
    headerName: "Salary Per Annum",
    field: "salary_month",
    // filter: 'agTextColumnFilter',
    editable: false,
  },
  {
    headerName: "Department ID",
    field: "department_id",
    // filter: 'agTextColumnFilter',
    editable: false,
  },
  {
    headerName: "Designation ID",
    field: "designation_id",
    // filter: 'agTextColumnFilter',
    editable: false,
  },
];

const gridOptions = {
  pagination: true,
  paginationPageSize: 10,
};


export default function FinanceDetailsPopup({ open, handleClose, finaceDetails }) {

  const [rowData, setRowData] = useState([]);
  const [EmployeeId, setEmployeeId] = useState("");
  const [salaryType, setSalaryType] = useState("");
  const [payScale, setPayScale] = useState("");
  const [salaryPerAnnum, setSalaryPerAnnum] = useState("");
  const [salary_from, setsalary_from] = useState("");
  const [salary_to, setsalary_to] = useState("");

  const [Name, setname] = useState("");
  const [loading, setLoading] = useState(false);

  const [PFNo, setPFNo] = useState("");

  const Location_Code = sessionStorage.getItem('selectedLocationCode');

  const handleSearch = async () => {
    setLoading(true);

    try {
      const company_code = sessionStorage.getItem("selectedCompanyCode");

      const salaryValue = salaryPerAnnum === "" ? null : parseInt(salaryPerAnnum, 10);

      const response = await fetch(`${config.apiBaseUrl}/getFinancialDetailsSearchCretria`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            EmployeeId,
            Name,
            salaryType,
            Payscale: payScale,
            PFNo,
            salary_from: salary_from ? parseFloat(salary_from) : null,
            salary_to: salary_to ? parseFloat(salary_to) : null,
            company_code,
            Location_Code
          }),
        }
      );

      if (response.ok) {
        const searchData = await response.json();

        const updatedData = searchData.map((item) => ({
          ...item,
          EmployeeId: item.EmployeeId,
          Name: item.Name,
          salaryType: item.salaryType,
          Payscale: item.Payscale,
          PFNo: item.PFNo,
          salary_from: item.salary_from,
          salary_to: item.salary_to,
          salaryPerAnnum: item.salary_month
            ? Number(item.salary_month)
            : null,
        }));

        setRowData(updatedData);
        console.log("data fetched successfully");
      } else if (response.status === 404) {
        toast.warning("Data Not found");
        setRowData([]);
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Something went wrong");
        setRowData([]);
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
      toast.error("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClosePopup = () => {
    clearInputs();
    setRowData([]);
    handleClose();
  };

  const handleReload = () => {
    clearInputs();
    setRowData([]);
  };

  const clearInputs = () => {
    setEmployeeId("");
    setname("");
    setSalaryType("");
    setPayScale("");
    setSalaryPerAnnum("");
    setPFNo("");
    setsalary_from("");
    setsalary_to("");
  };

  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowSelected = (event) => {
    setSelectedRows(event.api.getSelectedRows());
  };

  const handleConfirm = () => {
    const selectedData = selectedRows.map(row => ({
      employeeId: row.EmployeeId,
      salaryType: row.salaryType,
      Payscale: row.Payscale,
      PFNo: row.PFNo,
      salaryMonth: row.salary_month,
      first_name: row.First_Name,
      Department: row.department_id,
      Designation: row.designation_id,
    }));

    finaceDetails(selectedData);
    handleClosePopup();
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
          <div className="custom-modal container-fluid Topnav-screen">
            <div className="custom-modal-body">

              <div className="shadow-lg p-1 bg-light main-header-box">
                <div className="header-flex">
                  <h1 className="custom-modal-title">Financial Details Help</h1>

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
                      title="Please Enter the Employee ID"
                      placeholder=" "
                      maxLength={18}
                      className="exp-input-field form-control"
                      value={EmployeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                    // onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <label className="exp-form-labels">Employee ID</label>
                  </div>
                </div>

                <div className="form-block col-md-3">
                  <div className="inputGroup">
                    <input
                      type="text"
                      autoComplete="off"
                      title="Please Enter the Employee Name"
                      placeholder=" "
                      maxLength={225}
                      className="exp-input-field form-control"
                      value={Name}
                      onChange={(e) => setname(e.target.value)}
                    // onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <label className="exp-form-labels">Employee Name</label>
                  </div>
                </div>

                <div className="form-block col-md-3">
                  <div className="inputGroup">
                    <input
                      type="text"
                      title="Please Enter the Salary Type"
                      autoComplete="off"
                      placeholder=" "
                      maxLength={50}
                      className="exp-input-field form-control"
                      value={salaryType}
                      onChange={(e) => setSalaryType(e.target.value)}
                    // onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <label className="exp-form-labels">Salary Type</label>
                  </div>
                </div>

                <div className="form-block col-md-3">
                  <div className="inputGroup">
                    <input
                      type="text"
                      autoComplete="off"
                      title="Please Enter the Payscale"
                      placeholder=" "
                      maxLength={50}
                      className="exp-input-field form-control"
                      value={payScale}
                      onChange={(e) => setPayScale(e.target.value)}
                    // onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <label className="exp-form-labels">Payscale</label>
                  </div>
                </div>

                {/* <div className="form-block col-md-3">
                  <div className="inputGroup">
                    <input
                      type="text"
                      autoComplete="off"
                      placeholder=" "
                      className="exp-input-field form-control"
                      value={salaryPerAnnum}
                      onChange={(e) => setSalaryPerAnnum(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <label className="exp-form-labels">Salary Per Annum</label>
                  </div>
                </div> */}

                <div className="form-block col-md-3">
                  <div className="inputGroup">
                    <input
                      class="exp-input-field form-control"
                      title="Please Enter the PF No"
                      type="text"
                      id="PFNo"
                      placeholder=" "
                      autoComplete="off"
                      value={PFNo}
                      onChange={(e) => setPFNo(e.target.value)}
                      maxLength={100}
                    />
                    <label for="sname" className={`exp-form-labels`}>PF No</label>
                  </div>
                </div>

                <div className="form-block col-md-3">
                  <div className="inputGroup">
                    <input
                      type="number"
                      autoComplete="off"
                      title="Please Enter the Salary Range From"
                      placeholder=" "
                      className="exp-input-field form-control"
                      value={salary_from}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.length <= 18) {
                          setsalary_from(value);
                        }
                      }}
                      maxLength={18}
                    // onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <label className="exp-form-labels">Salary Range From</label>
                  </div>
                </div>

                <div className="form-block col-md-3">
                  <div className="inputGroup">
                    <input
                      type="number"
                      autoComplete="off"
                      title="Please Enter the Salary Range To"
                      placeholder=" "
                      className="exp-input-field form-control"
                      value={salary_to}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.length <= 18) {
                          setsalary_to(value);
                        }
                      }}
                      maxLength={18}
                    // onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <label className="exp-form-labels">Salary Range To</label>
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