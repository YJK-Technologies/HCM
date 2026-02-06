import React, { useState, useEffect, useRef } from "react";
import "../input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import TabButtons from '../ESSComponents/Tabs';
import { useNavigate } from "react-router-dom";
import Select from 'react-select';
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import { showConfirmationToast } from '../ToastConfirmation';
import '../apps.css'
import LoadingScreen from '../Loading';
const config = require('../Apiconfig');

function CandidateMaster() {

  const [phone, setphone] = useState("");
  const [Education, setEducation] = useState("");
  const [Experience, setExperience] = useState("");
  const [Related_experience, setRelated_experience] = useState("");
  const [EducationSC, setEducationSC] = useState("");
  const [ExperienceSC, setExperienceSC] = useState("");
  const [JobDescriptionSC, setJobDescriptionSC] = useState("");
  const [Related_experienceSC, setRelated_experienceSC] = useState("");
  const [Job_description, setJob_description] = useState("");
  const [email, setemail] = useState("");
  const [emailSC, setemailSC] = useState("");
  const [phoneSC, setphoneSC] = useState("");
  const [candidate_name, setcandidate_name] = useState("");
  const [error, setError] = useState("");
  const [rowData, setRowData] = useState([]);
  const [activeTab, setActiveTab] = useState("Candiate Master")
  const [loading, setLoading] = useState(false);
  const [isselectedJobID, setisselectedJobID] = useState(false);
  const [isselectedJobIDSC, setisselectedJobIDSC] = useState(false);
  const [selectedJobID, setselectedJobID] = useState("");
  const [selectedJobIDSC, setselectedJobIDSC] = useState("");
  const [JobID, setJobID] = useState("");
  const [JobIDSC, setJobIDSC] = useState("");
  const [Jobdrop, setJobdrop] = useState([]);
  const [JobDrop, setJobDrop] = useState([]);
  const [showAsterisk, setShowAsterisk] = useState(true);
  const [dptSC, setdptSC] = useState("");
  const [selectedcandidate_name, setSelectedcandidatename] = useState("");
  const [canditatename, set_candidatename] = useState("");
  const [isselectedscheduleid, setIsscheduleid] = useState("");
  const [selectedCV, setSelectedCV] = useState("");
  const [candidate_CV, setCandidate_CV] = useState("");
  const [canditatenameDrop, setcanditatenameDrop] = useState([]);
  const [currentPdfUrl, setCurrentPdfUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const cv = useRef(null)


  const navigate = useNavigate();

  const handleJobID = (selectedDPT) => {
    setselectedJobID(selectedDPT);
    setJobID(selectedDPT ? selectedDPT.value : '');
  };

  const handleJobIDSC = (selectedDPT) => {
    setselectedJobIDSC(selectedDPT);
    setJobIDSC(selectedDPT ? selectedDPT.value : '');
  };

  const filteredOptionJobID = Jobdrop.map(option => ({
    value: option.job_id,
    label: `${option.job_id} - ${option.job_title}`
  }));

  const handlescandidate_name = (selectedDPT) => {
    setSelectedcandidatename(selectedDPT);
    set_candidatename(selectedDPT ? selectedDPT.value : '');
  };

  const filteredOptioncandidate_name = canditatenameDrop.map(option => ({
    value: option.candidate_name,
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

  const handleSearch = async () => {
    setLoading(true);
    try {
      const body = {
        candidate_name: canditatename,
        email: emailSC,
        phone: phoneSC,
        applied_job_id: JobIDSC,
        Education: EducationSC,
        Experience: ExperienceSC,
        Job_description: JobDescriptionSC,
        Related_experience: Related_experienceSC,
        company_code: sessionStorage.getItem("selectedCompanyCode")
      };

      const response = await fetch(`${config.apiBaseUrl}/CandidateSearch`, {
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
          email: matchedItem.email,
          Canditate_CV: matchedItem.Canditate_CV,
          phone: matchedItem.phone,
          candidate_name: matchedItem.candidate_name,
          applied_job_id: matchedItem.applied_job_id,
          Education: matchedItem.Education,
          Experience: matchedItem.Experience,
          Related_experience: matchedItem.Related_experience,
          Job_description: matchedItem.Job_description,
          keyfield: matchedItem.keyfield,
          company_code: sessionStorage.getItem("selectedCompanyCode"),
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
    } finally {
      setLoading(false);
    }
  };




  //   const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   if (!file) return;

  //   // Preview URL
  //   const previewUrl = URL.createObjectURL(file);

  //   // Convert to Base64 (for backend)
  //   const reader = new FileReader();
  //   reader.onloadend = () => {
  //     const base64 = reader.result.split(",")[1];

  //     setMember({
  //       documentUrl: previewUrl,
  //       documentBase64: base64,
  //     });
  //   };

  //   reader.readAsDataURL(file);
  // };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedCV(URL.createObjectURL(file));
      setCandidate_CV(file);
    }
  };

  const handleRemoveLogo = () => {
    setSelectedCV(null);
    if (cv.current) {
      cv.current.value = "";
    }
  };

  const handlePdfClick = (url) => {
    setCurrentPdfUrl(url);
    setIsModalOpen(true);  // Show the modal
  };

  const handleUpdate = async (rowData) => {
    setLoading(true);
    showConfirmationToast(
      "Are you sure you want to update the data in the selected rows?",
      async () => {
        try {
          const company_code = sessionStorage.getItem('selectedCompanyCode');
          const modified_by = sessionStorage.getItem('selectedUserCode');

          const dataToSend = { candidate_masterData: Array.isArray(rowData) ? rowData : [rowData] };

          const response = await fetch(`${config.apiBaseUrl}/candidate_masterLoopUpdate`, {
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

          const dataToSend = { candidate_masterData: Array.isArray(rowData) ? rowData : [rowData] };

          const response = await fetch(`${config.apiBaseUrl}/candidate_masterLoopDelete`, {
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

  const reloadGridData = () => {
    setRowData([]);
  };

  const CVLinkRenderer = (props) => {
    if (!props.value?.data) {
      return <span>No CV</span>;
    }

    const openCV = () => {
      const byteArray = new Uint8Array(props.value.data);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      props.context.openPdf(url);
    };

    return (
      <span
        style={{
          color: "#0d6efd",
          cursor: "pointer",
          textDecoration: "underline",
          fontWeight: 500,
        }}
        onClick={openCV}
      >
        View CV
      </span>
    );
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
      headerName: "Candidate Id",
      field: "candidate_id",
      editable: false,
    },
    {
      headerName: "Candidate Name",
      field: "candidate_name",
      editable: true,
    },
    {
      headerName: "Email",
      field: "email",
      editable: true,
    },
    {
      headerName: "Phone",
      field: "phone",
      editable: true,
    },
    {
      headerName: "Applied Job ID",
      field: "applied_job_id",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: JobDrop,
      },
    },
    {
      headerName: "Education",
      field: "Education",
      editable: true,
    },
    {
      headerName: "Experience",
      field: "Experience",
      editable: true,
    },
    {
      headerName: "Related Experience",
      field: "Related_experience",
      editable: true,
    },
    {
      headerName: "Job Description",
      field: "Job_description",
      editable: true,
    },
   
    {
      headerName: "Candidate CV",
      field: "Canditate_CV",
      cellRenderer: CVLinkRenderer,
    },
    {
      headerName: "Keyfield ",
      field: "keyfield",
      editable: false,
      hide: true
    },
  ]

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



 const handleSave = async () => {
  // Required fields check
  if (
    !candidate_name ||
    !email ||
    !phone ||
    !JobID ||
    !Education ||
    !Experience ||
    !Related_experience ||
    !Job_description 
  ) {
    setError(" ");
    toast.warning("Error: Missing required fields");
    return;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    toast.warning("Please enter a valid Email address");
    return;
  }

  // Phone number validation
  if (phone.length !== 10) {
    toast.warning("Phone number must be 10 digits");
    return;
  }

  // ---------- API CALL ----------
  setLoading(true);

  try {
    const formData = new FormData();

    formData.append("candidate_name", candidate_name.trim());
    formData.append("email", email.trim());
    formData.append("phone", phone);
    formData.append("applied_job_id", JobID);
    formData.append("Education", Education);
    formData.append("Experience", Experience);
    formData.append("Related_experience", Related_experience);
    formData.append("Job_description", Job_description);
    formData.append(
      "company_code",
      sessionStorage.getItem("selectedCompanyCode")
    );
    formData.append(
      "created_by",
      sessionStorage.getItem("selectedUserCode")
    );
    formData.append("Canditate_CV", candidate_CV);

    const response = await fetch(
      `${config.apiBaseUrl}/candidate_masterInsert`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (response.ok) {
      toast.success("Data inserted successfully!");
    } else {
      const errorResponse = await response.json();
      toast.warning(errorResponse.message || "Failed to insert data");
    }
  } catch (error) {
    console.error("Error inserting data:", error);
    toast.error("Error inserting data");
  } finally {
    setLoading(false);
  }
};



  // const handleRowSelection = (row) => {
  //   setFromDate(formatDate(row.FromDate)); // Ensure correct format
  //   setToDate(formatDate(row.ToDate));
  //   setEligibledays(row.Salary_Days);
  //   // setSelectedRow(row);
  // };

  return (
    <div class="container-fluid Topnav-screen ">
      {loading && <LoadingScreen />}
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="shadow-lg p-1 bg-light rounded main-header-box">
        <div className="header-flex">
          <h1 className="page-title">Interview Masters </h1>
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
                required title="Please Enter the Eligibility Salary Days"
                autoComplete="off"
                value={candidate_name}
                maxLength={50}
                onChange={(e) => setcandidate_name((e.target.value))}
              />
              <label for="sname" className={` exp-form-labels ${error && !candidate_name ? 'text-danger' : ''}`}>Candidate Name<span className="text-danger">*</span></label>
            </div>
          </div>
          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="email"
                className="exp-input-field form-control"
                type="email"
                placeholder=""
                required
                title="Please Enter a Valid Email Address"
                autoComplete="off"
                value={email}
                maxLength={30}
                onChange={(e) => setemail(e.target.value.trim())}
              />
              <label
                htmlFor="email"
                className={`exp-form-labels ${error && (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
                    ? 'text-danger'
                    : ''
                  }`}
              >
                Email <span className="text-danger">*</span>
              </label>
            </div>

            {error && email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (
              <small className="text-danger">Please enter a valid email address</small>
            )}
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                className="exp-input-field form-control"
                type="text"
                placeholder=""
                required
                title="Please Enter the Eligibility Salary Days"
                autoComplete="off"
                value={phone}
                maxLength={13}
                inputMode="numeric"
                pattern="[0-9]*"
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setphone(value);
                }}
              />
              <label
                htmlFor="fdate"
                className={`exp-form-labels ${error && !phone ? 'text-danger' : ''}`}
              >
                Phone <span className="text-danger">*</span>
              </label>
            </div>
          </div>
          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedJobID ? "has-value" : ""} 
              ${isselectedJobID ? "is-focused" : ""}`}
            >
              <Select
                id="department"
                placeholder=" "
                onFocus={() => setisselectedJobID(true)}
                onBlur={() => setisselectedJobID(false)}
                classNamePrefix="react-select"
                isClearable
                type="text"
                value={selectedJobID}
                onChange={handleJobID}
                options={filteredOptionJobID}
              />
              <label htmlFor="selecteddpt" className={`floating-label ${error && !selectedJobID ? 'text-danger' : ''}`}>
                Applied Job ID{showAsterisk && <span className="text-danger">*</span>}
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                className="exp-input-field form-control"
                type="text"
                placeholder=""
                required
                title="Please Enter the Applied Job ID"
                autoComplete="off"
                value={Education}
                maxLength={100}
                onChange={(e) => { setEducation(e.target.value); }}
              />
              <label
                htmlFor="fdate"
                className={`exp-form-labels ${error && !Education ? 'text-danger' : ''}`}
              >
                Education <span className="text-danger">*</span>
              </label>
            </div>
          </div>
          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                className="exp-input-field form-control"
                type="text"
                placeholder=""
                required
                title="Please Enter the Applied Job ID"
                autoComplete="off"
                value={Experience}
                maxLength={100}
                onChange={(e) => { setExperience(e.target.value); }}
              />
              <label
                htmlFor="fdate"
                className={`exp-form-labels ${error && !Experience ? 'text-danger' : ''}`}
              >
                Experience <span className="text-danger">*</span>
              </label>
            </div>
          </div>
          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                className="exp-input-field form-control"
                type="text"
                placeholder=""
                required
                title="Please Enter the Applied Job ID"
                autoComplete="off"
                value={Related_experience}
                maxLength={100}
                 onChange={(e) => {setRelated_experience(e.target.value); }}
              />
              <label
                htmlFor="fdate"
                className={`exp-form-labels ${error && !Related_experience ? 'text-danger' : ''}`}
              >
                Related Experience <span className="text-danger">*</span>
              </label>
            </div>
          </div>
          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                className="exp-input-field form-control"
                type="text"
                placeholder=""
                required
                title="Please Enter the Applied Job ID"
                autoComplete="off"
                value={Job_description}
                maxLength={100}
                 onChange={(e) => { setJob_description(e.target.value); }}
              />
              <label
                htmlFor="fdate"
                className={`exp-form-labels ${error && !Job_description ? 'text-danger' : ''}`}
              >
                Job Description <span className="text-danger">*</span>
              </label>
            </div>
          </div>


          <div className="col-md-2">
            <div className="inputGroup">
              <div className="image-upload-container">
                {selectedCV ? (
                  <div className="image-preview-box">
                    <iframe
                      src={selectedCV}
                      alt="Uploaded CV"
                      className="uploaded-image"
                    ></iframe>
                    <button
                      type="button"
                      className="delete-image-btn"
                      onClick={handleRemoveLogo}
                    >
                      &times;
                    </button>
                  </div>
                ) : (
                  <div className="upload-placeholder-box">
                    <div className="upload-icon-text">
                      <i className="fa-regular fa-image upload-icon me-1"></i>
                      <span>Upload CV</span>
                    </div>
                  </div>
                )}

                <input
                  type="file"
                  id="locno"
                  className="exp-input-field form-control hidden-file-input"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  ref={cv}
                />
              </div>
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
              ${selectedcandidate_name ? "has-value" : ""} 
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
                value={selectedcandidate_name}
                onChange={handlescandidate_name}
                options={filteredOptioncandidate_name}
              />
              <label htmlFor="selecteddpt" className={`floating-label`}>
                Candiate Name
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
                required title="Please Enter the Eligibility Salary Days"
                autoComplete="off"
                value={emailSC}
                maxLength={30}
                onChange={(e) => setemailSC(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <label for="sname" className="exp-form-labels">Email </label>
            </div>
          </div>
          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                autoComplete="off"
                value={phoneSC}
                maxLength={13}
                inputMode="numeric"
                pattern="[0-9]*"
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setphoneSC(value);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <label for="sname" className="exp-form-labels">Phone</label>
            </div>
          </div>
           <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedJobIDSC ? "has-value" : ""} 
              ${isselectedJobIDSC ? "is-focused" : ""}`}
            >
              <Select
                id="department"
                placeholder=" "
                onFocus={() => setisselectedJobIDSC(true)}
                onBlur={() => setisselectedJobIDSC(false)}
                classNamePrefix="react-select"
                isClearable
                type="text"
                value={selectedJobIDSC}
                onChange={handleJobIDSC}
                options={filteredOptionJobID}
              />
              <label htmlFor="selecteddpt" className={`floating-label`}>
                Applied Job ID
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                className="exp-input-field form-control"
                type="text"
                placeholder=""
                required
                title="Please Enter the Applied Job ID"
                autoComplete="off"
                value={EducationSC}
                maxLength={100}
                onChange={(e) => { setEducationSC(e.target.value); }}
              />
              <label
                htmlFor="fdate"
                className={`exp-form-labels`}
              >
                Education 
              </label>
            </div>
          </div>
          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                className="exp-input-field form-control"
                type="text"
                placeholder=""
                required
                title="Please Enter the Applied Job ID"
                autoComplete="off"
                value={ExperienceSC}
                maxLength={100}
                onChange={(e) => { setExperienceSC(e.target.value); }}
              />
              <label
                htmlFor="fdate"
                className={`exp-form-labels`}
              >
                Experience 
              </label>
            </div>
          </div>
          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                className="exp-input-field form-control"
                type="text"
                placeholder=""
                required
                title="Please Enter the Applied Job ID"
                autoComplete="off"
                value={Related_experienceSC}
                maxLength={100}
                 onChange={(e) => {setRelated_experienceSC(e.target.value); }}
              />
              <label
                htmlFor="fdate"
                className={`exp-form-labels`}
              >
                Related Experience 
              </label>
            </div>
          </div>
          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                className="exp-input-field form-control"
                type="text"
                placeholder=""
                required
                title="Please Enter the Applied Job ID"
                autoComplete="off"
                value={JobDescriptionSC}
                maxLength={100}
                 onChange={(e) => {setJobDescriptionSC(e.target.value); }}
              />
              <label
                htmlFor="fdate"
                className={`exp-form-labels`}
              >
                Job Description
              </label>
            </div>
          </div>
          {/* <div className="col-md-2">
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
          </div> */}

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

          {isModalOpen && (
            <div
              className="modal fade show d-block"
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                   <div className="shadow-lg p-1 bg-light main-header-box">
                <div className="header-flex">
                  <h1 className="custom-modal-title">Candidate CV</h1>

                  <div className="action-wrapper">
                    <div className="action-icon delete"  onClick={() => {
                        URL.revokeObjectURL(currentPdfUrl);
                        setIsModalOpen(false);
                      }}>
                      <span className="tooltip">Close</span>
                      <i className="fa-solid fa-xmark"></i>
                    </div>
                  </div>
                </div>
              </div>
                  <div className="modal-body" style={{ height: "500px" }}>
                    <iframe
                      src={currentPdfUrl}
                      title="CV Preview"
                      width="100%"
                      height="100%"
                      style={{ border: "none" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}


        </div>
      </div>

      <div className="shadow-lg pt-3 pb-3 bg-light rounded mt-2 container-form-box" style={{ width: "100%" }}>
        <div class="ag-theme-alpine" style={{ height: 455, width: "100%" }}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            rowSelection="multiple"
            // onRowClicked={(event) => handleRowSelection(event.data)}
            pagination={true}
            paginationAutoPageSize={true}
            context={{
              openPdf: handlePdfClick,
            }}
          />
        </div>
      </div>
    </div>
  )
}
export default CandidateMaster;