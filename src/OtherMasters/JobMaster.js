import React, { useState, useEffect } from "react";
import "../input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import TabButtons from '../ESSComponents/Tabs';
import { AgGridReact } from "ag-grid-react";
import { showConfirmationToast } from '../ToastConfirmation';
import LoadingScreen from '../Loading';
import Select from 'react-select';

const config = require('../Apiconfig');

function JobMaster({ }) {

  const [rowData, setRowData] = useState([]);

  const [job_titleSC, setjob_titleSC] = useState("");
  const [job_title, setjob_title] = useState("");
  const [Country_Code, setCountry_Code] = useState("");
  const [location, setlocation] = useState("");
  const [employment_type, setemployment_type] = useState("");
  const [updated_on, setupdated_on] = useState("");
  const [Country_CodeSC, setCountry_CodeSC] = useState("");
  const [locationSC, setlocationSC] = useState("");
  const [employment_typeSC, setemployment_typeSC] = useState("");
  const [updated_onSC, setupdated_onSC] = useState("");
  const [department_idSC, setdepartment_idSC] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("Job Master")
  const [loading, setLoading] = useState(false);
  const [isSelectDepartment, setIsSelectDepartment] = useState(false);
  const [isSelectDepartmentSC, setIsSelectDepartmentSC] = useState(false);
  const [departmentList, setDepartmentList] = useState([]);
  const [departmentGridDrop, setDepartmentGridDrop] = useState([]);
  const [selecteddpt, setselecteddept] = useState("");
  const [DPTdrop, setDPTdrop] = useState([]);
  const [departmentDrop, setDepartmentDrop] = useState([]);
  const [dpt, setdpt] = useState("");
  const [showAsterisk, setShowAsterisk] = useState(true);
  const [selecteddptSC, setselecteddeptSC] = useState("");
  const [dptSC, setdptSC] = useState("");
  const navigate = useNavigate();


  const handleDPT = (selectedDPT) => {
    setselecteddept(selectedDPT);
    setdpt(selectedDPT ? selectedDPT.value : '');
  };
  const handleDPTSC = (selectedDPT) => {
    setselecteddeptSC(selectedDPT);
    setdptSC(selectedDPT ? selectedDPT.value : '');
  };

  const filteredOptionDPt = DPTdrop.map(option => ({
    value: option.dept_id,
    label: `${option.dept_id} - ${option.dept_name}`
  }));
  const filteredOptionDPtSC = DPTdrop.map(option => ({
    value: option.dept_id,
    label: `${option.dept_id} - ${option.dept_name}`
  }));


  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    const fetchDept = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/DeptID`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ company_code }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const val = await response.json();
        setDPTdrop(val);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    if (company_code) {
      fetchDept();
    }
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    fetch(`${config.apiBaseUrl}/DeptID`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((response) => response.json())
      .then((data) => {
        const deptOptions = data.map((option) => ({
          value: option.dept_id,
          label: `${option.dept_id} - ${option.dept_name}`,
        }));
        setDepartmentDrop(deptOptions);
      })
      // .then((val) => setDPTdrop(val))
      .catch((error) =>
        console.error("Error fetching department data:", error)
      );
  }, []);


  const columnDefs = [
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params) => {
        const cellWidth = params.column.getActualWidth();
        const isWideEnough = cellWidth > 20;
        const showIcons = isWideEnough;

        return (
          <div className="position-relative d-flex align-items-center" style={{ minHeight: '100%', justifyContent: 'center' }}>
            {showIcons && (
              <>
                <span
                  className="icon mx-2"
                  onClick={() => handleUpdate(params.data, params.node.data)}
                  style={{ cursor: 'pointer' }}
                >
                  <i className="fa-regular fa-floppy-disk"></i>
                </span>

                <span
                  className="icon mx-2"
                  onClick={() => handleDelete(params.data)}
                  style={{ cursor: 'pointer' }}
                >
                  <i className="fa-solid fa-trash"></i>
                </span>
              </>
            )}
          </div>
        );
      },
    },

    {
      headerName: "Job ID",
      field: "job_id",
      editable: true
    },
    {
      headerName: "Job Title",
      field: "job_title",
      editable: true
    },
    {
      headerName: "Department",
      field: "department_id",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: departmentDrop.map(d => d.value),
      },
      valueFormatter: (params) => {
        const dept = departmentDrop.find(d => d.value === params.value);
        return dept ? dept.label : params.value;
      },
    },
    {
      headerName: "Country Code",
      field: "Country_Code",
      editable: true
    }, {
      headerName: "Location",
      field: "location",
      editable: true
    }, {
      headerName: "Employment Type",
      field: "employment_type",
      editable: true
    }, {
      headerName: "Updated On",
      field: "updated_on",
      editable: true
    },
    {
      headerName: "Keyfield",
      field: "keyfield",
      editable: true,
      hide: true
    }

  ]

  const gridOptions = {
    pagination: true,
    paginationPageSize: 10,
  };

  const handleSave = async () => {
    if (!dpt ||
      !job_title ||
      !Country_Code ||
      !location ||
      !employment_type ||
      !updated_on
    ) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }
    setLoading(true);
    try {
      const Header = {
        department_id: dpt,
        job_title: job_title,
        Country_Code: Country_Code,
        location: location,
        employment_type: employment_type,
        updated_on: updated_on,
        company_code: sessionStorage.getItem('selectedCompanyCode'),
        created_by: sessionStorage.getItem('selectedUserCode')
      };
      const response = await fetch(`${config.apiBaseUrl}/job_masterInsert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Header),
      });
      if (response.ok) {
        console.log("Data inserted successfully");
        toast.success("Data inserted successfully!", {
          onClose: () => window.location.reload(),
        });
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to insert sales data");
        console.error(errorResponse.details || errorResponse.message);
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error('Error inserting data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const body = {
        job_title: job_titleSC,
        department_id: dptSC,
        Country_Code: Country_CodeSC,
        location: locationSC,
        employment_type: employment_typeSC,
        updated_on: updated_onSC || null,
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      };

      const response = await fetch(`${config.apiBaseUrl}/JobmasterSearch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const fetchedData = await response.json();
        const newRows = fetchedData.map((matchedItem) => ({
          job_title: matchedItem.job_title,
          job_id: matchedItem.job_id,
          department_id: matchedItem.department_id,
          dept_name: matchedItem.dept_name,
          Country_Code: matchedItem.Country_Code,
          employment_type: matchedItem.employment_type,
          location: matchedItem.location,
          updated_on: matchedItem.updated_on,
          keyfield: matchedItem.keyfield,
        }));
        setRowData(newRows);
      } else if (response.status === 404) {
        console.log("Data Not found");
        toast.warning("Data Not found");
        setRowData([]);
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to insert sales data");
        console.error(errorResponse.details || errorResponse.message);
        setRowData([]);
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
      toast.error("Error fetching search data:", error);
      setRowData([]);
    } finally {
      setLoading(false);
    }
  };

  const reloadGridData = () => {
    setRowData([]);
  };

  const handleUpdate = async (rowData) => {
    setLoading(true);

    showConfirmationToast(
      "Are you sure you want to update the data in the selected rows?",
      async () => {
        try {
          const company_code = sessionStorage.getItem("selectedCompanyCode");
          const modified_by = sessionStorage.getItem("selectedUserCode");

          const payload = {
            job_masterData: (Array.isArray(rowData) ? rowData : [rowData]).map(r => ({
              ...r,
              company_code,
              modified_by
            }))
          };

          const response = await fetch(`${config.apiBaseUrl}/job_masterLoopUpdate`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
          });

          const result = await response.json();

          if (response.ok) {
            toast.success("Data updated successfully");


            setRowData(prev =>
              prev.map(row => {
                const updated = result.data.find(u => u.job_id === row.job_id);
                return updated ? { ...row, keyfield: updated.keyfield } : row;
              })
            );

            handleSearch();
          } else {
            toast.warning(result.message || "Update failed");
          }

        } catch (error) {
          console.error("Update error:", error);
          toast.error("Update failed: " + error.message);
        } finally {
          setLoading(false);
        }
      },
      () => toast.info("Update cancelled")
    );
  };


  const handleDelete = async (rowData) => {
    setLoading(true);
    showConfirmationToast(
      "Are you sure you want to Delete the data in the selected rows?",
      async () => {
        try {
          const company_code = sessionStorage.getItem('selectedCompanyCode');

          const dataToSend = { job_masterData: Array.isArray(rowData) ? rowData : [rowData] };

          const response = await fetch(`${config.apiBaseUrl}/job_masterLoopDelete`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "company_code": company_code
            },
            body: JSON.stringify(dataToSend)
          });

          if (response.ok) {
            toast.success("Data deleted successfully", {
              onClose: () => handleSearch(),
            });
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
      },
      () => {
        toast.info("Data Delete cancelled.");
      }
    );
  };

  const tabs = [
    { label: 'Candiate Master' },
    { label: 'Job Master' },
    { label: 'Interview Panel' },
    { label: 'Interview Panel Members' },
    { label: 'Interview schedule' },
    { label: 'Interview Feedback' },
    { label: 'Interview Decision' }
  ];


  const handleTabClick = (tabLabel) => {
    setActiveTab(tabLabel);
    switch (tabLabel) {
      case 'Candiate Master':
        CandidateMaster();
        break;

      case 'Job Master':
        JobMaster();
        break;
      case 'Interview Panel':
        InterviewPanel();
        break;
      case 'Interview Panel Members':
        InterviewPanelMembers();
        break;

      case 'Interview schedule':
        InterviewSchedule();
        break;
      case 'Interview Feedback':
        InterviewFeedback();
        break;
      case 'Interview Decision':
        InterviewDecision();
        break;
      default:
        break;
    }
  };

  const CandidateMaster = () => {
    navigate("/CandidateMaster");
  };


  const JobMaster = () => {
    navigate("/JobMaster");
  };

  const InterviewPanel = () => {
    navigate("/InterviewPanel");
  };

  const InterviewPanelMembers = () => {
    navigate("/InterviewPanelMem");
  };

  const InterviewSchedule = () => {
    navigate("/InterviewSchedule");
  };

  const InterviewFeedback = () => {
    navigate("/InterviewFeedback");
  };

  const InterviewDecision = () => {
    navigate("/InterviewDecision");
  };


  return (
    <div class="container-fluid Topnav-screen ">
      {loading && <LoadingScreen />}
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="shadow-lg p-1 bg-light rounded main-header-box">
        <div className="header-flex">
          <h1 className="page-title">Job Master</h1>
          <div className="action-wrapper">
            <div onClick={handleSave} className="action-icon add">
              <span className="tooltip">Save</span>
              <i class="fa-solid fa-floppy-disk"></i>
            </div>
          </div>
        </div>
      </div>
      <TabButtons tabs={tabs} activeTab={activeTab} onTabClick={handleTabClick} />
      <div className="shadow-lg p-3 bg-light rounded mt-2 container-form-box">
        <div className="row g-3">

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the Annual Bonus"
                autoComplete="off"
                value={job_title}
                onChange={(e) => setjob_title((e.target.value))}
              />
              <label for="sname" className={`exp-form-labels ${error && !job_title ? 'text-danger' : ''}`}>Job Title<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selecteddpt ? "has-value" : ""} 
              ${isSelectDepartment ? "is-focused" : ""}`}
            >
              <Select
                id="department"
                placeholder=" "
                onFocus={() => setIsSelectDepartment(true)}
                onBlur={() => setIsSelectDepartment(false)}
                classNamePrefix="react-select"
                isClearable
                type="text"
                value={selecteddpt}
                onChange={handleDPT}
                options={filteredOptionDPt}
              />
              <label htmlFor="selecteddpt" className={`floating-label ${error && !dpt ? 'text-danger' : ''}`}>
                Department ID{showAsterisk && <span className="text-danger">*</span>}
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the Annual Bonus"
                autoComplete="off"
                value={Country_Code}
                onChange={(e) => setCountry_Code((e.target.value))}
              />
              <label for="sname" className={`exp-form-labels ${error && !Country_Code ? 'text-danger' : ''}`}>Country Code<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the Annual Bonus"
                autoComplete="off"
                value={location}
                onChange={(e) => setlocation((e.target.value))}
              />
              <label for="sname" className={`exp-form-labels ${error && !location ? 'text-danger' : ''}`}>Location<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the Annual Bonus"
                autoComplete="off"
                value={employment_type}
                onChange={(e) => setemployment_type((e.target.value))}
              />
              <label for="sname" className={`exp-form-labels ${error && !employment_type ? 'text-danger' : ''}`}>Employment Type<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="date"
                placeholder=""
                required title="Please Enter the Annual Bonus"
                autoComplete="off"
                value={updated_on}
                onChange={(e) => setupdated_on((e.target.value))}
              />
              <label for="sname" className={`exp-form-labels ${error && !updated_on ? 'text-danger' : ''}`}>Updated On<span className="text-danger">*</span></label>
            </div>
          </div>



        </div>
      </div>

      <div className="shadow-lg p-3 bg-light rounded mt-2 container-form-box">
        <div className="header-flex">
          <h6 className="">Search Criteria:</h6>
        </div>
        <div className="row g-3">



          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please enter the Annual Bonus"
                autoComplete="off"
                value={job_titleSC}
                onChange={(e) => setjob_titleSC((e.target.value))}
              />
              <label for="sname" className="exp-form-labels">Job Title</label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selecteddptSC ? "has-value" : ""} 
              ${isSelectDepartmentSC ? "is-focused" : ""}`}
            >
              <Select
                id="department"
                placeholder=" "
                onFocus={() => setIsSelectDepartmentSC(true)}
                onBlur={() => setIsSelectDepartmentSC(false)}
                classNamePrefix="react-select"
                isClearable
                type="text"
                value={selecteddptSC}
                onChange={handleDPTSC}
                options={filteredOptionDPtSC}
              />
              <label htmlFor="selecteddpt" className={`floating-label`}>
                Department ID
              </label>
            </div>
          </div>


          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the Annual Bonus"
                autoComplete="off"
                value={Country_CodeSC}
                onChange={(e) => setCountry_CodeSC((e.target.value))}
              />
              <label for="sname" className={`exp-form-labels`}>Country Code</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the Annual Bonus"
                autoComplete="off"
                value={locationSC}
                onChange={(e) => setlocationSC((e.target.value))}
              />
              <label for="sname" className={`exp-form-labels`}>Location</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the Annual Bonus"
                autoComplete="off"
                value={employment_typeSC}
                onChange={(e) => setemployment_typeSC((e.target.value))}
              />
              <label for="sname" className={`exp-form-labels`}>Employment Type</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="date"
                placeholder=""
                required title="Please Enter the Annual Bonus"
                autoComplete="off"
                value={updated_onSC}
                onChange={(e) => setupdated_onSC((e.target.value))}
              />
              <label for="sname" className={`exp-form-labels`}>Updated On</label>
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
            columnDefs={columnDefs}
            rowData={rowData}
            pagination={true}
            paginationAutoPageSize={true}
            gridOptions={gridOptions}
          />
        </div>
      </div>


    </div>
  );
}
export default JobMaster;
