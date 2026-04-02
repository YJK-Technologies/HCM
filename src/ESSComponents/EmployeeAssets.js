
import React, { useState, useEffect } from "react";
import "../input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useLocation } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import TabButtons from "./Tabs";
import Select from 'react-select'
import { showConfirmationToast } from '../ToastConfirmation';
import LoadingScreen from '../Loading';
import EmployeeAssetsPopup from "./EmployeeAssetsPopup";
import { DateTimeField } from "@mui/x-date-pickers";
const config = require('../Apiconfig');

function EmployeeAssets({ }) {
  const [loading, setLoading] = useState(false);
  const [EmployeeID, setEmployeeID] = useState("");
  const [error, setError] = useState(false);
  const [showAsterisk, setShowAsterisk] = useState(true);
  const navigate = useNavigate();
  const [employeeID, setEmployeeId] = useState("");
  const [First_Name, setFirst_Name] = useState('');
  const [department_id, setdepartment_id] = useState("");
  const [designation_id, setdesignation_id] = useState("");
  const [isSelectAllocationStatus, setIsSelectAllocationStatus] = useState({});
  const [AssetID, setAssetID] = useState('');
  const [allocationDate, setAllocationDate] = useState('');
  const [expectedReturnDate, setExpectedReturnDate] = useState('');
  const [actualReturnDate, setActualReturnDate] = useState('');
  const [statusdrop, setStatusdrop] = useState([]);


  const [Assetvalue, setAssetvalue] = useState([{
    relation: 'Assetvalue', members: [{
      relationName: '', AssetID: "",
      AllocationDate: "",
      ExpectedReturnDate: "",
      ActualReturnDate: "",
      AllocationStatus: "",
      ConditionAtIssue: "",
      ConditionAtReturn: "",
      ApprovedBy: "",
      Remarks: "",
      keyfield: ''
    }]
  }]);

  const [saveButtonVisible, setSaveButtonVisible] = useState(true);
  const permissions = JSON.parse(sessionStorage.getItem('permissions')) || {};
  const EmpAssetsPermissions = permissions
    .filter(permission => permission.screen_type === 'Family')
    .map(permission => permission.permission_type.toLowerCase());

  const NavigatecomDet = () => {
    navigate("/CompanyDetails", { state: { employeeId: employeeID, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const FinanceDet = () => {
    navigate("/FinanceDet", { state: { employeeId: employeeID, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const BankAccDet = () => {
    navigate("/BankAccDet", { state: { employeeId: employeeID, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const IdentDoc = () => {
    navigate("/IdentDoc", { state: { employeeId: employeeID, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const AcademicDet = () => {
    navigate("/AcademicDet", { state: { employeeId: employeeID, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const Insurance1 = () => {
    navigate("/Family", { state: { employeeId: employeeID, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const Documents = () => {
    navigate("/Documents", { state: { employeeId: employeeID, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };
  const EmployeeAssets = () => {
    navigate("/EmployeeAssets", { state: { employeeId: employeeID, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const EmployeeLoan = () => {
    navigate("/AddEmployeeInfo", { state: { employeeId: employeeID, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };


  const tabs = [
    { label: 'Personal Details' },
    { label: 'Company Details' },
    { label: 'Financial Details' },
    { label: 'Bank Account Details' },
    { label: 'Identity Documents' },
    { label: 'Academic Details' },
    { label: 'Family' },
    { label: 'Documents' },
    { label: 'Employee Assets' }
  ];

  const [activeTab, setActiveTab] = useState('Family');
  const handleTabClick = (tabLabel) => {
    setActiveTab(tabLabel);

    switch (tabLabel) {
      case 'Personal Details':
        EmployeeLoan();
        break;
      case 'Company Details':
        NavigatecomDet();
        break;
      case 'Financial Details':
        FinanceDet();
        break;
      case 'Bank Account Details':
        BankAccDet();
        break;
      case 'Identity Documents':
        IdentDoc();
        break;
      case 'Academic Details':
        AcademicDet();
        break;
      case 'Family':
        Insurance1();
        break;
      case 'Documents':
        Documents();
        break;
      case 'EmployeeAssets':
        EmployeeAssets();
        break;
      default:
        break;
    }
  };

  const addRow = (relation) => {
    setAssetvalue((prev) =>
      prev.map((item) =>
        item.relation === relation
          ? {
            ...item, members: [...item.members, {
              AssetID: "",
              AllocationDate: "",
              ExpectedReturnDate: "",
              ActualReturnDate: "",
              AllocationStatus: "",
              ConditionAtIssue: "",
              ConditionAtReturn: "",
              ApprovedBy: "",
              Remarks: ""
            }]
          }
          : item
      )
    );
  };

  const deleteRow = (relation, index) => {
    setAssetvalue((prev) =>
      prev.map((item) =>
        item.relation === relation
          ? { ...item, members: item.members.filter((_, i) => i !== index) }
          : item
      )
    );
  };

  // const handleSave = async () => {

  //     if (!EmployeeID) {
  //       setError(true);
  //       toast.warning("Error: Missing required keyfield")
  //       return;
  //     }

  //     for (const relationGroup of Assetvalue) {
  //       for (const member of relationGroup.members) {
  //         if (!member.AssetID  || !member.AllocationDate || !member.AllocationStatus) {
  //           setError(true);
  //           toast.warning("Error: Missing required fields")

  //           return;
  //         }
  //       }
  //     }

  //     const employeeData = Assetvalue.flatMap((relationGroup) =>
  //       relationGroup.members.map((member) => ({
  //         AssetID: member.AssetID,
  //         EmployeeID: member.EmployeeID,
  //         AllocationDate: member.AllocationDate,
  //         ExpectedReturnDate: member.ExpectedReturnDate,
  //         ActualReturnDate: member.ActualReturnDate,
  //         AllocationStatus: member.AllocationStatus,
  //         ConditionAtIssue: member.ConditionAtIssue,
  //         ConditionAtReturn: member.ConditionAtReturn,
  //         ApprovedBy: member.ApprovedBy,
  //         Remarks: member.Remarks,
  //         company_code: sessionStorage.getItem("selectedCompanyCode"),
  //         CreatedBy: sessionStorage.getItem("selectedUserCode")
  //       }))
  //     );
  //     setError(false);
  //     setLoading(true)

  //     try {
  //       const response = await fetch(`${config.apiBaseUrl}/EmployeeAssetsLoopInsert`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ employeeData }),
  //       });
  //       if (response.ok) {
  //         toast.success("Data inserted successfully!", {
  //           onClose: () => window.location.reload(),
  //         });
  //       } else {
  //         const errorResponse = await response.json();
  //         console.error(errorResponse.message);
  //         toast.warning(errorResponse.message, {
  //         })
  //       }
  //     } catch (err) {
  //       console.error("Error delete data:", err);
  //       toast.error('Error delete data: ' + err.message, {
  //       });
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  const handleSave = async () => {
    if (!EmployeeID || !EmployeeID.trim()) {
      setError(true);
      toast.warning("Employee ID is required");
      return;
    }

    for (const relationGroup of Assetvalue) {
      for (const member of relationGroup.members) {

        // Trim values before validation
        const AssetID = member.AssetID?.trim();
        const AllocationDate = member.AllocationDate;
        const Status = member.Status?.trim();

        if (!AssetID || !AllocationDate || !Status) {
          setError(true);
          toast.warning("Please fill all required fields");
          return;
        }

        // Convert to Date objects
        const allocDate = new Date(AllocationDate);
        const expectedDate = member.ExpectedReturnDate ? new Date(member.ExpectedReturnDate) : null;
        const actualDate = member.ActualReturnDate ? new Date(member.ActualReturnDate) : null;

        if (expectedDate && expectedDate < allocDate) {
          toast.warning("Expected Return Date must be after Allocation Date");
          return;
        }

        if (actualDate && actualDate < allocDate) {
          toast.warning("Actual Return Date must be after Allocation Date");
          return;
        }
      }
    }

    setError(false);
    setLoading(true);

    const employeeData = Assetvalue.flatMap((relationGroup) =>
      relationGroup.members.map((member) => ({
        AssetID: member.AssetID?.trim(),
        EmployeeID: employeeID.trim(),
        AllocationDate: member.AllocationDate,
        ExpectedReturnDate: member.ExpectedReturnDate || null,
        ActualReturnDate: member.ActualReturnDate || null,
        AllocationStatus: member.Status?.trim(),
        ConditionAtIssue: member.ConditionAtIssue?.trim() || "",
        ConditionAtReturn: member.ConditionAtReturn?.trim() || "",
        ApprovedBy: member.ApprovedBy?.trim() || "",
        Remarks: member.Remarks?.trim() || "",
        company_code: sessionStorage.getItem("selectedCompanyCode")?.trim(),
        CreatedBy: sessionStorage.getItem("selectedUserCode")?.trim(),

      }))
    );

    try {
      const response = await fetch(
        `${config.apiBaseUrl}/EmployeeAssetsLoopInsert`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ EmployeeAssetsData: employeeData }), // ✅ match backend
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success("Data saved successfully!", {
          onClose: () => window.location.reload(),
        });
      } else {
        console.error(result.message);
        toast.warning(result.message || "Failed to save data");
      }

    } catch (err) {
      console.error("Error saving data:", err);
      toast.error("Error saving data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const reloadGridData = () => {
    window.location.reload();
  };

  const filteredOptionStatus = statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),

      }),
    })
      .then((data) => data.json())
      .then((val) => setStatusdrop(val));
  }, []);


  const handleChangeStatus = (selectedStatus, relation, index) => {
    setAssetvalue((prevDocuments) =>
      prevDocuments.map((doc) => {
        if (doc.relation !== relation) return doc;

        return {
          ...doc,
          members: doc.members.map((member, i) => {
            if (i !== index) return member;

            return {
              ...member,
              Status: selectedStatus?.value || "",
              selectedStatus: selectedStatus || null,
            };
          }),
        };
      })
    );
  };

  const RelationInputChange = (relation, index, field, value) => {
    setAssetvalue((prev) =>
      prev.map((item) =>
        item.relation === relation
          ? {
            ...item,
            members: item.members.map((member, i) =>
              i === index ? { ...member, [field]: value } : member
            ),
          }
          : item
      )
    );
  };
  const handleEmployeeAssets = async (code) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getEmployeeFamily`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Id: code,
          company_code: sessionStorage.getItem("selectedCompanyCode"),
        }),
      });

      if (response.ok) {
        setSaveButtonVisible(false);
        setShowAsterisk(false);

        const data = await response.json();

        const [{ EmployeeId, department_id, designation_id, First_Name }] = data;

        setdepartment_id(department_id);
        setdesignation_id(designation_id);
        setFirst_Name(First_Name);
        setEmployeeId(EmployeeId);

     
        const mappedAssets = [
          {
            relation: "Assetvalue",
            members: data.map((item) => ({
              AssetID: item.AssetID || "",
              AllocationDate: formatDate(item.AllocationDate),
              ExpectedReturnDate: formatDate(item.ExpectedReturnDate),
              ActualReturnDate: formatDate(item.ActualReturnDate),
              AllocationStatus: item.AllocationStatus || "",
              ConditionAtIssue: item.ConditionAtIssue || "",
              ConditionAtReturn: item.ConditionAtReturn || "",
              ApprovedBy: item.ApprovedBy || "",
              Remarks: item.Remarks || "",
              keyfield: item.keyfield || "",
            })),
          },
        ];

        setAssetvalue(mappedAssets);

      } else if (response.status === 404) {
        toast.warning("Data not found");

        setAssetvalue([
          {
            relation: "Assetvalue",
            members: [
              {
                AssetID: "",
                AllocationDate: "",
                ExpectedReturnDate: "",
                ActualReturnDate: "",
                AllocationStatus: "",
                ConditionAtIssue: "",
                ConditionAtReturn: "",
                ApprovedBy: "",
                Remarks: "",
                keyfield: "",
              },
            ],
          },
        ]);
      } else {
        const err = await response.json();
        toast.warning(err.message || "Error fetching data");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error: " + error.message);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";

    const d = new Date(date);

    // Convert to YYYY-MM-DD (required for input type="date")
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleEmployeeAssets(EmployeeID)
    }
  };

  const [open, setOpen] = React.useState(false);

  const handleEmployeeInfo = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

    const handleDateChange = (relation, index, field, value) => {
    setAssetvalue((prev) =>
      prev.map((item) =>
        item.relation === relation
          ? {
            ...item,
            members: item.members.map((member, i) =>
              i === index ? { ...member, [field]: value } : member
            ),
          }
          : item
      )
    );
  };

  // const EmployeeAssetsPopup = async (data) => {
  //     if (data && data.length > 0) {
  //       setSaveButtonVisible(false);
  //       setShowAsterisk(false);
  //       setIsAcademicDataLoaded(true);
  //       const [{ employeeId }] = data;

  //       handleEmployeeAssets(employeeId);

  //     } else {
  //       console.log("Data not fetched...!");
  //     }
  //   };

  return (
    <div class="container-fluid Topnav-screen ">
      {loading && <LoadingScreen />}
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="shadow-lg p-1 bg-body-tertiary rounded main-header-box mb-1
          ">
        <div className="header-flex ">
          <h1 className="page-title">Employee Assets</h1>
          <div className="action-wrapper desktop-actions">
            {saveButtonVisible && ['add', 'all permission'].some(permission => EmpAssetsPermissions.includes(permission)) && (
              <div className="action-icon add"
                onClick={handleSave}
              >
                <span className="tooltip">save</span>
                <i class="fa-solid fa-floppy-disk"></i>
              </div>
            )}
            <div className="action-icon print"
              onClick={reloadGridData}
            >
              <span className="tooltip">Reload</span>
              <i className="fa-solid fa-arrow-rotate-right"></i>
            </div>
          </div>

          <div className="dropdown mobile-actions">
            <button className="btn btn-primary dropdown-toggle p-1" data-bs-toggle="dropdown">
              <i className="fa-solid fa-list"></i>
            </button>

            <ul className="dropdown-menu dropdown-menu-end text-center">

              {saveButtonVisible && ['add', 'all permission'].some(p => EmpAssetsPermissions.includes(p)) && (
                <li className="dropdown-item"
                  onClick={handleSave}
                >
                  <i className="fa-solid fa-floppy-disk text-success fs-4"></i>
                </li>
              )}

              <li className="dropdown-item"
              // onClick={reloadGridData}
              >
                <i className="fa-solid fa-arrow-rotate-right"></i>
              </li>

            </ul>
          </div>
        </div>
      </div>

      <div className="shadow-lg p-3 bg-light rounded mt-2 container-form-box">
        <div className="row g-3">

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="cno"
                class="exp-input-field form-control"
                placeholder=" "
                autoComplete="off"
                type="text"
                value={EmployeeID}
                onChange={(e) => setEmployeeID(e.target.value)}
                maxLength={18}
                onKeyPress={handleKeyPress}
              />
              <label className="exp-form-labels">Employee ID</label>
              <span className="select-add-btn" title="Employee Help"
                onClick={handleEmployeeInfo}>
                <i className="fa fa-search"></i>
              </span>
            </div>
          </div>

          <div className="col-md-2">
            <div className="exp-form-floating">
              <div className="info-label-container">
                <label id='FirstNamelabel' className="partyName">
                  <strong>Employee Name:</strong> {First_Name}
                </label>
              </div>
            </div>
          </div>

          <div className="col-md-2" style={{ marginRight: "20px", }}>
            <div className="exp-form-floating">
              <div className="info-label-container">
                <label id='Departmentlabel' className="partyName">
                  <strong>Department:</strong> {department_id}
                </label>
              </div>
            </div>
          </div>

          <div className="col-md-2">
            <div className="exp-form-floating">
              <div className="info-label-container">
                <label id='designationLabel' className="partyName">
                  <strong>Designation:</strong> {designation_id}
                </label>
              </div>
            </div>
          </div>

        </div>
      </div>
      <TabButtons tabs={tabs} activeTab={activeTab} onTabClick={handleTabClick} />
      {Assetvalue.map((relationGroup, relationIndex) => (
        <div
          key={relationIndex}
          className="shadow-lg p-2 bg-light rounded mt-2 container-form-box"
        >
          {relationGroup.members.map((member, index) => (
            <div key={index} className="row g-3">

              <div className="col-md-1">
                <div className="inputGroup">

                  {/* Add Button */}
                  <button
                    type="button"
                    className="btn btn-primary ms-3"
                    onClick={() => addRow(relationGroup.relation)}
                  >
                    <i className="fa-solid fa-circle-plus"></i>
                  </button>

                  {/* Delete Button */}
                  {relationGroup.members.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-danger ms-2"
                      onClick={() =>
                        deleteRow(relationGroup.relation, index)
                      }
                    >
                      <i className="fa-regular fa-trash-can"></i>
                    </button>
                  )}

                </div>
              </div>

              <div className="col-md-2">
                <div className="inputGroup">
                  <input
                    type="number"
                    className="exp-input-field form-control"
                    value={member.AssetID}
                    maxLength={12}
                    placeholder=" "
                    autoComplete="off"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        RelationInputChange(relationGroup.relation, index, 'AssetID', value);
                      }
                    }} />
                  <label for="cno" className={`exp-form-labels ${error && !member.AssetID ? 'text-danger' : ''}`}>AssetID{showAsterisk && <span className="text-danger">*</span>}</label>
                </div>
              </div>

              <div className="col-md-2">
                <div className="inputGroup">
                  <input
                    type="date"
                    className="exp-input-field form-control"
                    name="AllocationDate"
                    autoComplete="off"
                    value={member.AllocationDate}
                    max={new Date().toISOString().split("T")[0]}
                    onChange={(e) => {
                      const value = e.target.value;

                      if (
                        member.ExpectedReturnDate &&
                        new Date(value) >= new Date(member.ExpectedReturnDate)
                      ) {
                        toast.error("Issue Date must be less than Expiry Date");
                        return;
                      }

                      handleDateChange(
                        relationGroup.relation,
                        index,
                        "AllocationDate",
                        value
                      );
                    }}
                    required
                  />

                  <label htmlFor="cno" className={`exp-form-labels ${error && !member.AllocationDate ? 'text-danger' : ''}`}>AllocationDate{showAsterisk && <span className="text-danger">*</span>}</label>
                </div>
              </div>

              {/* Expected Return */}
              <div className="col-md-2">
                <div className="inputGroup">
                  <input
                    type="date"
                    name="ExpectedReturnDate"
                    className="exp-input-field form-control"
                    autoComplete="off"
                    value={member.ExpectedReturnDate}
                 
                     onChange={(e) => {
                      const value = e.target.value;

                      if (
                        member.AllocationDate &&
                        new Date(value) <= new Date(member.AllocationDate)
                      ) {
                        toast.error("Issue Date must be less than Expiry Date");
                        return;
                      }

                      handleDateChange(
                        relationGroup.relation,
                        index,
                        "ExpectedReturnDate",
                        value
                      );
                    }}
                    required
                  />
                  <label for="cno" className={`exp-form-labels ${error && !member.ExpectedReturnDate ? 'text-danger' : ''}`}>ExpectedReturnDate{showAsterisk && <span className="text-danger">*</span>}</label>
                </div>
              </div>

             

              {/* Status */}
              <div className="col-md-2">
                <div
                  className={`inputGroup selectGroup 
               ${member.selectedStatus ? "has-value" : ""}
                  ${isSelectAllocationStatus[index] ? "is-focused" : ""}`}
                >
                  <Select
                    placeholder=" "
                    onFocus={() => setIsSelectAllocationStatus((prev) => ({ ...prev, [index]: true }))}
                    onBlur={() => setIsSelectAllocationStatus((prev) => ({ ...prev, [index]: false }))}
                    classNamePrefix="react-select"
                    isClearable
                    value={member.selectedStatus}
                    options={filteredOptionStatus}
                    maxLength={50}
                    onChange={(selectAllocationStatus) =>
                      handleChangeStatus(selectAllocationStatus, relationGroup.relation, index)

                    } />
                  <label for="cno" className={`floating-label ${error && !!member.Status ? 'text-danger' : ''}`}>Allocation Status</label>
                </div>
              </div>

              {/* Condition Issue */}
              <div className="col-md-2">
                <div className="inputGroup">
                  <input
                    type="text"
                    className="exp-input-field form-control"
                    placeholder=" "
                    value={member.ConditionAtIssue}
                    pattern="[A-Za-z]+"
                    maxLength={50}
                    onChange={(e) => {
                      const onlyLetters = e.target.value.replace(/[^A-Za-z\s]/g, '');
                      RelationInputChange(relationGroup.relation, index, 'ConditionAtIssue', onlyLetters);
                    }}
                  />
                  <label for="cno" className={`exp-form-labels ${error && !member.ConditionAtIssue ? 'text-danger' : ''}`}>ConditionAtIssue{showAsterisk && <span className="text-danger">*</span>}</label>
                </div>
              </div>

              {/* Condition Return */}
              <div className="col-md-2">
                <div className="inputGroup">
                  <input
                    type="text"
                    className="exp-input-field form-control"
                    placeholder=" "
                    value={member.ConditionAtReturn}
                    pattern="[A-Za-z]+"
                    maxLength={50}
                    onChange={(e) => {
                      const onlyLetters = e.target.value.replace(/[^A-Za-z\s]/g, '');
                      RelationInputChange(relationGroup.relation, index, 'ConditionAtReturn', onlyLetters);
                    }} />
                  <label className="exp-form-labels">Condition at Return</label>
                </div>
              </div>

              {/* Approved By */}
              <div className="col-md-2">
                <div className="inputGroup">
                  <input
                    type="text"
                    className="exp-input-field form-control"
                    placeholder=" "
                    value={member.ApprovedBy}
                    pattern="[A-Za-z]+"
                    maxLength={100}
                    onChange={(e) => {
                      const onlyLetters = e.target.value.replace(/[^A-Za-z\s]/g, '');
                      RelationInputChange(relationGroup.relation, index, 'ApprovedBy', onlyLetters);
                    }}
                  />
                  <label className="exp-form-labels">Approved By</label>
                </div>
              </div>

              {/* Remarks */}
              <div className="col-md-2">
                <div className="inputGroup">
                  <input
                    type="text"
                    className="exp-input-field form-control"
                    placeholder=" "
                    value={member.Remarks}
                    pattern="[A-Za-z]+"
                    maxLength={100}
                    onChange={(e) => {
                      const onlyLetters = e.target.value.replace(/[^A-Za-z\s]/g, '');
                      RelationInputChange(relationGroup.relation, index, 'Remarks', onlyLetters);
                    }}
                  />

                  <label className="exp-form-labels">Remarks</label>
                </div>
              </div>

            </div>

          ))}
        </div>

      )
      )}
      <EmployeeAssetsPopup open={open} handleClose={handleClose} EmployeeAssetsPopup={EmployeeAssetsPopup} />


    </div>
  )
}
export default EmployeeAssets;

