import React, { useState, useEffect } from "react";
import "../input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import TabButtons from "./Tabs";
import PdfPreview from './PdfPreviewHelp';
import Select from 'react-select';
import DocumentPopup from "./DocumentPopup.js";
import { showConfirmationToast } from '../ToastConfirmation';
import LoadingScreen from '../Loading';
import DocumentImage from '../DefaultImages/Document.jpg';

const config = require('../Apiconfig');

function EmpDocumentReq({ }) {
  const [EmployeeId, setEmployeeId] = useState("");
  const [error, setError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPdfUrl, setCurrentPdfUrl] = useState(null);
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([
    {
      relation: 'documents',
      members: [{
        documentName: '',
        document: null,
        documentUrl: DocumentImage,
        keyfield: '',
        RepManager: '',
        selectRepManager: null,
        isDefaultImage: true,
      }]
    }
  ]);
  // const [documents, setDocuments] = useState([{ relation: 'documents', members: [{ documentName: '', document: null, documentUrl: '', keyfield:'' }] }]);
  const [documentNameDrop, setDocumentNameDrop] = useState([]);
  const [documentUrl, setDocumentUrl] = useState({});
  const [isAcademicDataLoaded, setIsAcademicDataLoaded] = useState(false);
  const [saveButtonVisible, setSaveButtonVisible] = useState(true);
  const [deleteError, setDeleteError] = useState("");
  const location = useLocation();
  const [First_Name, setFirst_Name] = useState('');
  const [department_id, setdepartment_id] = useState("");
  const [designation_id, setdesignation_id] = useState("");
  const [purpose, setpurpose] = useState("");

  const [isSelectDocument, setIsSelectDocument] = useState({});
  const [Managerdrop, setManagerdrop] = useState([]);
  const [isSelectRepManager, setIsSelectRepManager] = useState({});

  const [loading, setLoading] = useState(false);

  const employeeId = sessionStorage.getItem("selectedUserCode");
  useEffect(() => {
    handleRefNo(employeeId);
  }, []);

  //code added by Pavun purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem('permissions')) || {};
  const documentsPermissions = permissions
    .filter(permission => permission.screen_type === 'EmpDocumentReq')
    .map(permission => permission.permission_type.toLowerCase());

  const Location_Code = sessionStorage.getItem('selectedLocationCode')

  const handlePdfClick = (url) => {
    setCurrentPdfUrl(url);
    setIsModalOpen(true);  // Show the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentPdfUrl(null);
  };

  const AcademicDet = () => {
    navigate("/AcademicDetReq");
  };

  const Insurance1 = () => {
    navigate("/EmpFamPersonalDetail");
  };

  const Documents = () => {
    navigate("/EmpDocumentReq");
  };

  const EmployeeLoan = () => {
    navigate("/ManualEmployeeInfo");
  };

  const EmployeeAssets = () => {
    navigate("/EmpAssetsRequest");
  };

  const [activeTab, setActiveTab] = useState('Documents');
  const handleTabClick = (tabLabel) => {
    setActiveTab(tabLabel);

    switch (tabLabel) {
      case "Personal Details":
        EmployeeLoan();
        break;
      case 'Family':
        Insurance1();
        break;
      case 'Academic Details':
        AcademicDet();
        break;
      case 'Documents':
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
    { label: 'Personal Details' },
    { label: 'Family' },
    { label: 'Academic Details' },
    { label: 'Documents' },
    { label: "Assets" },
  ];

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]); // Remove metadata prefix
      reader.onerror = (error) => reject(error);
    });
  };

  const filteredOptionManager = Managerdrop.map((option) => ({
    value: option.EmployeeId,
    label: `${option.EmployeeId}-${option.full_name}`,
  }));

  const handleChangeRepManager = (
    selectedRepManager,
    relation,
    index
  ) => {
    setDocuments((prevDocuments) =>
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
                : member
            ),
          }
          : doc
      )
    );
  };

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/ESSManager`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
        Location_Code: sessionStorage.getItem('selectedLocationCode'),
      }),
    })
      .then((response) => response.json())
      .then(setManagerdrop)
      .catch((error) =>
        console.error("Error fetching manager:", error)
      );
  }, []);

  const handleSave = async () => {
    if (!EmployeeId) {
      toast.warning("Error: Missing required fields");
      return;
    }

        // Validate required fields
        setError(false);
        for (const group of documents) {
          for (const member of group.members) {
            if (
              !member.selectDocumentName ||
              !member.selectRepManager
            ) {
              setError(true);
              toast.warning("Please fill all required fields");
              return;
            }
          }
        }
        setError(false); 

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
            purpose,
            request_status: "Pending",
            created_by,
            Location_Code
          };

          const headerRes = await fetch(`${config.apiBaseUrl}/DocumentRequestHdr`,
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
          await saveDocumentDetails(info_request_id); // ✅ FIXED

          toast.success("Document request submitted successfully!", {
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
      }
    );
  };

  const saveDocumentDetails = async (info_request_id) => {
    try {
      const company_code = sessionStorage.getItem("selectedCompanyCode");
      const created_by = sessionStorage.getItem("selectedUserCode");

      // 🔥 Flatten documents → members
      const allRows = documents.flatMap(group => group.members);

      const detailsData = await Promise.all(
        allRows.map(async (row) => {
          // ❌ Skip empty rows
          if (!row.documentName || !row.document) {
            return null;
          }

          let base64File = null;

          if (row.document) {
            if (row.document.size > 2 * 1024 * 1024) {
              toast.warning(`File "${row.documentName}" exceeds 2MB`);
              return null;
            }

            base64File = await convertToBase64(row.document);
          }

          return {
            info_request_id,
            company_code,
            EmployeeId,
            request_status: "Pending",
            Location_Code,
            document_Name: row.documentName,
            document_files: base64File,
            RepManager: row.RepManager,
            created_by,
          };
        })
      );

      const filteredData = detailsData.filter(Boolean);

      // ❌ No valid rows
      if (filteredData.length === 0) {
        toast.warning("Please upload at least one document");
        return;
      }

      const res = await fetch(
        `${config.apiBaseUrl}/DocumentRequestDetails`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ detailsData: filteredData }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }

      console.log("Document details inserted successfully");

    } catch (error) {
      console.error(error);
      toast.error("Error inserting document details: " + error.message);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleRefNo(employeeId)
    }
  };

  const convertBufferToBlobUrlAndFile = (buffer, fileName = "document.pdf", mimeType = "application/pdf") => {
    if (buffer && buffer.type === "Buffer") {
      const byteArray = new Uint8Array(buffer.data);
      const blob = new Blob([byteArray], { type: mimeType });
      const blobUrl = URL.createObjectURL(blob);
      const file = new File([blob], fileName, { type: mimeType });
      return { blobUrl, file };
    }
    return { blobUrl: null, file: null };
  };

  const handleRefNo = async (code) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getempdoc`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ Id: code, company_code: sessionStorage.getItem("selectedCompanyCode"), })
      });

      if (response.ok) {
        const searchData = await response.json();
        const [{ employee_id, department_id, designation_id, First_Name }] = searchData;
        setdepartment_id(department_id);
        setdesignation_id(designation_id);
        setFirst_Name(First_Name);
        setSaveButtonVisible(true);
        setIsAcademicDataLoaded(true);

        const updatedDocument = searchData.reduce((acc, item) => {
          const { document_name, document_files, keyfield, RepManager } = item;

          console.log(document_files)
          let documentUrl = null;
          let documentFile = null;

          if (document_files) {
            const { blobUrl, file } = convertBufferToBlobUrlAndFile(document_files);
            if (blobUrl) {
              documentUrl = blobUrl;
            }

            if (file) {
              documentFile = file;
            }
          }

          console.log(documentUrl)

          const memberData = {
            documentName: document_name || "",
            selectDocumentName: document_name
              ? { value: document_name, label: document_name }
              : null,

            documentUrl: documentUrl || DocumentImage,
            document: documentFile,
            keyfield: keyfield,

            RepManager: RepManager || "",
            selectRepManager: RepManager
              ? filteredOptionManager.find(
                (opt) => opt.value === RepManager
              )
              : null,

            isDefaultImage: !documentFile
          };

          const existingRelation = acc.find(group => group.relation === document_name);

          if (existingRelation) {
            existingRelation.members.push(memberData);
          } else {
            acc.push({
              relation: document_name,
              members: [memberData]
            });
          }
          return acc;
        }, []);

        setDocuments(updatedDocument);
        setEmployeeId(employee_id);
      } else if (response.status === 404) {
        toast.warning('Data not found');

        setDocuments([
          {
            relation: 'documents',
            members: [{
              documentName: '',
              document: null,
              documentUrl: DocumentImage,
              keyfield: '',
              RepManager: '',
              selectRepManager: null,
              isDefaultImage: true,
            }]
          }
        ]);
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to insert sales data");
        console.error(errorResponse.details || errorResponse.message);
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error('Error inserting data: ' + error.message);

      setDocuments([
        {
          relation: 'documents',
          members: [{
            documentName: '',
            document: null,
            documentUrl: DocumentImage,
            keyfield: '',
            RepManager: '',
            selectRepManager: null,
            isDefaultImage: true,
          }]
        }
      ]);
    }
  };

  const reloadGridData = () => {
    window.location.reload();
  };

  const handleAddRow = (relation) => {
    setDocuments((prev) =>
      prev.map((item) =>
        item.relation === relation
          ? {
            ...item,
            members: [
              ...item.members,
              {
                documentName: '',
                document: null,
                documentUrl: DocumentImage,
                keyfield: '',
                RepManager: '',
                selectRepManager: null,
                isDefaultImage: true,
              }
            ]
          }
          : item
      )
    );
  };

  const handleDeleteRow = (relation, index) => {
    setDocuments((prev) =>
      prev.map((item) =>
        item.relation === relation
          ? { ...item, members: item.members.filter((_, i) => i !== index) }
          : item
      )
    );
  };

  const handleChangeDocumentName = (selectDocumentName, relation, index) => {
    setDocuments((prevDocuments) =>
      prevDocuments.map((doc) =>
        doc.relation === relation
          ? {
            ...doc,
            members: doc.members.map((member, i) =>
              i === index
                ? {
                  ...member,
                  documentName: selectDocumentName
                    ? selectDocumentName.value
                    : "",
                  selectDocumentName: selectDocumentName,
                }
                : member
            ),
          }
          : doc
      )
    );
  };

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getDocument`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),

      }),
    })

      .then((data) => data.json())
      .then((val) => setDocumentNameDrop(val));
  }, []);

  const filteredOptionDocumentName = Array.isArray(documentNameDrop)
    ? documentNameDrop.map((option) => ({
      value: option.attributedetails_name,
      label: option.attributedetails_name,
    }))
    : [];

  // const handleFileChange = (event, index) => {
  //   const file = event.target.files[0];
  //   if (file && file.type === 'application/pdf') {
  //     const fileUrl = URL.createObjectURL(file);

  //     setDocuments((prevDocuments) => {
  //       const updatedDocuments = [...prevDocuments];
  //       updatedDocuments[0].members[index].document = file;
  //       updatedDocuments[0].members[index].documentUrl = fileUrl;
  //       return updatedDocuments;
  //     });

  //     setDocumentUrl((prev) => ({
  //       ...prev,
  //       [index]: fileUrl,
  //     }));
  //   } else {
  //     toast.warning('Please upload a valid PDF file.');
  //     event.target.value = '';
  //   }
  // };

  const handleFileChange = (event, relation, index) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      const fileUrl = URL.createObjectURL(file);

      setDocuments((prevDocuments) =>
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
                    isDefaultImage: false,
                  }
                  : member
              ),
            }
            : doc
        )
      );

      setDocumentUrl((prev) => ({
        ...prev,
        [index]: fileUrl,
      }));
    } else {
      toast.warning('Please upload a valid PDF file.');
      event.target.value = '';
    }
  };

  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const EmployeeInfo = async (data) => {
    if (data && data.length > 0) {
      setSaveButtonVisible(false);
      const [{ EmployeeId }] = data;

      handleRefNo(EmployeeId);
      setEmployeeId(EmployeeId);
    } else {
      console.log("Data not fetched...!");
    }
    console.log(data);
  };

  const handleEmployeeInfo = () => {
    setOpen(true);
  };

  // useEffect(() => {
  //   if (location.state) {
  //     if (location.state.employeeId) {
  //       setEmployeeId(location.state.employeeId);
  //       handleRefNo(location.state.employeeId);
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

  useEffect(() => {
    const { employeeId, firstName, department_id, designation_id } = location.state || {};

    if (employeeId) {
      setEmployeeId(employeeId);
      setFirst_Name(firstName || "");
      setdepartment_id(department_id || "");
      setdesignation_id(designation_id || "");
    }

    if (
      employeeId &&
      documentNameDrop?.length > 0
    ) {
      handleRefNo(employeeId);
    }
  }, [location.state, documentNameDrop]);

  const handleRemovePdf = (relation, index) => {
    setDocuments(prev =>
      prev.map(doc =>
        doc.relation === relation
          ? {
            ...doc,
            members: doc.members.map((m, i) =>
              i === index
                ? {
                  ...m,
                  document: null,
                  documentUrl: "",
                  document: null,
                  isDefaultImage: false,
                }
                : m
            )
          }
          : doc
      )
    );
  };

  return (
    <div class="container-fluid Topnav-screen ">
      {loading && <LoadingScreen />}
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="shadow-lg p-1 bg-body-tertiary rounded main-header-box">
        <div className="header-flex">
          <h1 className="page-title">Documents</h1>

          <div className="action-wrapper desktop-actions">
            {saveButtonVisible && ['add', 'all permission'].some(permission => documentsPermissions.includes(permission)) && (
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

          {/* Mobile Dropdown */}
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

              {saveButtonVisible && ['add', 'all permission'].some(p => documentsPermissions.includes(p)) && (
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


      <TabButtons tabs={tabs} activeTab={activeTab} onTabClick={handleTabClick} />

      {documents.map((relationGroup, relationIndex) => (
        <div key={relationIndex} className="shadow-lg p-2 bg-light rounded mt-2 container-form-box">
          {relationGroup.members.map((member, index) => (
            <div key={index} className="row g-3">

              <div className="col-md-1">
                <div className="inputGroup">
                  <button type="button" title="Add Row" onClick={() => handleAddRow(relationGroup.relation)} className="btn btn-primary">
                    <i className="fa-solid fa-circle-plus"></i>
                  </button>
                  {relationGroup.members.length > 1 && (
                    <button type="button" title="Delete Row" onClick={() => handleDeleteRow(relationGroup.relation, index)} className="btn btn-danger">
                      <i className="fa-regular fa-trash-can"></i>
                    </button>
                  )}
                </div>
              </div>

              <div className="col-md-2">
                <div
                  className={`inputGroup selectGroup 
              ${member.selectDocumentName ? "has-value" : ""} 
               ${isSelectDocument[index] ? "is-focused" : ""}`}
                  title="Please Select the Document Name"
                >
                  <Select
                    id={`cname-${index}`}
                    placeholder=" "
                    onFocus={() => setIsSelectDocument((prev) => ({ ...prev, [index]: true }))}
                    onBlur={() => setIsSelectDocument((prev) => ({ ...prev, [index]: false }))}
                    classNamePrefix="react-select"
                    isClearable
                    type="text"
                    value={member.selectDocumentName}
                    maxLength={50}
                    onChange={(selectDocumentName) =>
                      handleChangeDocumentName(selectDocumentName, relationGroup.relation, index)
                    }
                    options={filteredOptionDocumentName}
                  />
                  <label htmlFor={`cname-${index}`} className={`floating-label ${error && !member.documentName ? 'text-danger' : ''}`}>
                    Document Name<span className="text-danger">*</span>
                  </label>
                </div>
              </div>

              <div className="col-md-2">
                <div className="inputGroup">
                  <input
                    id="passportNo"
                    className="exp-input-field form-control"
                    type="text"
                    placeholder=""
                    value={purpose}
                    onChange={(e) => setpurpose(e.target.value)}
                    maxLength={30}
                    autoComplete="off"
                    title="Please Enter the Purpose"
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
                        index
                      )
                    }
                  />

                  <label className={`floating-label ${error && !member.selectRepManager ? 'text-danger' : ''}`}>
                    Reporting Manager<span className="text-danger">*</span>
                  </label>
                </div>
              </div>

              <div className="col-md-2">
                <div className="inputGroup">
                  <div className="image-upload-container">

                    {member.document ? (
                      <div
                        className="image-preview-box"
                        onClick={() => handlePdfClick(member.documentUrl)}
                      >
                        <iframe
                          src={member.documentUrl}
                          title="PDF Preview"
                          className="pdf-inline-preview"
                        />

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
                    ) : member.isDefaultImage ? (
                      <div
                        className="upload-placeholder-box"
                        onClick={() =>
                          document.getElementById(`upload-${index}`).click()
                        }
                      >
                        <img
                          src={DocumentImage}
                          alt="Default Document"
                          className="uploaded-image"
                        />

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
        <DocumentPopup open={open} handleClose={handleClose} EmployeeInfo={EmployeeInfo} />
        <PdfPreview open={isModalOpen} pdfUrl={currentPdfUrl} handleClose={handleCloseModal} />
      </div>
    </div>
  );
}
export default EmpDocumentReq;