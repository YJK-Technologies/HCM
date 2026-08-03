import React, { useState, useEffect } from "react";
import "../input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import TabButtons from "./Tabs";
import Select from "react-select";
import { showConfirmationToast } from "../ToastConfirmation";
import LoadingScreen from "../Loading";
import EmployeeAssetsPopup from "./EmployeeAssetsPopup";
import { DateTimeField } from "@mui/x-date-pickers";
const config = require("../Apiconfig");

function EmployeeAssets({ }) {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(false);
  const [showAsterisk, setShowAsterisk] = useState(true);
  const navigate = useNavigate();
  const [employeeID, setEmployeeId] = useState("");
  const [First_Name, setFirst_Name] = useState("");
  const [department_id, setdepartment_id] = useState("");
  const [designation_id, setdesignation_id] = useState("");
  const [isSelectAllocationStatus, setIsSelectAllocationStatus] = useState({});
  const [AssetID, setAssetID] = useState("");
  const [allocationDate, setAllocationDate] = useState("");
  const [expectedReturnDate, setExpectedReturnDate] = useState("");
  const [actualReturnDate, setActualReturnDate] = useState("");
  const [statusdrop, setStatusdrop] = useState([]);
  const [selectedAssetID, setselectedAssetID] = useState("");
  const [isSelectAssetID, setIsisSelectAssetID] = useState(false);
  const [AssetIDDrop, setAssetIDDrop] = useState([]);

  const Location_Code = sessionStorage.getItem('selectedLocationCode')

  const [Managerdrop, setManagerdrop] = useState([]);
  const [isSelectRepManager, setIsSelectRepManager] = useState({});

  const [Assetvalue, setAssetvalue] = useState([
    {
      relation: "Assetvalue",
      members: [
        {
          relationName: "",
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
          RepManager: "",
          selectRepManager: null,
        },
      ],
    },
  ]);

  const [saveButtonVisible, setSaveButtonVisible] = useState(true);
  const permissions = JSON.parse(sessionStorage.getItem("permissions")) || {};
  const EmpAssetsPermissions = permissions
    .filter((permission) => permission.screen_type === "EmpAssetsRequest")
    .map((permission) => permission.permission_type.toLowerCase());

  const EmployeeID = sessionStorage.getItem("selectedUserCode");
  useEffect(() => {
    if (AssetIDDrop.length > 0 && EmployeeID) {
      handleEmployeeAssets(EmployeeID);
    }
  }, [AssetIDDrop, EmployeeID]);

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

  const tabs = [
    { label: "Personal Details" },
    { label: "Family" },
    { label: "Academic Details" },
    { label: "Documents" },
    { label: "Assets" },
  ];

  const [activeTab, setActiveTab] = useState("Assets");
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

  const addRow = (relation) => {
    setAssetvalue((prev) =>
      prev.map((item) =>
        item.relation === relation
          ? {
            ...item,
            members: [
              ...item.members,
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
                RepManager: "",
                selectRepManager: null,
              },
            ],
          }
          : item,
      ),
    );
  };

  const deleteRow = (relation, index) => {
    setAssetvalue((prev) =>
      prev.map((item) =>
        item.relation === relation
          ? { ...item, members: item.members.filter((_, i) => i !== index) }
          : item,
      ),
    );
  };

  const handleAssetSelect = async (data) => {
    console.log("Selected Assets:", data);

    if (data && data.length > 0) {
      // const selected = data[0]; // since single select
      const [{ EmployeeID }] = data;
      handleEmployeeAssets(EmployeeID);
      // Example: set into your form
      // setAssetvalue((prev) =>
      //   prev.map((item) => ({
      //     ...item,
      //     members: item.members.map((member, index) =>
      //       index === 0
      //         ? {
      //             ...member,
      //             AssetID: {
      //               label: selected.AssetID,
      //               value: selected.AssetID,
      //             },
      //           }
      //         : member,
      //     ),
      //   })),
      // );
    } else {
      console.log("Data not fetched...!");
    }
  };

  const filteredOptionManager = Managerdrop.map((option) => ({
    value: option.EmployeeId,
    label: `${option.EmployeeId}-${option.full_name}`,
  }));

  const handleChangeRepManager = (selectedRepManager, relation, index) => {
    setAssetvalue((prevDocuments) =>
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
      .catch((error) => console.error("Error fetching manager:", error));
  }, []);

  const handleSave = async () => {
    if (!EmployeeID?.trim()) {
      setError(true);
      toast.warning("Employee ID is required");
      return;
    }

    // Validate required fields
    setError(false);
    for (const group of Assetvalue) {
      for (const member of group.members) {
        if (
          !member.AssetID ||
          !member.ExpectedReturnDate ||
          !member.selectedStatus
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
            EmployeeId: EmployeeID,
            purpose: "Asset Request",
            request_status: "Pending",
            created_by,
            Location_Code
          };

          const headerRes = await fetch(`${config.apiBaseUrl}/AssetRequestHdr`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ headerData: [headerPayload] }),
            },
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
          await saveAssetDetails(info_request_id);

          toast.success("Asset request submitted successfully!", {
            onClose: () => window.location.reload(),
          });
        } catch (error) {
          console.error(error);
          toast.error("Error: " + error.message);
        } finally {
          setLoading(false);
        }
      },
      () => {
        toast.info("Data updated cancelled.");
      },
    );
  };

  const saveAssetDetails = async (info_request_id) => {
    try {
      const company_code = sessionStorage.getItem("selectedCompanyCode");
      const created_by = sessionStorage.getItem("selectedUserCode");

      const detailsData = Assetvalue.flatMap((group) =>
        group.members.map((row) => ({
          DetailID: 0,
          info_request_id,
          company_code,
          EmployeeId: EmployeeID,
          request_status: "Pending",
          AssetID: row.AssetID?.value || null,
          ExpectedReturnDate: row.ExpectedReturnDate,
          ActualReturnDate: row.ActualReturnDate,
          Remarks: row.Remarks,
          RepManager: row.RepManager,
          CreatedBy: created_by,
          Location_Code
        })),
      );

      const res = await fetch(`${config.apiBaseUrl}/AssetRequestDetails`, {
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

      console.log("Asset Details inserted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Error inserting asset details: " + error.message);
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
    fetch(`${config.apiBaseUrl}/getAllocationStatus`, {
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
      }),
    );
  };

  const RelationInputChange = (relation, index, field, value) => {
    setAssetvalue((prev) =>
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

  const handleEmployeeAssets = async (code) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getEmployeeAssets`, {
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
        const data = await response.json();
        if (data && data.length > 0) {
          const emp = data[0];

          // setEmployeeID(emp.EmployeeID || "");
          setFirst_Name(emp.First_Name || "");
          setdepartment_id(emp.department_id || "");
          setdesignation_id(emp.designation_id || "");
        }
        console.log("Fetched Employee Assets:", data);

        if (!data || data.length === 0) {
          toast.warning("No asset data found");

          setAssetvalue([
            {
              relation: "Assetvalue",
              members: [
                {
                  AssetID: null,
                  AllocationDate: "",
                  ExpectedReturnDate: "",
                  ActualReturnDate: "",
                  selectedStatus: null,
                  ConditionAtIssue: "",
                  ConditionAtReturn: "",
                  ApprovedBy: "",
                  Remarks: "",
                  keyfield: "",
                  RepManager: "",
                  selectRepManager: null,
                },
              ],
            },
          ]);
          return;
        }
        const mappedAssets = [
          {
            relation: "Assetvalue",
            members: data.map((item) => ({
              AssetID: item.AssetID
                ? {
                  label: item.AssetID,
                  value: item.AssetID,
                }
                : null,

              AllocationDate: formatDate(item.AllocationDate),
              ExpectedReturnDate: formatDate(item.ExpectedReturnDate),
              ActualReturnDate: formatDate(item.ActualReturnDate),

              selectedStatus: item.AllocationStatus
                ? {
                  label: item.AllocationStatus,
                  value: item.AllocationStatus,
                }
                : null,

              ConditionAtIssue: item.ConditionAtIssue || "",
              ConditionAtReturn: item.ConditionAtReturn || "",
              ApprovedBy: item.ApprovedBy || "",
              Remarks: item.Remarks || "",
              keyfield: item.Keyfield || "",
              RepManager: item.RepManager || "",
              selectRepManager: item.RepManager
                ? filteredOptionManager.find(
                  (opt) => opt.value === item.RepManager,
                )
                : null,
            })),
          },
        ];

        setAssetvalue(mappedAssets);
        console.log(mappedAssets);
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
                selectedStatus: "",
                ConditionAtIssue: "",
                ConditionAtReturn: "",
                ApprovedBy: "",
                Remarks: "",
                keyfield: "",
                RepManager: "",
                selectRepManager: null,
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
    // Handle dd/MM/yyyy manually
    const parts = date.split("/"); // ["08","04","2026"]
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month}-${day}`; // yyyy-MM-dd
    }
    return "";
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleEmployeeAssets(EmployeeID);
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
              i === index ? { ...member, [field]: value } : member,
            ),
          }
          : item,
      ),
    );
  };

  const handleAssetID = (selectedAssetID) => {
    setselectedAssetID(selectedAssetID);
    setAssetID(selectedAssetID ? selectedAssetID.value : "");
  };

  const filteredOptionAssetID = AssetIDDrop.map((option) => ({
    value: option.AssetID,
    label: `${option.AssetID} - ${option.AssetName}`,
    data: option,
  }));

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    const fetchAssetId = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/AssetIDDropoption`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ company_code, Location_Code }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const val = await response.json();
        setAssetIDDrop(val);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    if (company_code) {
      fetchAssetId();
    }
  }, []);

  return (
    <div class="container-fluid Topnav-screen ">
      {loading && <LoadingScreen />}
      <ToastContainer
        position="top-right"
        className="toast-design"
        theme="colored"
      />
      <div className="shadow-lg p-1 bg-body-tertiary rounded main-header-box mb-1">
        <div className="header-flex ">
          <h1 className="page-title">Assets</h1>
          <div className="action-wrapper desktop-actions">
            {saveButtonVisible && ["add", "all permission"].some((permission) => EmpAssetsPermissions.includes(permission)) && (
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
              {saveButtonVisible && ["add", "all permission"].some((p) => EmpAssetsPermissions.includes(p)) && (
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
                    title="Add Row"
                    onClick={() => addRow(relationGroup.relation)}
                  >
                    <i className="fa-solid fa-circle-plus"></i>
                  </button>

                  {/* Delete Button */}
                  {relationGroup.members.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-danger ms-2"
                      title="Delete Row"
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
                   ${member.AssetID ? "has-value" : ""} 
                   ${isSelectAssetID[index] ? "is-focused" : ""}`}
                  title="Please Select the Asset ID"
                >
                  <Select
                    type="number"
                    maxLength={12}
                    placeholder=" "
                    autoComplete="off"
                    inputMode="numeric"
                    onFocus={() =>
                      setIsisSelectAssetID((prev) => ({
                        ...prev,
                        [index]: true,
                      }))
                    }
                    onBlur={() =>
                      setIsisSelectAssetID((prev) => ({
                        ...prev,
                        [index]: false,
                      }))
                    }
                    value={member.AssetID}
                    classNamePrefix="react-select"
                    onChange={(selectedOption) =>
                      RelationInputChange(
                        relationGroup.relation,
                        index,
                        "AssetID",
                        selectedOption,
                      )
                    }
                    options={filteredOptionAssetID}
                  />
                  <label
                    htmlFor="selecteddpt"
                    className={`floating-label ${error && !member.AssetID ? "text-danger" : ""}`}
                  >
                    Asset ID{<span className="text-danger">*</span>}
                  </label>
                </div>
              </div>

              {/* Expected Return */}
              <div className="col-md-2">
                <div className="inputGroup">
                  <input
                    type="date"
                    name="ExpectedReturnDate"
                    className="exp-input-field form-control"
                    title="Please Enter the Expected Return Date"
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
                        value,
                      );
                    }}
                    required
                  />
                  <label
                    for="cno"
                    className={`exp-form-labels ${error && !member.ExpectedReturnDate ? "text-danger" : ""}`}
                  >
                    Expected Return Date
                    {showAsterisk && <span className="text-danger">*</span>}
                  </label>
                </div>
              </div>

              {/* Actual ReturnDate */}
              <div className="col-md-2">
                <div className="inputGroup">
                  <input
                    type="date"
                    name="ActualReturnDate"
                    className="exp-input-field form-control"
                    title="Please Enter the Actual Return Date"
                    value={member.ActualReturnDate}
                    maxLength={18}
                    placeholder=" "
                    autoComplete="off"
                    onChange={(e) =>
                      RelationInputChange(
                        relationGroup.relation,
                        index,
                        "ActualReturnDate",
                        e.target.value,
                      )
                    }
                  />
                  <label for="cno" className="exp-form-labels">
                    {" "}
                    Actual Return Date
                  </label>
                </div>
              </div>

              {/* Remarks */}
              <div className="col-md-2">
                <div className="inputGroup">
                  <input
                    type="text"
                    className="exp-input-field form-control"
                    title="Please Enter the Remarks"
                    placeholder=" "
                    value={member.Remarks}
                    pattern="[A-Za-z]+"
                    maxLength={100}
                    onChange={(e) => {
                      const onlyLetters = e.target.value.replace(
                        /[^A-Za-z\s]/g,
                        "",
                      );
                      RelationInputChange(
                        relationGroup.relation,
                        index,
                        "Remarks",
                        onlyLetters,
                      );
                    }}
                  />

                  <label className="exp-form-labels">Remarks</label>
                </div>
              </div>

              <div className="col-md-2">
                <div className="inputGroup">
                  <input
                    type="text"
                    className="exp-input-field form-control"
                    title="Please Enter the Purpose"
                    placeholder=" "
                    value={member.Purpose}
                    pattern="[A-Za-z]+"
                    maxLength={100}
                    onChange={(e) => {
                      const onlyLetters = e.target.value.replace(
                        /[^A-Za-z\s]/g,
                        "",
                      );
                      RelationInputChange(
                        relationGroup.relation,
                        index,
                        "Purpose",
                        onlyLetters,
                      );
                    }}
                  />

                  <label className="exp-form-labels">Purpose</label>
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
            </div>
          ))}
        </div>
      ))}
      <EmployeeAssetsPopup
        open={open}
        handleClose={handleClose}
        onSelectAssets={handleAssetSelect}
      />
    </div>
  );
}
export default EmployeeAssets;
