import React, { useState, useEffect, useRef } from "react";
import "../input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import TabButtons from './Tabs.js';
import Select from 'react-select';
import EmployeeInfoPopup from "./EmployeeinfoPopup.js";
import { showConfirmationToast } from '../ToastConfirmation';
import LoadingScreen from '../Loading';

const config = require('../Apiconfig');

function Input({ }) {
  const [activeTab, setActiveTab] = useState('Personal Details');
  const [EmployeeId, setEmployeeId] = useState("");
  const [First_Name, setFirst_Name] = useState("");
  const [first_Name, setfirst_Name] = useState("");
  const [department_id, setdepartment_id] = useState("");
  const [designation_id, setdesignation_id] = useState("");
  const [Middle_Name, setMiddle_Name] = useState("");
  const [Last_Name, setLast_Name] = useState("");
  const [Father_Name, setFather_Name] = useState("");
  const [Mother_Name, setMother_Name] = useState("");
  const [DOB, setDOB] = useState("");
  const [Gender, setGender] = useState("");
  const [Email, setEmail] = useState("");
  const [Grade_id, setGrade_id] = useState("");
  const [Phone1, setPhone1] = useState("");
  const [Phone2, setPhone2] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [address3, setAddress3] = useState("");
  const [error, setError] = useState("");
  const [permanantAddress, setPermanantAddress] = useState("");
  const [reference_Name, setReference_Name] = useState("");
  const [reference_Phone, setReference_Phone] = useState("");
  const [marital_Status, setMarital_Status] = useState("");
  const [Marital_StatusDrop, setMarital_StatusDrop] = useState([]);
  const [pan_No, setPan_No] = useState('');
  const [Aadhaar_no, setAadhar_no] = useState("");
  const [kids, setKids] = useState("");
  const [KidsDrop, setKidsDrop] = useState([]);
  const [genderdrop, setgenderdrop] = useState([]);
  const [IDdrop, setIDdrop] = useState([]);
  const [selectedGender, setselectedGender] = useState("");
  const [selectedkids, setselectedkids] = useState("");
  const [selectedmartial, setselectedmartial] = useState("");
  const [selectedgradeid, setselectedgradeid] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [user_images, setuser_image] = useState("");
  const [saveButtonVisible, setSaveButtonVisible] = useState(true);
  const [updateButtonVisible, setUpdateButtonVisible] = useState(false);
  const [showAsterisk, setShowAsterisk] = useState(true);
  const [loading, setLoading] = useState(false);
  const [placeOfBirth, setPlaceOfBirth] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [spouseName, setSpouseName] = useState('');
  const [noOfChildren, setNoOfChildren] = useState('');
  const [noOfSiblings, setNoOfSiblings] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactRelation, setEmergencyContactRelation] = useState('');
  const [selectedEmergencyContactRelation, setSelectedEmergencyContactRelation] = useState('')
  const [emergencyContactRelationDrop, setEmergencyContactRelationDrop] = useState([]);
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [city, setCity] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [cityDrop, setCityDrop] = useState([]);
  const [title, setTitle] = useState('');
  const [selectedTitle, setSelectedTitle] = useState('');
  const [titleDrop, setTitleDrop] = useState([]);
  const [nationality, setNationality] = useState('');
  const [selectedNationality, setSelectedNationality] = useState('');
  const [nationalityDrop, setNationalityDrop] = useState([]);
  const [religion, setReligion] = useState('');
  const [selectedReligion, setSelectedReligion] = useState('');
  const [religionDrop, setReligionDrop] = useState([]);
  const [state, setState] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [stateDrop, setStateDrop] = useState([]);
  const [country, setCountry] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [countryDrop, setCountryDrop] = useState([]);
  const [postalCode, setPostalCode] = useState('');
  const [passportNo, setPassportNo] = useState('');
  const [passportExpiryDate, setPassportExpiryDate] = useState('');
  const [otherIdType, setOtherIdType] = useState('');
  const [selectedOtherIdType, setSelectedOtherIdType] = useState('');
  const [otherDrop, setOtherDrop] = useState([]);
  const [otherIdNo, setOtherIdNo] = useState('');


  const [isSelectGender, setIsSelectGender] = useState(false);
  const [isSelectGrade, setIsSelectGrade] = useState(false);
  const [isSelectKids, setIsSelectKids] = useState(false);
  const [isSelectTitle, setIsSelectTitle] = useState(false);
  const [isSelectReligion, setIsSelectReligion] = useState(false);
  const [isSelectNationality, setIsSelectNationality] = useState(false);
  const [isSelectRelation, setIsSelectRelation] = useState(false);
  const [isSelectMarital, setIsSelectMarital] = useState(false);
  const [isSelectCity, setIsSelectCity] = useState(false);
  const [isSelectState, setIsSelectState] = useState(false);
  const [isSelectCountry, setIsSelectCountry] = useState(false);
  const [isSelectOtherType, setIsSelectOtherType] = useState(false);
  const logo = useRef(null)

  //code added by Pavun purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem('permissions')) || {};
  const employeePermissions = permissions
    .filter(permission => permission.screen_type === 'AddEmployeeInfo')
    .map(permission => permission.permission_type.toLowerCase());

  const handleInsert = async () => {
    if (
      !First_Name ||
      !Last_Name ||
      !Father_Name ||
      !Mother_Name ||
      !DOB ||
      !Gender ||
      !Email ||
      !Phone1 ||
      !Phone2 ||
      !address1 ||
      !address2 ||
      !address3 ||
      !permanantAddress ||
      !pan_No ||
      !Aadhaar_no ||
      !selectedmartial ||
      !kids ||
      !Grade_id ||
      !title ||
      !placeOfBirth ||
      !nationality ||
      !religion ||
      !bloodGroup ||
      !emergencyContactName ||
      !emergencyContactPhone ||
      !emergencyContactRelation ||
      !city ||
      !state ||
      !country ||
      !postalCode
    ) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }

    if (!validateEmail(Email)) {
      toast.warning("Please enter a valid email address")
      setError("Please enter a valid email address");
      return;
    }

    if (businessEmail && !validateEmail(businessEmail)) {
      toast.warning("Please enter a valid business email");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("EmployeeId", EmployeeId);
      formData.append("First_Name", First_Name);
      formData.append("Middle_Name", Middle_Name);
      formData.append("Last_Name", Last_Name);
      formData.append("Father_Name", Father_Name);
      formData.append("Mother_Name", Mother_Name);
      formData.append("DOB", DOB);
      formData.append("Gender", selectedGender);
      formData.append("Email", Email);
      formData.append("Phone1", Phone1);
      formData.append("Phone2", Phone2);
      formData.append("Address1", address1);
      formData.append("Address2", address2);
      formData.append("Address3", address3);
      formData.append("PermanantAddress", permanantAddress);
      formData.append("Reference_Name", reference_Name);
      formData.append("Reference_Phone", reference_Phone);
      formData.append("Pan_No", pan_No);
      formData.append("Aadhar_no", Aadhaar_no);
      formData.append("Marital_Status", selectedmartial);
      formData.append("Kids", selectedkids);
      formData.append("Grade_id", selectedgradeid);
      formData.append("City", city);
      formData.append("State", state);
      formData.append("Country", country);
      formData.append("Postal_Code", postalCode);
      formData.append("Emergency_Contact_Phone", emergencyContactPhone);
      formData.append("Emergency_Contact_Relationship", emergencyContactRelation);
      formData.append("Emergency_Contact_Name", emergencyContactName);
      formData.append("Email_Business", businessEmail);
      formData.append("Number_of_Children", noOfChildren);
      formData.append("Number_of_Siblings", noOfSiblings);
      formData.append("Spouse_Name", spouseName);
      formData.append("Other_Id_No", otherIdNo);
      formData.append("Blood_Group", bloodGroup);
      formData.append("Other_Id_Type", otherIdType);
      formData.append("Religion", religion);
      formData.append("Nationality", nationality);
      formData.append("Passport_Expiry_Date", passportExpiryDate);
      formData.append("Title", title);
      formData.append("Place_of_Birth", placeOfBirth);
      formData.append("Passport_No", passportNo);
      formData.append("Created_by", sessionStorage.getItem("selectedUserCode"));
      formData.append("company_code", sessionStorage.getItem('selectedCompanyCode'));
      if (user_images) {
        formData.append("Photos", user_images);
      }

      const response = await fetch(`${config.apiBaseUrl}/addEmployeePersonalData`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const searchData = await response.json();
        console.log(searchData);
        const [{ EmployeeId }] = searchData;
        setEmployeeId(EmployeeId);

        toast.success("Employee Personal Data inserted Successfully")

        console.log("Employee Personal Data Data inserted successfully");
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to insert Employee Personal Data");
        console.error(errorResponse.details || errorResponse.message);
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error('Error inserting data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  function validateEmail(email) {
    const emailRegex = /^[A-Za-z\._\-0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/;
    return emailRegex.test(email);
  }

  const handleUpdate = async () => {
    if (

      !First_Name ||
      !Middle_Name ||
      !Last_Name ||
      !Father_Name ||
      !Mother_Name ||
      !DOB ||
      !Gender ||
      !Email ||
      !Phone1 ||
      !Phone2 ||
      !address2 ||
      !address3 ||
      !permanantAddress ||
      !reference_Name ||
      !pan_No ||
      !Aadhaar_no ||
      !marital_Status ||
      !kids ||
      !Grade_id ||
      !title ||
      !placeOfBirth ||
      !nationality ||
      !religion ||
      !bloodGroup ||
      !emergencyContactName ||
      !emergencyContactPhone ||
      !emergencyContactRelation ||
      !city ||
      !state ||
      !country ||
      !postalCode
    ) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }

    if (!validateEmail(Email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (businessEmail && !validateEmail(businessEmail)) {
      toast.warning("Please enter a valid business email");
      return;
    }

    showConfirmationToast(
      "Are you sure you want to update the data ?",
      async () => {
        try {
          const formData = new FormData();
          formData.append("EmployeeId", EmployeeId);
          formData.append("First_Name", First_Name);
          formData.append("Middle_Name", Middle_Name);
          formData.append("Last_Name", Last_Name);
          formData.append("Father_Name", Father_Name);
          formData.append("Mother_Name", Mother_Name);
          formData.append("DOB", DOB);
          formData.append("Gender", selectedGender);
          formData.append("Email", Email);
          formData.append("Phone1", Phone1);
          formData.append("Phone2", Phone2);
          formData.append("Address1", address1);
          formData.append("Address2", address2);
          formData.append("Address3", address3);
          formData.append("PermanantAddress", permanantAddress);
          formData.append("Reference_name", reference_Name);
          formData.append("Reference_Phone", reference_Phone);
          formData.append("Pan_No", pan_No);
          formData.append("Aadhar_no", Aadhaar_no);
          formData.append("Marital_Status", selectedmartial);
          formData.append("Kids", selectedkids);
          formData.append("Grade_id", selectedgradeid);
          formData.append("City", city);
          formData.append("State", state);
          formData.append("Country", country);
          formData.append("Postal_Code", postalCode);
          formData.append("Emergency_Contact_Phone", emergencyContactPhone);
          formData.append("Emergency_Contact_Relationship", emergencyContactRelation);
          formData.append("Emergency_Contact_Name", emergencyContactName);
          formData.append("Email_Business", businessEmail);
          formData.append("Number_of_Children", noOfChildren);
          formData.append("Number_of_Siblings", noOfSiblings);
          formData.append("Spouse_Name", spouseName);
          formData.append("Other_Id_No", otherIdNo);
          formData.append("Blood_Group", bloodGroup);
          formData.append("Other_Id_Type", otherIdType);
          formData.append("Religion", religion);
          formData.append("Nationality", nationality);
          formData.append("Passport_Expiry_Date", passportExpiryDate);
          formData.append("Title", title);
          formData.append("Place_of_Birth", placeOfBirth);
          formData.append("Passport_No", passportNo);
          formData.append("company_code", sessionStorage.getItem('selectedCompanyCode'));
          formData.append("modified_by", sessionStorage.getItem('selectedUserCode'));

          if (user_images) {
            formData.append("Photos", user_images);
          }
          const response = await fetch(`${config.apiBaseUrl}/Employeedataupdate`, {
            method: "POST",
            body: formData,
          });

          if (response.status === 200) {
            console.log("Data Updated successfully");
            toast.success("Data Updated successfully!")
          } else {
            const errorResponse = await response.json();
            console.error(errorResponse.message);
            toast.warning(errorResponse.message);
          }
        } catch (error) {
          console.error("Error Update data:", error);
          toast.error('Error inserting data: ' + error.message);
        }
      },
      () => {
        toast.info("Data updated cancelled.");
      }
    );
  };

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

  const Insurance1 = () => {
    navigate("/Family", { state: { employeeId: EmployeeId, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const Documents = () => {
    navigate("/Documents", { state: { employeeId: EmployeeId, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const EmployeeLoan = () => {
    navigate("/AddEmployeeInfo", { state: { employeeId: EmployeeId, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

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

  const handleGradeID = (selectedgradeid) => {
    setGrade_id(selectedgradeid);
    setselectedgradeid(selectedgradeid ? selectedgradeid.value : '');
  };

  const filteredOptionGradeid = Array.isArray(IDdrop)
    ? IDdrop.map((option) => ({
      value: option.GradeID,
      label: option.GradeID,
    }))
    : [];

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getID`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),

      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setIDdrop(data); // Store the fetched gender options in state
        }
      })
      .catch((error) => {
        console.error('Error fetching gender data:', error);
      });
  }, []);

  const Handlegender = (selectedgender) => {
    setGender(selectedgender);
    setselectedGender(selectedgender ? selectedgender.value : '');

  };

  const filteredOptiongender = genderdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/gender`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),

      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setgenderdrop(data); // Store the fetched gender options in state
        }
      })
      .catch((error) => {
        console.error('Error fetching gender data:', error);
      });
  }, []);

  const handleKids = (selectedkids) => {
    setKids(selectedkids);
    setselectedkids(selectedkids ? selectedkids.value : '');
  };

  const filteredOptionKids = KidsDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getKids`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),

      }),
    })
      .then((data) => data.json())
      .then((val) => setKidsDrop(val));
  }, []);

  const handleChangeTitle = (selectedTitle) => {
    setSelectedTitle(selectedTitle);
    setTitle(selectedTitle ? selectedTitle.value : '');
  };

  const filteredOptionTitle = titleDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getTitle`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),

      }),
    })
      .then((data) => data.json())
      .then((val) => setTitleDrop(val));
  }, []);

  const handleChangeNationality = (selectedNationality) => {
    setSelectedNationality(selectedNationality);
    setNationality(selectedNationality ? selectedNationality.value : '');
  };

  const filteredOptionNationality = nationalityDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

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

  const handleChangeReligion = (selectedReligion) => {
    setSelectedReligion(selectedReligion);
    setReligion(selectedReligion ? selectedReligion.value : '');
  };

  const filteredOptionReligion = religionDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getReligion`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),

      }),
    })
      .then((data) => data.json())
      .then((val) => setReligionDrop(val));
  }, []);

  const handlemartial = (martilalselected) => {
    setMarital_Status(martilalselected);
    setselectedmartial(martilalselected ? martilalselected.value : '');
  };

  const filteredOptionmartial = Marital_StatusDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getMartial`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((data) => data.json())
      .then((val) => setMarital_StatusDrop(val));
  }, []);

  const handleChangeRelation = (selectedEmergencyContactRelation) => {
    setSelectedEmergencyContactRelation(selectedEmergencyContactRelation);
    setEmergencyContactRelation(selectedEmergencyContactRelation ? selectedEmergencyContactRelation.value : '');
  };

  const filteredOptionRelation = emergencyContactRelationDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  useEffect(() => {

    fetch(`${config.apiBaseUrl}/getrelation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((data) => data.json())
      .then((val) => setEmergencyContactRelationDrop(val));
  }, []);

  const handleChangeCity = (selectedCity) => {
    setSelectedCity(selectedCity);
    setCity(selectedCity ? selectedCity.value : '');
  };

  const filteredOptionCity = cityDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/city`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setCityDrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleChangeCountry = (selectedCountry) => {
    setSelectedCountry(selectedCountry);
    setCountry(selectedCountry ? selectedCountry.value : '');
  };

  const filteredOptionCountry = countryDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/country`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setCountryDrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleChangeState = (selectedState) => {
    setSelectedState(selectedState);
    setState(selectedState ? selectedState.value : '');
  };

  const filteredOptionState = stateDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/state`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setStateDrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleChangeOtherType = (selectedOtherIdType) => {
    setSelectedOtherIdType(selectedOtherIdType);
    setOtherIdType(selectedOtherIdType ? selectedOtherIdType.value : '');
  };

  const filteredOptionOtherType = otherDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getDocumentType`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((data) => data.json())
      .then((val) => setOtherDrop(val));
  }, []);

  const handleRemoveLogo = () => {
    setSelectedImage(null);
    if (logo.current) {
      logo.current.value = "";
    }
  };

  const handleFileSelect1 = (event) => {
    const file = event.target.files[0];
    if (file) {
      const maxSize = 1 * 1024 * 1024;
      if (file.size > maxSize) {
        Swal.fire({
          icon: 'error',
          title: 'File Too Large',
          text: 'File size exceeds 1MB. Please upload a smaller file.',
          confirmButtonText: 'OK'
        });
        event.target.value = null;
        return;
      }
      if (file) {
        setSelectedImage(URL.createObjectURL(file));
        setuser_image(file);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleRefNo(EmployeeId)
    }
  };

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleRefNo = async (code) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getEmployeePersonaldet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ Id: code, company_code: sessionStorage.getItem("selectedCompanyCode"), })
      });
      if (response.ok) {
        setSaveButtonVisible(false);
        setUpdateButtonVisible(true);
        const searchData = await response.json();
        const [{ EmployeeId, First_Name, Middle_Name, Last_Name, father_name, mother_name, DOB,
          email, Aadhar_no, Reference_Phone, phone1, phone2, Address1, address2, address3,
          PermanantAddress, designation_id, department_id, Reference_name, Pan_No, Photos, Grade_id, Gender,
          Marital_Status, Kids, Title, Place_of_Birth, Nationality, Religion, Blood_Group, Spouse_Name,
          Number_of_Siblings, Number_of_Children, Email_Business, Phone_Alternate, Emergency_Contact_Name,
          Emergency_Contact_Relationship, Emergency_Contact_Phone, City, State, Country, Postal_Code, Passport_No,
          Passport_Expiry_Date, Other_Id_Type, Other_Id_No }] = searchData;

        setEmployeeId(EmployeeId);
        setFirst_Name(First_Name);
        setfirst_Name(First_Name);
        setMiddle_Name(Middle_Name);
        setLast_Name(Last_Name);
        setFather_Name(father_name);
        setMother_Name(mother_name);
        setDOB(formatDate(DOB));
        setEmail(email);
        setAadhar_no(Aadhar_no);
        setReference_Phone(Reference_Phone);
        setPhone1(phone1);
        setPhone2(phone2);
        setAddress1(Address1);
        setAddress2(address2);
        setAddress3(address3);
        setPermanantAddress(PermanantAddress);
        setReference_Name(Reference_name);
        setdepartment_id(department_id);
        setdesignation_id(designation_id);
        setPlaceOfBirth(Place_of_Birth);
        setBloodGroup(Blood_Group);
        setSpouseName(Spouse_Name);
        setNoOfSiblings(Number_of_Siblings);
        setNoOfChildren(Number_of_Children);
        setBusinessEmail(Email_Business);
        setEmergencyContactName(Emergency_Contact_Name);
        setEmergencyContactPhone(Emergency_Contact_Phone);
        setPostalCode(Postal_Code);
        setPassportNo(Passport_No);
        setPassportExpiryDate(formatDate(Passport_Expiry_Date));
        setOtherIdNo(Other_Id_No);

        const imageBlob = new Blob([new Uint8Array(Photos.data)], { type: 'image/jpeg' });

        setuser_image(imageBlob);

        const imageUrl = URL.createObjectURL(imageBlob);
        setSelectedImage(imageUrl);

        setPan_No(Pan_No);

        const selectedGrade = filteredOptionGradeid.find(option => option.value === Grade_id);
        setGrade_id(selectedGrade);
        setselectedgradeid(selectedGrade?.value || null);

        const selectedGender = filteredOptiongender.find(option => option.value === Gender);
        setGender(selectedGender);
        setselectedGender(selectedGender?.value || null);

        const martialStatus = filteredOptionmartial.find(option => option.value === Marital_Status);
        setMarital_Status(martialStatus);
        setselectedmartial(martialStatus?.value || null);

        const kids = filteredOptionKids.find(option => option.value === Kids);
        setKids(kids);
        setselectedkids(kids?.value || null);

        const selectedTitle = filteredOptionTitle.find(option => option.value === Title);
        setSelectedTitle(selectedTitle);
        setTitle(selectedTitle?.value || null);

        const selectedNationality = filteredOptionNationality.find(option => option.value === Nationality);
        setSelectedNationality(selectedNationality);
        setNationality(selectedNationality?.value || null);

        const selectedReligion = filteredOptionReligion.find(option => option.value === Religion);
        setSelectedReligion(selectedReligion);
        setReligion(selectedReligion?.value || null);

        const selectedEmergencyContactRelation = filteredOptionRelation.find(option => option.value === Emergency_Contact_Relationship);
        setSelectedEmergencyContactRelation(selectedEmergencyContactRelation);
        setEmergencyContactRelation(selectedEmergencyContactRelation?.value || null);

        const selectedCity = filteredOptionCity.find(option => option.value === City);
        setSelectedCity(selectedCity);
        setCity(selectedCity?.value || null);

        const selectedState = filteredOptionState.find(option => option.value === State);
        setSelectedState(selectedState);
        setState(selectedState?.value || null);

        const selectedCountry = filteredOptionCountry.find(option => option.value === Country);
        setSelectedCountry(selectedCountry);
        setCountry(selectedCountry?.value || null);

        const selectedOtherIdType = filteredOptionOtherType.find(option => option.value === Other_Id_Type);
        setSelectedOtherIdType(selectedOtherIdType);
        setOtherIdType(selectedOtherIdType?.value || null);

        console.log("data fetched successfully")
      } else if (response.status === 404) {
        toast.error("Data not found")
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

  const handleDelete = async () => {
    if (
      !EmployeeId) {
      toast.warning("Please fill all required fields.");
      return;
    }

    showConfirmationToast(
      "Are you sure you want to Delete the data ?",
      async () => {
        setLoading(true);
        try {
          const deatils = {
            EmployeeId: EmployeeId,
            company_code: sessionStorage.getItem("selectedCompanyCode")
          }

          const response = await fetch(`${config.apiBaseUrl}/deleteemployeedata`, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(deatils),
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
            console.error(errorResponse.message);
            toast.warning(errorResponse.message, {
            })
          }
        } catch (error) {
          console.error("Error delete data:", error);
          toast.error('Error delete data: ' + error.message, {
          });
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
    window.location.reload();
  };

  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleEmployeeInfo = () => {
    setOpen(true);
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

  const EmployeeInfo = (data) => {
    if (!data || data.length === 0) return;

    setSaveButtonVisible(false);
    setUpdateButtonVisible(true);

    const [{
      EmployeeId, First_Name, Middle_Name, Last_Name, Father_Name, Mother_Name, DOB,
      Email, Aadhar_no, Reference_Phone, phone1, phone2,
      Address1, Address2, Address3, PermanantAddress,
      designation_id, department_id, Reference_Name, Pan_No,
      Photos, Grade_id, Gender, Marital_Status, Kids, Title,
      Place_of_Birth, Nationality, Religion, Blood_Group, Spouse_Name,
      Number_of_Siblings, Number_of_Children, Email_Business,
      Emergency_Contact_Name, Emergency_Contact_Phone,
      Emergency_Contact_Relationship, City, State, Country,
      Postal_Code, Passport_No, Passport_Expiry_Date,
      Other_Id_Type, Other_Id_No
    }] = data;

    // 🔹 BASIC FIELDS
    setEmployeeId(EmployeeId);
    setFirst_Name(First_Name);
    setfirst_Name(First_Name);
    setMiddle_Name(Middle_Name);
    setLast_Name(Last_Name);
    setFather_Name(Father_Name);
    setMother_Name(Mother_Name);
    setDOB(formatDate(DOB));
    setEmail(Email);
    setPhone1(phone1);
    setPhone2(phone2);
    setAddress1(Address1);
    setAddress2(Address2);
    setAddress3(Address3);
    setPermanantAddress(PermanantAddress);
    setReference_Name(Reference_Name);
    setReference_Phone(Reference_Phone);
    setPan_No(Pan_No);
    setAadhar_no(Aadhar_no);
    setdepartment_id(department_id);
    setdesignation_id(designation_id);
    setPlaceOfBirth(Place_of_Birth);
    setBloodGroup(Blood_Group);
    setSpouseName(Spouse_Name);
    setNoOfSiblings(Number_of_Siblings);
    setNoOfChildren(Number_of_Children);
    setBusinessEmail(Email_Business);
    setEmergencyContactName(Emergency_Contact_Name);
    setEmergencyContactPhone(Emergency_Contact_Phone);
    setPostalCode(Postal_Code);
    setPassportNo(Passport_No);
    setPassportExpiryDate(formatDate(Passport_Expiry_Date));
    setOtherIdNo(Other_Id_No);

    if(Photos){
    const imageBlob = base64ToBlob(Photos);
    setuser_image(imageBlob);
    const imageUrl = URL.createObjectURL(imageBlob);
    setSelectedImage(imageUrl);
    }

    // 🔽 DROPDOWN VALUE FETCH (SAME AS handleRefNo)

    const selectedGrade = filteredOptionGradeid.find(o => o.value === Grade_id);
    setGrade_id(selectedGrade);
    setselectedgradeid(selectedGrade?.value || null);

    const selectedGender = filteredOptiongender.find(o => o.value === Gender);
    setGender(selectedGender);
    setselectedGender(selectedGender?.value || null);

    const selectedMartial = filteredOptionmartial.find(o => o.value === Marital_Status);
    setMarital_Status(selectedMartial);
    setselectedmartial(selectedMartial?.value || null);

    const selectedKids = filteredOptionKids.find(o => o.value === Kids);
    setKids(selectedKids);
    setselectedkids(selectedKids?.value || null);

    const selectedTitle = filteredOptionTitle.find(o => o.value === Title);
    setSelectedTitle(selectedTitle);
    setTitle(selectedTitle?.value || null);

    const selectedNationality = filteredOptionNationality.find(o => o.value === Nationality);
    setSelectedNationality(selectedNationality);
    setNationality(selectedNationality?.value || null);

    const selectedReligion = filteredOptionReligion.find(o => o.value === Religion);
    setSelectedReligion(selectedReligion);
    setReligion(selectedReligion?.value || null);

    const selectedRelation = filteredOptionRelation.find(o => o.value === Emergency_Contact_Relationship);
    setSelectedEmergencyContactRelation(selectedRelation);
    setEmergencyContactRelation(selectedRelation?.value || null);

    const selectedCity = filteredOptionCity.find(o => o.value === City);
    setSelectedCity(selectedCity);
    setCity(selectedCity?.value || null);

    const selectedState = filteredOptionState.find(o => o.value === State);
    setSelectedState(selectedState);
    setState(selectedState?.value || null);

    const selectedCountry = filteredOptionCountry.find(o => o.value === Country);
    setSelectedCountry(selectedCountry);
    setCountry(selectedCountry?.value || null);

    const selectedOtherIdType = filteredOptionOtherType.find(o => o.value === Other_Id_Type);
    setSelectedOtherIdType(selectedOtherIdType);
    setOtherIdType(selectedOtherIdType?.value || null);

    console.log("Popup data mapped successfully");
  };



  // useEffect(() => {
  //   if (location.state) {
  //     if (location.state.employeeId) {
  //       setEmployeeId(location.state.employeeId);
  //     }
  //     if (location.state.firstName) {
  //       setfirst_Name(location.state.firstName);
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
      genderdrop?.length > 0 &&
      IDdrop?.length > 0 &&
      Marital_StatusDrop?.length > 0 &&
      KidsDrop?.length > 0
    ) {
      handleRefNo(employeeId);
    }
  }, [location.state, genderdrop, IDdrop, Marital_StatusDrop, KidsDrop]);

  return (
    <div class="container-fluid Topnav-screen">
      {loading && <LoadingScreen />}
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="shadow-lg p-1 bg-light rounded main-header-box">
        <div className="header-flex">
          <h1 className="page-title">Add Employee Info</h1>
          <div className="action-wrapper desktop-actions">
            {saveButtonVisible && ['add', 'all permission'].some(permission => employeePermissions.includes(permission)) && (
              <div className="action-icon add" onClick={handleInsert}>
                <span className="tooltip">save</span>
                <i class="fa-solid fa-floppy-disk"></i>
              </div>
            )}
            {updateButtonVisible && ['update', 'all permission'].some(permission => employeePermissions.includes(permission)) && (
              <div className="action-icon update" onClick={handleUpdate}>
                <span className="tooltip">Update</span>
                <i class="fa-solid fa-pen-to-square"></i>
              </div>
            )}
            {['delete', 'all permission'].some(permission => employeePermissions.includes(permission)) && (
              <div className="action-icon delete" onClick={handleDelete}>
                <span className="tooltip">Delete</span>
                <i class="fa-solid fa-trash"></i>
              </div>
            )}
            <div className="action-icon print" onClick={reloadGridData}>
              <span className="tooltip">Reload</span>
              <i className="fa-solid fa-arrow-rotate-right"></i>
            </div>
          </div>

          {/* Mobile Dropdown */}
          <div className="dropdown mobile-actions">
            <button className="btn btn-primary dropdown-toggle p-1" data-bs-toggle="dropdown">
              <i className="fa-solid fa-list"></i>
            </button>

            <ul className="dropdown-menu dropdown-menu-end text-center">

              {saveButtonVisible && ['add', 'all permission'].some(p => employeePermissions.includes(p)) && (
                <li className="dropdown-item" onClick={handleInsert}>
                  <i className="fa-solid fa-floppy-disk text-success fs-4"></i>
                </li>
              )}

              {updateButtonVisible && ['update', 'all permission'].some(p => employeePermissions.includes(p)) && (
                <li className="dropdown-item" onClick={handleUpdate}>
                  <i className="fa-solid fa-pen-to-square text-primary fs-4"></i>
                </li>
              )}

              {['delete', 'all permission'].some(p => employeePermissions.includes(p)) && (
                <li className="dropdown-item" onClick={handleDelete}>
                  <i className="fa-solid fa-user-minus text-danger fs-4"></i>
                </li>
              )}

              <li className="dropdown-item" onClick={reloadGridData}>
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
                id="EmployeeId"
                className="exp-input-field form-control"
                type="text"
                placeholder=" "
                autoComplete="off"
                required
                value={EmployeeId}
                maxLength={100}
                onChange={(e) => setEmployeeId(e.target.value)}
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
                  <strong>Employee Name:</strong> {first_Name}
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
                id="FirstName"
                class="exp-input-field form-control"
                type="text"
                placeholder=" "
                required
                value={First_Name}
                onChange={(e) => setFirst_Name(e.target.value)}
                maxLength={75}
                autoComplete="off"
              />
              <label htmlFor="FirstName" className={`exp-form-labels ${error && !First_Name ? 'text-danger' : ''}`}>First Name{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="MiddleName"
                class="exp-input-field form-control"
                type="text"
                placeholder=" "
                value={Middle_Name}
                onChange={(e) => setMiddle_Name(e.target.value)}
                maxLength={75}
                autoComplete="off"
              />
              <label htmlFor="MiddleName" className="exp-form-labels">Middle Name</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="LastName"
                class="exp-input-field form-control"
                type="text"
                placeholder=" "
                value={Last_Name}
                onChange={(e) => setLast_Name(e.target.value)}
                maxLength={75}
                autoComplete="off"
              />
              <label htmlFor="LastName" className={`exp-form-labels ${error && !Last_Name ? 'text-danger' : ''}`}>Last Name{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="FatherName"
                class="exp-input-field form-control"
                type="text"
                placeholder=" "
                value={Father_Name}
                onChange={(e) => setFather_Name(e.target.value)}
                maxLength={100}
                autoComplete="off"
              />
              <label htmlFor="FatherName" className={`exp-form-labels ${error && !Father_Name ? 'text-danger' : ''}`}>Father Name{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="MotherName"
                class="exp-input-field form-control"
                type="text"
                placeholder=" "
                value={Mother_Name}
                onChange={(e) => setMother_Name(e.target.value)}
                maxLength={100}
                autoComplete="off"
              />
              <label htmlFor="MotherName" className={`exp-form-labels ${error && !Mother_Name ? 'text-danger' : ''}`}>
                Mother Name{showAsterisk && <span className="text-danger">*</span>}
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="dob"
                class="exp-input-field form-control"
                type="date"
                placeholder=""
                value={DOB}
                onChange={(e) => setDOB(e.target.value)}
              />
              <label htmlFor="dob" className={`exp-form-labels ${error && !DOB ? 'text-danger' : ''}`}>DOB{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${Gender ? "has-value" : ""} 
              ${isSelectGender ? "is-focused" : ""}`}
            >
              <Select
                inputId="gender"
                name="gender"
                type="text"
                placeholder=" "
                onFocus={() => setIsSelectGender(true)}
                onBlur={() => setIsSelectGender(false)}
                classNamePrefix="react-select"
                isClearable
                value={Gender}
                options={filteredOptiongender}
                onChange={Handlegender}
                maxLength={10}
                autoComplete="off"
              />
              <label htmlFor="gender" className={`floating-label ${error && !selectedGender ? 'text-danger' : ''}`}>Gender{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="email"
                className="exp-input-field form-control"
                type="email"
                placeholder=""
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={225}
                autoComplete="off"
              />
              <label htmlFor="email" className={`exp-form-labels ${error && !Email ? 'text-danger' : ''}`}>Email{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${Grade_id ? "has-value" : ""} 
              ${isSelectGrade ? "is-focused" : ""}`}
            >
              <Select
                inputId="gradeid"
                name="gradeid"
                placeholder=" "
                onFocus={() => setIsSelectGrade(true)}
                onBlur={() => setIsSelectGrade(false)}
                classNamePrefix="react-select"
                isClearable
                value={Grade_id}
                onChange={handleGradeID}
                options={filteredOptionGradeid}
              />
              <label htmlFor="gradeid" className={`floating-label ${error && !selectedgradeid ? 'text-danger' : ''}`}>Grade ID{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="Phone"
                className="exp-input-field form-control"
                type="number"
                placeholder=""
                required
                value={Phone1}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 13) {
                    setPhone1(value);
                  }
                }}
                maxLength={13}
                autoComplete="off"
              />
              <label htmlFor="Phone" className={`exp-form-labels ${error && !Phone1 ? 'text-danger' : ''}`}>Phone No{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="phone2"
                className="exp-input-field form-control"
                type="Number"
                placeholder=""
                value={Phone2}
                // onChange={(e) => setPhone2(e.target.value)}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 13) {
                    setPhone2(value);
                  }
                }}
                maxLength={20}
                autoComplete="off"
              />
              <label htmlFor="phone2" className={`exp-form-labels ${error && !Phone2 ? 'text-danger' : ''}`}>Alternative Phone No{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="address1"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                value={address1}
                onChange={(e) => setAddress1(e.target.value)}
                maxLength={100}
                autoComplete="off"
              />
              <label htmlFor="address1" className={`exp-form-labels ${error && !address1 ? 'text-danger' : ''}`}>Address 1{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="address2"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                value={address2}
                maxLength={100}
                onChange={(e) => setAddress2(e.target.value)}
                autoComplete="off"
              />
              <label htmlFor="address2" className={`exp-form-labels ${error && !address2 ? 'text-danger' : ''}`}>Address 2{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="address3"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                value={address3}
                onChange={(e) => setAddress3(e.target.value)}
                autoComplete="off"
                maxLength={100}
              />
              <label htmlFor="address3" className={`exp-form-labels ${error && !address3 ? 'text-danger' : ''}`}>Address 3{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="permanantAddress"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                value={permanantAddress}
                onChange={(e) => setPermanantAddress(e.target.value)}
                autoComplete="off"
                maxLength={300}
              />
              <label htmlFor="permanantAddress" className={`exp-form-labels ${error && !permanantAddress ? 'text-danger' : ''}`}>Permanent Address{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="ReferenceName"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                value={reference_Name}
                onChange={(e) => setReference_Name(e.target.value)}
                autoComplete="off"
                maxLength={100}
              />
              {/* <label htmlFor="ReferenceName" className="exp-form-labels">Reference Name</label> */}
              <label for="ReferenceName" className={`exp-form-labels ${error && !reference_Name ? 'text-danger' : ''}`}>Reference Name<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="ReferencePhone"
                class="exp-input-field form-control"
                type="Number"
                placeholder=""
                value={reference_Phone}
                // onChange={(e) => setReference_Phone(e.target.value)}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 13) {
                    setReference_Phone(value);
                  }
                }}
                autoComplete="off"
                maxLength={20}
              />
              <label for="ReferencePhone" className={`exp-form-labels ${error && !reference_Phone ? 'text-danger' : ''}`}>Reference Phone No<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${marital_Status ? "has-value" : ""} 
              ${isSelectMarital ? "is-focused" : ""}`}
            >
              <Select
                inputId="maritalStatus"
                name="maritalStatus"
                placeholder=" "
                onFocus={() => setIsSelectMarital(true)}
                onBlur={() => setIsSelectMarital(false)}
                classNamePrefix="react-select"
                isClearable
                value={marital_Status}
                onChange={handlemartial}
                options={filteredOptionmartial}
                autoComplete="off"
              />
              <label htmlFor="maritalStatus" className={`floating-label ${error && !selectedmartial ? 'text-danger' : ''}`}>Marital Status{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="Panno"
                class="exp-input-field form-control"
                type="text"
                placeholder=" "
                value={pan_No}
                // onChange={(e) => setPan_No(e.target.value)}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 13) {
                    setPan_No(value);
                  }
                }}
                autoComplete="off"
                maxLength={20}
              />
              <label htmlFor="Panno" className={`exp-form-labels ${error && !pan_No ? 'text-danger' : ''}`}>PAN No{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="Aadharno"
                class="exp-input-field form-control"
                type="Number"
                placeholder=""
                value={Aadhaar_no}
                // onChange={(e) => setAadhar_no(e.target.value)}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 12) {
                    setAadhar_no(value);
                  }
                }}
                autoComplete="off"
                maxLength={18}
              />
              <label htmlFor="Aadharno" className={`exp-form-labels ${error && !Aadhaar_no ? 'text-danger' : ''}`}>Aadhaar No{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${kids ? "has-value" : ""} 
              ${isSelectKids ? "is-focused" : ""}`}
            >
              <Select
                inputId="KidS"
                name="KidS"
                value={kids}
                onChange={handleKids}
                options={filteredOptionKids}
                autoComplete="off"
                placeholder=" "
                onFocus={() => setIsSelectKids(true)}
                onBlur={() => setIsSelectKids(false)}
                classNamePrefix="react-select"
                isClearable
              />
              <label htmlFor="KidS" className={`floating-label ${error && !selectedkids ? 'text-danger' : ''}`}>Kids{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedTitle ? "has-value" : ""} 
              ${isSelectTitle ? "is-focused" : ""}`}
            >
              <Select
                inputId="title"
                name="title"
                value={selectedTitle}
                onChange={handleChangeTitle}
                options={filteredOptionTitle}
                autoComplete="off"
                placeholder=" "
                onFocus={() => setIsSelectTitle(true)}
                onBlur={() => setIsSelectTitle(false)}
                classNamePrefix="react-select"
                isClearable
              />
              <label htmlFor="title" className={`floating-label ${error && !title ? 'text-danger' : ''}`}>Title{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="placeOfBirth"
                className="exp-input-field form-control"
                type="text"
                placeholder=""
                value={placeOfBirth}
                onChange={(e) => setPlaceOfBirth(e.target.value)}
                maxLength={100}
                autoComplete="off"
              />
              <label htmlFor="placeOfBirth" className={`exp-form-labels ${error && !placeOfBirth ? 'text-danger' : ''}`}>Place of Birth{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedNationality ? "has-value" : ""} 
              ${isSelectNationality ? "is-focused" : ""}`}
            >
              <Select
                inputId="nationality"
                name="nationality"
                value={selectedNationality}
                onChange={handleChangeNationality}
                options={filteredOptionNationality}
                autoComplete="off"
                placeholder=" "
                onFocus={() => setIsSelectNationality(true)}
                onBlur={() => setIsSelectNationality(false)}
                classNamePrefix="react-select"
                isClearable
              />
              <label htmlFor="nationality" className={`floating-label ${error && !nationality ? 'text-danger' : ''}`}>Nationality{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedReligion ? "has-value" : ""} 
              ${isSelectReligion ? "is-focused" : ""}`}
            >
              <Select
                inputId="religion"
                name="religion"
                value={selectedReligion}
                onChange={handleChangeReligion}
                options={filteredOptionReligion}
                autoComplete="off"
                placeholder=" "
                onFocus={() => setIsSelectReligion(true)}
                onBlur={() => setIsSelectReligion(false)}
                classNamePrefix="react-select"
                isClearable
              />
              <label htmlFor="religion" className={`floating-label ${error && !religion ? 'text-danger' : ''}`}>Religion{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="bloodGroup"
                className="exp-input-field form-control"
                type="text"
                placeholder=""
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                maxLength={10}
                autoComplete="off"
              />
              <label htmlFor="bloodGroup" className={`exp-form-labels ${error && !bloodGroup ? 'text-danger' : ''}`}>Blood Group{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="spouseName"
                className="exp-input-field form-control"
                type="text"
                placeholder=""
                value={spouseName}
                onChange={(e) => setSpouseName(e.target.value)}
                maxLength={100}
                autoComplete="off"
              />
              <label htmlFor="spouseName" className="exp-form-labels">Spouse Name</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="noOfChildren"
                className="exp-input-field form-control"
                type="text"
                placeholder=""
                value={noOfChildren}
                maxLength={2}
                autoComplete="off"
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    setNoOfChildren(value);
                  }
                }}
              />
              <label htmlFor="noOfChildren" className="exp-form-labels">No of Children</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="noOfSiblings"
                className="exp-input-field form-control"
                type="text"
                placeholder=""
                value={noOfSiblings}
                maxLength={2}
                autoComplete="off"
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    setNoOfSiblings(value);
                  }
                }}
              />
              <label htmlFor="noOfSiblings" className="exp-form-labels">No of Siblings</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="businessEmail"
                className="exp-input-field form-control"
                type="email"
                placeholder=""
                value={businessEmail}
                onChange={(e) => setBusinessEmail(e.target.value)}
                maxLength={100}
                autoComplete="off"
              />
              <label htmlFor="businessEmail" className="exp-form-labels">Email Business</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="emergencyContactName"
                className="exp-input-field form-control"
                type="text"
                placeholder=""
                value={emergencyContactName}
                onChange={(e) => setEmergencyContactName(e.target.value)}
                maxLength={100}
                autoComplete="off"
              />
              <label htmlFor="emergencyContactName" className={`exp-form-labels ${error && !emergencyContactName ? 'text-danger' : ''}`}>Emergency Contact Name{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedEmergencyContactRelation ? "has-value" : ""} 
              ${isSelectRelation ? "is-focused" : ""}`}
            >
              <Select
                inputId="emergencyContactRelation"
                name="emergencyContactRelation"
                value={selectedEmergencyContactRelation}
                onChange={handleChangeRelation}
                options={filteredOptionRelation}
                autoComplete="off"
                placeholder=" "
                onFocus={() => setIsSelectRelation(true)}
                onBlur={() => setIsSelectRelation(false)}
                classNamePrefix="react-select"
                isClearable
              />
              <label htmlFor="emergencyContactRelation" className={`floating-label ${error && !emergencyContactRelation ? 'text-danger' : ''}`}>Emergency Relation{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="emergencyContactPhone"
                className="exp-input-field form-control"
                type="text"
                placeholder=""
                value={emergencyContactPhone}
                maxLength={12}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    setEmergencyContactPhone(value);
                  }
                }}
                autoComplete="off"
              />
              <label htmlFor="emergencyContactPhone" className={`exp-form-labels ${error && !emergencyContactPhone ? 'text-danger' : ''}`}>Emergency Contact Phone{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedCity ? "has-value" : ""} 
              ${isSelectCity ? "is-focused" : ""}`}
            >
              <Select
                inputId="city"
                name="city"
                value={selectedCity}
                onChange={handleChangeCity}
                options={filteredOptionCity}
                autoComplete="off"
                placeholder=" "
                onFocus={() => setIsSelectCity(true)}
                onBlur={() => setIsSelectCity(false)}
                classNamePrefix="react-select"
                isClearable
              />
              <label htmlFor="city" className={`floating-label ${error && !city ? 'text-danger' : ''}`}>City{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedState ? "has-value" : ""} 
              ${isSelectState ? "is-focused" : ""}`}
            >
              <Select
                inputId="state"
                name="state"
                value={selectedState}
                onChange={handleChangeState}
                options={filteredOptionState}
                autoComplete="off"
                placeholder=" "
                onFocus={() => setIsSelectState(true)}
                onBlur={() => setIsSelectState(false)}
                classNamePrefix="react-select"
                isClearable
              />
              <label htmlFor="state" className={`floating-label ${error && !state ? 'text-danger' : ''}`}>State{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedCountry ? "has-value" : ""} 
              ${isSelectCountry ? "is-focused" : ""}`}
            >
              <Select
                inputId="country"
                name="country"
                value={selectedCountry}
                onChange={handleChangeCountry}
                options={filteredOptionCountry}
                autoComplete="off"
                placeholder=" "
                onFocus={() => setIsSelectCountry(true)}
                onBlur={() => setIsSelectCountry(false)}
                classNamePrefix="react-select"
                isClearable
              />
              <label htmlFor="country" className={`floating-label ${error && !country ? 'text-danger' : ''}`}>Country{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="postalCode"
                className="exp-input-field form-control"
                type="text"
                placeholder=""
                value={postalCode}
                maxLength={10}
                autoComplete="off"
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    setPostalCode(value);
                  }
                }}
              />
              <label htmlFor="postalCode" className={`exp-form-labels ${error && !postalCode ? 'text-danger' : ''}`}>Postal Code{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="passportNo"
                className="exp-input-field form-control"
                type="text"
                placeholder=""
                value={passportNo}
                onChange={(e) => setPassportNo(e.target.value)}
                maxLength={30}
                autoComplete="off"
              />
              <label htmlFor="passportNo" className="exp-form-labels">Passport No</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="passportExpiryDate"
                className="exp-input-field form-control"
                type="date"
                placeholder=""
                value={passportExpiryDate}
                onChange={(e) => setPassportExpiryDate(e.target.value)}
                maxLength={225}
                autoComplete="off"
              />
              <label htmlFor="passportExpiryDate" className="exp-form-labels">Passport Expiry Date</label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedOtherIdType ? "has-value" : ""} 
              ${isSelectOtherType ? "is-focused" : ""}`}
            >
              <Select
                inputId="otherIdType"
                name="otherIdType"
                value={selectedOtherIdType}
                onChange={handleChangeOtherType}
                options={filteredOptionOtherType}
                autoComplete="off"
                placeholder=" "
                onFocus={() => setIsSelectOtherType(true)}
                onBlur={() => setIsSelectOtherType(false)}
                classNamePrefix="react-select"
                isClearable
              />
              <label htmlFor="otherIdType" className="floating-label">Other ID Type</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="otherIdNo"
                className="exp-input-field form-control"
                type="text"
                placeholder=""
                value={otherIdNo}
                onChange={(e) => setOtherIdNo(e.target.value)}
                maxLength={50}
                autoComplete="off"
              />
              <label htmlFor="otherIdNo" className="exp-form-labels">Other ID No</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <div className="image-upload-container">
                {selectedImage ? (
                  <div className="image-preview-box">
                    <img
                      src={selectedImage}
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
                      <span>Upload Logo</span>
                    </div>
                  </div>
                )}

                <input
                  type="file"
                  id="locno"
                  className="exp-input-field form-control hidden-file-input"
                  accept="image/*"
                  onChange={handleFileSelect1}
                  ref={logo}
                />
              </div>
            </div>
          </div>

        </div>
      </div>
      <div>
        <EmployeeInfoPopup open={open} handleClose={handleClose} EmployeeInfo={EmployeeInfo} />
      </div>
    </div>
  );
}
export default Input;
