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

function InterviewSchedule({ }) {
  const [rowData, setRowData] = useState([]);
  const [endYear, setEndYear] = useState(LastDate);
  const [error, setError] = useState("");
  const [scheduled_datetime, setscheduled_datetime] = useState("");
  const [location, setlocation] = useState("");
  const [locationSC, setlocationSC] = useState("");
  const [meeting_link, setmeeting_link] = useState("");
  const [timezone, settimezone] = useState("");
  const [department_idSC, setdepartment_idSC] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedStatusSC, setSelectedStatusSC] = useState(null);
  const [status, setstatus] = useState("");
  const [statusSC, setstatusSC] = useState("");
  const [isSelectFocused, setIsSelectFocused] = useState(false);
  const [isSelectFocusedSC, setIsSelectFocusedSC] = useState(false);
  const [selectedPanelID, setselectedPanelID] = useState("");
  const [PanelID, setPanelID] = useState("");
  const [isSelectPanelID, setisSelectPanelID] = useState("");
  const [PanelDrop, setPanelDrop] = useState([]);
  const [showAsterisk, setShowAsterisk] = useState(true);
  const [isSelectPanelSC, setisSelectPanelSC] = useState(false);
  const [selectedPanelIDSC, setselectedPanelIDSC] = useState("");
  const [PanelIDSC, setPanelIDSC] = useState("");
  const [selectedscheduleidSC, setselectedscheduleidSC] = useState("");
  const [scheduleidSC, setscheduleidSC] = useState("");
  const [isselectedscheduleidSC, setIsscheduleidSC] = useState("");
  const [scheduleidDrop, setscheduleidDrop] = useState([]);
  const [selectedcandidate_name, setSelectedcandidatename] = useState("");
  const [canditatename, set_candidatename] = useState("");
  const [isselectedcanditateid, setIscanditateid] = useState("");
  const [isselectedcanditateidSC, setIscanditateidSC] = useState("");
  const [canditatenameDrop, setcanditatenameDrop] = useState([]);
  const [selectedcandidate_nameSC, setSelectedcandidatenameSC] = useState("");
  const [canditatenameSC, set_candidatenameSC] = useState("");
  const [selectedInterviewMode, setselectedInterviewMode] = useState("");
  const [InterviewMode, setInterviewMode] = useState("");
  const [InterviewModedrop, setInterviewModeDrop] = useState([]);
  const [isSelectInterviewMode, setisSelectInterviewMode] = useState(false);
  const [selectedInterviewModeSC, setselectedInterviewModeSC] = useState("");
  const [InterviewModeSC, setInterviewModeSC] = useState("");
  const [isSelectInterviewModeSC, setisSelectInterviewModeSC] = useState(false);
  const [statusgriddrop, setStatusGriddrop] = useState([]);
  const [Paneldrop, setPaneldrop] = useState([]);
  const [candidatedrop, setcandidatedrop] = useState([]);
  const [interviewmodeDrop, setInterviewmodeDrop] = useState([]);



  const [activeTab, setActiveTab] = useState("Interview schedule")
  const [loading, setLoading] = useState(false);
  const [statusdrop, setStatusdrop] = useState([]);

  const navigate = useNavigate();

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };


  const handleInterviewMode = (selectedDPT) => {
    setselectedInterviewMode(selectedDPT);
    setInterviewMode(selectedDPT ? selectedDPT.value : '');
  };
  const handleInterviewModeSC = (selectedDPT) => {
    setselectedInterviewModeSC(selectedDPT);
    setInterviewModeSC(selectedDPT ? selectedDPT.value : '');
  };

  const filteredOptionInterviewMode = InterviewModedrop.map(option => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name
  }));

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    fetch(`${config.apiBaseUrl}/InterviewStatus`, {
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
    fetch(`${config.apiBaseUrl}/InterviewPanelData`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((response) => response.json())
      .then((data) => {
        const statusOption = data.map((option) => ({
          value: option.panel_id,
          label: `${option.panel_id}-${option.panel_name}`,
        }));
        setPaneldrop(statusOption);
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
        const statusOption = data.map((option) => ({
          value: option.candidate_id,
          label: `${option.candidate_id}-${option.candidate_name}`,
        }));
        setcandidatedrop(statusOption);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    const fetchDept = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/InterviewMode`, {
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
        setInterviewModeDrop(val);
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

    fetch(`${config.apiBaseUrl}/InterviewMode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((response) => response.json())
      .then((data) => {
        const interviewMode = data.map(option => option.attributedetails_name);
        setInterviewmodeDrop(interviewMode);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handlescandidate_name = (selectedDPT) => {
    setSelectedcandidatename(selectedDPT);
    set_candidatename(selectedDPT ? selectedDPT.value : '');
  };
  const handlescandidate_nameSC = (selectedDPT) => {
    setSelectedcandidatenameSC(selectedDPT);
    set_candidatenameSC(selectedDPT ? selectedDPT.value : '');
  };

  const filteredOptioncandidate_name = canditatenameDrop.map(option => ({
    value: option.candidate_id,
    label: `${option.candidate_id} - ${option.candidate_name}`
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

  const handlePanelIDSC = (selectedDPT) => {
    setselectedPanelIDSC(selectedDPT);
    setPanelIDSC(selectedDPT ? selectedDPT.value : '');
  };

  const handlePanelID = (selectedDPT) => {
    setselectedPanelID(selectedDPT);
    setPanelID(selectedDPT ? selectedDPT.value : '');
  };


  const handleChangeStatus = (selectedStatus) => {
    setSelectedStatus(selectedStatus);
    setstatus(selectedStatus ? selectedStatus.value : "");
  };
  const handleChangeStatusSC = (selectedStatus) => {
    setSelectedStatusSC(selectedStatus);
    setstatusSC(selectedStatus ? selectedStatus.value : "");
  };

  const filteredOptionPanelID = PanelDrop.map(option => ({
    value: option.panel_id,
    label: `${option.panel_id} - ${option.panel_name}`
  }));


  const filteredOptionStatus = statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    const fetchDept = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/InterviewPanelData`, {
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
        setPanelDrop(val);
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
    fetch(`${config.apiBaseUrl}/InterviewStatus`, {
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
      editable: false,
    },
    {
      headerName: "Candidate ID",
      field: "candidate_id",
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: candidatedrop.map(d => d.value),
      },
      valueFormatter: (params) => {
        const dept = candidatedrop.find(d => d.value === params.value);
        return dept ? dept.label : params.value;
      },
      editable: true
    },
    {
      headerName: "Panel ID",
      field: "panel_id",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: Paneldrop.map(d => d.value),
      },
      valueFormatter: (params) => {
        const dept = Paneldrop.find(d => d.value === params.value);
        return dept ? dept.label : params.value;
      },
    },
    {
      headerName: "Schedule Date",
      field: "scheduled_datetime",
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
      headerName: "Time Zone",
      field: "timezone",
      editable: true
    },
    {
      headerName: "Location",
      field: "location",
      editable: true
    },
    {
      headerName: "Interview Mode",
      field: "Interview_Mode",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: interviewmodeDrop
      },
    },
    {
      headerName: "Time Zone",
      field: "timezone",
      editable: true
    },
    {
      headerName: "Meeting Link",
      field: "meeting_link",
      editable: true
    },
    {
      headerName: "Status",
      field: "Status",
      editable: true,
      cellEditor: "agSelectCellEditor",
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
    if (!canditatename || !PanelID || !scheduled_datetime || !endYear) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }

    try {
      const Header = {
        panel_id: PanelID,
        candidate_id: canditatename,
        scheduled_datetime: scheduled_datetime,
        Status: status,
        Interview_Mode: InterviewMode,
        location: location,
        meeting_link: meeting_link,
        timezone: timezone,
        company_code: sessionStorage.getItem('selectedCompanyCode'),
        created_by: sessionStorage.getItem('selectedUserCode')
      };

      const response = await fetch(`${config.apiBaseUrl}/interview_scheduleInsert`, {
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
        candidate_id: canditatenameSC,
        schedule_id: scheduleidSC,
        panel_id: PanelIDSC,
        department_id: department_idSC,
        Interview_Mode: InterviewModeSC,
        Status: statusSC,
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      };

      const response = await fetch(`${config.apiBaseUrl}/InterviewSchedule`, {
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
          candidate_id: matchedItem.candidate_id,
          panel_id: matchedItem.panel_id,
          scheduled_datetime: matchedItem.scheduled_datetime,
          timezone: matchedItem.timezone,
          location: matchedItem.location,
          timezone: matchedItem.timezone,
          meeting_link: matchedItem.meeting_link,
          Status: matchedItem.Status,
          keyfield: matchedItem.keyfield,
          Interview_Mode: matchedItem.Interview_Mode,
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

          const dataToSend = { interview_scheduleData: Array.isArray(rowData) ? rowData : [rowData] };

          const response = await fetch(`${config.apiBaseUrl}/interview_scheduleLoopUpdate`, {
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

          const dataToSend = { interview_scheduleData: Array.isArray(rowData) ? rowData : [rowData] };

          const response = await fetch(`${config.apiBaseUrl}/interview_scheduleLoopDelete`, {
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
          <h1 className="page-title">Interview Schedule</h1>
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
              ${selectedPanelID ? "has-value" : ""} 
              ${isSelectPanelID ? "is-focused" : ""}`}
            >
              <Select
                id="department"
                placeholder=" "
                onFocus={() => setisSelectPanelID(true)}
                onBlur={() => setisSelectPanelID(false)}
                classNamePrefix="react-select"
                isClearable
                type="text"
                value={selectedPanelID}
                onChange={handlePanelID}
                options={filteredOptionPanelID}
              />
              <label htmlFor="selecteddpt" className={`floating-label ${error && !PanelID ? 'text-danger' : ''}`}>
                Panel ID{showAsterisk && <span className="text-danger">*</span>}
              </label>
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
                value={scheduled_datetime}
                onChange={(e) => setscheduled_datetime((e.target.value))}
              />
              <label for="add1" className={`exp-form-labels ${error && !scheduled_datetime ? 'text-danger' : ''}`}>Schedule Date<span className="text-danger">*</span></label>
            </div>
          </div>
          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="time"
                placeholder=""
                title="Please Enter the Company Contribution"
                required
                autoComplete="off"
                value={timezone}
                onChange={(e) => settimezone((e.target.value))}
              />
              <label for="sname" className={`exp-form-labels ${error && !timezone ? 'text-danger' : ''}`}>Time Zone<span className="text-danger">*</span></label>
            </div>
          </div>
          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedInterviewMode ? "has-value" : ""} 
              ${isSelectInterviewMode ? "is-focused" : ""}`}
            >
              <Select
                id="department"
                placeholder=" "
                onFocus={() => setisSelectInterviewMode(true)}
                onBlur={() => setisSelectInterviewMode(false)}
                classNamePrefix="react-select"
                isClearable
                type="text"
                value={selectedInterviewMode}
                onChange={handleInterviewMode}
                options={filteredOptionInterviewMode}
              />
              <label htmlFor="selecteddpt" className={`floating-label ${error && !selectedInterviewMode ? 'text-danger' : ''}`}>
                Interview Mode{showAsterisk && <span className="text-danger">*</span>}
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
                title="Please Enter the Company Contribution"
                required
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
                title="Please Enter the Company Contribution"
                required
                autoComplete="off"
                value={meeting_link}
                onChange={(e) => setmeeting_link((e.target.value))}
              />
              <label for="sname" className={`exp-form-labels`}>Meeting Link</label>
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
              <label for="status" class="floating-label">Status</label>
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
              ${selectedPanelIDSC ? "has-value" : ""} 
              ${isSelectPanelSC ? "is-focused" : ""}`}
            >
              <Select
                id="department"
                placeholder=" "
                onFocus={() => setisSelectPanelSC(true)}
                onBlur={() => setisSelectPanelSC(false)}
                classNamePrefix="react-select"
                isClearable
                type="text"
                value={selectedPanelIDSC}
                onChange={handlePanelIDSC}
                options={filteredOptionPanelID}
              />
              <label htmlFor="selecteddpt" className={`floating-label`}>
                Panel ID
              </label>
            </div>
          </div>
          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedInterviewModeSC ? "has-value" : ""} 
              ${isSelectInterviewModeSC ? "is-focused" : ""}`}
            >
              <Select
                id="department"
                placeholder=" "
                onFocus={() => setisSelectInterviewModeSC(true)}
                onBlur={() => setisSelectInterviewModeSC(false)}
                classNamePrefix="react-select"
                isClearable
                type="text"
                value={selectedInterviewModeSC}
                onChange={handleInterviewModeSC}
                options={filteredOptionInterviewMode}
              />
              <label htmlFor="selecteddpt" className={`floating-label`}>
                Interview Mode
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
                value={locationSC}
                onChange={(e) => setlocationSC((e.target.value))}
              />
              <label for="sname" className="exp-form-labels">Location</label>
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
export default InterviewSchedule;
