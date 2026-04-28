import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import "./apps.css";
import { ToastContainer, toast } from "react-toastify";
import Select from "react-select";
import LoadingScreen from "./Loading";
import { useNavigate } from "react-router-dom";
import { showConfirmationToast } from "./ToastConfirmation";
import { Title } from "chart.js";

const config = require("./Apiconfig");

function PayrollSettingsGrid() {

  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editedData, setEditedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // Filters
  const [statusdrop, setStatusdrop] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [status, setStatus] = useState("");

  const [salaryFromToDaySC, setSalaryFromToDaySC] = useState("");
  const [OTRateSC, setOTRateSC] = useState("");
  const [salaryFromDaySC, setSalaryFromDaySC] = useState("");
  const [salaryToDaySC, setSalaryToDaySC] = useState("");
  const [effectiveFromSC, setEffectiveFromSC] = useState("");
  const [effectiveToSC, setEffectiveToSC] = useState("");
  const [remarksSC, setRemarksSC] = useState("");

  const handleNavigateWithRowData = (row) => {
  navigate("/PayrollSettingsAdd", {
    state: { mode: "update", selectedRow: row }
  });
};

  // Load Status
  useEffect(() => {
    fetch(`${config.apiBaseUrl}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((res) => res.json())
      .then(setStatusdrop);
  }, []);

  const filteredStatus = statusdrop.map((opt) => ({
    value: opt.attributedetails_name,
    label: opt.attributedetails_name,
  }));

  const handleStatusChange = (selected) => {
    setSelectedStatus(selected);
    setStatus(selected ? selected.value : "");
  };

  // 🔍 SEARCH (FULL FILTER)
const handleSearch = async () => {
  setLoading(true);

  try {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    const response = await fetch(
      `${config.apiBaseUrl}/payroll_settingsSearch`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
       body: JSON.stringify({
       company_code,
       salary_from_to_day: salaryFromToDaySC,
       OT_Rate: OTRateSC,
       salary_from_day: salaryFromDaySC,
       salary_to_day: salaryToDaySC,
       effective_from: effectiveFromSC,
       effective_to: effectiveToSC,
       remarks: remarksSC,
       Status: status,
     }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      setRowData(data);
    } else if (response.status === 404) {
      toast.warning("Data not found");
      setRowData([]);
    } else {
      const err = await response.json();
      toast.error(err.message);
    }
  } catch (error) {
    toast.error("Error: " + error.message);
  } finally {
    setLoading(false);
  }
};
  // 🧠 TRACK EDITS
  const onCellValueChanged = (params) => {
    const updatedRow = params.data;

    setEditedData((prev) => {
      const index = prev.findIndex(r => r.keyfield === updatedRow.keyfield);

      if (index !== -1) {
        const updated = [...prev];
        updated[index] = updatedRow;
        return updated;
      } else {
        return [...prev, updatedRow];
      }
    });
  };

  // UPDATE
    const handleUpdate = async () => {
      const selectedEdited = editedData.filter(row =>
        selectedRows.some(sel => sel.keyfield === row.keyfield)
      );
  
      if (selectedEdited.length === 0) {
        toast.warning("Please select and edit at least one row");
        return;
      }
  
      showConfirmationToast("Update selected records?", async () => {
        setLoading(true);
    
        try {
          await fetch(`${config.apiBaseUrl}/UpdatePayrollSettings`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: selectedEdited }),
          });
      
          toast.success("Updated successfully");
          handleSearch();
      
        } catch (err) {
          toast.error(err.message);
        } finally {
          setLoading(false);
        }
      });
    };
  // 🗑 DELETE
  const handleDelete = async () => {
    if (selectedRows.length === 0) {
      toast.warning("Select at least one row");
      return;
    }

    showConfirmationToast("Delete selected records?", async () => {
      setLoading(true);

      try {
        for (const row of selectedRows) {
          await fetch(`${config.apiBaseUrl}/DeletePayrollSetting`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              company_code: sessionStorage.getItem("selectedCompanyCode"),
              keyfield: row.keyfield,
              modified_by: sessionStorage.getItem('selectedUserCode'),                
            }),
          });
        }

        toast.success("Deleted successfully");
        handleSearch();

      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    },
        () => {
          toast.info("Data Delete cancelled.");
        }
      );
  };

  // GRID
  const columnDefs = [
    { checkboxSelection: true, headerCheckboxSelection: true, width: 50 },

    { headerName: "Salary Days",
      field: "salary_from_to_day",
      editable: false,
      cellRenderer: (params) => (
        <span style={{ cursor: "pointer" }} onClick={() => handleNavigateWithRowData(params.data)} >
            {params.value}</span>)
    },
    { headerName: "OT Rate",
      field: "OT_Rate",
      editable: false,
    },
    {
      headerName: " Salary From Day",
      field: "salary_from_day",
      editable: false,
    },
    { headerName: "Salary To Day", 
      field: "salary_to_day",
      editable: false,
    },
    {
      headerName: "Financial From",
      field: "effective_from",
      editable: false,
    },
    {
      headerName: "Financial To",
      field: "effective_to",
      editable: false,
    },

    { headerName: "Remarks",
      field: "remarks", 
      editable: false, 
    },
    {
      headerName: "Status",
      field: "Status",
      editable: false,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: filteredStatus.map(s => s.value)
      },
    }
  ];

  const defaultColDef = {
  resizable: true,
  wrapText: true,
};

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  const onSelectionChanged = () => {
    const selected = gridApi.getSelectedRows();
    setSelectedRows(selected);
  };

  const handleClear = () => {
  setSalaryFromToDaySC("");
  setOTRateSC("");
  setSalaryFromDaySC("");
  setSalaryToDaySC("");
  setEffectiveFromSC("");
  setEffectiveToSC("");
  setRemarksSC("");

  setSelectedStatus(null);
  setStatus("");

  setRowData([]);        
  setEditedData([]);     
  setSelectedRows([]);   
};

return (
  <div className="container-fluid Topnav-screen">

    {loading && <LoadingScreen />}
    <ToastContainer position="top-right" className="toast-design" theme="colored" />

    {/* HEADER */}
    <div className="shadow-lg p-1 bg-body-tertiary rounded main-header-box">
      <div className="header-flex">
        <h1 className="page-title">Payroll Settings</h1>

        <div className="action-wrapper desktop-actions">
            <div className="action-icon add" onClick={() => 
              navigate("/PayrollSettingsAdd", { state: { mode: "create" } })
            }>
              <span className="tooltip">Add</span>
              <i className="fa-solid fa-user-plus"></i>
            </div>

          <div className="action-icon delete" onClick={handleDelete}>
            <span className="tooltip">Delete</span>
            <i className="fa-solid fa-user-minus"></i>
          </div>

          {/* <div className="action-icon update" onClick={handleUpdate}>
            <span className="tooltip">Update</span>
            <i className="fa-solid fa-pen-to-square"></i>
          </div> */}

        </div>

        {/* MOBILE */}
        <div className="dropdown mobile-actions">
          <button className="btn btn-primary dropdown-toggle p-1" data-bs-toggle="dropdown">
            <i className="fa-solid fa-list"></i>
          </button>

          <ul className="dropdown-menu dropdown-menu-end text-center">

            {/* <li className="dropdown-item" onClick={handleUpdate}>
              <i className="fa-solid fa-pen-to-square text-primary fs-4"></i>
            </li> */}

            <li className="dropdown-item" onClick={handleDelete}>
              <i className="fa-solid fa-user-minus text-danger fs-4"></i>
            </li>

          </ul>
        </div>

      </div>
    </div>

    {/* FILTER */}
    <div className="shadow-lg p-3 bg-light rounded mt-2 container-form-box">
      <div className="row g-3">

        {/* Salary Days */}
        <div className="col-md-2">
          <div className="inputGroup">
            <input
              type="number"
              className="exp-input-field form-control"
              title="Please Enter the Salary Days"
              placeholder=""
              value={salaryFromToDaySC}
              onChange={(e) => setSalaryFromToDaySC(e.target.value)}
            />
            <label className="exp-form-labels">Salary Days</label>
          </div>
        </div>

        {/* OT Rate */}
        <div className="col-md-2">
          <div className="inputGroup">
            <input
              type="number"
              placeholder=""
              className="exp-input-field form-control"
              title="Please Enter the OT Rate"
              value={OTRateSC}
              onChange={(e) => setOTRateSC(e.target.value)}
            />
            <label className="exp-form-labels">OT Rate</label>
          </div>
        </div>

        {/* From Day */}
        <div className="col-md-2">
          <div className="inputGroup">
            <input
              type="number"
              placeholder=""
              className="exp-input-field form-control"
              title="Please Enter the Salary From Day"
              value={salaryFromDaySC}
              onChange={(e) => setSalaryFromDaySC(e.target.value)}
            />
            <label className="exp-form-labels">Salary From Day</label>
          </div>
        </div>

        {/* To Day */}
        <div className="col-md-2">
          <div className="inputGroup">
            <input
              type="number"
              placeholder=""
              className="exp-input-field form-control"
              title="Please Enter the Salary To Day"
              value={salaryToDaySC}
              onChange={(e) => setSalaryToDaySC(e.target.value)}
            />
            <label className="exp-form-labels">Salary To Day</label>
          </div>
        </div>

        {/* Effective From */}
        <div className="col-md-2">
          <div className="inputGroup">
            <input
              type="date"
              placeholder=""
              className="exp-input-field form-control"
              title="Please Enter the Financial From Date"
              value={effectiveFromSC}
              onChange={(e) => setEffectiveFromSC(e.target.value)}
            />
            <label className="exp-form-labels">Financial From</label>
          </div>
        </div>

        {/* Effective To */}
        <div className="col-md-2">
          <div className="inputGroup">
            <input
              type="date"
              className="exp-input-field form-control"
              placeholder=""
              title="Please Enter the Financial To Date"
              value={effectiveToSC}
              onChange={(e) => setEffectiveToSC(e.target.value)}
            />
            <label className="exp-form-labels">Financial To</label>
          </div>
        </div>

        {/* Remarks */}
        <div className="col-md-2">
          <div className="inputGroup">
            <input
              type="text"
              className="exp-input-field form-control"
              placeholder=""
              title="Please Enter the Remarks"
              value={remarksSC}
              onChange={(e) => setRemarksSC(e.target.value)}
            />
            <label className="exp-form-labels">Remarks</label>
          </div>
        </div>

        {/* Status */}
        <div className="col-md-2">
          <div className={`inputGroup selectGroup ${selectedStatus ? "has-value" : ""}`} title="Please Enter the Status">
            <Select
              value={selectedStatus}
              onChange={handleStatusChange}
              options={filteredStatus}
              classNamePrefix="react-select"
              placeholder=""
              isClearable
            />
            <label className="floating-label">Status</label>
          </div>
        </div>

        {/* SEARCH + RELOAD */}
        <div className="col-12">
          <div className="search-btn-wrapper">

            <div className="icon-btn search" onClick={handleSearch}>
              <span className="tooltip">Search</span>
              <i className="fa-solid fa-magnifying-glass"></i>
            </div>

            <div className="icon-btn reload" onClick={handleClear}>
              <span className="tooltip">Reload</span>
              <i className="fa-solid fa-rotate-right"></i>
            </div>

          </div>
        </div>

      </div>
    </div>

    {/* GRID */}
    <div className="shadow-lg pt-3 pb-3 bg-light rounded mt-2 container-form-box">
      <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          onGridReady={onGridReady}
          rowSelection="multiple"
          onSelectionChanged={onSelectionChanged}
          onCellValueChanged={onCellValueChanged}
          pagination={true}
          paginationAutoPageSize={true}
        />
      </div>
    </div>

  </div>
);}

export default PayrollSettingsGrid;