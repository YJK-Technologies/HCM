import React, { useState, useEffect, useRef } from "react";
import "../input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import TabButtons from "./Tabs.js";
import Select from "react-select";
import EmployeeInfoPopup from "./EmployeeinfoPopup.js";
import { showConfirmationToast } from "../ToastConfirmation";
import LoadingScreen from "../Loading";

const config = require("../Apiconfig");

function ManualEmployeeInfo({}) {
  const [activeTab, setActiveTab] = useState("Personal Details");
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
  const [error, setError] = useState(false);
  const [permanantAddress, setPermanantAddress] = useState("");
  const [reference_Name, setReference_Name] = useState("");
  const [reference_Phone, setReference_Phone] = useState("");
  const [marital_Status, setMarital_Status] = useState("");
  const [Marital_StatusDrop, setMarital_StatusDrop] = useState([]);
  const [pan_No, setPan_No] = useState("");
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
  const [placeOfBirth, setPlaceOfBirth] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [spouseName, setSpouseName] = useState("");
  const [noOfChildren, setNoOfChildren] = useState("");
  const [noOfSiblings, setNoOfSiblings] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactRelation, setEmergencyContactRelation] = useState("");
  const [
    selectedEmergencyContactRelation,
    setSelectedEmergencyContactRelation,
  ] = useState("");
  const [emergencyContactRelationDrop, setEmergencyContactRelationDrop] =
    useState([]);
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");
  const [city, setCity] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [cityDrop, setCityDrop] = useState([]);
  const [title, setTitle] = useState("");
  const [selectedTitle, setSelectedTitle] = useState("");
  const [titleDrop, setTitleDrop] = useState([]);
  const [nationality, setNationality] = useState("");
  const [selectedNationality, setSelectedNationality] = useState("");
  const [nationalityDrop, setNationalityDrop] = useState([]);
  const [religion, setReligion] = useState("");
  const [selectedReligion, setSelectedReligion] = useState("");
  const [religionDrop, setReligionDrop] = useState([]);
  const [state, setState] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [stateDrop, setStateDrop] = useState([]);
  const [country, setCountry] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [countryDrop, setCountryDrop] = useState([]);
  const [postalCode, setPostalCode] = useState("");
  const [passportNo, setPassportNo] = useState("");
  const [passportExpiryDate, setPassportExpiryDate] = useState("");
  const [otherIdType, setOtherIdType] = useState("");
  const [selectedOtherIdType, setSelectedOtherIdType] = useState("");
  const [otherDrop, setOtherDrop] = useState([]);
  const [otherIdNo, setOtherIdNo] = useState("");
  const [purpose, setpurpose] = useState("");
  const [Siblings, setSiblings] = useState('');

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

  const [selectedmanager, setselectedmanager] = useState('');
  const [RepManager, setReportingManager] = useState("");
  const [Managerdrop, setManagerdrop] = useState([]);
  const [isSelectManager, setIsSelectManager] = useState(false);

  const logo = useRef(null);

  const employeeId = sessionStorage.getItem("selectedUserCode");
  useEffect(() => {
    if(IDdrop.length > 0 &&
      genderdrop.length > 0 &&
      KidsDrop.length > 0 &&
      titleDrop.length > 0 &&
      nationalityDrop.length > 0 &&
      religionDrop.length > 0 &&
      Marital_StatusDrop.length > 0 &&
      emergencyContactRelationDrop.length > 0 &&
      cityDrop.length > 0 &&
      countryDrop.length > 0 &&
      stateDrop.length > 0 &&
      otherDrop.length > 0 &&
       employeeId
    ){
      handleRefNo(employeeId);
    }
    
  }, [employeeId, IDdrop, genderdrop, KidsDrop, titleDrop, nationalityDrop, religionDrop,
     Marital_StatusDrop, emergencyContactRelationDrop, cityDrop, countryDrop, stateDrop, otherDrop
  ]);

  //code added by Pavun purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem("permissions")) || {};
  const employeePermissions = permissions
    .filter((permission) => permission.screen_type === "AddEmployeeInfo")
    .map((permission) => permission.permission_type.toLowerCase());

    const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = (error) => reject(error);
  });
};

  const handleSave = async () => {
    if (
      !EmployeeId ||
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
      !RepManager ||
      !postalCode
    ) {
      setError(true);
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
    };

    const headerRes = await fetch(`${config.apiBaseUrl}/PersonalRequestHdr`,
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
    await savePersonalDetails(info_request_id);

    toast.success("Personal details submitted successfully!", {
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

const savePersonalDetails = async (info_request_id) => {
  try {
    const company_code = sessionStorage.getItem("selectedCompanyCode");
    const created_by = sessionStorage.getItem("selectedUserCode");

    let photoBase64 = null;

    if (user_images) {
      if (user_images.size > 1 * 1024 * 1024) {
        toast.warning("Photo size exceeds 1MB");
        return;
      }
      photoBase64 = await convertToBase64(user_images);
    }

    const detailsData = [
      {
        info_request_id,
        company_code,
        EmployeeId,
        request_status: "Pending",

        // Personal
        First_Name,
        Middle_Name,
        Last_Name,
        father_name: Father_Name,
        mother_name: Mother_Name,
        DOB,
        Gender: selectedGender,
        email: Email,
        phone1: Phone1,
        phone2: Phone2,

        // Address
        Address1: address1,
        address2,
        address3,
        PermanantAddress: permanantAddress,

        // Reference
        Reference_name: reference_Name,
        Reference_Phone: reference_Phone,

        // IDs
        Pan_No: pan_No,
        Aadhar_no: Aadhaar_no,
        Photos: photoBase64,

        // Family
        marital_status: selectedmartial,
        Kids: selectedkids,

        // Job
        Grade_id: selectedgradeid,
        Title: title,

        // Extra
        Place_of_Birth: placeOfBirth,
        Nationality: nationality,
        Religion: religion,
        Blood_Group: bloodGroup,

        // Family Details
        Spouse_Name: spouseName,
        Number_of_Siblings: noOfSiblings,
        Number_of_Children: noOfChildren,

        // Contact
        Email_Business: businessEmail,
        Phone_Alternate: Phone2,

        // Emergency
        Emergency_Contact_Name: emergencyContactName,
        Emergency_Contact_Relationship: emergencyContactRelation,
        Emergency_Contact_Phone: emergencyContactPhone,
        Siblings: Siblings,

        // Location
        City: city,
        State: state,
        Postal_Code: postalCode,
        Country: country,

        // Passport
        Passport_No: passportNo,
        Passport_Expiry_Date: passportExpiryDate,

        // Other ID
        Other_Id_Type: otherIdType,
        Other_Id_No: otherIdNo,
        RepManager,

        created_by,
      },
    ];

    const res = await fetch(
      `${config.apiBaseUrl}/PersonalRequestDetails`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ detailsData }),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message);
    }

    console.log("Personal Details inserted successfully");

  } catch (error) {
    console.error(error);
    toast.error("Error inserting details: " + error.message);
  }
};
  function validateEmail(email) {
    const emailRegex = /^[A-Za-z\._\-0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/;
    return emailRegex.test(email);
  }

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
    { label: "Personal Details" },
    // { label: 'Academic Details' },
    { label: 'Family' },
    { label: 'Academic Details' },
    { label: 'Documents' },
    { label: "Assets" },

  ];

  const handleGradeID = (selectedgradeid) => {
    setGrade_id(selectedgradeid);
    setselectedgradeid(selectedgradeid ? selectedgradeid.value : "");
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
        console.error("Error fetching gender data:", error);
      });
  }, []);

  const Handlegender = (selectedgender) => {
    setGender(selectedgender);
    setselectedGender(selectedgender ? selectedgender.value : "");
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
        console.error("Error fetching gender data:", error);
      });
  }, []);

  const handleKids = (selectedkids) => {
    setKids(selectedkids);
    setselectedkids(selectedkids ? selectedkids.value : "");
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
    setTitle(selectedTitle ? selectedTitle.value : "");
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
    setNationality(selectedNationality ? selectedNationality.value : "");
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
    setReligion(selectedReligion ? selectedReligion.value : "");
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
    setselectedmartial(martilalselected ? martilalselected.value : "");
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
    setEmergencyContactRelation(
      selectedEmergencyContactRelation
        ? selectedEmergencyContactRelation.value
        : "",
    );
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
    setCity(selectedCity ? selectedCity.value : "");
  };

  const filteredOptionCity = cityDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    fetch(`${config.apiBaseUrl}/city`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => setCityDrop(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleChangeCountry = (selectedCountry) => {
    setSelectedCountry(selectedCountry);
    setCountry(selectedCountry ? selectedCountry.value : "");
  };

  const filteredOptionCountry = countryDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    fetch(`${config.apiBaseUrl}/country`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => setCountryDrop(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleChangeState = (selectedState) => {
    setSelectedState(selectedState);
    setState(selectedState ? selectedState.value : "");
  };

  const filteredOptionState = stateDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    fetch(`${config.apiBaseUrl}/state`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => setStateDrop(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleChangeOtherType = (selectedOtherIdType) => {
    setSelectedOtherIdType(selectedOtherIdType);
    setOtherIdType(selectedOtherIdType ? selectedOtherIdType.value : "");
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

  const handleChangemanager = (selectedOption) => {
    setselectedmanager(selectedOption);
    setReportingManager(selectedOption ? selectedOption.value : '');
  };

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
      }),
    })
      .then((response) => response.json())
      .then(setManagerdrop)
      .catch((error) => console.error("Error fetching warehouse:", error));
  }, []);

  const handleRemoveLogo = () => {
    setSelectedImage(null); 
    setuser_image('')
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
          icon: "error",
          title: "File Too Large",
          text: "File size exceeds 1MB. Please upload a smaller file.",
          confirmButtonText: "OK",
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

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleRefNo = async (code) => {
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/getEmployeePersonaldet`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Id: code,
            company_code: sessionStorage.getItem("selectedCompanyCode"),
          }),
        },
      );
      if (response.ok) {
        setSaveButtonVisible(true);
        setUpdateButtonVisible(true);
        const searchData = await response.json();
        const [
          {
            EmployeeId,
            First_Name,
            Middle_Name,
            Last_Name,
            father_name,
            mother_name,
            DOB,
            email,
            Aadhar_no,
            Reference_Phone,
            phone1,
            phone2,
            Address1,
            address2,
            address3,
            PermanantAddress,
            designation_id,
            department_id,
            Reference_name,
            Pan_No,
            Photos,
            Grade_id,
            Gender,
            Marital_Status,
            Kids,
            Title,
            Place_of_Birth,
            Nationality,
            Religion,
            Blood_Group,
            Spouse_Name,
            Number_of_Siblings,
            Number_of_Children,
            Email_Business,
            Phone_Alternate,
            Emergency_Contact_Name,
            Emergency_Contact_Relationship,
            Emergency_Contact_Phone,
            City,
            State,
            Country,
            Postal_Code,
            Passport_No,
            Passport_Expiry_Date,
            Other_Id_Type,
            Other_Id_No,
          },
        ] = searchData;

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

        if (Photos && Photos.data) {
          const imageBlob = new Blob([new Uint8Array(Photos.data)], {
            type: "image/jpeg",
          });
        
          setuser_image(imageBlob);
        
          const imageUrl = URL.createObjectURL(imageBlob);
          setSelectedImage(imageUrl);
        } else {
          // 🔥 No photo case (remove / empty)
          setuser_image(null);
          setSelectedImage(null);
        }

        setPan_No(Pan_No);

        const selectedGrade = filteredOptionGradeid.find(
          (option) => option.value === Grade_id,
        );
        setGrade_id(selectedGrade);
        setselectedgradeid(selectedGrade?.value || null);

        const selectedGender = filteredOptiongender.find(
          (option) => option.value === Gender,
        );
        setGender(selectedGender);
        setselectedGender(selectedGender?.value || null);

        const martialStatus = filteredOptionmartial.find(
          (option) => option.value === Marital_Status,
        );
        setMarital_Status(martialStatus);
        setselectedmartial(martialStatus?.value || null);

        const kids = filteredOptionKids.find((option) => option.value === Kids);
        setKids(kids);
        setselectedkids(kids?.value || null);

        const selectedTitle = filteredOptionTitle.find(
          (option) => option.value === Title,
        );
        setSelectedTitle(selectedTitle);
        setTitle(selectedTitle?.value || null);

        const selectedNationality = filteredOptionNationality.find(
          (option) => option.value === Nationality,
        );
        setSelectedNationality(selectedNationality);
        setNationality(selectedNationality?.value || null);

        const selectedReligion = filteredOptionReligion.find(
          (option) => option.value === Religion,
        );
        setSelectedReligion(selectedReligion);
        setReligion(selectedReligion?.value || null);

        const selectedEmergencyContactRelation = filteredOptionRelation.find(
          (option) => option.value === Emergency_Contact_Relationship,
        );
        setSelectedEmergencyContactRelation(selectedEmergencyContactRelation);
        setEmergencyContactRelation(
          selectedEmergencyContactRelation?.value || null,
        );

        const selectedCity = filteredOptionCity.find(
          (option) => option.value === City,
        );
        setSelectedCity(selectedCity);
        setCity(selectedCity?.value || null);

        const selectedState = filteredOptionState.find(
          (option) => option.value === State,
        );
        setSelectedState(selectedState);
        setState(selectedState?.value || null);

        const selectedCountry = filteredOptionCountry.find(
          (option) => option.value === Country,
        );
        setSelectedCountry(selectedCountry);
        setCountry(selectedCountry?.value || null);

        const selectedOtherIdType = filteredOptionOtherType.find(
          (option) => option.value === Other_Id_Type,
        );
        setSelectedOtherIdType(selectedOtherIdType);
        setOtherIdType(selectedOtherIdType?.value || null);

        console.log("data fetched successfully");
      } else if (response.status === 404) {
        toast.error("Data not found");
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

  const reloadGridData = () => {
    window.location.reload();
  };


  return (
    <div className="container-fluid Topnav-screen">
      {loading && <LoadingScreen />}
      <ToastContainer
        position="top-right"
        className="toast-design"
        theme="colored"
      />
      <div className="shadow-lg p-1 bg-light rounded main-header-box">
        <div className="header-flex">
          <h1 className="page-title">Employee Personal Details</h1>
          <div className="action-wrapper desktop-actions">
            {saveButtonVisible &&
              ["add", "all permission"].some((permission) =>
                employeePermissions.includes(permission),
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

          {/* Mobile Dropdown */}
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
                  employeePermissions.includes(p),
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
      <div className="shadow-lg p-2 bg-light rounded mt-2 container-form-box">
        <div className="row g-3">
          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="FirstName"
                className="exp-input-field form-control"
                title="Please Enter the First Name"
                type="text"
                placeholder=" "
                required
                value={First_Name}
                onChange={(e) => setFirst_Name(e.target.value)}
                maxLength={75}
                autoComplete="off"
              />
              <label
                htmlFor="FirstName"
                className={`exp-form-labels ${error && !First_Name ? "text-danger" : ""}`}
              >
                First Name
                {showAsterisk && <span className="text-danger">*</span>}
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="MiddleName"
                className="exp-input-field form-control"
                type="text"
                placeholder=" "
                value={Middle_Name}
                onChange={(e) => setMiddle_Name(e.target.value)}
                maxLength={75}
                autoComplete="off"
                title="Please Enter the Middle Name"
              />
              <label htmlFor="MiddleName" className="exp-form-labels">
                Middle Name
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="LastName"
                className="exp-input-field form-control"
                type="text"
                placeholder=" "
                value={Last_Name}
                onChange={(e) => setLast_Name(e.target.value)}
                maxLength={75}
                autoComplete="off"
                title="Please Enter the Last Name"
              />
              <label
                htmlFor="LastName"
                className={`exp-form-labels ${error && !Last_Name ? "text-danger" : ""}`}
              >
                Last Name
                {showAsterisk && <span className="text-danger">*</span>}
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="FatherName"
                className="exp-input-field form-control"
                title="Please Enter the Father Name"
                type="text"
                placeholder=" "
                value={Father_Name}
                onChange={(e) => setFather_Name(e.target.value)}
                maxLength={100}
                autoComplete="off"
              />
              <label
                htmlFor="FatherName"
                className={`exp-form-labels ${error && !Father_Name ? "text-danger" : ""}`}
              >
                Father Name
                {showAsterisk && <span className="text-danger">*</span>}
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="MotherName"
                className="exp-input-field form-control"
                title="Please Enter the Mother Name"
                type="text"
                placeholder=" "
                value={Mother_Name}
                onChange={(e) => setMother_Name(e.target.value)}
                maxLength={100}
                autoComplete="off"
              />
              <label
                htmlFor="MotherName"
                className={`exp-form-labels ${error && !Mother_Name ? "text-danger" : ""}`}
              >
                Mother Name
                {showAsterisk && <span className="text-danger">*</span>}
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="dob"
                className="exp-input-field form-control"
                title="Please Enter the Date of Birth"
                type="date"
                placeholder=""
                value={DOB}
                onChange={(e) => setDOB(e.target.value)}
              />
              <label
                htmlFor="dob"
                className={`exp-form-labels ${error && !DOB ? "text-danger" : ""}`}
              >
                DOB{showAsterisk && <span className="text-danger">*</span>}
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${Gender ? "has-value" : ""} 
              ${isSelectGender ? "is-focused" : ""}`}
              title="Please Select the Gender"
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
              <label
                htmlFor="gender"
                className={`floating-label ${error && !selectedGender ? "text-danger" : ""}`}
              >
                Gender{showAsterisk && <span className="text-danger">*</span>}
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="email"
                className="exp-input-field form-control"
                title="Please Enter the Email"
                type="email"
                placeholder=""
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={225}
                autoComplete="off"
              />
              <label
                htmlFor="email"
                className={`exp-form-labels ${error && !Email ? "text-danger" : ""}`}
              >
                Email{showAsterisk && <span className="text-danger">*</span>}
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${Grade_id ? "has-value" : ""} 
              ${isSelectGrade ? "is-focused" : ""}`}
              title="Please Select the Grade ID"
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
              <label
                htmlFor="gradeid"
                className={`floating-label ${error && !selectedgradeid ? "text-danger" : ""}`}
              >
                Grade ID{showAsterisk && <span className="text-danger">*</span>}
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="Phone"
                className="exp-input-field form-control"
                title="Please Enter the Phone Number"
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
              <label
                htmlFor="Phone"
                className={`exp-form-labels ${error && !Phone1 ? "text-danger" : ""}`}
              >
                Phone No{showAsterisk && <span className="text-danger">*</span>}
              </label>
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
                title="Please Enter the Alternative Phone Number"
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
              <label
                htmlFor="phone2"
                className={`exp-form-labels ${error && !Phone2 ? "text-danger" : ""}`}
              >
                Alternative Phone No
                {showAsterisk && <span className="text-danger">*</span>}
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="address1"
                className="exp-input-field form-control"
                title="Please Enter the Address 1"
                type="text"
                placeholder=""
                value={address1}
                onChange={(e) => setAddress1(e.target.value)}
                maxLength={100}
                autoComplete="off"
              />
              <label
                htmlFor="address1"
                className={`exp-form-labels ${error && !address1 ? "text-danger" : ""}`}
              >
                Address 1
                {showAsterisk && <span className="text-danger">*</span>}
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="address2"
                className="exp-input-field form-control"
                title="Please Enter the Address 2"
                type="text"
                placeholder=""
                value={address2}
                maxLength={100}
                onChange={(e) => setAddress2(e.target.value)}
                autoComplete="off"
              />
              <label
                htmlFor="address2"
                className={`exp-form-labels ${error && !address2 ? "text-danger" : ""}`}
              >
                Address 2
                {showAsterisk && <span className="text-danger">*</span>}
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="address3"
                className="exp-input-field form-control"
                title="Please Enter the Address 3"
                type="text"
                placeholder=""
                value={address3}
                onChange={(e) => setAddress3(e.target.value)}
                autoComplete="off"
                maxLength={100}
              />
              <label
                htmlFor="address3"
                className={`exp-form-labels ${error && !address3 ? "text-danger" : ""}`}
              >
                Address 3
                {showAsterisk && <span className="text-danger">*</span>}
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="permanantAddress"
                  title="Please Enter the Permanent Address"
                className="exp-input-field form-control"
                type="text"
                placeholder=""
                value={permanantAddress}
                onChange={(e) => setPermanantAddress(e.target.value)}
                autoComplete="off"
                maxLength={300}
              />
              <label
                htmlFor="permanantAddress"
                className={`exp-form-labels ${error && !permanantAddress ? "text-danger" : ""}`}
              >
                Permanent Address
                {showAsterisk && <span className="text-danger">*</span>}
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="ReferenceName"
                className="exp-input-field form-control"
                title="Please Enter the Reference Name"
                type="text"
                placeholder=""
                value={reference_Name}
                onChange={(e) => setReference_Name(e.target.value)}
                autoComplete="off"
                maxLength={100}
              />
              {/* <label htmlFor="ReferenceName" className="exp-form-labels">Reference Name</label> */}
              <label
                for="ReferenceName"
                className={`exp-form-labels ${error && !reference_Name ? "text-danger" : ""}`}
              >
                Reference Name<span className="text-danger">*</span>
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="ReferencePhone"
                className="exp-input-field form-control"
                title="Please Enter the Reference Phone Number"
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
              <label
                for="ReferencePhone"
                className={`exp-form-labels ${error && !reference_Phone ? "text-danger" : ""}`}
              >
                Reference Phone No<span className="text-danger">*</span>
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${marital_Status ? "has-value" : ""} 
              ${isSelectMarital ? "is-focused" : ""}`}
              title="Please Select the Marital Status"
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
              <label
                htmlFor="maritalStatus"
                className={`floating-label ${error && !selectedmartial ? "text-danger" : ""}`}
              >
                Marital Status
                {showAsterisk && <span className="text-danger">*</span>}
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="Panno"
                className="exp-input-field form-control"
                title="Please Enter the PAN Number"
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
              <label
                htmlFor="Panno"
                className={`exp-form-labels ${error && !pan_No ? "text-danger" : ""}`}
              >
                PAN No{showAsterisk && <span className="text-danger">*</span>}
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="Aadharno"
                className="exp-input-field form-control"
                title="Please Enter the Aadhaar Number"
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
              <label
                htmlFor="Aadharno"
                className={`exp-form-labels ${error && !Aadhaar_no ? "text-danger" : ""}`}
              >
                Aadhaar No
                {showAsterisk && <span className="text-danger">*</span>}
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${kids ? "has-value" : ""} 
              ${isSelectKids ? "is-focused" : ""}`}
              title="Please Select the Number of Kids"
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
              <label
                htmlFor="KidS"
                className={`floating-label ${error && !selectedkids ? "text-danger" : ""}`}
              >
                Kids{showAsterisk && <span className="text-danger">*</span>}
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedTitle ? "has-value" : ""} 
              ${isSelectTitle ? "is-focused" : ""}`}
              title="Please Select the Title"
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
              <label
                htmlFor="title"
                className={`floating-label ${error && !title ? "text-danger" : ""}`}
              >
                Title{showAsterisk && <span className="text-danger">*</span>}
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="placeOfBirth"
                className="exp-input-field form-control"
                title="Please Enter the Place of Birth"
                type="text"
                placeholder=""
                value={placeOfBirth}
                onChange={(e) => setPlaceOfBirth(e.target.value)}
                maxLength={100}
                autoComplete="off"
              />
              <label
                htmlFor="placeOfBirth"
                className={`exp-form-labels ${error && !placeOfBirth ? "text-danger" : ""}`}
              >
                Place of Birth
                {showAsterisk && <span className="text-danger">*</span>}
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedNationality ? "has-value" : ""} 
              ${isSelectNationality ? "is-focused" : ""}`}
              title="Please Select the Nationality"
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
              <label
                htmlFor="nationality"
                className={`floating-label ${error && !nationality ? "text-danger" : ""}`}
              >
                Nationality
                {showAsterisk && <span className="text-danger">*</span>}
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedReligion ? "has-value" : ""} 
              ${isSelectReligion ? "is-focused" : ""}`}
              title="Please Select the Religion"
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
              <label
                htmlFor="religion"
                className={`floating-label ${error && !religion ? "text-danger" : ""}`}
              >
                Religion{showAsterisk && <span className="text-danger">*</span>}
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="bloodGroup"
                className="exp-input-field form-control"
                  title="Please Enter the Blood Group"
                type="text"
                placeholder=""
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                maxLength={10}
                autoComplete="off"
              />
              <label
                htmlFor="bloodGroup"
                className={`exp-form-labels ${error && !bloodGroup ? "text-danger" : ""}`}
              >
                Blood Group
                {showAsterisk && <span className="text-danger">*</span>}
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="spouseName"
                className="exp-input-field form-control"
                  title="Please Enter the Spouse Name"
                type="text"
                placeholder=""
                value={spouseName}
                onChange={(e) => setSpouseName(e.target.value)}
                maxLength={100}
                autoComplete="off"
              />
              <label htmlFor="spouseName" className="exp-form-labels">
                Spouse Name
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="noOfChildren"
                className="exp-input-field form-control"
                  title="Please Enter the Number of Children"
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
              <label htmlFor="noOfChildren" className="exp-form-labels">
                No of Children
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="noOfSiblings"
                className="exp-input-field form-control"
                  title="Please Enter the Number of Siblings"
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
              <label htmlFor="noOfSiblings" className="exp-form-labels">
                No of Siblings
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="businessEmail"
                className="exp-input-field form-control"
                  title="Please Enter the Business Email"
                type="email"
                placeholder=""
                value={businessEmail}
                onChange={(e) => setBusinessEmail(e.target.value)}
                maxLength={100}
                autoComplete="off"
              />
              <label htmlFor="businessEmail" className="exp-form-labels">
                Email Business
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="emergencyContactName"
                className="exp-input-field form-control"
                  title="Please Enter the Emergency Contact Name"
                type="text"
                placeholder=""
                value={emergencyContactName}
                onChange={(e) => setEmergencyContactName(e.target.value)}
                maxLength={100}
                autoComplete="off"
              />
              <label
                htmlFor="emergencyContactName"
                className={`exp-form-labels ${error && !emergencyContactName ? "text-danger" : ""}`}
              >
                Emergency Contact Name
                {showAsterisk && <span className="text-danger">*</span>}
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedEmergencyContactRelation ? "has-value" : ""} 
              ${isSelectRelation ? "is-focused" : ""}`}
              title="Please Select the Emergency Contact Relation"
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
              <label
                htmlFor="emergencyContactRelation"
                className={`floating-label ${error && !emergencyContactRelation ? "text-danger" : ""}`}
              >
                Emergency Relation
                {showAsterisk && <span className="text-danger">*</span>}
              </label>
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
                title="Please Enter the Emergency Contact Phone"
              />
              <label
                htmlFor="emergencyContactPhone"
                className={`exp-form-labels ${error && !emergencyContactPhone ? "text-danger" : ""}`}
              >
                Emergency Contact Phone
                {showAsterisk && <span className="text-danger">*</span>}
              </label>
            </div>
          </div>

          {/* <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="Siblings"
                className="exp-input-field form-control"
                type="text"
                placeholder=""
                value={Siblings}
                maxLength={12}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    setSiblings(value);
                  }
                }}
                autoComplete="off"
              />
              <label htmlFor="Siblings" className={`exp-form-labels ${error && !Siblings ? 'text-danger' : ''}`}>Siblings{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div> */}


          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedCity ? "has-value" : ""} 
              ${isSelectCity ? "is-focused" : ""}`}
              title="Please Select the City"
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
              <label
                htmlFor="city"
                className={`floating-label ${error && !city ? "text-danger" : ""}`}
              >
                City{showAsterisk && <span className="text-danger">*</span>}
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedState ? "has-value" : ""} 
              ${isSelectState ? "is-focused" : ""}`}
              title="Please Select the State"
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
              <label
                htmlFor="state"
                className={`floating-label ${error && !state ? "text-danger" : ""}`}
              >
                State{showAsterisk && <span className="text-danger">*</span>}
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedCountry ? "has-value" : ""} 
              ${isSelectCountry ? "is-focused" : ""}`}
              title="Please Select the Country"
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
              <label
                htmlFor="country"
                className={`floating-label ${error && !country ? "text-danger" : ""}`}
              >
                Country{showAsterisk && <span className="text-danger">*</span>}
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="postalCode"
                className="exp-input-field form-control"
                  title="Please Enter the Postal Code"
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
              <label
                htmlFor="postalCode"
                className={`exp-form-labels ${error && !postalCode ? "text-danger" : ""}`}
              >
                Postal Code
                {showAsterisk && <span className="text-danger">*</span>}
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="passportNo"
                className="exp-input-field form-control"
                  title="Please Enter the Passport Number"
                type="text"
                placeholder=""
                value={passportNo}
                onChange={(e) => setPassportNo(e.target.value)}
                maxLength={30}
                autoComplete="off"
              />
              <label htmlFor="passportNo" className="exp-form-labels">
                Passport No
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="passportExpiryDate"
                className="exp-input-field form-control"
                  title="Please Enter the Passport Expiry Date"
                type="date"
                placeholder=""
                value={passportExpiryDate}
                onChange={(e) => setPassportExpiryDate(e.target.value)}
                maxLength={225}
                autoComplete="off"
              />
              <label htmlFor="passportExpiryDate" className="exp-form-labels">
                Passport Expiry Date
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedOtherIdType ? "has-value" : ""} 
              ${isSelectOtherType ? "is-focused" : ""}`}
              title="Please Select the Other ID Type"
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
              <label htmlFor="otherIdType" className="floating-label">
                Other ID Type
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="otherIdNo"
                className="exp-input-field form-control"
                  title="Please Enter the Other ID Number"
                type="text"
                placeholder=""
                value={otherIdNo}
                onChange={(e) => setOtherIdNo(e.target.value)}
                maxLength={50}
                autoComplete="off"
              />
              <label htmlFor="otherIdNo" className="exp-form-labels">
                Other ID No
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
              ${selectedmanager ? "has-value" : ""} 
              ${isSelectManager ? "is-focused" : ""}`}
              title="Please Select the Reporting Manager"
            >
              <Select
                value={selectedmanager}
                options={filteredOptionManager}
                onChange={handleChangemanager}
                placeholder=" "
                onFocus={() => setIsSelectManager(true)}
                onBlur={() => setIsSelectManager(false)}
                classNamePrefix="react-select"
                isClearable
              />
              <label className={`floating-label ${error && !RepManager ? 'text-danger' : ''}`}>
                Reporting Manager<span className="text-danger">*</span>
              </label>
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
    </div>
  );
}
export default ManualEmployeeInfo;
