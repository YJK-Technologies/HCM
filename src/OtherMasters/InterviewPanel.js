import React, { useState, useEffect } from "react";
import "../input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { AgGridReact } from "ag-grid-react";
import { useNavigate } from "react-router-dom";
import TabButtons from '../ESSComponents/Tabs';
import { showConfirmationToast } from '../ToastConfirmation';
import LoadingScreen from '../Loading';
import Select from "react-select";

const config = require('../Apiconfig');

const getFinancialYearDates = () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // getMonth() is 0-based
  console.log(currentMonth)
  let startYear, endYear;

  if (currentMonth < 4) {
    startYear = currentYear - 1;
    endYear = currentYear;
  } else {

    startYear = currentYear;
    endYear = currentYear + 1;
  }

  const FirstDate = `${startYear}-04-01`;
  const LastDate = `${endYear}-03-31`;

  return { FirstDate, LastDate };
};
const { FirstDate, LastDate } = getFinancialYearDates();

function InterviewPanel({ }) {
  const [rowData, setRowData] = useState([]);
  const [startYear, setStartYear] = useState(FirstDate);
  const [endYear, setEndYear] = useState(LastDate);
  const [error, setError] = useState("");
  const [panel_name, setpanel_name] = useState("");
  const [panel_nameSC, setpanel_nameSC] = useState("");

  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedStatusSC, setSelectedStatusSC] = useState(null);
  const [status, setstatus] = useState("");
  const [statusSC, setstatusSC] = useState("");
  const [hasValueChanged, setHasValueChanged] = useState(false);
  const [isSelectFocused, setIsSelectFocused] = useState(false);
  const [isSelectFocusedSC, setIsSelectFocusedSC] = useState(false);

  const [isSelectDepartment, setIsSelectDepartment] = useState(false);
  const [isSelectjobID, setisSelectjobID] = useState(false);
  const [isSelectjobIDSC, setisSelectjobIDSC] = useState(false);
  const [isSelectDepartmentSC, setIsSelectDepartmentSC] = useState(false);
  const [selecteddpt, setselecteddept] = useState("");
  const [DPTdrop, setDPTdrop] = useState([]);
  const [Jobdrop, setJobdrop] = useState([]);
  const [dpt, setdpt] = useState("");
  const [selectedJobID, setselectedJobID] = useState("");
  const [JobID, setJobID] = useState("");
  const [selectedJobIDSC, setselectedJobIDSC] = useState("");
  const [JobIDSC, setJobIDSC] = useState("");
  const [selecteddptSC, setselecteddeptSC] = useState("");
  const [dptSC, setdptSC] = useState("");
  const [activeTab, setActiveTab] = useState("Interview Panel")
  const [loading, setLoading] = useState(false);
  const [statusdrop, setStatusdrop] = useState([]);
  const [statusgriddrop, setStatusGriddrop] = useState([]);
  const [Dptdrop, setDptdrop] = useState([]);
  const [jobDrop, setJobDrop] = useState([]);

  const navigate = useNavigate();

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };


  const handleDPT = (selectedDPT) => {
    setselecteddept(selectedDPT);
    setdpt(selectedDPT ? selectedDPT.value : '');
  };
  const handleJobID = (selectedDPT) => {
    setselectedJobID(selectedDPT);
    setJobID(selectedDPT ? selectedDPT.value : '');
  };
  const handleJobIDSC = (selectedDPT) => {
    setselectedJobIDSC(selectedDPT);
    setJobIDSC(selectedDPT ? selectedDPT.value : '');
  };
  const handleDPTSC = (selectedDPT) => {
    setselecteddeptSC(selectedDPT);
    setdptSC(selectedDPT ? selectedDPT.value : '');
  };

  const filteredOptionDPt = DPTdrop.map(option => ({
    value: option.dept_id,
    label: `${option.dept_id} - ${option.dept_name}`
  }));
  const filteredOptionJobID = Jobdrop.map(option => ({
    value: option.job_id,
    label: `${option.job_id} - ${option.job_title}`
  }));
  const filteredOptionDPtSC = DPTdrop.map(option => ({
    value: option.dept_id,
    label: `${option.dept_id} - ${option.dept_name}`
  }));


  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    fetch(`${config.apiBaseUrl}/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((response) => response.json())
      .then((data) => {
        const statusOption = data.map(option => option.attributedetails_name);
        setStatusGriddrop(statusOption);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    fetch(`${config.apiBaseUrl}/JobMaster`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((response) => response.json())
      .then((data) => {
        const job = data.map((option) => ({
          value: option.job_id,
          label: `${option.job_id}-${option.job_title}`,
        }));
        setJobDrop(job);
      })
      .catch((error) => console.error('Error fetching data:', error));
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
        // Merge dept_id and dept_name
        const deptOptions = data.map((option) => ({
          value: option.dept_id,
          label: `${option.dept_id} - ${option.dept_name}`,
        }));

        setDptdrop(deptOptions);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);



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
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    const fetchDept = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/JobMaster`, {
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
        setJobdrop(val);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    if (company_code) {
      fetchDept();
    }
  }, []);


  const handleChangeStatus = (selectedStatus) => {
    setSelectedStatus(selectedStatus);
    setstatus(selectedStatus ? selectedStatus.value : "");
  };
  const handleChangeStatusSC = (selectedStatus) => {
    setSelectedStatusSC(selectedStatus);
    setstatusSC(selectedStatus ? selectedStatus.value : "");
  };


  const filteredOptionStatus = statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));


  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    fetch(`${config.apiBaseUrl}/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setStatusdrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleKeyDownStatus = async (e) => {
    if (e.key === "Enter" && hasValueChanged) {
      await handleSearch();
      setHasValueChanged(false);
    }
  };

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
      headerName: "Panel Name",
      field: "panel_name",
      editable: true
    },
    {
      headerName: "Job ID",
      field: "job_id",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: jobDrop.map(d => d.value),
      },
      valueFormatter: (params) => {
        const dept = jobDrop.find(d => d.value === params.value);
        return dept ? dept.label : params.value;
      },
    },
    {
      headerName: "Department ID",
      field: "department_id",
      width: 250,
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: Dptdrop.map(d => d.value),
      },
      valueFormatter: (params) => {
        const dept = Dptdrop.find(d => d.value === params.value);
        return dept ? dept.label : params.value;
      },
    },
    {
      headerName: "Status",
      cellEditor: "agSelectCellEditor",
      field: "Status",
      cellEditorParams: {
        values: statusgriddrop,
      },
      editable: true
    },
    {
      headerName: "Keyfield",
      field: "keyfield",
      editable: false,
      hide: true
      // hide: true
    },
  ]

  const gridOptions = {
    pagination: true,
    paginationPageSize: 10,
  };

  const handleSave = async () => {
    if (!panel_name || !JobID || !dpt || !endYear) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }

    try {
      const Header = {
        job_id: JobID,
        panel_name: panel_name,
        department_id: dpt,
        Status: status,
        company_code: sessionStorage.getItem('selectedCompanyCode'),
        created_by: sessionStorage.getItem('selectedUserCode')
      };

      const response = await fetch(`${config.apiBaseUrl}/interview_panelInsert`, {
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
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const body = {
        panel_name: panel_nameSC,
        job_id: JobIDSC,
        department_id: dptSC,
        Status: statusSC,
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      };

      const response = await fetch(`${config.apiBaseUrl}/InterviewPanel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const fetchedData = await response.json();
        const newRows = fetchedData.map((matchedItem) => ({
          panel_name: matchedItem.panel_name,
          job_id: matchedItem.job_id,
          department_id: matchedItem.department_id,
          Status: matchedItem.Status,
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
    } finally {
      setLoading(false);
    }
  };

  const reloadGridData = () => {
    setRowData([])
  };

  const handleUpdate = async (rowData) => {
    setLoading(true);
    showConfirmationToast(
      "Are you sure you want to update the data in the selected rows?",
      async () => {
        try {
          const company_code = sessionStorage.getItem('selectedCompanyCode');
          const modified_by = sessionStorage.getItem('selectedUserCode');

          const dataToSend = { interview_panelData: Array.isArray(rowData) ? rowData : [rowData] };

          const response = await fetch(`${config.apiBaseUrl}/interview_panelLoopUpdate`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "company_code": company_code,
              "modified-by": modified_by
            },
            body: JSON.stringify(dataToSend)
          });

          if (response.ok) {
            toast.success("Data updated successfully", {
              onClose: () => handleSearch(), // Runs handleSearch when toast closes
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
        toast.info("Data updated cancelled.");
      }
    );
  };

  const handleDelete = async (rowData) => {
    setLoading(true);
    showConfirmationToast(
      "Are you sure you want to Delete the data in the selected rows?",
      async () => {
        try {
          const company_code = sessionStorage.getItem('selectedCompanyCode');

          const dataToSend = { interview_panelData: Array.isArray(rowData) ? rowData : [rowData] };

          const response = await fetch(`${config.apiBaseUrl}/interview_panelLoopDelete`, {
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
          <h1 className="page-title">Interview Panel</h1>
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
                title="Please Enter the Company Contribution"
                required
                autoComplete="off"
                value={panel_name}
                onChange={(e) => setpanel_name((e.target.value))}
              />
              <label for="sname" className={`exp-form-labels ${error && !panel_name ? 'text-danger' : ''}`}>Panel Name<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedJobID ? "has-value" : ""} 
              ${isSelectjobID ? "is-focused" : ""}`}
            >
              <Select
                id="department"
                placeholder=" "
                onFocus={() => setisSelectjobID(true)}
                onBlur={() => setisSelectjobID(false)}
                classNamePrefix="react-select"
                isClearable
                type="text"
                value={selectedJobID}
                onChange={handleJobID}
                options={filteredOptionJobID}
              />
              <label htmlFor="selecteddpt" className={`floating-label ${error && !dpt ? 'text-danger' : ''}`}>
                Job ID{<span className="text-danger">*</span>}
              </label>
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
                Department ID{<span className="text-danger">*</span>}
              </label>
            </div>
          </div>
          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedStatus ? "has-value" : ""} 
              ${isSelectFocused ? "is-focused" : ""}`}
            >
              <Select
                id="status"
                isClearable
                value={selectedStatus}
                onChange={handleChangeStatus}
                options={filteredOptionStatus}
                placeholder=""
                classNamePrefix="react-select"
                onFocus={() => setIsSelectFocused(true)}
                onBlur={() => setIsSelectFocused(false)}
              />
              <label for="status" class={`floating-label ${error && !selectedStatus ? 'text-danger' : ''}`}>Status{<span className="text-danger">*</span>}

              </label>
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
                id="add3"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Choose the Start Year"
                autoComplete="off"
                value={panel_nameSC}
                onChange={(e) => setpanel_nameSC(e.target.value)}
              />
              <label For="city" className="exp-form-labels">Panel Name</label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedJobIDSC ? "has-value" : ""} 
              ${isSelectjobIDSC ? "is-focused" : ""}`}
            >
              <Select
                id="department"
                placeholder=" "
                onFocus={() => setisSelectjobIDSC(true)}
                onBlur={() => setisSelectjobIDSC(false)}
                classNamePrefix="react-select"
                isClearable
                type="text"
                value={selectedJobIDSC}
                onChange={handleJobIDSC}
                options={filteredOptionJobID}
              />
              <label htmlFor="selecteddpt" className={`floating-label`}>
                Job ID
              </label>
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
            <div
              className={`inputGroup selectGroup 
              ${selectedStatusSC ? "has-value" : ""} 
              ${isSelectFocusedSC ? "is-focused" : ""}`}
            >
              <Select
                id="status"
                isClearable
                value={selectedStatusSC}
                onChange={handleChangeStatusSC}
                options={filteredOptionStatus}
                placeholder=""
                classNamePrefix="react-select"
                onFocus={() => setIsSelectFocusedSC(true)}
                onBlur={() => setIsSelectFocusedSC(false)}
              />
              <label for="status" class="floating-label">Status</label>
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
export default InterviewPanel;
