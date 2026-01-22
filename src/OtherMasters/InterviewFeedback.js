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

function InterviewFeedback({ }) {
  const [rowData, setRowData] = useState([]);
  const [submitted_on, setsubmitted_on] = useState(FirstDate);
  const [error, setError] = useState("");
  const [rating, setrating] = useState("");
  const [comments, setcomments] = useState("");
  const [commentsSC, setcommentsSC] = useState("");
  const [hasValueChanged, setHasValueChanged] = useState(false);
  const [selectedscheduleid, setselectedscheduleid] = useState("");
  const [scheduleid, setscheduleid] = useState("");
  const [selectedscheduleidSC, setselectedscheduleidSC] = useState("");
  const [scheduleidSC, setscheduleidSC] = useState("");
  const [isselectedscheduleidSC, setIsscheduleidSC] = useState("");
  const [isselectedscheduleid, setIsscheduleid] = useState("");
  const [isselectedfeedback_id, setIsfeedback_id] = useState("");
  const [scheduleidDrop, setscheduleidDrop] = useState([]);
  const [feedback_idDrop, setfeedback_idDrop] = useState([]);

  const [activeTab, setActiveTab] = useState("Interview Feedback")
  const [loading, setLoading] = useState(false);
  const [statusdrop, setStatusdrop] = useState([]);
  const [showAsterisk, setShowAsterisk] = useState(true);
  const [selectedfeedback_id, setselectedfeedback_id] = useState("");
  const [feedback_id, setfeedback_id] = useState("");
   const [selectedEmployeeID, setselectedEmployeeID] = useState("");
    const [EmployeeID, setEmployeeID] = useState("");
    const [selectedEmployeeIDSC, setselectedEmployeeIDSC] = useState("");
    const [EmployeeIDSC, setEmployeeIDSC] = useState("");
    const [EmployeeIDdrop, setEmployeeIDdrop] = useState([]);
    const [isSelectEmployeeID, setisSelectEmployeeID] = useState(false);
    const [isSelectEmployeeIDSC, setisSelectEmployeeIDSC] = useState(false);

  const navigate = useNavigate();

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };


   const handlefeedback_id = (selectedDPT) => {
    setselectedfeedback_id(selectedDPT);
    setfeedback_id(selectedDPT ? selectedDPT.value : '');
  };
   const filteredOptionfeedback_id = feedback_idDrop.map(option => ({
    value: option.feedback_id,
    label: option.feedback_id,
  }));

      const handleEmployeeID = (selectedDPT) => {
    setselectedEmployeeID(selectedDPT);
    setEmployeeID(selectedDPT ? selectedDPT.value : '');
  };
     const handleEmployeeIDSC = (selectedDPT) => {
    setselectedEmployeeIDSC(selectedDPT);
    setEmployeeIDSC(selectedDPT ? selectedDPT.value : '');
  };

   const filteredOptionEmployeeID = EmployeeIDdrop.map(option => ({
    value: option.EmployeeId,
    label: `${option.EmployeeId} - ${option.First_Name}`
  }));



  const handleschedule_id = (selectedDPT) => {
    setselectedscheduleid(selectedDPT);
    setscheduleid(selectedDPT ? selectedDPT.value : '');
  };
  const handleschedule_idSC = (selectedDPT) => {
    setselectedscheduleidSC(selectedDPT);
    setscheduleidSC(selectedDPT ? selectedDPT.value : '');
  };


  const filteredOptionschedule_id = scheduleidDrop.map(option => ({
    value: option.schedule_id,
    label: option.schedule_id,
  }));

   useEffect(() => {
        const company_code = sessionStorage.getItem('selectedCompanyCode');
    
        const fetchDept = async () => {
          try {
            const response = await fetch(`${config.apiBaseUrl}/Employee_ID`, {
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
            setEmployeeIDdrop(val);
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
        const response = await fetch(`${config.apiBaseUrl}/ScheduleID`, {
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
        setscheduleidDrop(val);
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
        const response = await fetch(`${config.apiBaseUrl}/Feedback_ID`, {
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
        setfeedback_idDrop(val);
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
      headerName: "Schedule ID",
      field: "schedule_id",
      editable: true
    },
    {
      headerName: "Employee ID",
      field: "employee_id",
      editable: false
    },
    {
      headerName: "Rating",
      field: "rating",
      editable: true
    },
    {
      headerName: "Comments",
      field: "comments",
      editable: true
    },
    {
      headerName: "Submitted On",
      field: "submitted_on",
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
    if (!scheduleid || !EmployeeID || !rating || !submitted_on) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }

    try {
      const Header = {
        employee_id: EmployeeID,
        schedule_id: scheduleid,
        rating: rating,
        comments: comments,
        submitted_on: submitted_on,
        company_code: sessionStorage.getItem('selectedCompanyCode'),
        created_by: sessionStorage.getItem('selectedUserCode')
      };

      const response = await fetch(`${config.apiBaseUrl}/interview_feedbackInsert`, {
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
            onClose: () => window.location.reload(),
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
        schedule_id: scheduleidSC,
        feedback_id: feedback_id,
        employee_id: EmployeeIDSC,
        rating: Number.rating,
        comments: commentsSC,
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      };

      const response = await fetch(`${config.apiBaseUrl}/InterviewFeedbackSC`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const fetchedData = await response.json();
        const newRows = fetchedData.map((matchedItem) => ({
          schedule_id: matchedItem.schedule_id,
          employee_id: matchedItem.employee_id,
          rating: matchedItem.rating,
          comments: matchedItem.comments,
          submitted_on: matchedItem.submitted_on,
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

          const dataToSend = { interview_feedbackData: Array.isArray(rowData) ? rowData : [rowData] };

          const response = await fetch(`${config.apiBaseUrl}/interview_feedbackLoopUpdate`, {
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

          const dataToSend = { interview_feedbackData: Array.isArray(rowData) ? rowData : [rowData] };

          const response = await fetch(`${config.apiBaseUrl}/interview_feedbackLoopDelete`, {
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
          <h1 className="page-title">Interview Feedback</h1>
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
              ${selectedscheduleid ? "has-value" : ""} 
              ${isselectedscheduleid ? "is-focused" : ""}`}
            >
              <Select
                id="department"
                placeholder=" "
                onFocus={() => setIsscheduleid(true)}
                onBlur={() => setIsscheduleid(false)}
                classNamePrefix="react-select"
                isClearable
                type="text"
                value={selectedscheduleid}
                onChange={handleschedule_id}
                options={filteredOptionschedule_id}
              />
              <label htmlFor="selecteddpt" className={`floating-label ${error && !selectedscheduleid ? 'text-danger' : ''}`}>
                Schedule ID{showAsterisk && <span className="text-danger">*</span>}
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedEmployeeID ? "has-value" : ""} 
              ${isSelectEmployeeID ? "is-focused" : ""}`}
            >
              <Select
                id="department"
                placeholder=" "
                onFocus={() => setisSelectEmployeeID(true)}
                onBlur={() => setisSelectEmployeeID(false)}
                classNamePrefix="react-select"
                isClearable
                type="text"
                value={selectedEmployeeID}
                onChange={handleEmployeeID}
                options={filteredOptionEmployeeID}
              />
              <label htmlFor="selecteddpt" className={`floating-label ${error && !selectedEmployeeID ? 'text-danger' : ''}`}>
                Employee ID{showAsterisk && <span className="text-danger">*</span>}
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
                value={rating}
                onChange={(e) => setrating((e.target.value))}
              />
              <label for="add1" className={`exp-form-labels ${error && !rating ? 'text-danger' : ''}`}>Rating<span className="text-danger">*</span></label>
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
                value={comments}
                onChange={(e) => setcomments((e.target.value))}
              />
              <label for="add1" className={`exp-form-labels ${error && !comments ? 'text-danger' : ''}`}>comments<span className="text-danger">*</span></label>
            </div>
          </div>
          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="date"
                placeholder=""
                title="Please Enter the Employee PF"
                required
                autoComplete="off"
                value={submitted_on}
                onChange={(e) => setsubmitted_on((e.target.value))}
              />
              <label for="add1" className={`exp-form-labels ${error && !submitted_on ? 'text-danger' : ''}`}>Submitted On<span className="text-danger">*</span></label>
            </div>
          </div>
          {/* <div className="col-md-2">
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
                <label for="status" class="floating-label">Status</label>
              </div>
            </div> */}
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
              ${selectedfeedback_id ? "has-value" : ""} 
              ${isselectedfeedback_id ? "is-focused" : ""}`}
            >
              <Select
                id="department"
                placeholder=" "
                onFocus={() => setIsfeedback_id(true)}
                onBlur={() => setIsfeedback_id(false)}
                classNamePrefix="react-select"
                isClearable
                type="text"
                value={selectedfeedback_id}
                onChange={handlefeedback_id}
                options={filteredOptionfeedback_id}
              />
              <label htmlFor="selecteddpt" className={`floating-label`}>
                Feedback ID
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedscheduleidSC ? "has-value" : ""} 
              ${isselectedscheduleidSC ? "is-focused" : ""}`}
            >
              <Select
                id="department"
                placeholder=" "
                onFocus={() => setIsscheduleidSC(true)}
                onBlur={() => setIsscheduleidSC(false)}
                classNamePrefix="react-select"
                isClearable
                type="text"
                value={selectedscheduleidSC}
                onChange={handleschedule_idSC}
                options={filteredOptionschedule_id}
              />
              <label htmlFor="selecteddpt" className={`floating-label`}>
                Schedule ID
              </label>
            </div>
          </div>

         <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedEmployeeIDSC ? "has-value" : ""} 
              ${isSelectEmployeeIDSC ? "is-focused" : ""}`}
            >
              <Select
                id="department"
                placeholder=" "
                onFocus={() => setisSelectEmployeeIDSC(true)}
                onBlur={() => setisSelectEmployeeIDSC(false)}
                classNamePrefix="react-select"
                isClearable
                type="text"
                value={selectedEmployeeIDSC}
                onChange={handleEmployeeIDSC}
                options={filteredOptionEmployeeID}
              />
              <label htmlFor="selecteddpt" className={`floating-label`}>
                Employee ID
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
                value={commentsSC}
                onChange={(e) => setcommentsSC((e.target.value))}
              />
              <label for="sname" className="exp-form-labels">Comments</label>
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
export default InterviewFeedback;
