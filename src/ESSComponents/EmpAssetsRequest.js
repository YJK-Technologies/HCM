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

function EmpAssetsRequest({}) {
  const [activeTab, setActiveTab] = useState("Assets");
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
  //new
  const [assetId, setAssetId] = useState("");
  const [allocationDate, setAllocationDate] = useState("");
  const [expectedReturnDate, setExpectedReturnDate] = useState("");
  const [actualReturnDate, setActualReturnDate] = useState("");
  const [allocationStatus, setAllocationStatus] = useState("");
  const [conditionAtIssue, setConditionAtIssue] = useState("");
  const [conditionAtReturn, setConditionAtReturn] = useState("");
  const [approvedBy, setApprovedBy] = useState("");
  const [remarks, setRemarks] = useState("");

  const employeeId = sessionStorage.getItem("selectedUserCode");
  useEffect(() => {
    if (
      IDdrop.length > 0 &&
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
    ) {
      handleRefNo(employeeId);
    }
  }, [
    employeeId,
    IDdrop,
    genderdrop,
    KidsDrop,
    titleDrop,
    nationalityDrop,
    religionDrop,
    Marital_StatusDrop,
    emergencyContactRelationDrop,
    cityDrop,
    countryDrop,
    stateDrop,
    otherDrop,
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
    if (!EmployeeId) {
      toast.warning("Error: Missing required fields");
      return;
    }

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

      const headerRes = await fetch(`${config.apiBaseUrl}/PersonalRequestHdr`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ headerData: [headerPayload] }),
      });

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

          // ✅ Personal
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

          // ✅ Address
          Address1: address1,
          address2,
          address3,
          PermanantAddress: permanantAddress,

          // ✅ Reference
          Reference_name: reference_Name,
          Reference_Phone: reference_Phone,

          // ✅ IDs
          Pan_No: pan_No,
          Aadhar_no: Aadhaar_no,
          Photos: photoBase64,

          // ✅ Family
          marital_status: selectedmartial,
          Kids: selectedkids,

          // ✅ Job
          Grade_id: selectedgradeid,
          Title: title,

          // ✅ Extra
          Place_of_Birth: placeOfBirth,
          Nationality: nationality,
          Religion: religion,
          Blood_Group: bloodGroup,

          // ✅ Family Details
          Spouse_Name: spouseName,
          Number_of_Siblings: noOfSiblings,
          Number_of_Children: noOfChildren,

          // ✅ Contact
          Email_Business: businessEmail,
          Phone_Alternate: Phone2,

          // ✅ Emergency
          Emergency_Contact_Name: emergencyContactName,
          Emergency_Contact_Relationship: emergencyContactRelation,
          Emergency_Contact_Phone: emergencyContactPhone,

          // ✅ Location
          City: city,
          State: state,
          Postal_Code: postalCode,
          Country: country,

          // ✅ Passport
          Passport_No: passportNo,
          Passport_Expiry_Date: passportExpiryDate,

          // ✅ Other ID
          Other_Id_Type: otherIdType,
          Other_Id_No: otherIdNo,

          created_by,
        },
      ];

      const res = await fetch(`${config.apiBaseUrl}/PersonalRequestDetails`, {
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
    // { label: 'Academic Details' },
    { label: "Family" },
    { label: "Academic Details" },
    { label: "Documents" },
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
          <h1 className="page-title">Employee Assets Details</h1>
          <div className="action-wrapper desktop-actions">
            {saveButtonVisible &&
              ["add", "all permission"].some((permission) =>
                employeePermissions.includes(permission),
              ) && (
                <div className="action-icon add" onClick={handleSave}>
                  <span className="tooltip">save</span>
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

          {/* Asset ID */}
          <div className="col-md-2">
            <div className="inputGroup">
              <input
                type="text"
                value={assetId}
                className="exp-input-field form-control"
                placeholder=" "
                autoComplete="off"
                onChange={(e) => setAssetId(e.target.value)}
              />
              <label className="exp-form-labels">Asset ID</label>
            </div>
          </div>

          {/* Allocation Date */}
          <div className="col-md-2">
            <div className="inputGroup">
              <input
                type="date"
                className="exp-input-field form-control"
                placeholder=" "
                autoComplete="off"
                value={allocationDate}
                onChange={(e) => setAllocationDate(e.target.value)}
              />
              <label className="exp-form-labels">Allocation Date</label>
            </div>
          </div>

          {/* Expected Return */}
          <div className="col-md-2">
            <div className="inputGroup">
              <input
                type="date"
                className="exp-input-field form-control"
                placeholder=" "
                autoComplete="off"                
                value={expectedReturnDate}
                onChange={(e) => setExpectedReturnDate(e.target.value)}
              />
              <label className="exp-form-labels">Expected Return</label>
            </div>
          </div>

          {/* Actual Return */}
          <div className="col-md-2">
            <div className="inputGroup">
              <input
                type="date"
                className="exp-input-field form-control"
                placeholder=" "
                autoComplete="off"                
                value={actualReturnDate}
                onChange={(e) => setActualReturnDate(e.target.value)}
              />
              <label className="exp-form-labels">Actual Return</label>
            </div>
          </div>

          {/* Allocation Status */}
          <div className="col-md-2">
            <div className="inputGroup">
            <input
              type="text"
              className="exp-input-field form-control"
              placeholder=" "
              autoComplete="off"                
              value={allocationStatus}
              onChange={(e) => setAllocationStatus(e.target.value)}
            />
            <label className="exp-form-labels">Allocation Status</label>
            </div>
          </div>

          {/* Condition at Issue */}
        <div className="col-md-2">
          <div className="inputGroup">
            <input
              type="text"
              className="exp-input-field form-control"
              placeholder=" "
              autoComplete="off"                
              value={conditionAtIssue}
              onChange={(e) => setConditionAtIssue(e.target.value)}
            />
            <label className="exp-form-labels">Condition at Issue</label>
            </div>
          </div>

          {/* Condition at Return */}
        <div className="col-md-2">
          <div className="inputGroup">
            <input
              type="text"
              className="exp-input-field form-control"
              placeholder=" "
              autoComplete="off"                
              value={conditionAtReturn}
              onChange={(e) => setConditionAtReturn(e.target.value)}
            />
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
              autoComplete="off"                
              value={approvedBy}
              onChange={(e) => setApprovedBy(e.target.value)}
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
              autoComplete="off"                
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
            <label className="exp-form-labels">Remarks</label>
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
              />
              <label htmlFor="passportNo" className="exp-form-labels">
                Purpose
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default EmpAssetsRequest;
