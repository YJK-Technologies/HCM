import React, { useState, useEffect } from "react";
import "../input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import TabButtons from "./Tabs";
import Select from "react-select";
import FamilyDetails from "./FamilyPopup";
import { showConfirmationToast } from "../ToastConfirmation";
import LoadingScreen from "../Loading";
const config = require("../Apiconfig");

function EmpFamPersonalDetail({ }) {
  const [familyMembers, setFamilyMembers] = useState([
    {
      relation: "familyMembers",
      members: [
        {
          relationName: "",
          name: "",
          dob: "",
          Age: "",
          aadharNo: "",
          sex: "",
          nationality: "",
          CRPNo: "",
          CRP_ExpiryDate: "",
          passportNo: "",
          passportExpiryDate: "",
          visaEntitled: "",
          visaExpiryDate: "",
          airTicketEntitled: "",
          keyfield: "",
          RepManager: "",
        },
      ],
    },
  ]);
  const [EmployeeId, setEmployeeId] = useState("");
  const [error, setError] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [relativedrop, setrelationdrop] = useState([]);
  const [booleanDrop, setBooleanDrop] = useState([]);
  const [sexDrop, setSexDrop] = useState([]);
  const [nationalityDrop, setNationalityDrop] = useState([]);
  const [saveButtonVisible, setSaveButtonVisible] = useState(true);
  const [isAcademicDataLoaded, setIsAcademicDataLoaded] = useState(false);
  const [showAsterisk, setShowAsterisk] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [First_Name, setFirst_Name] = useState("");
  const [department_id, setdepartment_id] = useState("");
  const [designation_id, setdesignation_id] = useState("");

  const [isSelectRelation, setIsSelectRelation] = useState({});
  const [isSelectSex, setIsSelectSex] = useState({});
  const [isSelectNationality, setIsSelectNationality] = useState({});
  const [isSelectAirTicket, setIsSelectAirTicket] = useState({});
  const [isSelectVisa, setIsSelectVisa] = useState({});
  const [isSelectRepManager, setIsSelectRepManager] = useState({});
  const [loading, setLoading] = useState(false);
  const [purpose, setpurpose] = useState("");
  const [familyData, setFamilyData] = useState([]);

  const [Managerdrop, setManagerdrop] = useState([]);

  const Location_Code = sessionStorage.getItem('selectedLocationCode')

  //code added by Pavun purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem("permissions")) || {};
  const familyPermissions = permissions
    .filter((permission) => permission.screen_type === "EmpFamPersonalDetail")
    .map((permission) => permission.permission_type.toLowerCase());

  const employeeId = sessionStorage.getItem("selectedUserCode");
  useEffect(() => {
    if (
      relativedrop.length > 0 &&
      sexDrop.length > 0 &&
      nationalityDrop.length > 0 &&
      booleanDrop.length > 0
    ) {
      handleEmployeeFamily(employeeId);
    }
  }, [relativedrop, sexDrop, nationalityDrop, booleanDrop]);

  const EmployeeLoan = () => {
    navigate("/ManualEmployeeInfo");
  };
  const Insurance1 = () => {
    navigate("/EmpFamPersonalDetail");
  };
  const AcademicDet = () => {
    navigate("/AcademicDetReq");
  };
  const Documents = () => {
    navigate("/EmpDocumentReq");
  };

  const EmployeeAssets = () => {
    navigate("/EmpAssetsRequest");
  };

  const addRow = (relation) => {
    setFamilyMembers((prev) =>
      prev.map((item) =>
        item.relation === relation
          ? {
            ...item,
            members: [
              ...item.members,
              { relationName: "", name: "", dob: "", Age: "", aadharNo: "" },
            ],
          }
          : item,
      ),
    );
  };

  const deleteRow = (relation, index) => {
    setFamilyMembers((prev) =>
      prev.map((item) =>
        item.relation === relation
          ? { ...item, members: item.members.filter((_, i) => i !== index) }
          : item,
      ),
    );
  };

  const RelationInputChange = (relation, index, field, value) => {
    setFamilyMembers((prev) =>
      prev.map((item) =>
        item.relation === relation
          ? {
            ...item,
            members: item.members.map((member, i) =>
              i === index ? { ...member, [field]: value } : member,
            ),
          }
          : item,
      ),
    );
  };

  const [activeTab, setActiveTab] = useState("Family");
  const handleTabClick = (tabLabel) => {
    setActiveTab(tabLabel);

    switch (tabLabel) {
      case "Personal Details":
        EmployeeLoan();
        break;
      case "Family":
        Insurance1();
        break;
      case "Academic Details":
        AcademicDet();
        break;
      case "Documents":
        Documents();
        break;
      case "Assets":
        EmployeeAssets();
      default:
        break;
    }
  };

  const tabs = [
    { label: "Personal Details" },
    { label: "Family" },
    { label: "Academic Details" },
    { label: "Documents" },
    { label: "Assets" },
  ];

  const handleSave = async () => {
    if (!EmployeeId) {
      toast.warning("Error: Missing required fields");
      return;
    }

    showConfirmationToast(
      "Are you sure you want to update the data ?",
      async () => {
        try {
          setLoading(true);

          const company_code = sessionStorage.getItem("selectedCompanyCode");
          const created_by = sessionStorage.getItem("selectedUserCode");

          /* ---------------- HEADER ---------------- */
          const headerPayload = {
            company_code,
            EmployeeId,
            purpose: purpose,
            request_status: "Pending",
            created_by,
            Location_Code
          };

          const headerRes = await fetch(`${config.apiBaseUrl}/FamilyRequestHdr`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ headerData: [headerPayload] }),
            }
          );

          if (!headerRes.ok) {
            const err = await headerRes.json();
            throw new Error(err.message);
          }

          const headerResult = await headerRes.json();
          const info_request_id = headerResult?.[0]?.info_request_id;

          if (!info_request_id) {
            throw new Error("info_request_id not returned from backend");
          }

          /* ---------------- DETAILS ---------------- */
          await saveFamilyDetails(info_request_id);

          toast.success("Family details submitted successfully!", {
            onClose: () => window.location.reload(),
          });
        } catch (err) {
          console.error(err);
          toast.error("Error: " + err.message);
        } finally {
          setLoading(false);
        }
      },
      () => {
        toast.info("Data updated cancelled.");
      },
    );
  };

  const saveFamilyDetails = async (info_request_id) => {
    try {
      const company_code = sessionStorage.getItem("selectedCompanyCode");
      const created_by = sessionStorage.getItem("selectedUserCode");

      // assuming you have multiple family rows (table/grid)
      const detailsData = familyMembers.flatMap((group) =>
        group.members.map((row) => ({
          info_request_id,
          company_code,
          Location_Code,
          EmployeeId,
          request_status: "Pending",
          Relation: row.relationName,
          Name: row.name,
          DOB: row.dob,
          AGE: row.Age,
          aadhar_no: row.aadharNo,
          Sex: row.sex,
          Nationality: row.nationality,
          CPR_No: row.CRPNo,
          CPR_Expiry_Date: row.CRP_ExpiryDate,
          Passport_No: row.passportNo,
          Passport_Expiry_Date: row.passportExpiryDate,
          Visa_Entitled: row.visaEntitled,
          Visa_Expiry_Date: row.visaExpiryDate,
          Air_Ticket_Entitled: row.airTicketEntitled === "1" ? true : false,
          RepManager: row.RepManager,
          created_by,
        })),
      );

      const res = await fetch(`${config.apiBaseUrl}/FamilyRequestDetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ detailsData }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }

      console.log("Family Details inserted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Error inserting family details: " + error.message);
    }
  };

  const formatDate = (dateString) => {
    if (typeof dateString === "string" && dateString) {
      const dateParts = dateString.split("T")[0].split("-");
      if (dateParts.length === 3) {
        return `${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`;
      }
    }
    return "";
  };

  const handleEmployeeFamily = async (code) => {
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
        setSaveButtonVisible(true);
        setIsAcademicDataLoaded(true);
        setShowAsterisk(false);
        const searchData = await response.json();

        const [{ EmployeeId, department_id, designation_id, First_Name }] =
          searchData;
        setdepartment_id(department_id);
        setdesignation_id(designation_id);
        setFirst_Name(First_Name);

        const updatedFamilyMembers = searchData.reduce((acc, item) => {
          const {
            Relation,
            Name,
            DOB,
            AGE,
            aadhar_no,
            keyfield,
            Sex,
            Nationality,
            CPR_No,
            CPR_Expiry_Date,
            Passport_No,
            Passport_Expiry_Date,
            Visa_Entitled,
            Visa_Expiry_Date,
            Air_Ticket_Entitled,
          } = item;

          const formattedDOB = formatDate(DOB);
          const formattedCRP_ExpiryDate = formatDate(CPR_Expiry_Date);
          const formattedpassportExpiryDate = formatDate(Passport_Expiry_Date);
          const formattedvisaExpiryDate = formatDate(Visa_Expiry_Date);

          const airTicketValue = Air_Ticket_Entitled === true ? "1" : "0";
          const visaEntitledValue = Visa_Entitled === true ? "1" : "0";
          
          const memberData = {
            relationName: Relation || "",
            selectRelation: Relation
              ? { value: Relation, label: Relation }
              : null,
            name: Name,
            dob: formattedDOB,
            Age: AGE,
            aadharNo: aadhar_no,
            keyfield: keyfield,
            sex: Sex || "",
            selectSex: Sex ? { value: Sex, label: Sex } : null,
            nationality: Nationality || "",
            selectNationality: Nationality
              ? { value: Nationality, label: Nationality }
              : null,
            visaEntitled: visaEntitledValue || "",
            selectVisa: visaEntitledValue
              ? { value: visaEntitledValue, label: visaEntitledValue }
              : null,
            airTicketEntitled: airTicketValue || "",
            selectAirTicket: airTicketValue
              ? { value: airTicketValue, label: airTicketValue }
              : null,
            CRPNo: CPR_No,
            CRP_ExpiryDate: formattedCRP_ExpiryDate,
            passportNo: Passport_No,
            passportExpiryDate: formattedpassportExpiryDate,
            visaExpiryDate: formattedvisaExpiryDate,
          };

          const existingRelation = acc.find(
            (group) => group.relation === Relation,
          );

          if (existingRelation) {
            existingRelation.members.push(memberData);
          } else {
            acc.push({
              relation: Relation,
              members: [memberData],
            });
          }
          return acc;
        }, []);

        setFamilyMembers(updatedFamilyMembers);
        setEmployeeId(EmployeeId);
      } else if (response.status === 404) {
        toast.warning("Data not found");
        setFamilyMembers([
          {
            relation: "familyMembers",
            members: [
              {
                relationName: "",
                name: "",
                dob: "",
                Age: "",
                aadharNo: "",
                sex: "",
                nationality: "",
                CRPNo: "",
                CRP_ExpiryDate: "",
                passportNo: "",
                passportExpiryDate: "",
                visaEntitled: "",
                visaExpiryDate: "",
                airTicketEntitled: "",
                keyfield: "",
              },
            ],
          },
        ]);
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to insert sales data");
        console.error(errorResponse.details || errorResponse.message);
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error("Error inserting data: " + error.message);
    }
  };

  const filteredOptionrelation = relativedrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionSex = sexDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionNationality = nationalityDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionBoolean = booleanDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionManager = Managerdrop.map((option) => ({
    value: option.EmployeeId,
    label: `${option.EmployeeId}-${option.full_name}`,
  }));

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/ESSManager`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
        Location_Code: sessionStorage.getItem('selectedLocationCode'),
      }),
    })
      .then((response) => response.json())
      .then(setManagerdrop)
      .catch((error) => console.error("Error fetching warehouse:", error));
  }, []);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getrelation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((data) => data.json())
      .then((val) => setrelationdrop(val));
  }, []);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getBool`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((data) => data.json())
      .then((val) => setBooleanDrop(val));
  }, []);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getSex`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((data) => data.json())
      .then((val) => setSexDrop(val));
  }, []);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getNationality`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((data) => data.json())
      .then((val) => setNationalityDrop(val));
  }, []);

  const handleChangeRelation = (selectedRelation, relation, index) => {
    setFamilyMembers((prevDocuments) =>
      prevDocuments.map((doc) =>
        doc.relation === relation
          ? {
            ...doc,
            members: doc.members.map((member, i) =>
              i === index
                ? {
                  ...member,
                  relationName: selectedRelation
                    ? selectedRelation.value
                    : "",
                  selectRelation: selectedRelation,
                }
                : member,
            ),
          }
          : doc,
      ),
    );
  };

  const handleChangeAirTicket = (selectedAirTicket, relation, index) => {
    setFamilyMembers((prevDocuments) =>
      prevDocuments.map((doc) =>
        doc.relation === relation
          ? {
            ...doc,
            members: doc.members.map((member, i) =>
              i === index
                ? {
                  ...member,
                  airTicketEntitled: selectedAirTicket
                    ? selectedAirTicket.value
                    : "",
                  selectAirTicket: selectedAirTicket,
                }
                : member,
            ),
          }
          : doc,
      ),
    );
  };

  const handleChangeVisa = (selectedVisa, relation, index) => {
    setFamilyMembers((prevDocuments) =>
      prevDocuments.map((doc) =>
        doc.relation === relation
          ? {
            ...doc,
            members: doc.members.map((member, i) =>
              i === index
                ? {
                  ...member,
                  visaEntitled: selectedVisa ? selectedVisa.value : "",
                  selectVisa: selectedVisa,
                }
                : member,
            ),
          }
          : doc,
      ),
    );
  };

  const handleChangeSex = (selectedSex, relation, index) => {
    setFamilyMembers((prevDocuments) =>
      prevDocuments.map((doc) =>
        doc.relation === relation
          ? {
            ...doc,
            members: doc.members.map((member, i) =>
              i === index
                ? {
                  ...member,
                  sex: selectedSex ? selectedSex.value : "",
                  selectSex: selectedSex,
                }
                : member,
            ),
          }
          : doc,
      ),
    );
  };

  const handleChangeNationality = (selectedNationality, relation, index) => {
    setFamilyMembers((prevDocuments) =>
      prevDocuments.map((doc) =>
        doc.relation === relation
          ? {
            ...doc,
            members: doc.members.map((member, i) =>
              i === index
                ? {
                  ...member,
                  nationality: selectedNationality
                    ? selectedNationality.value
                    : "",
                  selectNationality: selectedNationality,
                }
                : member,
            ),
          }
          : doc,
      ),
    );
  };

  const handleChangeRepManager = (selectedRepManager, relation, index) => {
    setFamilyMembers((prevDocuments) =>
      prevDocuments.map((doc) =>
        doc.relation === relation
          ? {
            ...doc,
            members: doc.members.map((member, i) =>
              i === index
                ? {
                  ...member,
                  RepManager: selectedRepManager
                    ? selectedRepManager.value
                    : "",
                  selectRepManager: selectedRepManager,
                }
                : member,
            ),
          }
          : doc,
      ),
    );
  };

  const reloadGridData = () => {
    window.location.reload();
  };

  const [open1, setOpen1] = React.useState(false);

  const handleFamilyDetails = () => {
    setOpen1(true);
  };

  const handleClose = () => {
    setOpen1(false);
  };

  const handleDateChange = (e, relation, idx) => {
    const selectedDate = e.target.value;
    const today = new Date();
    const dob = new Date(selectedDate);

    if (selectedDate > today.toISOString().split("T")[0]) {
      toast.warning("Future dates are not allowed!");
      return;
    }

    // Calculate age
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--; // Adjust age if birthday hasn't occurred yet this year
    }

    // Update both DOB and Age
    RelationInputChange(relation, idx, "dob", selectedDate);
    RelationInputChange(relation, idx, "Age", age);
  };

  // useEffect(() => {
  //   if (location.state) {
  //     if (location.state.employeeId) {
  //       setEmployeeId(location.state.employeeId);
  //       handleEmployeeFamily(location.state.employeeId);
  //     }
  //     if (location.state.firstName) {
  //       setFirst_Name(location.state.firstName);
  //     }
  //     if (location.state.department_id) {
  //       setdepartment_id(location.state.department_id);
  //     }
  //     if (location.state.designation_id) {
  //       setdesignation_id(location.state.designation_id);
  //     }
  //   }
  // }, [location.state]);

  return (
    <div class="container-fluid Topnav-screen ">
      {loading && <LoadingScreen />}
      <ToastContainer
        position="top-right"
        className="toast-design"
        theme="colored"
      />
      <div className="shadow-lg p-1 bg-body-tertiary rounded main-header-box">
        <div className="header-flex">
          <h1 className="page-title">Family</h1>

          <div className="action-wrapper desktop-actions">
            {saveButtonVisible && ["add", "all permission"].some((permission) => familyPermissions.includes(permission)) && (
              <div className="action-icon add" onClick={handleSave}>
                <span className="tooltip">Save</span>
                <i class="fa-solid fa-floppy-disk"></i>
              </div>
            )}
            <div className="action-icon print" onClick={reloadGridData}>
              <span className="tooltip">Reload</span>
              <i className="fa-solid fa-arrow-rotate-right"></i>
            </div>
          </div>

          <div className="dropdown mobile-actions">
            <button
              className="btn btn-primary dropdown-toggle p-0"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="fa-solid fa-ellipsis-vertical"></i>
            </button>

            <ul className="dropdown-menu dropdown-menu-end text-center">
              {saveButtonVisible && ["add", "all permission"].some((p) => familyPermissions.includes(p)) && (
                <li>
                  <button className="dropdown-item" onClick={handleSave}>
                    <i className="fa-solid fa-floppy-disk add fs-4"></i>
                  </button>
                </li>
              )}

              <li>
                <button className="dropdown-item" onClick={reloadGridData}>
                  <i className="fa-solid fa-arrow-rotate-right text-dark fs-4"></i>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <TabButtons
        tabs={tabs}
        activeTab={activeTab}
        onTabClick={handleTabClick}
      />

      {familyMembers.map((relationGroup, relationIndex) => (
        <div
          key={relationIndex}
          className="shadow-lg p-2 bg-light rounded mt-2 container-form-box"
        >
          {relationGroup.members.map((member, index) => (
            <div key={index} className="row g-3">
              <div className="col-md-1">
                <div className="inputGroup">
                  <button
                    type="button"
                    className="btn btn-primary ms-3"
                    title="Add Member"
                    onClick={() => addRow(relationGroup.relation)}
                  >
                    <i className="fa-solid fa-circle-plus"></i>
                  </button>
                  {relationGroup.members.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-danger"
                      title="Delete Member"
                      onClick={() => deleteRow(relationGroup.relation, index)}
                    >
                      <i className="fa-regular fa-trash-can"></i>
                    </button>
                  )}
                </div>
              </div>

              <div className="col-md-2">
                <div
                  className={`inputGroup selectGroup 
      ${member.selectRelation ? "has-value" : ""} 
      ${isSelectRelation[index] ? "is-focused" : ""}`}
                  title="Please Select the Relation"
                >
                  <Select
                    placeholder=" "
                    classNamePrefix="react-select"
                    isClearable
                    value={member.selectRelation}
                    options={filteredOptionrelation}
                    onFocus={() =>
                      setIsSelectRelation((prev) => ({
                        ...prev,
                        [index]: true,
                      }))
                    }
                    onBlur={() =>
                      setIsSelectRelation((prev) => ({
                        ...prev,
                        [index]: false,
                      }))
                    }
                    onChange={(selectedRelation) =>
                      RelationInputChange(
                        relationGroup.relation,
                        index,
                        "selectRelation", // ✅ IMPORTANT (match state)
                        selectedRelation,
                      )
                    }
                  />

                  <label
                    className={`floating-label ${error && !member.selectRelation ? "text-danger" : ""
                      }`}
                  >
                    Relation <span className="text-danger">*</span>
                  </label>
                </div>
              </div>

              <div className="col-md-2">
                <div className="inputGroup">
                  <input
                    type="text"
                    className="exp-input-field form-control"
                    title="Please Enter the Name"
                    placeholder=" "
                    autoComplete="off"
                    value={member.name}
                    pattern="[A-Za-z]+"
                    maxLength={250}
                    onChange={(e) => {
                      const onlyLetters = e.target.value.replace(
                        /[^A-Za-z\s]/g,
                        "",
                      );
                      RelationInputChange(
                        relationGroup.relation,
                        index,
                        "name",
                        onlyLetters,
                      );
                    }}
                  />

                  <label
                    className={`exp-form-labels ${error && !member.name ? "text-danger" : ""
                      }`}
                  >
                    Name <span className="text-danger">*</span>
                  </label>
                </div>
              </div>

              <div className="col-md-2">
                <div className="inputGroup">
                  <input
                    type="date"
                    className="exp-input-field form-control"
                    title="Please Enter the Date of Birth"
                    placeholder=" "
                    autoComplete="off"
                    value={member.dob}
                    max={new Date().toISOString().split("T")[0]} // Restrict future dates
                    onChange={(e) =>
                      handleDateChange(e, relationGroup.relation, index)
                    }
                  />
                  <label
                    className={`exp-form-labels ${error && !member.dob ? "text-danger" : ""}`}
                  >
                    DOB<span className="text-danger">*</span>
                  </label>
                </div>
              </div>

              <div className="col-md-2">
                <div className="inputGroup">
                  <input
                    type="text"
                    className="exp-input-field form-control"
                    title="Please Enter the Age"
                    value={member.Age}
                    placeholder=" "
                    maxLength={3}
                    autoComplete="off"
                    readOnly
                    inputMode="numeric"
                    pattern="[0-9]*"
                  // onChange={(e) => RelationInputChange(relationGroup.relation, index, 'Age', e.target.value)}
                  />
                  <label
                    for="cno"
                    className={`exp-form-labels ${error && !member.Age ? "text-danger" : ""}`}
                  >
                    Age<span className="text-danger">*</span>
                  </label>
                </div>
              </div>

              <div className="col-md-2">
                <div className="inputGroup">
                  <input
                    type="text"
                    className="exp-input-field form-control"
                    title="Please Enter the Aadhar No"
                    value={member.aadharNo}
                    maxLength={12}
                    placeholder=" "
                    autoComplete="off"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        RelationInputChange(
                          relationGroup.relation,
                          index,
                          "aadharNo",
                          value,
                        );
                      }
                    }}
                  />
                  <label for="cno" className="exp-form-labels">
                    Aadhaar No
                  </label>
                </div>
              </div>

              <div className="col-md-2">
                <div
                  className={`inputGroup selectGroup 
                  ${member.selectSex ? "has-value" : ""} 
                  ${isSelectSex[index] ? "is-focused" : ""}`}
                  title="Please Select the Sex"
                >
                  <Select
                    placeholder=" "
                    onFocus={() =>
                      setIsSelectSex((prev) => ({ ...prev, [index]: true }))
                    }
                    onBlur={() =>
                      setIsSelectSex((prev) => ({ ...prev, [index]: false }))
                    }
                    classNamePrefix="react-select"
                    isClearable
                    value={member.selectSex}
                    options={filteredOptionSex}
                    maxLength={50}
                    onChange={(selectedSex) =>
                      handleChangeSex(
                        selectedSex,
                        relationGroup.relation,
                        index,
                      )
                    }
                  />
                  <label
                    for="cno"
                    className={`floating-label ${error && !member.sex ? "text-danger" : ""}`}
                  >
                    Sex
                  </label>
                </div>
              </div>

              <div className="col-md-2">
                <div
                  className={`inputGroup selectGroup 
                  ${member.selectNationality ? "has-value" : ""} 
                  ${isSelectNationality[index] ? "is-focused" : ""}`}
                  title="Please Select the Nationality"
                >
                  <Select
                    placeholder=" "
                    onFocus={() =>
                      setIsSelectNationality((prev) => ({
                        ...prev,
                        [index]: true,
                      }))
                    }
                    onBlur={() =>
                      setIsSelectNationality((prev) => ({
                        ...prev,
                        [index]: false,
                      }))
                    }
                    classNamePrefix="react-select"
                    isClearable
                    value={member.selectNationality}
                    options={filteredOptionNationality}
                    maxLength={50}
                    onChange={(selectNationality) =>
                      handleChangeNationality(
                        selectNationality,
                        relationGroup.relation,
                        index,
                      )
                    }
                  />
                  <label
                    for="cno"
                    className={`floating-label ${error && !member.nationality ? "text-danger" : ""}`}
                  >
                    Nationality
                  </label>
                </div>
              </div>

              <div className="col-md-2">
                <div className="inputGroup">
                  <input
                    type="text"
                    className="exp-input-field form-control"
                    title="Please Enter the CRP No"
                    value={member.CRPNo}
                    maxLength={30}
                    placeholder=" "
                    autoComplete="off"
                    onChange={(e) =>
                      RelationInputChange(
                        relationGroup.relation,
                        index,
                        "CRPNo",
                        e.target.value,
                      )
                    }
                  />
                  <label for="cno" className="exp-form-labels">
                    CRP No
                  </label>
                </div>
              </div>

              <div className="col-md-2">
                <div className="inputGroup">
                  <input
                    type="date"
                    className="exp-input-field form-control"
                    title="Please Enter the CRP Expiry Date"
                    value={member.CRP_ExpiryDate}
                    maxLength={18}
                    placeholder=" "
                    autoComplete="off"
                    onChange={(e) =>
                      RelationInputChange(
                        relationGroup.relation,
                        index,
                        "CRP_ExpiryDate",
                        e.target.value,
                      )
                    }
                  />
                  <label for="cno" className="exp-form-labels">
                    CRP Expiry Date
                  </label>
                </div>
              </div>

              <div className="col-md-2">
                <div className="inputGroup">
                  <input
                    type="text"
                    className="exp-input-field form-control"
                    title="Please Enter the Passport No"
                    value={member.passportNo}
                    maxLength={9}
                    placeholder=" "
                    autoComplete="off"
                    onChange={(e) =>
                      RelationInputChange(
                        relationGroup.relation,
                        index,
                        "passportNo",
                        e.target.value,
                      )
                    }
                  />
                  <label for="cno" className="exp-form-labels">
                    Passport No
                  </label>
                </div>
              </div>

              <div className="col-md-2">
                <div className="inputGroup">
                  <input
                    type="date"
                    className="exp-input-field form-control"
                    title="Please Enter the Passport Expiry Date"
                    value={member.passportExpiryDate}
                    maxLength={18}
                    placeholder=" "
                    autoComplete="off"
                    onChange={(e) =>
                      RelationInputChange(
                        relationGroup.relation,
                        index,
                        "passportExpiryDate",
                        e.target.value,
                      )
                    }
                  />
                  <label for="cno" className="exp-form-labels">
                    Passport Expiry Date
                  </label>
                </div>
              </div>

              <div className="col-md-2">
                <div
                  className={`inputGroup selectGroup 
                  ${member.selectVisa ? "has-value" : ""} 
                  ${isSelectVisa[index] ? "is-focused" : ""}`}
                  title="Please Select if Visa Entitled"
                >
                  <Select
                    placeholder=" "
                    onFocus={() =>
                      setIsSelectVisa((prev) => ({ ...prev, [index]: true }))
                    }
                    onBlur={() =>
                      setIsSelectVisa((prev) => ({ ...prev, [index]: false }))
                    }
                    classNamePrefix="react-select"
                    isClearable
                    value={member.selectVisa}
                    options={filteredOptionBoolean}
                    maxLength={50}
                    onChange={(selectVisa) =>
                      handleChangeVisa(
                        selectVisa,
                        relationGroup.relation,
                        index,
                      )
                    }
                  />
                  <label for="cno" className={`floating-label`}>
                    Visa Entitled
                  </label>
                </div>
              </div>

              <div className="col-md-2">
                <div className="inputGroup">
                  <input
                    type="date"
                    className="exp-input-field form-control"
                    title="Please Enter the Visa Expiry Date"
                    value={member.visaExpiryDate}
                    maxLength={18}
                    placeholder=" "
                    autoComplete="off"
                    onChange={(e) =>
                      RelationInputChange(
                        relationGroup.relation,
                        index,
                        "visaExpiryDate",
                        e.target.value,
                      )
                    }
                  />
                  <label for="cno" className="exp-form-labels">
                    Visa Expiry Date
                  </label>
                </div>
              </div>

              <div className="col-md-2">
                <div
                  className={`inputGroup selectGroup 
                  ${member.selectAirTicket ? "has-value" : ""} 
                  ${isSelectAirTicket[index] ? "is-focused" : ""}`}
                  title="Please Select if Air Ticket Entitled"
                >
                  <Select
                    placeholder=" "
                    onFocus={() =>
                      setIsSelectAirTicket((prev) => ({
                        ...prev,
                        [index]: true,
                      }))
                    }
                    onBlur={() =>
                      setIsSelectAirTicket((prev) => ({
                        ...prev,
                        [index]: false,
                      }))
                    }
                    classNamePrefix="react-select"
                    isClearable
                    value={member.selectAirTicket}
                    options={filteredOptionBoolean}
                    maxLength={50}
                    onChange={(selectAirTicket) =>
                      handleChangeAirTicket(
                        selectAirTicket,
                        relationGroup.relation,
                        index,
                      )
                    }
                  />
                  <label for="cno" className={`floating-label`}>
                    Air Ticket Entitled
                  </label>
                </div>
              </div>

              <div className="col-md-2">
                <div className="inputGroup">
                  <input
                    id="passportNo"
                    className="exp-input-field form-control"
                    title="Please Enter the Purpose"
                    type="text"
                    placeholder=""
                    value={purpose}
                    onChange={(e) => setpurpose(e.target.value)}
                    maxLength={30}
                    autoComplete="off"
                  />
                  <label htmlFor="passportNo" className="exp-form-labels">
                    Purpose
                  </label>
                </div>
              </div>

              <div className="col-md-2">
                <div
                  className={`inputGroup selectGroup 
                  ${member.selectRepManager ? "has-value" : ""} 
                  ${isSelectRepManager[index] ? "is-focused" : ""}`}
                  title="Please Select the Reporting Manager"
                >
                  <Select
                    placeholder=" "
                    onFocus={() =>
                      setIsSelectRepManager((prev) => ({
                        ...prev,
                        [index]: true,
                      }))
                    }
                    onBlur={() =>
                      setIsSelectRepManager((prev) => ({
                        ...prev,
                        [index]: false,
                      }))
                    }
                    classNamePrefix="react-select"
                    isClearable
                    value={member.selectRepManager}
                    options={filteredOptionManager}
                    maxLength={50}
                    onChange={(selectRepManager) =>
                      handleChangeRepManager(
                        selectRepManager,
                        relationGroup.relation,
                        index,
                      )
                    }
                  />
                  <label for="cno" className={`floating-label`}>
                    Reporting Manager
                  </label>
                </div>
              </div>

            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
export default EmpFamPersonalDetail;
