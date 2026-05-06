import { useState } from "react";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-autocomplete-editor/dist/main.css';
import { toast } from 'react-toastify';
import LoadingScreen from '../Loading';
const config = require('../Apiconfig');

export default function EmployeeAssetsPopup({ open, handleClose,onSelectAssets , EmployeeAssetsPopup }) {
  const [loading, setLoading] = useState(false);
  const [EmployeeId, setEmployeeId] = useState("");
  const [AssetID, setAssetID] = useState("");
  const [ConditionAtIssue, setConditionAtIssue] = useState("");
  const [Remarks, setRemarks] = useState("");
  const [rowData, setRowData] = useState([]);


  const [selectedRows, setSelectedRows] = useState([]);

  const handleSearch = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/getAssetSearchCretria`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          EmployeeID: EmployeeId,
          AssetID: AssetID,
          company_code: sessionStorage.getItem("selectedCompanyCode")
        })
      });

   if (response.ok) {
        const searchData = await response.json();
        setRowData(searchData);
        console.log("data fetched successfully")
      } else if (response.status === 404) {
        toast.warning("Data Not found")
        setRowData([]);
        clearInputs([])
        console.log("Data not found");
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to insert sales data");
      }
    } catch (error) {
      console.error("Error deleting rows:", error);
      toast.error('Error Deleting Data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const columnDefs = [
    {
      checkboxSelection: true,
      headerName: "Employee Id",
      field: "EmployeeId",
      editable: false,
    },

    {
      headerName: "Asset ID",
      field: "AssetID",
      // filter: 'agTextColumnFilter',
      editable: true,
    },

    {
      headerName: "Allocation Date",
      field: "AllocationDate",
      // filter: 'agTextColumnFilter',
      editable: true,
    },

    {
      headerName: "Expected Return Date",
      field: "ExpectedReturnDate",
      // filter: 'agTextColumnFilter',
      editable: true,
    },
    {
      headerName: "Actual Return Date",
      field: "ActualReturnDate",
      // filter: 'agTextColumnFilter',
      editable: true,
    },

    {
      headerName: "Allocation Status",
      field: "AllocationStatus",
      // filter: 'agTextColumnFilter',
      editable: true,
    },
    {
      headerName: "Condition At Issue",
      field: "ConditionAtIssue",
      // filter: 'agTextColumnFilter',
      editable: true,
    },

    {
      headerName: "Condition At Return",
      field: "ConditionAtReturn",
      // filter: 'agTextColumnFilter',
      editable: true,
    },

    {
      headerName: "Approved By",
      field: "ApprovedBy",
      // filter: 'agTextColumnFilter',
      editable: true,
    },

    {
      headerName: "Remarks",
      field: "Remarks",
      // filter: 'agTextColumnFilter',
      editable: true,
    },

  ]


const handleConfirm = () => {
  const selectedData = selectedRows.map(row => ({
    EmployeeID: row.EmployeeId,
    AssetID: row.AssetID,
  }));

  onSelectAssets(selectedData);   // changed
  handleClose();
  clearInputs();
  setRowData([]);
};
   

   

  const gridOptions = {
    pagination: true,
    paginationPageSize: 10,
  };

  const handleRowSelected = (event) => {
    setSelectedRows(event.api.getSelectedRows());
  };

  const clearInputs = () => {
    setEmployeeId("");
    setAssetID("");
    setConditionAtIssue("");
    setRemarks("");
  };
  const handleReload = () => {
    clearInputs([])
    setRowData([])
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
                  <h1 className="custom-modal-title">Employee Asset Popup</h1>

                  <div className="action-wrapper">
                    <div className="action-icon delete" onClick={handleClose}>
                      <span className="tooltip">Close</span>
                      <i className="fa-solid fa-xmark"></i>
                    </div>
                  </div>
                </div>
              </div>

              {/* FORM SECTION */}
              <div className="form-row shadow-lg p-3 bg-light mt-2 container-form-box">

                <div className="form-block col-md-4 col-sm-6 mb-2">
                  <div className="inputGroup">
                    <input
                      type="text"
                      placeholder=" "
                      className="exp-input-field form-control"
                      title="Please Enter the Employee ID"
                      value={EmployeeId}
                      maxLength={100}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      // onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      autoComplete="off"
                    />
                    <label className="exp-form-labels">Employee ID</label>
                  </div>
                </div>

                <div className="form-block col-md-4 col-sm-6 mb-2">
                  <div className="inputGroup">
                    <input
                      type="text"
                      placeholder=" "
                      className="exp-input-field form-control"
                      title="Please Enter the Asset ID"
                      value={AssetID}
                      maxLength={250}
                      onChange={(e) => setAssetID(e.target.value)}
                      // onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      autoComplete="off"
                    />
                    <label className="exp-form-labels">Asset ID</label>
                  </div>
                </div>

                <div className="form-block col-md-4 col-sm-6 mb-2">
                  <div className="inputGroup">
                    <input
                      type="text"
                      placeholder=" "
                      className="exp-input-field form-control"
                      title="Please Enter the Condition at Issue"
                      value={ConditionAtIssue}
                      maxLength={100}
                      onChange={(e) => setConditionAtIssue(e.target.value)}
                      // onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      autoComplete="off"
                    />
                    <label className="exp-form-labels">Condition at Issue</label>
                  </div>
                </div>

                <div className="form-block col-md-4 col-sm-6 mb-2">
                  <div className="inputGroup">
                    <input
                      type="text"
                      placeholder=" "
                      className="exp-input-field form-control"
                      title="Please Enter the Remarks"
                      value={Remarks}
                      maxLength={100}
                      onChange={(e) => setRemarks(e.target.value)}
                      // onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      autoComplete="off"
                    />
                    <label className="exp-form-labels">Remarks</label>
                  </div>
                </div>


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

  )
}
