import React, { useState, useEffect, useRef } from "react";
import "../input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import TabButtons from "./Tabs";
import Bankaccdetpopup from "./bankaccdetpopup";
import { showConfirmationToast } from "../ToastConfirmation";
import LoadingScreen from "../Loading";
import Select from "react-select";
import BankPassbook from "../DefaultImages/Passbook.jpg";

const config = require("../Apiconfig");

function Input({}) {
  const [EmployeeId, setEmployeeId] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [department_id, setdepartment_id] = useState("");
  const [designation_id, setdesignation_id] = useState("");
  const [First_Name, setFirst_Name] = useState("");

  const [open, setOpen] = React.useState(false);
  const [saveButtonVisible, setSaveButtonVisible] = useState(true);

  const [booleanDrop, setBooleanDrop] = useState([]);
  const [currencyDrop, setCurrencyDrop] = useState([]);

  const [isSelectWPSEnabled, setIsSelectWPSEnabled] = useState({});
  const [isSelectIsPrimaryAccount, setIsSelectIsPrimaryAccount] = useState({});
  const [isSelectIsActive, setIsSelectIsActive] = useState({});
  const [isSelectIsDelete, setIsSelectIsDelete] = useState({});
  const [isSelectedCurrency, setIsSelectedCurrency] = useState({});

  const location = useLocation();

  const [bankDetails, setBankDetails] = useState([
    {
      relation: "bankDetails",
      members: [
        {
          AccountHolderName: "",
          Account_NO: "",
          IFSC_Code: "",
          bankName: "",
          branchName: "",
          bankCity: "",
          bankCountry: "",
          salaryCurrency: "",
          WPS_Enabled: "",
          WPSMemberId: "",
          isPrimaryAccount: "",
          isActive: "",
          isDelete: "",
          passBookImg: null,
          documentUrl: BankPassbook,
          showDefaultImage: true,
          keyfield: "",
          isNewFile: false,
        },
      ],
    },
  ]);

  const Location_Code = sessionStorage.getItem("selectedLocationCode");

  const permissions = JSON.parse(sessionStorage.getItem("permissions")) || {};
  const bankPermissions = permissions
    .filter((permission) => permission.screen_type === "BankAccDet")
    .map((permission) => permission.permission_type.toLowerCase());

  const navigate = useNavigate();

  const handleInputChange = (relation, index, field, value) => {
    setBankDetails((prev) =>
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

  const handleAddRow = (relation) => {
    setBankDetails((prev) =>
      prev.map((item) =>
        item.relation === relation
          ? {
              ...item,
              members: [
                ...item.members,
                {
                  AccountHolderName: "",
                  Account_NO: "",
                  IFSC_Code: "",
                  bankName: "",
                  branchName: "",
                  bankCity: "",
                  bankCountry: "",
                  salaryCurrency: "",
                  accountType: "",
                  WPS_Enabled: "",
                  WPSMemberId: "",
                  isPrimaryAccount: "",
                  isActive: "",
                  isDelete: "",
                  passBookImg: null,
                  documentUrl: BankPassbook,
                  showDefaultImage: true,
                  keyfield: "",
                  isNewFile: false,
                },
              ],
            }
          : item,
      ),
    );
  };

  const handleDeleteRow = (relation, index) => {
    setBankDetails((prev) =>
      prev.map((item) =>
        item.relation === relation
          ? {
              ...item,
              members: item.members.filter((_, i) => i !== index),
            }
          : item,
      ),
    );
  };

  const handleChangeCurrency = (selectedCurrency, relation, index) => {
    setBankDetails((prevBankDetails) =>
      prevBankDetails.map((bank) =>
        bank.relation === relation
          ? {
              ...bank,
              members: bank.members.map((member, i) =>
                i === index
                  ? {
                      ...member,
                      salaryCurrency: selectedCurrency
                        ? selectedCurrency.value
                        : "",
                      selectedCurrency: selectedCurrency,
                    }
                  : member,
              ),
            }
          : bank,
      ),
    );
  };

  const handleChangeIsPrimaryAccount = (
    selectedIsPrimaryAccount,
    relation,
    index,
  ) => {
    setBankDetails((prevBankDetails) =>
      prevBankDetails.map((bank) =>
        bank.relation === relation
          ? {
              ...bank,
              members: bank.members.map((member, i) =>
                i === index
                  ? {
                      ...member,
                      isPrimaryAccount: selectedIsPrimaryAccount
                        ? selectedIsPrimaryAccount.value
                        : "",
                      selectedIsPrimaryAccount,
                    }
                  : member,
              ),
            }
          : bank,
      ),
    );
  };

  // Boolean dropdown
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

  // Currency
  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getCurrenyCode`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((data) => data.json())
      .then((val) => setCurrencyDrop(val));
  }, []); 
  
  const filteredOptionBoolean = Array.isArray(booleanDrop)
    ? booleanDrop.map((option) => ({
        value: Number(option.attributedetails_code), // 0 or 1
        label: option.attributedetails_name, // No / Yes
      }))
    : [];

  const filteredOptionCurrency = Array.isArray(currencyDrop)
    ? currencyDrop.map((option) => ({
        value: option.attributedetails_name,
        label: option.attributedetails_name,
      }))
    : [];

  // Account Type
  const handleChangeAccountType = (selectedOption, relation, index) => {
    setBankDetails((prev) =>
      prev.map((item) =>
        item.relation === relation
          ? {
              ...item,
              members: item.members.map((member, i) =>
                i === index
                  ? {
                      ...member,
                      accountType: selectedOption ? selectedOption.value : "",
                      selectedAccountType: selectedOption,
                    }
                  : member,
              ),
            }
          : item,
      ),
    );
  };

  // WPS Enabled
  const handleChangeWPSEnabled = (selectedOption, relation, index) => {
    setBankDetails((prev) =>
      prev.map((item) =>
        item.relation === relation
          ? {
              ...item,
              members: item.members.map((member, i) =>
                i === index
                  ? {
                      ...member,
                      WPS_Enabled: selectedOption ? selectedOption.value : "",
                      selectedWPSEnabled: selectedOption,
                    }
                  : member,
              ),
            }
          : item,
      ),
    );
  };

  // Is Active
  const handleChangeIsActive = (selectedOption, relation, index) => {
    setBankDetails((prev) =>
      prev.map((item) =>
        item.relation === relation
          ? {
              ...item,
              members: item.members.map((member, i) =>
                i === index
                  ? {
                      ...member,
                      isActive: selectedOption ? selectedOption.value : "",
                      selectedIsActive: selectedOption,
                    }
                  : member,
              ),
            }
          : item,
      ),
    );
  };

  // Is Delete
  const handleChangeIsDelete = (selectedOption, relation, index) => {
    setBankDetails((prev) =>
      prev.map((item) =>
        item.relation === relation
          ? {
              ...item,
              members: item.members.map((member, i) =>
                i === index
                  ? {
                      ...member,
                      isDelete: selectedOption ? selectedOption.value : "",
                      selectedIsDelete: selectedOption,
                    }
                  : member,
              ),
            }
          : item,
      ),
    );
  };

  const NavigatecomDet = () => {
    navigate("/CompanyDetails", {
      state: { employeeId: EmployeeId, firstName: First_Name, department_id: department_id, designation_id: designation_id, },
    });
  };

  const FinanceDet = () => {
    navigate("/FinanceDet", {
      state: { employeeId: EmployeeId, firstName: First_Name, department_id: department_id, designation_id: designation_id,},
    });
  };

  const BankAccDet = () => {
    navigate("/BankAccDet", {
      state: { employeeId: EmployeeId, firstName: First_Name, department_id: department_id, designation_id: designation_id, },
    });
  };

  const IdentDoc = () => {
    navigate("/IdentDoc", {
      state: { employeeId: EmployeeId, firstName: First_Name, department_id: department_id, designation_id: designation_id,},
    });
  };

  const AcademicDet = () => {
    navigate("/AcademicDet", {
      state: { employeeId: EmployeeId, firstName: First_Name, department_id: department_id, designation_id: designation_id, },
    });
  };

  const Insurance = () => {
    navigate("/Family", {
      state: { employeeId: EmployeeId, firstName: First_Name, department_id: department_id, designation_id: designation_id, },
    });
  };

  const Documents = () => {
    navigate("/Documents", {
      state: { employeeId: EmployeeId, firstName: First_Name, department_id: department_id, designation_id: designation_id, },
    });
  };

  const EmployeeAssets = () => {
    navigate("/EmployeeAssets", {
      state: { employeeId: EmployeeId, firstName: First_Name, department_id: department_id, designation_id: designation_id, },
    });
  };

  const EmployeeLoan = () => {
    navigate("/AddEmployeeInfo", {
      state: { employeeId: EmployeeId, firstName: First_Name, department_id: department_id, designation_id: designation_id,},
    });
  };

  const [activeTab, setActiveTab] = useState("Bank Account Details");
  const handleTabClick = (tabLabel) => {
    setActiveTab(tabLabel);

    switch (tabLabel) {
      case "Personal Details":
        EmployeeLoan();
        break;
      case "Company Details":
        NavigatecomDet();
        break;
      case "Financial Details":
        FinanceDet();
        break;
      case "Bank Account Details":
        BankAccDet();
        break;
      case "Identity Documents":
        IdentDoc();
        break;
      case "Academic Details":
        AcademicDet();
        break;
      case "Family":
        Insurance();
        break;
      case "Documents":
        Documents();
        break;
      case "Employee Assets":
        EmployeeAssets();
        break;

      default:
        break;
    }
  };

  const tabs = [
    { label: "Personal Details" },
    { label: "Company Details" },
    { label: "Financial Details" },
    { label: "Bank Account Details" },
    { label: "Identity Documents" },
    { label: "Academic Details" },
    { label: "Family" },
    { label: "Documents" },
    { label: "Employee Assets" },
  ];

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) return resolve(null);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleInsert = async () => {
    if (!EmployeeId) {
      setError(true);
      toast.warning("Employee ID is required.");
      return;
    }

    const members = bankDetails[0].members;

    const hasInvalid = members.some(
      (member) =>
        !member.AccountHolderName ||
        !member.Account_NO ||
        !member.bankName ||
        !member.IFSC_Code,
    );

    if (hasInvalid) {
      setError(true);
      toast.warning("Please fill all required fields.");
      return;
    }

    setLoading(true);

    try {
      const employeeData = await Promise.all(
        members.map(async (member) => ({
          EmployeeId,
          AccountHolderName: member.AccountHolderName,
          Account_NO: member.Account_NO,
          IFSC_Code: member.IFSC_Code,
          bankName: member.bankName,
          branchName: member.branchName,
          Bank_City: member.bankCity,
          Bank_Country: member.bankCountry,
          Salary_Currency: member.salaryCurrency,
          Account_Type: member.accountType,
          WPS_Enabled: member.WPSEnabled,
          WPS_Member_Id: member.WPSMemberId,
          Is_Primary_Account: member.isPrimaryAccount,
          Is_Active: member.isActive,
          Is_Deleted: member.isDelete,
          Bankbook_img: member.passBookImg
            ? await convertFileToBase64(member.passBookImg)
            : null,
          company_code: sessionStorage.getItem("selectedCompanyCode"),
          Location_Code,
          created_by: sessionStorage.getItem("selectedUserCode"),
        })),
      );

      const response = await fetch(
        `${config.apiBaseUrl}/Add_employee_bankdetails`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ employeeData }),
        },
      );

      if (response.ok) {
        toast.success("Bank Details Added Successfully.", {
          onClose: () => window.location.reload(),
        });
      } else {
        const err = await response.json();
        toast.warning(err.message);
      }
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (relation, index) => {
    const member = bankDetails.find((item) => item.relation === relation)
      ?.members[index];

    if (!member) return;

    showConfirmationToast(
      "Are you sure you want to delete this Bank Account?",
      async () => {
        setLoading(true);
        try {
          const bankDetailsToDelete = [
            {
              EmployeeId,
              Account_NO: member.Account_NO,
              company_code: sessionStorage.getItem("selectedCompanyCode"),
              Location_Code,
              modified_by: sessionStorage.getItem("selectedUserCode"),
            },
          ];

          const response = await fetch(
            `${config.apiBaseUrl}/Employeebankdetdelete`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                bankDetailsToDelete,
              }),
            },
          );

          if (response.ok) {
            toast.success("Deleted Successfully.");

            setBankDetails((prev) =>
              prev.map((item) =>
                item.relation === relation
                  ? {
                      ...item,
                      members: item.members.filter((_, i) => i !== index),
                    }
                  : item,
              ),
            );
          } else {
            const err = await response.json();

            toast.warning(err.message);
          }
        } catch (err) {
          toast.error(err.message);
        } finally {
          setLoading(false);
        }
      },
      () => toast.info("Delete Cancelled."),
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleBankDetails(EmployeeId);
    }
  };

  const handleUpdate = async (relation, index) => {

    const member = bankDetails.find((item) => item.relation === relation)
      ?.members[index];

    if (!member) return;
    setLoading(true);

    try {
      const editedData = [
        {
          EmployeeId,
          AccountHolderName: member.AccountHolderName,
          Account_NO: member.Account_NO,
          IFSC_Code: member.IFSC_Code,
          bankName: member.bankName,
          branchName: member.branchName,
          Bank_City: member.bankCity,
          Bank_Country: member.bankCountry,
          Salary_Currency: member.salaryCurrency,
          Account_Type: member.accountType,
          WPS_Enabled: member.WPSEnabled,
          WPS_Member_Id: member.WPSMemberId,
          Is_Primary_Account: member.isPrimaryAccount,
          Is_Active: member.isActive,
          Is_Deleted: member.isDelete,
          Bankbook_img: member.passBookImg
            ? await convertFileToBase64(member.passBookImg)
            : null,
          company_code: sessionStorage.getItem("selectedCompanyCode"),
          Location_Code,
          modified_by: sessionStorage.getItem("selectedUserCode"),
        },
      ];

      const response = await fetch(
        `${config.apiBaseUrl}/updateEmployeebankdet`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            editedData,
          }),
        },
      );

      if (response.ok) {
        toast.success("Bank Details Updated Successfully.");
      } else {
        const err = await response.json();
        toast.warning(err.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleBankAccDet = () => {
    setOpen(true);
  };

  const reloadGridData = () => {
    window.location.reload();
  };

  const handleBankDetails = async (employeeId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/getEmployeeBankDeatils`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Id: employeeId,
            company_code: sessionStorage.getItem("selectedCompanyCode"),
          }),
        },
      );
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          setSaveButtonVisible(false);

          setEmployeeId(employeeId);

          setFirst_Name(data[0].First_Name || "");
          setdepartment_id(data[0].department_id || "");
          setdesignation_id(data[0].designation_id || "");

          const members = data.map((item) => {
            const currencyOption = filteredOptionCurrency.find(
              (opt) => opt.value === item.Salary_Currency,
            );
            const primaryValue =
              item.Is_Primary_Account === true
                ? 1
                : item.Is_Primary_Account === false
                  ? 0
                  : Number(item.Is_Primary_Account);
            const primaryOption = filteredOptionBoolean.find(
              (opt) => opt.value === primaryValue,
            );

            let imageUrl = BankPassbook;
            let imageBlob = null;

            if (
              item.Bankbook_img &&
              item.Bankbook_img.data &&
              item.Bankbook_img.data.length > 0
            ) {
              imageBlob = new Blob([new Uint8Array(item.Bankbook_img.data)], {
                type: "image/jpeg",
              });
              imageUrl = URL.createObjectURL(imageBlob);
            }
            return {
              AccountHolderName: item.AccountHolderName || "",
              Account_NO: item.Account_NO || "",
              IFSC_Code: item.IFSC_Code || "",
              bankName: item.bankName || "",
              branchName: item.branchName || "",
              bankCity: item.Bank_City || "",
              bankCountry: item.Bank_Country || "",
              salaryCurrency: item.Salary_Currency || "",
              selectedCurrency: currencyOption || null,
              WPSMemberId: item.WPS_Member_Id || "",
              isPrimaryAccount: primaryValue,
              selectedIsPrimaryAccount: primaryOption || null,
              passBookImg: imageBlob,
              documentUrl: imageUrl,
              isDefaultImage: !imageBlob,
              keyfield: item.keyfield || "",
              S_NO: item.S_NO || "",
            };
          });

          setBankDetails([
            {
              relation: "bankDetails",
              members,
            },
          ]);
        }
      } else if (response.status === 404) {
        toast.warning("Data not found");
      } else {
        const error = await response.json();
        toast.warning(error.message);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const bankAccountDetails = async (data) => {
    if (data && data.length > 0) {
      setSaveButtonVisible(false);

      const [{ EmployeeId }] = data;

      handleBankDetails(EmployeeId);
    } else {
      console.log("Data not fetched...!");
    }
  };

  useEffect(() => {
    const { employeeId, firstName, department_id, designation_id } =
      location.state || {};

    if (employeeId) {
      setEmployeeId(employeeId);

      setFirst_Name(firstName || "");

      setdepartment_id(department_id || "");

      setdesignation_id(designation_id || "");
    }

    if (employeeId && currencyDrop.length && booleanDrop.length) {
      handleBankDetails(employeeId);
    }
  }, [location.state, currencyDrop, booleanDrop]);

  const handlePassbookChange = (event, relation, index) => {
    const file = event.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.warning("Please upload a valid image.");
      event.target.value = "";
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    setBankDetails((prev) =>
      prev.map((item) =>
        item.relation === relation
          ? {
              ...item,
              members: item.members.map((member, i) =>
                i === index
                  ? {
                      ...member,
                      passBookImg: file,
                      documentUrl: imageUrl,
                      isDefaultImage: false,
                      isNewImage: true,
                    }
                  : member,
              ),
            }
          : item,
      ),
    );
  };

  const handleRemovePassbook = (relation, index) => {
    setBankDetails((prev) =>
      prev.map((item) =>
        item.relation === relation
          ? {
              ...item,
              members: item.members.map((member, i) =>
                i === index
                  ? {
                      ...member,
                      passBookImg: null,
                      documentUrl: "",
                      isDefaultImage: false,
                    }
                  : member,
              ),
            }
          : item,
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
      <div className="shadow-lg p-1 bg-light rounded main-header-box">
        <div className="header-flex">
          <h1 className="page-title">Bank Account Details</h1>

          <div className="action-wrapper desktop-actions">
            {["add", "all permission"].some((permission) =>
              bankPermissions.includes(permission),
            ) && (
              <div className="action-icon add" onClick={handleInsert}>
                <span className="tooltip">Save</span>
                <i class="fa-solid fa-floppy-disk"></i>
              </div>
            )}
            {["delete", "all permission"].some((permission) =>
              bankPermissions.includes(permission),
            ) && (
              <div className="action-icon delete" onClick={handleDelete}>
                <span className="tooltip">Delete</span>
                <i class="fa-solid fa-trash"></i>
              </div>
            )}
            <div
              className="action-icon print"
              onClick={reloadGridData}
              title="Reload"
            >
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
              {["add", "all permission"].some((p) =>
                bankPermissions.includes(p),
              ) && (
                <li>
                  <button className="dropdown-item" onClick={handleInsert}>
                    <i className="fa-solid fa-floppy-disk add fs-4"></i>
                  </button>
                </li>
              )}
              {["delete", "all permission"].some((p) =>
                bankPermissions.includes(p),
              ) && (
                <li>
                  <button className="dropdown-item" onClick={handleDelete}>
                    <i className="fa-solid fa-trash delete fs-4"></i>
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

      <div className="shadow-lg p-3 bg-light rounded mt-2 container-form-box">
        <div className="row g-3">
          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="EmployeeId"
                class="exp-input-field form-control"
                type="text"
                placeholder=" "
                autoComplete="off"
                required
                value={EmployeeId}
                maxLength={100}
                onChange={(e) => setEmployeeId(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <label
                for="cno"
                className={`exp-form-labels ${error && !EmployeeId ? "text-danger" : ""}`}
              >
                Employee ID<span className="text-danger">*</span>{" "}
              </label>
              <span
                className="select-add-btn"
                title="Bank Account Details Help"
                onClick={handleBankAccDet}
              >
                <i className="fa fa-search"></i>
              </span>
            </div>
          </div>

          <div className="col-md-2">
            <div className="exp-form-floating">
              <div className="info-label-container">
                <label id="FirstNamelabel" className="partyName">
                  <strong>Employee Name:</strong> {First_Name}
                </label>
              </div>
            </div>
          </div>

          <div className="col-md-2" style={{ marginRight: "20px" }}>
            <div className="exp-form-floating">
              <div className="info-label-container">
                <label id="Departmentlabel" className="partyName">
                  <strong>Department:</strong> {department_id}
                </label>
              </div>
            </div>
          </div>

          <div className="col-md-2">
            <div className="exp-form-floating">
              <div className="info-label-container">
                <label id="designationLabel" className="partyName">
                  <strong>Designation:</strong> {designation_id}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TabButtons
        tabs={tabs}
        activeTab={activeTab}
        onTabClick={handleTabClick}
      />

      {bankDetails.map((relationGroup, relationIndex) => (
        <div
          key={relationIndex}
          className="shadow-lg p-2 bg-light rounded mt-2 container-form-box"
        >
          {relationGroup.members.map((member, index) => (
            <div key={index} className="row g-3">
              {/* Add/Delete Row */}
              <div className="col-md-1">
                <div className="inputGroup">
                  <button
                    type="button"
                    className="btn btn-primary ms-3"
                    title="Add Row"
                    onClick={() => handleAddRow(relationGroup.relation)}
                  >
                    <i className="fa-solid fa-circle-plus"></i>
                  </button>

                  {relationGroup.members.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-danger"
                      title="Delete Row"
                      onClick={() =>
                        handleDeleteRow(relationGroup.relation, index)
                      }
                    >
                      <i className="fa-regular fa-trash-can"></i>
                    </button>
                  )}
                </div>
              </div>

              {/* Account Holder */}
              <div className="col-md-2">
                <div className="inputGroup">
                  <input
                    type="text"
                    className="exp-input-field form-control"
                    placeholder=" "
                    autoComplete="off"
                    value={member.AccountHolderName}
                    maxLength={100}
                    onChange={(e) =>
                      handleInputChange(
                        relationGroup.relation,
                        index,
                        "AccountHolderName",
                        e.target.value,
                      )
                    }
                  />
                  <label className={`exp-form-labels ${ error && !member.AccountHolderName ? "text-danger" : "" }`} >
                    Account Holder Name
                    <span className="text-danger">*</span>
                  </label>
                </div>
              </div>

              {/* Account Number */}
              <div className="col-md-2">
                <div className="inputGroup">
                  <input
                    type="text"
                    className="exp-input-field form-control"
                    placeholder=" "
                    autoComplete="off"
                    value={member.Account_NO}
                    maxLength={50}
                    onChange={(e) =>
                      handleInputChange(
                        relationGroup.relation,
                        index,
                        "Account_NO",
                        e.target.value,
                      )
                    }
                  />
                  <label className={`exp-form-labels ${ error && !member.Account_NO ? "text-danger" : "" }`} >
                    Account Number
                    <span className="text-danger">*</span>
                  </label>
                </div>
              </div>

              {/* IFSC */}
              <div className="col-md-2">
                <div className="inputGroup">
                  <input
                    type="text"
                    className="exp-input-field form-control"
                    placeholder=" "
                    autoComplete="off"
                    value={member.IFSC_Code}
                    maxLength={30}
                    onChange={(e) =>
                      handleInputChange(
                        relationGroup.relation,
                        index,
                        "IFSC_Code",
                        e.target.value,
                      )
                    }
                  />

                  <label className={`exp-form-labels ${ error && !member.IFSC_Code ? "text-danger" : "" }`} > 
                    IFSC Code
                    <span className="text-danger">*</span>
                  </label>
                </div>
              </div>

              {/* Bank Name */}
              <div className="col-md-2">
                <div className="inputGroup">
                  <input
                    type="text"
                    className="exp-input-field form-control"
                    placeholder=" "
                    autoComplete="off"
                    value={member.bankName}
                    maxLength={100}
                    onChange={(e) =>
                      handleInputChange(
                        relationGroup.relation,
                        index,
                        "bankName",
                        e.target.value,
                      )
                    }
                  />

                  <label className={`exp-form-labels ${ error && !member.bankName ? "text-danger" : "" }`} >
                    Bank Name
                    <span className="text-danger">*</span>
                  </label>
                </div>
              </div>

              {/* Branch Name */}
              <div className="col-md-2">
                <div className="inputGroup">
                  <input
                    type="text"
                    className="exp-input-field form-control"
                    placeholder=" "
                    autoComplete="off"
                    value={member.branchName}
                    maxLength={100}
                    onChange={(e) =>
                      handleInputChange(
                        relationGroup.relation,
                        index,
                        "branchName",
                        e.target.value,
                      )
                    }
                  />
                  <label className={`exp-form-labels ${ error && !member.branchName ? "text-danger" : "" }`}>
                    Branch Name
                    <span className="text-danger">*</span>
                  </label>
                </div>
              </div>

              {/* Bank City */}

              <div className="col-md-2">
                <div className="inputGroup">
                  <input
                    type="text"
                    className="exp-input-field form-control"
                    placeholder=" "
                    autoComplete="off"
                    value={member.bankCity}
                    maxLength={100}
                    onChange={(e) =>
                      handleInputChange(
                        relationGroup.relation,
                        index,
                        "bankCity",
                        e.target.value,
                      )
                    }
                  />
                  <label className="exp-form-labels">Bank City</label>
                </div>
              </div>

              {/* Bank Country */}

              <div className="col-md-2">
                <div className="inputGroup">
                  <input
                    type="text"
                    className="exp-input-field form-control"
                    placeholder=" "
                    autoComplete="off"
                    value={member.bankCountry}
                    maxLength={100}
                    onChange={(e) =>
                      handleInputChange(
                        relationGroup.relation,
                        index,
                        "bankCountry",
                        e.target.value,
                      )
                    }
                  />

                  <label className="exp-form-labels">Bank Country</label>
                </div>
              </div>

              {/* Salary Currency */}

              <div className="col-md-2">
                <div
                  className={`inputGroup selectGroup
                  ${member.selectedCurrency ? "has-value" : ""}
                  ${isSelectedCurrency[index] ? "is-focused" : ""}`}
                >
                  <Select
                    id={`currency-${index}`}
                    placeholder=" "
                    classNamePrefix="react-select"
                    isClearable
                    value={member.selectedCurrency}
                    options={filteredOptionCurrency}
                    onFocus={() =>
                      setIsSelectedCurrency((prev) => ({
                        ...prev,
                        [index]: true,
                      }))
                    }
                    onBlur={() =>
                      setIsSelectedCurrency((prev) => ({
                        ...prev,
                        [index]: false,
                      }))
                    }
                    onChange={(selectedOption) =>
                      handleChangeCurrency(
                        selectedOption,
                        relationGroup.relation,
                        index,
                      )
                    }
                  />

                  <label className="floating-label">Salary Currency</label>
                </div>
              </div>

              {/* WPS Member ID */}

              <div className="col-md-2">
                <div className="inputGroup">
                  <input
                    type="text"
                    className="exp-input-field form-control"
                    placeholder=" "
                    autoComplete="off"
                    value={member.WPSMemberId}
                    maxLength={100}
                    onChange={(e) =>
                      handleInputChange(
                        relationGroup.relation,
                        index,
                        "WPSMemberId",
                        e.target.value,
                      )
                    }
                  />

                  <label className="exp-form-labels">WPS Member ID</label>
                </div>
              </div>

              {/* Is Primary Account */}

              <div className="col-md-2">
                <div
                  className={`inputGroup selectGroup
                  ${member.selectedIsPrimaryAccount ? "has-value" : ""}
                  ${isSelectIsPrimaryAccount[index] ? "is-focused" : ""}`}
                >
                  <Select
                    id={`primary-${index}`}
                    placeholder=" "
                    classNamePrefix="react-select"
                    isClearable
                    value={member.selectedIsPrimaryAccount}
                    options={filteredOptionBoolean}
                    onFocus={() =>
                      setIsSelectIsPrimaryAccount((prev) => ({
                        ...prev,
                        [index]: true,
                      }))
                    }
                    onBlur={() =>
                      setIsSelectIsPrimaryAccount((prev) => ({
                        ...prev,
                        [index]: false,
                      }))
                    }
                    onChange={(selectedOption) =>
                      handleChangeIsPrimaryAccount(
                        selectedOption,
                        relationGroup.relation,
                        index,
                      )
                    }
                  />

                  <label className="floating-label">Is Primary Account</label>
                </div>
              </div>

              {/* Passbook */}

              <div className="col-md-2">
                <div className="inputGroup">
                  <div className="image-upload-container">
                    {member.passBookImg ? (
                      <div className="image-preview-box">
                        <img
                          src={member.documentUrl}
                          alt="Passbook"
                          className="uploaded-image"
                        />

                        <button
                          type="button"
                          className="delete-image-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemovePassbook(relationGroup.relation, index);
                          }}
                        >
                          &times;
                        </button>
                      </div>
                    ) : member.isDefaultImage ? (
                      <div className="upload-placeholder-box">
                        <img
                          src={BankPassbook}
                          alt="Default"
                          className="uploaded-image"
                        />

                        <button
                          type="button"
                          className="delete-image-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemovePassbook(relationGroup.relation, index);
                          }}
                        >
                          &times;
                        </button>
                      </div>
                    ) : (
                      <div className="upload-placeholder-box">
                        <div className="upload-icon-text">
                          <i className="fa-solid fa-image upload-icon me-1"></i>
                          <span>Upload Passbook</span>
                        </div>
                      </div>
                    )}

                    <input
                      type="file"
                      id={`upload-${index}`}
                      className={`hidden-file-input ${
                        member.passBookImg ? "disable-overlay" : ""
                      }`}
                      accept="image/*"
                      onChange={(e) =>
                        handlePassbookChange(e, relationGroup.relation, index)
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-1">
                {member.Account_NO && (
                  <div className="inputGroup">
                    {["update", "all permission"].some((permission) =>
                      bankPermissions.includes(permission),
                    ) && (
                      <button
                        type="button"
                        className="btn btn-success"
                        title="Update"
                        onClick={() =>
                          handleUpdate(relationGroup.relation, index)
                        }
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                    )}

                    {["delete", "all permission"].some((permission) =>
                      bankPermissions.includes(permission),
                    ) && (
                      <button
                        type="button"
                        className="btn btn-danger"
                        title="Delete"
                        onClick={() =>
                          handleDelete(relationGroup.relation, index)
                        }
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}

      <Bankaccdetpopup
        open={open}
        handleClose={handleClose}
        Employeebankdetails={bankAccountDetails}
      />
    </div>
  );
}
export default Input;
