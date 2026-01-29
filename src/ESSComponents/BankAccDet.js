import React, { useState, useEffect, useRef } from "react";
import "../input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useLocation } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import TabButtons from "./Tabs";
import Bankaccdetpopup from "./bankaccdetpopup";
import { showConfirmationToast } from '../ToastConfirmation';
import LoadingScreen from '../Loading';
import Select from "react-select";
const config = require('../Apiconfig');

function Input({ }) {
  const [EmployeeId, setEmployeeId] = useState('');
  const [AccountHolderName, setAccountHolderName] = useState('');
  const [Account_NO, setAccountNumber] = useState('');
  const [IFSC_Code, setIFSCCode] = useState('');
  const [bankName, setBankName] = useState('');
  const [branchName, setBranchName] = useState('');
  const [passBookImg, setPassBookImg] = useState('');
  const [selectedImg, setSelectedImage] = useState(null);
  const [saveButtonVisible, setSaveButtonVisible] = useState(true);
  const [updateButtonVisible, setUpdateButtonVisible] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [department_id, setdepartment_id] = useState("");
  const [designation_id, setdesignation_id] = useState("");
  const location = useLocation();
  const [First_Name, setFirst_Name] = useState('');
  const logo = useRef(null)
  const [loading, setLoading] = useState(false);
  const [accountTypeDrop, setAccountTypeDrop] = useState([]);
  const [selectedAccountType, setSelectedAccountType] = useState('');
  const [accountType, setAccountType] = useState('');
  const [isSelectAccountType, setIsSelectAccountType] = useState(false);
  const [isSelectWPSEnabled, setIsSelectWPSEnabled] = useState(false);
  const [isSelectIsPrimaryAccount, setIsSelectIsPrimaryAccount] = useState(false);
  const [isSelectIsActive, setIsSelectIsActive] = useState(false);
  const [isSelectIsDelete, setIsSelectIsDelete] = useState(false);
  const [bankCity, setBankCity] = useState('');
  const [bankCountry, setBankCountry] = useState('');
  const [salaryCurrency, setSalaryCurrency] = useState('');
  const [booleanDrop, setBooleanDrop] = useState([]);
  const [selectedWPSEnabled, setSelectedWPSEnabled] = useState('');
  const [WPSEnabled, setWPSEnabled] = useState('');
  const [WPSMemberId, setWPSMemberId] = useState('');
  const [selectedIsPrimaryAccount, setSelectedIsPrimaryAccount] = useState('');
  const [isPrimaryAccount, setIsPrimaryAccount] = useState('');
  const [selectedIsActive, setSelectedIsActive] = useState('');
  const [isActive, setIsActive] = useState('');
  const [selectedIsDelete, setSelectedIsDelete] = useState('');
  const [isDelete, setIsDelete] = useState('');
  const [sNo, setSNo] = useState('');


  //code added by Pavun purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem('permissions')) || {};
  const bankPermissions = permissions
    .filter(permission => permission.screen_type === 'BankAccDet')
    .map(permission => permission.permission_type.toLowerCase());

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const NavigatecomDet = () => {
    navigate("/CompanyDetails", { state: { employeeId: EmployeeId, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const FinanceDet = () => {
    navigate("/FinanceDet", { state: { employeeId: EmployeeId, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const BankAccDet = () => {
    navigate("/BankAccDet", { state: { employeeId: EmployeeId, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const IdentDoc = () => {
    navigate("/IdentDoc", { state: { employeeId: EmployeeId, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const AcademicDet = () => {
    navigate("/AcademicDet", { state: { employeeId: EmployeeId, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const Insurance = () => {
    navigate("/Family", { state: { employeeId: EmployeeId, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const Documents = () => {
    navigate("/Documents", { state: { employeeId: EmployeeId, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const EmployeeLoan = () => {
    navigate("/AddEmployeeInfo", { state: { employeeId: EmployeeId, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const [activeTab, setActiveTab] = useState('Bank Account Details');
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
        Insurance();
        break;
      case 'Documents':
        Documents();
        break;
      default:
        break;
    }
  };

  const tabs = [
    { label: 'Personal Details' },
    { label: 'Company Details' },
    { label: 'Financial Details' },
    { label: 'Bank Account Details' },
    { label: 'Identity Documents' },
    { label: 'Academic Details' },
    { label: 'Family' },
    { label: 'Documents' }
  ];

  const handleChangeAccountType = (selectedAccountType) => {
    setSelectedAccountType(selectedAccountType);
    setAccountType(selectedAccountType ? selectedAccountType.value : '');
  };

  const filteredOptionAccountType = accountTypeDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  useEffect(() => {

    fetch(`${config.apiBaseUrl}/getAccountType`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((data) => data.json())
      .then((val) => setAccountTypeDrop(val));
  }, []);

  const handleChangeWPSEnabled = (selectedWPSEnabled) => {
    setSelectedWPSEnabled(selectedWPSEnabled);
    setWPSEnabled(selectedWPSEnabled ? selectedWPSEnabled.value : '');
  };

  const handleChangeIsPrimaryAccount = (selectedIsPrimaryAccount) => {
    setSelectedIsPrimaryAccount(selectedIsPrimaryAccount);
    setIsPrimaryAccount(selectedIsPrimaryAccount ? selectedIsPrimaryAccount.value : '');
  };

  const handleChangeIsActive = (selectedIsActive) => {
    setSelectedIsActive(selectedIsActive);
    setIsActive(selectedIsActive ? selectedIsActive.value : '');
  };

  const handleChangeIsDelete = (selectedIsDelete) => {
    setSelectedIsDelete(selectedIsDelete);
    setIsDelete(selectedIsDelete ? selectedIsDelete.value : '');
  };

  const filteredOptionBoolean = booleanDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

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

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const maxSize = 1 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.warning('File size exceeds 1MB. Please upload a smaller file.');
        event.target.value = null;
        return;
      }
      setSelectedImage(URL.createObjectURL(file));
      setPassBookImg(file);
    }
  };

  const handleInsert = async () => {
    if (!EmployeeId || !Account_NO || !AccountHolderName || !bankName || !IFSC_Code) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }
    setLoading(true)

    try {
      const formData = new FormData();
      formData.append("EmployeeId", EmployeeId);
      formData.append("Account_NO", Account_NO);
      formData.append("AccountHolderName", AccountHolderName);
      formData.append("bankName", bankName);
      formData.append("branchName", branchName);
      formData.append("IFSC_Code", IFSC_Code);
      formData.append("Account_Type", accountType);
      formData.append("Bank_City", bankCity);
      formData.append("Bank_Country", bankCountry);
      formData.append("Salary_Currency", salaryCurrency);
      formData.append("WPS_Enabled", WPSEnabled);
      formData.append("WPS_Member_Id", WPSMemberId);
      formData.append("Is_Primary_Account", isPrimaryAccount);
      formData.append("Is_Active", isActive);
      formData.append("Is_Deleted", isDelete);
      formData.append("S_NO", sNo);
      formData.append("company_code", sessionStorage.getItem("selectedCompanyCode"));
      formData.append("created_by", sessionStorage.getItem("selectedUserCode"));

      if (passBookImg) {
        formData.append("Bankbook_img", passBookImg);
      }

      const response = await fetch(`${config.apiBaseUrl}/Add_employee_bankdetails`, {
        method: "POST",
        body: formData,
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
        console.error(errorResponse.message);
        toast.warning(errorResponse.message);
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error('Error inserting data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!Account_NO) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }
    setLoading(true)

    showConfirmationToast(
      "Are you sure you want to Delete the data?",
      async () => {
        try {
          const Header = {
            EmployeeId: EmployeeId,
            Account_NO: Account_NO,
            company_code: sessionStorage.getItem("selectedCompanyCode")
          };

          const response = await fetch(`${config.apiBaseUrl}/Employeebankdetdelete`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(Header),
          });

          if (response.status === 200) {
            console.log("Data deleted successfully");
            setTimeout(() => {
              toast.success("Data deleted successfully!", {
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
        } finally {
          setLoading(false);
        }
      },
      () => {
        toast.info("Data Delete cancelled.");
      }
    );
  };


  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleRefNo(EmployeeId)
    }
  };

  const handleRefNo = async (code) => {
    setLoading(true)
    try {
      const response = await fetch(`${config.apiBaseUrl}/getEmployeeBankDeatils`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ Id: code, company_code: sessionStorage.getItem("selectedCompanyCode"), })
      });

      if (response.ok) {
        const searchData = await response.json();

        const [{ AccountHolderName, designation_id, department_id, First_Name, Account_NO, EmployeeId, bankName,
          IFSC_Code, branchName, Bankbook_img, Bank_City, Bank_Country, Salary_Currency, WPS_Enabled, WPS_Member_Id,
          Is_Primary_Account, Is_Active, Is_Deleted, S_NO }] = searchData;

        setAccountHolderName(AccountHolderName);
        setAccountNumber(Account_NO)
        setdepartment_id(department_id);
        setdesignation_id(designation_id);
        setFirst_Name(First_Name);
        setEmployeeId(EmployeeId);
        setIFSCCode(IFSC_Code);
        setBankName(bankName);
        setBranchName(branchName);
        setBankCity(Bank_City);
        setBankCountry(Bank_Country);
        setSalaryCurrency(Salary_Currency);
        setWPSMemberId(WPS_Member_Id);
        setSNo(S_NO);

        setBooleanSelect(WPS_Enabled, setSelectedWPSEnabled, setWPSEnabled);
        setBooleanSelect(Is_Primary_Account, setSelectedIsPrimaryAccount, setIsPrimaryAccount);
        setBooleanSelect(Is_Active, setSelectedIsActive, setIsActive);
        setBooleanSelect(Is_Deleted, setSelectedIsDelete, setIsDelete);

        setUpdateButtonVisible(true);

        setSaveButtonVisible(false);

        const imageBlob = new Blob([new Uint8Array(Bankbook_img.data)], { type: 'image/jpeg' });
        setPassBookImg(imageBlob);
        const imageUrl = URL.createObjectURL(imageBlob);
        setSelectedImage(imageUrl);

      } else if (response.status === 404) {
        toast.warning("Data not found")
        setAccountHolderName('');
        setAccountNumber('');
        setIFSCCode('');
        setBankName('');
        setBranchName('');
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to insert sales data");
        console.error(errorResponse.details || errorResponse.message);
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error('Error inserting data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };


  const handleUpdate = async () => {
    if (!EmployeeId || !Account_NO || !AccountHolderName || !bankName || !IFSC_Code) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }
    setLoading(true)

    try {
      const formData = new FormData();
      formData.append("EmployeeId", EmployeeId);
      formData.append("Account_NO", Account_NO);
      formData.append("AccountHolderName", AccountHolderName);
      formData.append("bankName", bankName);
      formData.append("branchName", branchName);
      formData.append("IFSC_Code", IFSC_Code);
      formData.append("Bank_City", bankCity);
      formData.append("Bank_Country", bankCountry);
      formData.append("Salary_Currency", salaryCurrency);
      formData.append("WPS_Enabled", WPSEnabled);
      formData.append("WPS_Member_Id", WPSMemberId);
      formData.append("Is_Primary_Account", isPrimaryAccount);
      formData.append("Is_Active", isActive);
      formData.append("Is_Deleted", isDelete);
      formData.append("S_NO", sNo);
      formData.append("company_code", sessionStorage.getItem("selectedCompanyCode"));
      formData.append("modified_by", sessionStorage.getItem("selectedUserCode"));

      if (passBookImg) {
        formData.append("Bankbook_img", passBookImg);
      }

      const response = await fetch(`${config.apiBaseUrl}/updateEmployeebankdet`, {
        method: "POST",
        body: formData,
      });

      if (response.status === 200) {
        console.log("Data updated successfully");
        setTimeout(() => {
          toast.success("Data updated successfully!", {
            onClose: () => window.location.reload(),
          });
        }, 1000);
      } else {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.warning(errorResponse.message);
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error('Error inserting data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  }
  const handleBankAccDet = () => {
    setOpen(true);
  };



  const reloadGridData = () => {
    window.location.reload();
  };

  const base64ToBlob = (base64, contentType = 'image/jpeg') => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  };

  const setBooleanSelect = (
    backendValue,
    setSelectedFn,
    setValueFn
  ) => {
    if (backendValue === null || backendValue === undefined) {
      setSelectedFn(null);
      setValueFn(null);
      return;
    }

    const value = backendValue === true ? "1" : "0";

    const selectedOption = filteredOptionBoolean.find(
      option => option.value === value
    );

    setSelectedFn(selectedOption || null);
    setValueFn(value);
  };

  const Employeebankdetails = async (data) => {

    if (data && data.length > 0) {
      setSaveButtonVisible(false);
      setUpdateButtonVisible(true);
      const [{ AccountHolderName, designation_id, department_id, First_Name, Account_NO, EmployeeId, bankName,
        IFSC_Code, branchName, Bankbook_img, Bank_City, Bank_Country, Salary_Currency, WPS_Enabled, WPS_Member_Id,
        Is_Primary_Account, Is_Active, Is_Deleted, S_NO }] = data;

      if (Bankbook_img?.data) {
        const imageBlob = base64ToBlob(Bankbook_img);
        setPassBookImg(imageBlob);
        const imageUrl = URL.createObjectURL(imageBlob);
        setSelectedImage(imageUrl);
      }

      setAccountHolderName(AccountHolderName);
      setAccountNumber(Account_NO)
      setdepartment_id(department_id);
      setdesignation_id(designation_id);
      setFirst_Name(First_Name);
      setEmployeeId(EmployeeId);
      setIFSCCode(IFSC_Code);
      setBankName(bankName);
      setBranchName(branchName);
      setBankCity(Bank_City);
      setBankCountry(Bank_Country);
      setSalaryCurrency(Salary_Currency);
      setWPSMemberId(WPS_Member_Id);
      setSNo(S_NO);

      setBooleanSelect(WPS_Enabled, setSelectedWPSEnabled, setWPSEnabled);
      setBooleanSelect(Is_Primary_Account, setSelectedIsPrimaryAccount, setIsPrimaryAccount);
      setBooleanSelect(Is_Active, setSelectedIsActive, setIsActive);
      setBooleanSelect(Is_Deleted, setSelectedIsDelete, setIsDelete);

    } else {
      console.log("Data not fetched...!");
    }
    console.log(data)
  };

  const EmployeeInfo = async (data) => {
    if (data && data.length > 0) {
      setSaveButtonVisible(false);
      setUpdateButtonVisible(true);
      const [{ EmployeeId }] = data;

      console.log(data);


      const employeeId = document.getElementById('EmployeeId');
      if (employeeId) {
        employeeId.value = EmployeeId;
        setEmployeeId(EmployeeId);
      } else {
        console.error('EmployeeId  not found');
      }




    } else {
      console.log("Data not fetched...!");
    }
    console.log(data);
  };

  // useEffect(() => {
  //   if (location.state) {
  //     if (location.state.employeeId) {
  //       setEmployeeId(location.state.employeeId);
  //       handleRefNo(location.state.employeeId)
  //     }
  //     if (location.state.firstName) {
  //       setFirst_Name(location.state.firstName);
  //     }
  //     if (location.state.department_id) {
  //       setdepartment_id(location.state.department_id);
  //     } else {
  //       console.log("data not found")
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

    if (employeeId) {
      handleRefNo(employeeId);
    }
  }, [location.state]);

  const handleRemoveLogo = () => {
    setSelectedImage(null);
    if (logo.current) {
      logo.current.value = "";
    }
  };

  return (
    <div class="container-fluid Topnav-screen ">
      {loading && <LoadingScreen />}
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="shadow-lg p-1 bg-body-tertiary rounded main-header-box">
        <div className="header-flex">
          <h1 className="page-title">Bank Account Details</h1>

          <div className="action-wrapper desktop-actions">
            {saveButtonVisible && ['add', 'all permission'].some(permission => bankPermissions.includes(permission)) && (
              <div className="action-icon add" onClick={handleInsert}>
                <span className="tooltip">save</span>
                <i class="fa-solid fa-floppy-disk"></i>
              </div>
            )}
            {updateButtonVisible && ['update', 'all permission'].some(permission => bankPermissions.includes(permission)) && (
              <div className="action-icon update" onClick={handleUpdate}>
                <span className="tooltip">Update</span>
                <i class="fa-solid fa-pen-to-square"></i>
              </div>
            )}
            {['delete', 'all permission'].some(permission => bankPermissions.includes(permission)) && (
              <div className="action-icon delete" onClick={handleDelete}>
                <span className="tooltip">Delete</span>
                <i class="fa-solid fa-trash"></i>
              </div>
            )}
            <div className="action-icon print" onClick={reloadGridData} title="Reload">
              <span className="tooltip">Reload</span>
              <i className="fa-solid fa-arrow-rotate-right"></i>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <div className="dropdown mobile-actions">
          <button className="btn btn-primary dropdown-toggle p-1" data-bs-toggle="dropdown">
            <i className="fa-solid fa-list"></i>
          </button>

          <ul className="dropdown-menu dropdown-menu-end text-center">

            {saveButtonVisible && ['add', 'all permission'].some(p => bankPermissions.includes(p)) && (
              <li className="dropdown-item" onClick={handleInsert}>
                <i className="fa-solid fa-floppy-disk text-success fs-4"></i>
              </li>
            )}

            {updateButtonVisible && ['update', 'all permission'].some(p => bankPermissions.includes(p)) && (
              <li className="dropdown-item" onClick={handleUpdate}>
                <i className="fa-solid fa-pen-to-square text-primary fs-4"></i>
              </li>
            )}

            {['delete', 'all permission'].some(p => bankPermissions.includes(p)) && (
              <li className="dropdown-item" onClick={handleDelete}>
                <i className="fa-solid fa-user-minus text-danger fs-4"></i>
              </li>
            )}

            {['all permission', 'reload'].some(p => bankPermissions.includes(p)) && (
              <li className="dropdown-item" onClick={reloadGridData}>
                <i className="fa-solid fa-arrow-rotate-right"></i>
              </li>
            )}

          </ul>
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
                value={EmployeeId}
                maxLength={100}
                onChange={(e) => setEmployeeId(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <label for="cno" className={`exp-form-labels ${error && !EmployeeId ? 'text-danger' : ''}`}>Employee ID<span className="text-danger">*</span> </label>
              <span className="select-add-btn" title="Bank Account Details Help" onClick={handleBankAccDet}>
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

      <div className="shadow-lg p-2 bg-light rounded mt-2 container-form-box">
        <div className="row g-3">

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="sNo"
                class="exp-input-field form-control"
                type="number"
                placeholder=" "
                autoComplete="off"
                value={sNo}
                onChange={(e) => setSNo(e.target.value)}
              />
              <label for="add1" className={`exp-form-labels`}>SNo</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="cno"
                class="exp-input-field form-control"
                type="text"
                placeholder=" "
                autoComplete="off"
                value={AccountHolderName}
                maxLength={200}
                onChange={(e) => setAccountHolderName(e.target.value)}
              />
              <label for="cno" className={`exp-form-labels ${error && !AccountHolderName ? 'text-danger' : ''}`}>Account Holder Name<span className="text-danger">*</span> </label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="Account_NO"
                class="exp-input-field form-control"
                type="Number"
                name="Account_NO"
                placeholder=" "
                autoComplete="off"
                value={Account_NO}
                maxLength={50}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
              <label for="cname" className={`exp-form-labels ${error && !Account_NO ? 'text-danger' : ''}`}>Account Number<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="IFSC_Code"
                class="exp-input-field form-control"
                type="text"
                placeholder=" "
                autoComplete="off"
                value={IFSC_Code}
                maxLength={11}
                onChange={(e) => setIFSCCode(e.target.value)}
              />
              <label for="sname" className={`exp-form-labels ${error && !IFSC_Code ? 'text-danger' : ''}`}>IFSC Code<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="bankName"
                class="exp-input-field form-control"
                type="text"
                placeholder=" "
                autoComplete="off"
                value={bankName}
                maxLength={100}
                onChange={(e) => setBankName(e.target.value)}
              />
              <label for="sname" className={`exp-form-labels ${error && !bankName ? 'text-danger' : ''}`}>Bank Name
                <span className="text-danger">*</span>
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="branchName"
                class="exp-input-field form-control"
                type="text"
                placeholder=" "
                autoComplete="off"
                value={branchName}
                maxLength={100}
                onChange={(e) => setBranchName(e.target.value)}
              />
              <label for="add1" className={`exp-form-labels ${error && !branchName ? 'text-danger' : ''}`}>Branch Name<span className="text-danger">*</span></label>
            </div>
          </div>

          {/* <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedAccountType ? "has-value" : ""} 
              ${isSelectAccountType ? "is-focused" : ""}`}
            >
              <Select
                id="department"
                placeholder=" "
                onFocus={() => setIsSelectAccountType(true)}
                onBlur={() => setIsSelectAccountType(false)}
                classNamePrefix="react-select"
                isClearable
                type="text"
                value={selectedAccountType}
                onChange={handleChangeAccountType}
                options={filteredOptionAccountType}
              />
              <label htmlFor="selecteddpt" className={`floating-label`}>
                Account Type
              </label>
            </div>
          </div> */}

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="bankCity"
                class="exp-input-field form-control"
                type="text"
                placeholder=" "
                autoComplete="off"
                value={bankCity}
                maxLength={50}
                onChange={(e) => setBankCity(e.target.value)}
              />
              <label for="add1" className={`exp-form-labels`}>Bank City</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="bankCountry"
                class="exp-input-field form-control"
                type="text"
                placeholder=" "
                autoComplete="off"
                value={bankCountry}
                maxLength={50}
                onChange={(e) => setBankCountry(e.target.value)}
              />
              <label for="add1" className={`exp-form-labels`}>Bank Country</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="salaryCurrency"
                class="exp-input-field form-control"
                type="text"
                placeholder=" "
                autoComplete="off"
                value={salaryCurrency}
                maxLength={3}
                onChange={(e) => setSalaryCurrency(e.target.value)}
              />
              <label for="add1" className={`exp-form-labels`}>Salary Currency</label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedWPSEnabled ? "has-value" : ""} 
              ${isSelectWPSEnabled ? "is-focused" : ""}`}
            >
              <Select
                id="WPSEnabled"
                placeholder=" "
                onFocus={() => setIsSelectWPSEnabled(true)}
                onBlur={() => setIsSelectWPSEnabled(false)}
                classNamePrefix="react-select"
                isClearable
                type="text"
                value={selectedWPSEnabled}
                onChange={handleChangeWPSEnabled}
                options={filteredOptionBoolean}
              />
              <label htmlFor="selecteddpt" className={`floating-label`}>
                WPS Enabled
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="WPSMemberId"
                class="exp-input-field form-control"
                type="text"
                placeholder=" "
                autoComplete="off"
                value={WPSMemberId}
                maxLength={20}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    setWPSMemberId(value);
                  }
                }}
              />
              <label for="add1" className={`exp-form-labels`}>WPS Member Id</label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedIsPrimaryAccount ? "has-value" : ""} 
              ${isSelectIsPrimaryAccount ? "is-focused" : ""}`}
            >
              <Select
                id="IsPrimaryAccount"
                placeholder=" "
                onFocus={() => setIsSelectIsPrimaryAccount(true)}
                onBlur={() => setIsSelectIsPrimaryAccount(false)}
                classNamePrefix="react-select"
                isClearable
                type="text"
                value={selectedIsPrimaryAccount}
                onChange={handleChangeIsPrimaryAccount}
                options={filteredOptionBoolean}
              />
              <label htmlFor="selecteddpt" className={`floating-label`}>
                Is Primary Account
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedIsActive ? "has-value" : ""} 
              ${isSelectIsActive ? "is-focused" : ""}`}
            >
              <Select
                id="IsActive"
                placeholder=" "
                onFocus={() => setIsSelectIsActive(true)}
                onBlur={() => setIsSelectIsActive(false)}
                classNamePrefix="react-select"
                isClearable
                type="text"
                value={selectedIsActive}
                onChange={handleChangeIsActive}
                options={filteredOptionBoolean}
              />
              <label htmlFor="selecteddpt" className={`floating-label`}>
                Is Active
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedIsDelete ? "has-value" : ""} 
              ${isSelectIsDelete ? "is-focused" : ""}`}
            >
              <Select
                id="IsDelete"
                placeholder=" "
                onFocus={() => setIsSelectIsDelete(true)}
                onBlur={() => setIsSelectIsDelete(false)}
                classNamePrefix="react-select"
                isClearable
                type="text"
                value={selectedIsDelete}
                onChange={handleChangeIsDelete}
                options={filteredOptionBoolean}
              />
              <label htmlFor="selecteddpt" className={`floating-label`}>
                Is Delete
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <div className="image-upload-container">
                {selectedImg ? (
                  <div className="image-preview-box">
                    <img
                      src={selectedImg}
                      alt="Uploaded Logo"
                      className="uploaded-image"
                    />
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
                      <span>Upload Bank Passbook</span>
                    </div>
                  </div>
                )}

                <input
                  type="file"
                  id="locno"
                  className="exp-input-field form-control hidden-file-input"
                  accept="image/*"
                  onChange={handleFileSelect}
                  ref={logo}
                />
              </div>
            </div>
          </div>

        </div>
      </div>
      <Bankaccdetpopup open={open} handleClose={handleClose} Employeebankdetails={Employeebankdetails} />
    </div>
  );
}
export default Input;
