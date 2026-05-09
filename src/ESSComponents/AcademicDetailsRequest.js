import React, { useState, useEffect, useRef } from "react";
import "../input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import TabButtons from "./Tabs";
import Select from "react-select";
import AcademicDetails from "./AcademicDetPopup.js";
import PdfPreview from "./PdfPreviewHelp";
import LoadingScreen from "../Loading";
import { showConfirmationToast } from "../ToastConfirmation";

const config = require("../Apiconfig");

function Input({}) {
  const [Academic, setAcademic] = useState([
    {
      relation: "Academic",
      members: [
        {
          academicName: "",
          major: "",
          institution: "",
          academicYear: "",
          document: null,
          documentUrl: "",
          keyfield: "",
          purpose: "",
          RepManager: "",
        },
      ],
    },
  ]);
  const [EmployeeId, setEmployeeId] = useState("");
  const [error, setError] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [document, setDocument] = useState("");
  const [documentUrl, setDocumentUrl] = useState({});
  const navigate = useNavigate();
  const created_by = sessionStorage.getItem("selectedUserCode");
  const [open, setOpen] = React.useState(false);
  const [saveButtonVisible, setSaveButtonVisible] = useState(true);
  const [isAcademicDataLoaded, setIsAcademicDataLoaded] = useState(false);
  const employeeIdRef = useRef(null);
  const [showAsterisk, setShowAsterisk] = useState(true);
  const [currentPdfUrl, setCurrentPdfUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const [First_Name, setFirst_Name] = useState("");
  const [department_id, setdepartment_id] = useState("");
  const [designation_id, setdesignation_id] = useState("");
  const [loading, setLoading] = useState(false);

  const [isSelectRepManager, setIsSelectRepManager] = useState({});
  const [Managerdrop, setManagerdrop] = useState([]);

  //code added by Pavun purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem("permissions")) || {};
  const academicPermissions = permissions
    .filter((permission) => permission.screen_type === "AcademicDet")
    .map((permission) => permission.permission_type.toLowerCase());

  const handlePdfClick = (url) => {
    setCurrentPdfUrl(url);
    setIsModalOpen(true); // Show the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentPdfUrl(null);
  };

  const employeeId = sessionStorage.getItem("selectedUserCode");
  useEffect(() => {
    handleAcademic(employeeId);
  }, []);

  const addRow = (relation) => {
    setAcademic((prev) =>
      prev.map((item) =>
        item.relation === relation
          ? {
              ...item,
              members: [
                ...item.members,
                {
                  academicName: "",
                  major: "",
                  institution: "",
                  academicYear: "",
                  document: null,
                  documentUrl: "",
                  keyfield: "",
                  purpose: "",
                },
              ],
            }
          : item,
      ),
    );
  };

  const deleteRow = (relation, index) => {
    setAcademic((prev) =>
      prev.map((item) =>
        item.relation === relation
          ? { ...item, members: item.members.filter((_, i) => i !== index) }
          : item,
      ),
    );
  };

  //   const handleSave = async () => {
  //     if (!EmployeeId) {
  //       setError(true);
  //       toast.warning("Error: Missing required fields");
  //       return;
  //     }

  //     for (const relationGroup of Academic) {
  //       for (const member of relationGroup.members) {
  //         if (
  //           !member.academicName ||
  //           !member.major ||
  //           !member.institution ||
  //           !member.academicYear ||
  //           !member.purpose
  //         ) {
  //           setError(true);
  //           toast.warning("Error: Missing required fields");
  //           return;
  //         }
  //       }
  //     }

  //     const employeeData = await Promise.all(
  //       Academic.flatMap((relationGroup) =>
  //         relationGroup.members.map(async (member) => {

  //   let fileBase64 = null;

  //   if (member.document) {
  //     const fileSize = member.document.size;
  //     const maxSize = 1 * 1024 * 1024;

  //     if (fileSize > maxSize) {
  //       toast.warning("File size exceeds 1MB");
  //       return null;
  //     }

  //     fileBase64 = await convertToBase64(member.document);
  //   }

  //   return {
  //     EmployeeId: EmployeeId,
  //     academicName: member.academicName,
  //     major: member.major,
  //     institution: member.institution,
  //     academicYear: member.academicYear,
  //     document: fileBase64,
  //     company_code: sessionStorage.getItem("selectedCompanyCode"),
  //     created_by: sessionStorage.getItem("selectedUserCode"),
  //     purpose: member.purpose
  //   };

  // })
  //       )

  //     );
  //     setError(false);
  //     setLoading(true);

  //     try {
  //       const response = await fetch(
  //         `${config.apiBaseUrl}/AcademicDetailsRequest`,
  //         {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify({ employeeData }),
  //         },
  //       );
  //       if (response.ok) {
  //         toast.success("Data inserted successfully!", {
  //           onClose: () => window.location.reload(),
  //         });
  //       } else {
  //         const errorResponse = await response.json();
  //         console.error(errorResponse.message);
  //         toast.warning(errorResponse.message, {});
  //       }
  //     } catch (err) {
  //       console.error("Error delete data:", err);
  //       toast.error("Error delete data: " + err.message, {});
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  const filteredOptionManager = Managerdrop.map((option) => ({
    value: option.EmployeeId,
    label: `${option.EmployeeId}-${option.full_name}`,
  }));

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/ESSManager`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((response) => response.json())
      .then(setManagerdrop)
      .catch((error) => console.error("Error fetching warehouse:", error));
  }, []);

  const handleChangeRepManager = (selectedRepManager, relation, index) => {
    setAcademic((prevDocuments) =>
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

          const headerPayload = {
            company_code,
            EmployeeId,
            purpose: Academic[0]?.members[0]?.purpose,
            request_status: "Pending",
            created_by,
          };

    const headerRes = await fetch(`${config.apiBaseUrl}/AcademicRequestHdr`,
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

          // ✅ ONLY DB VALUE
          const info_request_id = headerResult?.[0]?.info_request_id;

          if (!info_request_id) {
            throw new Error("info_request_id not returned from backend");
          }

          await saveAcademicDetails(info_request_id);

          toast.success("Data inserted successfully!", {
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
  const saveAcademicDetails = async (info_request_id) => {
    try {
      const company_code = sessionStorage.getItem("selectedCompanyCode");
      const created_by = sessionStorage.getItem("selectedUserCode");

      const detailsData = await Promise.all(
        Academic.flatMap((group) =>
          group.members.map(async (member) => {
            if (
              !member.academicName ||
              !member.major ||
              !member.institution ||
              !member.academicYear
            ) {
              return null;
            }

            let fileBase64 = null;

            if (member.document) {
              if (member.document.size > 1 * 1024 * 1024) {
                toast.warning("File size exceeds 1MB");
                return null;
              }
              fileBase64 = await convertToBase64(member.document);
            }

            return {
              info_request_id,
              company_code,
              EmployeeId,
              request_status: "Pending",
              academicName: member.academicName,
              major: member.major,
              institution: member.institution,
              academicYear: member.academicYear,
              RepManager: member.RepManager,
              document: fileBase64,
              created_by,
            };
          }),
        ),
      );

      const filteredData = detailsData.filter(Boolean);

      if (filteredData.length === 0) {
        toast.warning("No valid academic details found");
        return;
      }

      const res = await fetch(`${config.apiBaseUrl}/AcademicRequestDetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ detailsData: filteredData }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }

      console.log("Academic Details inserted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Error inserting details: " + error.message);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]); // Remove metadata prefix
      reader.onerror = (error) => reject(error);
    });
  };

  const convertBufferToBlobUrlAndFile = (
    buffer,
    fileName = "document.pdf",
    mimeType = "application/pdf",
  ) => {
    if (buffer && buffer.type === "Buffer") {
      const byteArray = new Uint8Array(buffer.data);
      const blob = new Blob([byteArray], { type: mimeType });
      const blobUrl = URL.createObjectURL(blob);
      const file = new File([blob], fileName, { type: mimeType });
      return { blobUrl, file };
    }
    return { blobUrl: null, file: null };
  };

  const handleAcademic = async (code) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getAcademicDetails`, {
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
        const searchData = await response.json();
        setSaveButtonVisible(true);
        setShowAsterisk(false);
        setIsAcademicDataLoaded(true);
        const [{ EmployeeId, department_id, designation_id, First_Name }] =
          searchData;
        setdepartment_id(department_id);
        setdesignation_id(designation_id);
        setFirst_Name(First_Name);

        const updatedFamilyMembers = searchData.reduce((acc, item) => {
          const {
            academicName,
            academicYear,
            document,
            institution,
            keyfield,
            major,
            purpose,
          } = item;

          console.log(document);
          const formattedDOB = formatDate(academicYear);

          let documentUrl = null;
          let documentFile = null;

          if (document) {
            const { blobUrl, file } = convertBufferToBlobUrlAndFile(document);
            if (blobUrl) {
              documentUrl = blobUrl;
            }

            if (file) {
              documentFile = file;
            }
          }

          const memberData = {
            academicName: academicName,
            major: major,
            institution: institution,
            academicYear: formattedDOB,
            keyfield: keyfield,
            documentUrl: documentUrl,
            document: documentFile,
            purpose: purpose,
          };

          const existingRelation = acc.find(
            (group) => group.relation === academicName,
          );

          if (existingRelation) {
            existingRelation.members.push(memberData);
          } else {
            acc.push({
              relation: academicName,
              members: [memberData],
            });
          }
          return acc;
        }, []);

        setAcademic(updatedFamilyMembers);
        setEmployeeId(EmployeeId);
      } else if (response.status === 404) {
        toast.warning("Data not found");
        setAcademic([
          {
            relation: "Academic",
            members: [
              {
                academicName: "",
                major: "",
                institution: "",
                academicYear: "",
                document: null,
                documentUrl: "",
                keyfield: "",
                purpose: "",
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

  const RelationInputChange = (relation, index, field, value) => {
    setAcademic((prev) =>
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

  const handleFileChange = (event, relation, index) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      const fileUrl = URL.createObjectURL(file);

      setAcademic((prevDocuments) =>
        prevDocuments.map((doc) =>
          doc.relation === relation
            ? {
                ...doc,
                members: doc.members.map((member, i) =>
                  i === index
                    ? {
                        ...member,
                        document: file,
                        documentUrl: fileUrl,
                      }
                    : member,
                ),
              }
            : doc,
        ),
      );

      setDocumentUrl((prev) => ({
        ...prev,
        [index]: fileUrl,
      }));
    } else {
      toast.warning("Please upload a valid PDF file.");
      event.target.value = "";
    }
  };

  const AcademicDet = () => {
    navigate("/AcademicDetReq");
  };
  const Insurance1 = () => {
    navigate("/EmpFamPersonalDetail");
  };
  const EmployeeLoan = () => {
    navigate("/ManualEmployeeInfo");
  };
  const Documents = () => {
    navigate("/EmpDocumentReq");
  };
  const EmployeeAssets = () => {
    navigate("/EmpAssetsRequest");
  };

  const [activeTab, setActiveTab] = useState("Academic Details");
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
        break;
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

  const reloadGridData = () => {
    window.location.reload();
  };

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (e, relation, idx) => {
    const selectedDate = new Date(e.target.value); // Convert to Date object
    const today = new Date(); // Get today's date

    if (selectedDate > today) {
      toast.warning("Future dates are not allowed!");
    } else {
      RelationInputChange(relation, idx, "academicYear", e.target.value);
    }
  };

  const handleRemovePdf = (relation, index) => {
    setAcademic((prev) =>
      prev.map((doc) =>
        doc.relation === relation
          ? {
              ...doc,
              members: doc.members.map((m, i) =>
                i === index ? { ...m, document: null, documentUrl: "" } : m,
              ),
            }
          : doc,
      ),
    );
  };

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
          <h1 className="page-title">Academic Details</h1>

          <div className="action-wrapper desktop-actions">
            {saveButtonVisible &&
              ["add", "all permission"].some((permission) =>
                academicPermissions.includes(permission),
              ) && (
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
              className="btn btn-primary dropdown-toggle p-1"
              data-bs-toggle="dropdown"
            >
              <i className="fa-solid fa-list"></i>
            </button>

            <ul className="dropdown-menu dropdown-menu-end text-center">
              {saveButtonVisible &&
                ["add", "all permission"].some((p) =>
                  academicPermissions.includes(p),
                ) && (
                  <li className="dropdown-item" onClick={handleSave}>
                    <i className="fa-solid fa-floppy-disk text-success fs-4"></i>
                  </li>
                )}

              <li className="dropdown-item" onClick={reloadGridData}>
                <i className="fa-solid fa-arrow-rotate-right"></i>
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

      {Academic.map((relationGroup, relationIndex) => (
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
                    title="Add Details"
                    onClick={() => addRow(relationGroup.relation)}
                  >
                    <i className="fa-solid fa-circle-plus"></i>
                  </button>
                  {relationGroup.members.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-danger"
                      title="Delete Details"
                      onClick={() => deleteRow(relationGroup.relation, index)}
                    >
                      <i className="fa-regular fa-trash-can"></i>
                    </button>
                  )}
                </div>
              </div>

              <div className="col-md-2">
                <div className="inputGroup">
                  <input
                    type="text"
                    className="exp-input-field form-control"
                    title="Please Enter the Academic Name"
                    value={member.academicName}
                    placeholder=" "
                    autoComplete="off"
                    maxLength={50}
                    onChange={(e) =>
                      RelationInputChange(
                        relationGroup.relation,
                        index,
                        "academicName",
                        e.target.value,
                      )
                    }
                  />
                  <label
                    className={`exp-form-labels ${error && !member.academicName ? "text-danger" : ""}`}
                  >
                    Academic Name<span className="text-danger">*</span>
                  </label>
                </div>
              </div>

              <div className="col-md-2">
                <div className="inputGroup">
                  <input
                    type="text"
                    className="exp-input-field form-control"
                    value={member.major}
                    maxLength={125}
                    placeholder=" "
                    autoComplete="off"
                    title="Please Enter the Major"
                    onChange={(e) =>
                      RelationInputChange(
                        relationGroup.relation,
                        index,
                        "major",
                        e.target.value,
                      )
                    }
                  />
                  <label
                    className={`exp-form-labels ${error && !member.major ? "text-danger" : ""}`}
                  >
                    Major<span className="text-danger">*</span>
                  </label>
                </div>
              </div>

              <div className="col-md-2">
                <div className="inputGroup">
                  <input
                    type="text"
                    className="exp-input-field form-control"
                    title="Please Enter the Institution"
                    value={member.institution}
                    maxLength={225}
                    placeholder=" "
                    autoComplete="off"
                    onChange={(e) =>
                      RelationInputChange(
                        relationGroup.relation,
                        index,
                        "institution",
                        e.target.value,
                      )
                    }
                  />
                  <label
                    className={`exp-form-labels ${error && !member.institution ? "text-danger" : ""}`}
                  >
                    Institution<span className="text-danger">*</span>
                  </label>
                </div>
              </div>

              <div className="col-md-2">
                <div className="inputGroup">
                  <input
                    id="fdate"
                    class="exp-input-field form-control"
                    title="Please Enter the Academic Year"
                    type="date"
                    placeholder=" "
                    autoComplete="off"
                    // onChange={(e) => RelationInputChange(relationGroup.relation, index, 'academicYear', e.target.value)}
                    value={member.academicYear}
                    max={new Date().toISOString().split("T")[0]} // Restrict future dates
                    onChange={(e) =>
                      handleDateChange(e, relationGroup.relation, index)
                    }
                  />
                  <label
                    for="add1"
                    className={`exp-form-labels ${error && !member.relationName ? "text-danger" : ""}`}
                  >
                    Academic Year<span className="text-danger">*</span>
                  </label>
                </div>
              </div>

              <div className="col-md-2">
                <div className="inputGroup">
                  <input
                    type="text"
                    className="exp-input-field form-control"
                    title="Please Enter the Purpose"
                    value={member.purpose}
                    placeholder=" "
                    autoComplete="off"
                    maxLength={50}
                    onChange={(e) =>
                      RelationInputChange(
                        relationGroup.relation,
                        index,
                        "purpose",
                        e.target.value,
                      )
                    }
                  />
                  <label className={`exp-form-labels`}>Purpose</label>
                </div>
              </div>

              <div className="col-md-2">
              <div
                className={`inputGroup selectGroup 
                ${member.selectRepManager ? "has-value" : ""} 
                ${isSelectRepManager[`${relationGroup.relation}-${index}`] ? "is-focused" : ""}`}
                title="Please Select the Reporting Manager"
              >
                <Select
                  placeholder=" "
                  onFocus={() =>
                    setIsSelectRepManager((prev) => ({
                      ...prev,
                      [`${relationGroup.relation}-${index}`]: true,
                    }))
                  }
                  onBlur={() =>
                    setIsSelectRepManager((prev) => ({
                      ...prev,
                      [`${relationGroup.relation}-${index}`]: false,
                    }))
                  }
                  classNamePrefix="react-select"
                  isClearable
                  value={member.selectRepManager}
                  options={filteredOptionManager}
                  onChange={(selectRepManager) =>
                    handleChangeRepManager(
                      selectRepManager,
                      relationGroup.relation,
                      index,
                    )
                  }
                />
                <label className="floating-label">Reporting Manager</label>
              </div>
            </div>

              <div className="col-md-2">
                <div className="inputGroup">
                  <div className="image-upload-container">
                    {member.documentUrl ? (
                      <div
                        className="image-preview-box"
                        onClick={() => handlePdfClick(member.documentUrl)}
                      >
                        <iframe
                          src={member.documentUrl}
                          title="PDF Preview"
                          className="pdf-inline-preview"
                        ></iframe>

                        <button
                          type="button"
                          className="delete-image-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemovePdf(relationGroup.relation, index);
                          }}
                        >
                          &times;
                        </button>
                      </div>
                    ) : (
                      <div className="upload-placeholder-box">
                        <div className="upload-icon-text">
                          <i className="fa-solid fa-file-arrow-up upload-icon me-1"></i>
                          <span>Upload Document</span>
                        </div>
                      </div>
                    )}

                    <input
                      type="file"
                      id={`upload-${index}`}
                      className={`hidden-file-input 
                      ${member.documentUrl ? "disable-overlay" : ""}`}
                      accept="application/pdf"
                      onChange={(event) =>
                        handleFileChange(event, relationGroup.relation, index)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
      <div>
        <PdfPreview
          open={isModalOpen}
          pdfUrl={currentPdfUrl}
          handleClose={handleCloseModal}
        />
      </div>
    </div>
  );
}
export default Input;
