import { useState } from "react";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import "ag-grid-enterprise";
import 'ag-grid-autocomplete-editor/dist/main.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import LoadingScreen from '../Loading';
const config = require('../Apiconfig');

const columnDefs = [
  {
    checkboxSelection: true,
    headerName: "Employee ID",
    field: "EmployeeId",
    editable: false,
  },
  {
    headerName: "First Name",
    field: "first_name",
    editable: false,
  },
  {
    headerName: "Middle Name",
    field: "middle_name",
    editable: false,
  },
  {
    headerName: "Last Name",
    field: "Last_Name",
    editable: false,
  },
  {
    headerName: "Phone Number",
    field: "phone1",
    editable: false,
  },
  {
    headerName: "Email",
    field: "email",
    editable: false,
  },
  {
    headerName: "Document No",
    field: "documentNo",
    editable: false,
  },
  {
    headerName: "Document Type",
    field: "documentType",
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
    headerName: "Issue Date",
    field: "issueDate",
    editable: false,
    valueFormatter: params => format(new Date(params.value), 'yyyy-MM-dd'),
  },
  {
    headerName: "Expiry Date",
    field: "expiryDate",
    editable: false,
    valueFormatter: params => format(new Date(params.value), 'yyyy-MM-dd'),
  },
  // {
  //   headerName: "Document",
  //   field: "document",
  //   editable: false,
  //   // minWidth: 135,
  //   // maxWidth: 200,
  //   cellRenderer: (params) => {
  //       if (params.value) {
  //         const fileURL = `data:application/pdf;base64,${params.value}`;
  //         return (
  //           <iframe 
  //             src={fileURL} 
  //             style={{ width: "50px", height: "50px" }}
  //             title="PDF Preview"
  //           />
  //         );
  //       } else {
  //         return <span>No Document</span>;
  //       }
  //     }
  // },
];

const gridOptions = {
  pagination: true,
  paginationPageSize: 10,
};

export default function IdentityDocumentsPopup({ open, handleClose, identityDocuments }) {

  const [rowData, setRowData] = useState([]);
  const [EmployeeId, setEmployeeId] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [documentNo, setDocumentNo] = useState("");
  const [Name, setname] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);

    try {
      const company_code = sessionStorage.getItem("selectedCompanyCode");

      const response = await fetch(
        `${config.apiBaseUrl}/getIdentityDocumentSearchCretria`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            EmployeeId,
            documentType,
            Name,
            documentNo,
            company_code
          })
        }
      );

      if (response.ok) {
        const searchData = await response.json();

        // ✅ Clean structured mapping
        const updatedData = searchData.map((item) => ({
          ...item,
          EmployeeId: item.EmployeeId,
          documentType: item.documentType,
          documentNo: item.documentNo,
          issueDate: item.issueDate,
          expiryDate: item.expiryDate,
          department_id: item.department_id,
          designation_id: item.designation_id,
        }));

        setRowData(updatedData);
        console.log("Data fetched successfully");
      }

      else if (response.status === 404) {
        toast.warning("Data Not found");
        setRowData([]); // ✅ ONLY clear grid
      }

      else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Something went wrong");
        setRowData([]);
      }

    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClosePopup = () => {
    handleClose();
    clearInputs();
    setRowData([]);
    setSelectedRows([]);
  };

  const handleReload = () => {
    clearInputs();
    setRowData([]);
    setSelectedRows([]);
  };
  const clearInputs = () => {
    setEmployeeId("");
    setDocumentType("");
    setDocumentNo("");
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

    const selectedData = selectedRows.map(row => ({
      employeeId: row.EmployeeId,
      documentType: row.documentType,
      documentNo: row.documentNo,
      issueDate: row.issueDate,
      first_name: row.first_name,
      expiryDate: row.expiryDate,
      Department: row.department_id,
      Designation: row.designation_id,
    }));

    identityDocuments(selectedData);

    handleClosePopup(); // ✅ single clean exit
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
                  <h1 className="custom-modal-title">Identity Documents Help</h1>

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
                      placeholder=" "
                      className="exp-input-field form-control"
                      title="Please Enter the Employee ID"
                      value={EmployeeId}
                      maxLength={18}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      // onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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
                      title="Please Enter the Employee Name"
                      value={Name}
                      onChange={(e) => setname(e.target.value)}
                      // onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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
                      title="Please Enter the Document Type"
                      value={documentType}
                      maxLength={50}
                      onChange={(e) => setDocumentType(e.target.value)}
                      // onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      autoComplete="off"
                    />
                    <label className="exp-form-labels">Document Type</label>
                  </div>
                </div>

                <div className="form-block col-md-3">
                  <div className="inputGroup">
                    <input
                      type="text"
                      placeholder=" "
                      className="exp-input-field form-control"
                      title="Please Enter the Document No"
                      value={documentNo}
                      maxLength={100}
                      onChange={(e) => setDocumentNo(e.target.value)}
                      // onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      autoComplete="off"
                    />
                    <label className="exp-form-labels">Document No</label>
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