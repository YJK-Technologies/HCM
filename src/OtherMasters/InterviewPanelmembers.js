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

function InterviewPanelMem({ }) {
  const [rowData, setRowData] = useState([]);
  const [error, setError] = useState("");
  const [member_id, setmember_id] = useState("");
  const [Role, setRole] = useState("");
  const [RoleSC, setRoleSC] = useState("");
  const [statusSC, setstatusSC] = useState("");
  const [hasValueChanged, setHasValueChanged] = useState(false);
  const [selectedPanelID, setselectedPanelID] = useState("");
  const [PanelID, setPanelID] = useState("");
  const [selectedPanelIDSC, setselectedPanelIDSC] = useState("");
  const [PanelIDSC, setPanelIDSC] = useState("");
  const [PanelDrop, setPanelDrop] = useState([]);
  const [isSelectPanelID, setIsisSelectPanelID] = useState(false);
  const [isSelectPanelSC, setisSelectPanelSC] = useState(false);
  const [selectedEmployeeID, setselectedEmployeeID] = useState("");
  const [EmployeeID, setEmployeeID] = useState("");
  const [selectedEmployeeIDSC, setselectedEmployeeIDSC] = useState("");
  const [EmployeeIDSC, setEmployeeIDSC] = useState("");
  const [EmployeeIDdrop, setEmployeeIDdrop] = useState([]);
  const [showAsterisk, setShowAsterisk] = useState(true);
  const [isSelectEmployeeID, setisSelectEmployeeID] = useState(false);
  const [isSelectEmployeeIDSC, setisSelectEmployeeIDSC] = useState(false);



  const [activeTab, setActiveTab] = useState("Interview Panel Members")
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


  const handlePanelID = (selectedDPT) => {
    setselectedPanelID(selectedDPT);
    setPanelID(selectedDPT ? selectedDPT.value : '');
  };
  const handlePanelIDSC = (selectedDPT) => {
    setselectedPanelIDSC(selectedDPT);
    setPanelIDSC(selectedDPT ? selectedDPT.value : '');
  };

  const filteredOptionPanelID = PanelDrop.map(option => ({
    value: option.panel_id,
    label: `${option.panel_id} - ${option.panel_name}`
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
      headerName: "Member ID",
      field: "member_id",
      editable: true
    },
    {
      headerName: "Panel ID",
      field: "panel_id",
      editable: false
    },
    {
      headerName: "Employee ID",
      field: "employee_id",
      editable: true
    },
    {
      headerName: "Role",
      field: "Role",
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
    if (!Role || !PanelID || !EmployeeID) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }

    try {
      const Header = {
        panel_id: PanelID,
        Role: Role,
        employee_id: EmployeeID,
        company_code: sessionStorage.getItem('selectedCompanyCode'),
        created_by: sessionStorage.getItem('selectedUserCode')
      };

      const response = await fetch(`${config.apiBaseUrl}/interview_panel_membersInsert`, {
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
        member_id: member_id,
        panel_id: PanelIDSC,
        employee_id: EmployeeIDSC,
        Role: RoleSC,
        status: statusSC,
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      };

      const response = await fetch(`${config.apiBaseUrl}/InterviewPanelMembers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const fetchedData = await response.json();
        const newRows = fetchedData.map((matchedItem) => ({
          member_id: matchedItem.member_id,
          Role: matchedItem.Role,
          employee_id: matchedItem.employee_id,
          panel_id: matchedItem.panel_id,
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

          const dataToSend = { interview_panel_membersData: Array.isArray(rowData) ? rowData : [rowData] };

          const response = await fetch(`${config.apiBaseUrl}/interview_panel_membersLoopUpdate`, {
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

          const dataToSend = { interview_panel_membersData: Array.isArray(rowData) ? rowData : [rowData] };

          const response = await fetch(`${config.apiBaseUrl}/interview_panel_membersLoopDelete`, {
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
          <h1 className="page-title">Interview Panel Members</h1>
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

          {/* <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="number"
                placeholder=""
                title="Please Enter the Company Contribution"
                required
                autoComplete="off"
                value={member_id}
                onChange={(e) => setmember_id((e.target.value))}
              />
              <label for="sname" className={`exp-form-labels ${error && !member_id ? 'text-danger' : ''}`}>Member ID<span className="text-danger">*</span></label>
            </div>
          </div> */}

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedPanelID ? "has-value" : ""} 
              ${isSelectPanelID ? "is-focused" : ""}`}
            >
              <Select
                id="department"
                placeholder=" "
                onFocus={() => setIsisSelectPanelID(true)}
                onBlur={() => setIsisSelectPanelID(false)}
                classNamePrefix="react-select"
                isClearable
                type="text"
                value={selectedPanelID}
                onChange={handlePanelID}
                options={filteredOptionPanelID}
              />
              <label htmlFor="selecteddpt" className={`floating-label ${error && !selectedPanelID ? 'text-danger' : ''}`}>
                Panel ID{showAsterisk && <span className="text-danger">*</span>}
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
                value={Role}
                onChange={(e) => setRole((e.target.value))}
              />
              <label for="add1" className={`exp-form-labels ${error && !Role ? 'text-danger' : ''}`}>Role<span className="text-danger">*</span></label>
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
                value={member_id}
                onChange={(e) => setmember_id(e.target.value)}
              />
              <label For="city" className="exp-form-labels">Member ID</label>
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
                title="Please Enter the Employee PF"
                required
                autoComplete="off"
                value={RoleSC}
                onChange={(e) => setRoleSC((e.target.value))}
              />
              <label for="add1" className={`exp-form-labels`}>Role</label>
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
export default InterviewPanelMem;
