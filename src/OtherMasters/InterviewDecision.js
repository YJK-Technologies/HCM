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

function InterviewDecision({ }) {
  const [rowData, setRowData] = useState([]);
  const [endYear, setEndYear] = useState(LastDate);
  const [error, setError] = useState("");
  const [decided_on, setdecided_on] = useState("");
  const [decided_by, setdecided_by] = useState("");
  const [decided_bySC, setdecided_bySC] = useState("");
  const [remarks, setremarks] = useState("");
  const [remarksSC, setremarksSC] = useState("");
  const [employeePF, setEmployeePF] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedStatusSC, setSelectedStatusSC] = useState(null);
  const [status, setstatus] = useState("");
  const [statusSC, setstatusSC] = useState("");
  const [hasValueChanged, setHasValueChanged] = useState(false);
  const [isSelectFocused, setIsSelectFocused] = useState(false);
  const [isSelectFocusedSC, setIsSelectFocusedSC] = useState(false);
  const [selectedcandidate_name, setSelectedcandidatename] = useState("");
  const [canditatename, set_candidatename] = useState("");
  const [isselectedcanditateid, setIscanditateid] = useState("");
  const [canditatenameDrop, setcanditatenameDrop] = useState([]);
  const [showAsterisk, setShowAsterisk] = useState(true);
  const [selectedcandidate_nameSC, setSelectedcandidatenameSC] = useState("");
  const [canditatenameSC, set_candidatenameSC] = useState("")
  const [isselectedcanditateidSC, setIscanditateidSC] = useState("");
  const [selecteddecision_id, setselecteddecision_id] = useState("");
  const [decision_id, setdecision_id] = useState("");
  const [decision_idDrop, setdecision_idDrop] = useState([]);
  const [isselecteddecision_id, setIsisselecteddecision_id] = useState(false);
  const [selectedJobID, setselectedJobID] = useState("");
  const [JobID, setJobID] = useState("");
  const [Jobdrop, setJobdrop] = useState([]);
  const [isSelectjobID, setisSelectjobID] = useState(false);
  const [selectedJobIDSC, setselectedJobIDSC] = useState("");
  const [JobIDSC, setJobIDSC] = useState("");
  const [isSelectjobIDSC, setisSelectjobIDSC] = useState(false);



  const [activeTab, setActiveTab] = useState("Interview Decision")
  const [loading, setLoading] = useState(false);
  const [statusdrop, setStatusdrop] = useState([]);
  const [statusDrop, setStatusDrop] = useState([]);
  const [conditateDrop, setConditateDrop] = useState([]);
  const [jobDrop, setJobDrop] = useState([]);

  const navigate = useNavigate();

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handledecision_id = (selectedDPT) => {
    setselecteddecision_id(selectedDPT);
    setdecision_id(selectedDPT ? selectedDPT.value : '');
  };
  const filteredOptiondecision_id = decision_idDrop.map(option => ({
    value: option.decision_id,
    label: option.decision_id,
  }));

  const handleJobID = (selectedDPT) => {
    setselectedJobID(selectedDPT);
    setJobID(selectedDPT ? selectedDPT.value : '');
  };

  const filteredOptionJobID = Jobdrop.map(option => ({
    value: option.job_id,
    label: `${option.job_id} - ${option.job_title}`
  }));

  const handleJobIDSC = (selectedDPT) => {
    setselectedJobIDSC(selectedDPT);
    setJobIDSC(selectedDPT ? selectedDPT.value : '');
  };

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



  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    const fetchDept = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/Decision_ID`, {
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
        setdecision_idDrop(val);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    if (company_code) {
      fetchDept();
    }
  }, []);


  const handlescandidate_name = (selectedDPT) => {
    setSelectedcandidatename(selectedDPT);
    set_candidatename(selectedDPT ? selectedDPT.value : '');
  };

  const handlescandidate_nameSC = (selectedDPT) => {
    setSelectedcandidatenameSC(selectedDPT);
    set_candidatenameSC(selectedDPT ? selectedDPT.value : '');
  };


  const handleChangeStatus = (selectedStatus) => {
    setSelectedStatus(selectedStatus);
    setstatus(selectedStatus ? selectedStatus.value : "");
  };
  const handleChangeStatusSC = (selectedStatus) => {
    setSelectedStatusSC(selectedStatus);
    setstatusSC(selectedStatus ? selectedStatus.value : "");
  };

  const filteredOptioncandidate_name = canditatenameDrop.map(option => ({
    value: option.candidate_id,
    label: `${option.candidate_id} - ${option.candidate_name}`
  }));


  const filteredOptionStatus = statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    const fetchDept = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/CanditateID`, {
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
        setcanditatenameDrop(val);
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
        const jobs = data.map(option => option.job_id);
        setJobDrop(jobs);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/CanditateID`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((response) => response.json())
      .then((data) => {
        const jobs = data.map(option => option.candidate_id);
        setConditateDrop(jobs);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

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
        const status = data.map(option => option.attributedetails_name);
        setStatusDrop(status);
      })
      .catch((error) => console.error('Error fetching data:', error));
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
      headerName: "Candidate Id",
      field: "candidate_id",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: conditateDrop,
      },
    },
    {
      headerName: "Decision Id",
      field: "decision_id",
      editable: true,
    },
    {
      headerName: "Job ID",
      field: "job_id",
      editable: false,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: jobDrop,
      },
    },
    {
      headerName: "Decided by",
      field: "decided_by",
      editable: true
    },
    {
      headerName: "Decided On",
      field: "decided_on",
      editable: true,
      valueFormatter: (params) => formatDate(params.value),
      filterParams: {
        comparator: (filterLocalDateAtMidnight, cellValue) => {
          const cellDate = new Date(cellValue.split('/').join('-'));
          if (cellDate < filterLocalDateAtMidnight) {
            return -1;
          } else if (cellDate > filterLocalDateAtMidnight) {
            return 1;
          }
          return 0;
        },
      },
    },
    {
      headerName: "Remarks",
      field: "remarks",
      editable: true
    },
    {
      headerName: "Final status",
      field: "Final_Status",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: statusDrop,
      },
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
    if (!canditatename || !JobID || !decided_by || !endYear) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }

    try {
      const Header = {
        job_id: JobID,
        candidate_id: canditatename,
        decided_by: Number(decided_by),
        remarks: remarks,
        decided_on: decided_on,
        Final_Status: status,
        company_code: sessionStorage.getItem('selectedCompanyCode'),
        created_by: sessionStorage.getItem('selectedUserCode')
      };

      const response = await fetch(`${config.apiBaseUrl}/interview_decisionInsert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Header),
      });
      if (response.status === 200) {
        console.log("Data inserted successfully");
        setTimeout(() => {
          toast.success("Data inserted successfully!", {
            // onClose: () => window.location.reload(),
          });
        }, 1000);
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
        candidate_id: canditatenameSC,
        job_id: JobIDSC,
        decision_id: decision_id,
        remarks: remarksSC,
        decided_by: decided_bySC,
        status: statusSC,
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      };

      const response = await fetch(`${config.apiBaseUrl}/InterviewDecisionSC`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const fetchedData = await response.json();
        const newRows = fetchedData.map((matchedItem) => ({
          candidate_id: matchedItem.candidate_id,
          decision_id: matchedItem.decision_id,
          job_id: matchedItem.job_id,
          decided_by: matchedItem.decided_by,
          decided_on: matchedItem.decided_on,
          Final_Status: matchedItem.Final_Status,
          remarks: matchedItem.remarks,
          STATUS: matchedItem.STATUS,
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

          const dataToSend = { interview_decisionData: Array.isArray(rowData) ? rowData : [rowData] };

          const response = await fetch(`${config.apiBaseUrl}/interview_decisionLoopUpdate`, {
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

          const dataToSend = { interview_decisionData: Array.isArray(rowData) ? rowData : [rowData] };

          const response = await fetch(`${config.apiBaseUrl}/interview_decisionLoopDelete`, {
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
          <h1 className="page-title">Interview Decision</h1>
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
            <div
              className={`inputGroup selectGroup 
              ${selectedcandidate_name ? "has-value" : ""} 
              ${isselectedcanditateid ? "is-focused" : ""}`}
            >
              <Select
                id="department"
                placeholder=" "
                onFocus={() => setIscanditateid(true)}
                onBlur={() => setIscanditateid(false)}
                classNamePrefix="react-select"
                isClearable
                type="text"
                value={selectedcandidate_name}
                onChange={handlescandidate_name}
                options={filteredOptioncandidate_name}
              />
              <label htmlFor="selecteddpt" className={`floating-label ${error && !selectedcandidate_name ? 'text-danger' : ''}`}>
                Candiate ID{showAsterisk && <span className="text-danger">*</span>}
              </label>
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
              <label htmlFor="selecteddpt" className={`floating-label ${error && !selectedJobID ? 'text-danger' : ''}`}>
                Job ID{showAsterisk && <span className="text-danger">*</span>}
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
                title="Please Enter the Employee PF"
                required
                autoComplete="off"
                value={decided_by}
                onChange={(e) => setdecided_by((e.target.value))}
              />
              <label for="add1" className={`exp-form-labels ${error && !decided_by ? 'text-danger' : ''}`}>Decided By<span className="text-danger">*</span></label>
            </div>
          </div>
          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                title="Please Enter the Employee PF"
                required
                autoComplete="off"
                value={remarks}
                onChange={(e) => setremarks((e.target.value))}
              />
              <label for="add1" className={`exp-form-labels ${error && !remarks ? 'text-danger' : ''}`}>Remarks<span className="text-danger">*</span></label>
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
              <label for="status" class="floating-label">Final Status</label>
            </div>
          </div>
          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="date"
                placeholder=""
                required title="Please Enter the Company Contribution"
                autoComplete="off"
                value={decided_on}
                onChange={(e) => setdecided_on((e.target.value))}
              />
              <label for="sname" className="exp-form-labels">Decided On</label>
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
            <div
              className={`inputGroup selectGroup 
              ${selecteddecision_id ? "has-value" : ""} 
              ${isselecteddecision_id ? "is-focused" : ""}`}
            >
              <Select
                id="department"
                placeholder=" "
                onFocus={() => setIsisselecteddecision_id(true)}
                onBlur={() => setIsisselecteddecision_id(false)}
                classNamePrefix="react-select"
                isClearable
                type="text"
                value={selecteddecision_id}
                onChange={handledecision_id}
                options={filteredOptiondecision_id}
              />
              <label htmlFor="selecteddpt" className={`floating-label`}>
                Decison ID
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedcandidate_nameSC ? "has-value" : ""} 
              ${isselectedcanditateidSC ? "is-focused" : ""}`}
            >
              <Select
                id="department"
                placeholder=" "
                onFocus={() => setIscanditateidSC(true)}
                onBlur={() => setIscanditateidSC(false)}
                classNamePrefix="react-select"
                isClearable
                type="text"
                value={selectedcandidate_nameSC}
                onChange={handlescandidate_nameSC}
                options={filteredOptioncandidate_name}
              />
              <label htmlFor="selecteddpt" className={`floating-label`}>
                Candiate ID
              </label>
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
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the Company Contribution"
                autoComplete="off"
                value={decided_bySC}
                onChange={(e) => setdecided_bySC((e.target.value))}
              />
              <label for="sname" className="exp-form-labels">Decided By</label>
            </div>
          </div>
          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the Company Contribution"
                autoComplete="off"
                value={remarksSC}
                onChange={(e) => setremarksSC((e.target.value))}
              />
              <label for="sname" className="exp-form-labels">Remarks</label>
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
              <label for="status" class="floating-label">Final Status</label>
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
export default InterviewDecision;
