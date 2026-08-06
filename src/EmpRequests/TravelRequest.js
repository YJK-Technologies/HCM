import React, { useState, useEffect } from "react";
import "../input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { AgGridReact } from "ag-grid-react";
import { showConfirmationToast } from "../ToastConfirmation";
import LoadingScreen from "../Loading";
import Select from "react-select";
import * as XLSX from "xlsx-js-style";
import { XCircle } from 'lucide-react';
const config = require("../Apiconfig");

function TravelRequest({ }) {

  //code added by Pavun purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem('permissions')) || {};
  const travelRequestPermissions = permissions
    .filter(permission => permission.screen_type === 'TravelRequest')
    .map(permission => permission.permission_type.toLowerCase());

  const [rowData, setRowData] = useState([]);
  const [Country_Code, setCountry_Code] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSelectDepartment, setIsSelectDepartment] = useState(false);
  const [selecteddpt, setselecteddept] = useState("");
  const [DPTdrop, setDPTdrop] = useState([]);
  const [Countrydrop, setCountrydrop] = useState([]);
  const [CountrydropGR, setCountrydropGR] = useState([]);
  const [CountrydropSC, setCountrydropSC] = useState([]);
  const [employmentdrop, setEmploymentdrop] = useState([]);
  const [employmentdropGR, setEmploymentdropGR] = useState([]);
  const [departmentDrop, setDepartmentDrop] = useState([]);
  const [dpt, setdpt] = useState("");
  const [showAsterisk, setShowAsterisk] = useState(true);
  const [selecteddptSC, setselecteddeptSC] = useState("");
  const [dptSC, setdptSC] = useState("");

  const [travel_request_id, settravel_request_id] = useState("");
  const [request_number, setrequest_number] = useState("");
  const [empIdDrop, setEmpIdDrop] = useState([]);
  const [empId, setEmpId] = useState("");
  const [selectedEmpId, setSelectedEmpId] = useState("");

  const [destination_country_id, setdestination_country_id] = useState("");
  const [destination_city, setdestination_city] = useState("");
  const [purpose_of_travel, setpurpose_of_travel] = useState("");
  const [countryIdDrop, setCountyIdDrop] = useState([]);
  const [visaTypeDrop, setVisaTypeDrop] = useState([]);
  const [travelStartDate, setTravelStartDate] = useState("");
  const [travelEndDate, setTravelEndDate] = useState("");

  const [estimated_cost, setestimated_cost] = useState("");
  const [Currency_Code, setCurrency_Code] = useState("");
  const [reqStatusDrop, setReqStatusDrop] = useState([]);
  const [reqStatusDropAG, setReqStatusDropAG] = useState([]);
  const [reqStatus, setReqStatus] = useState("");
  const [selectedReqStatus, setSelectedReqStatus] = useState("");
  const [priorityDrop, setPriorityDrop] = useState([]);
  const [priority, setPriority] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [remarks, setRemarks] = useState("");

  const [empIdDropSc, setEmpIdDropSc] = useState([]);
  const [empIdSc, setEmpIdSc] = useState("");
  const [selectedEmpIdSc, setSelectedEmpIdSc] = useState("");
  const [countryIdDropSc, setCountyIdDropSc] = useState([]);
  const [visaTypeDropSc, setVisaTypeDropSc] = useState([]);
  const [travelStartDateSc, setTravelStartDateSc] = useState("");
  const [travelEndDateSc, setTravelEndDateSc] = useState("");
  const [reqStatusDropSC, setReqStatusDropSC] = useState([]);
  const [priorityDropSc, setPriorityDropSc] = useState([]);
  const [prioritySc, setPrioritySc] = useState("");
  const [selectedPrioritySc, setSelectedPrioritySc] = useState("");
  const [remarksSc, setRemarksSc] = useState("");
  const [dynamicOptions, setDynamicOptions] = useState([]);
  const [selectedmanager, setselectedmanager] = useState("");
  const [ProjectManager, setProjectManager] = useState("");
  const [isSelectManager, setIsSelectManager] = useState(false);
  const [Managerdrop, setManagerdrop] = useState([]);
  const [ManagerdropAG, setManagerdropAG] = useState([]);
  const [travel_request_idSC, settravel_request_idSC] = useState("");
  const [request_numberSC, setrequest_numberSC] = useState("");
  const [isSelectDepartmentSC, setIsSelectDepartmentSC] = useState(false);
  const [DPTdropSC, setDPTdropSC] = useState([]);

  const [destination_country_idSC, setdestination_country_idSC] = useState("");
  const [purpose_of_travelSC, setpurpose_of_travelSC] = useState("");

  const [estimated_costSC, setestimated_costSC] = useState("");
  const [Currency_CodeSC, setCurrency_CodeSC] = useState("");
  const [selectedReqStatusSC, setSelectedReqStatusSC] = useState("");
  const [reqStatusSC, setReqStatusSC] = useState("");
  const [selectedmanagerSC, setselectedmanagerSC] = useState("");
  const [isSelectManagerSC, setIsSelectManagerSC] = useState(false);
  const [ManagerdropSC, setManagerdropSC] = useState([]);
  const [destination_citySC, setdestination_citySC] = useState("");
  const [ProjectManagerSC, setProjectManagerSC] = useState("");
  const [PriorityGridDrop, setPriorityGridDrop] = useState([]);

  const [isSelectedEmpId, setIsSelectedEmpId] = useState(false);
  const [isSelectedReqStatus, setIsSelectedReqStatus] = useState(false);
  const [isSelectedPriority, setIsSelectedPriority] = useState(false);

  const [isSelectedEmpIdSc, setIsSelectedEmpIdSc] = useState(false);
  const [isSelectedReqStatusSC, setIsSelectedReqStatusSC] = useState(false);
  const [isSelectedPrioritySc, setIsSelectedPrioritySc] = useState(false);

  const [currencyDrop, setCurrencyDrop] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [isSelectedCurrency, setIsSelectedCurrency] = useState(false);

  const [currencyDropSc, setCurrencyDropSc] = useState([]);
  const [selectedCurrencySc, setSelectedCurrencySc] = useState('');
  const [isSelectedCurrencySc, setIsSelectedCurrencySc] = useState(false);

  const [currencyDropGrid, setCurrencyDropGrid] = useState([]);

  const [travel_type, settravel_type] = useState("");
  const [travel_typeDrop, settravel_typeDrop] = useState([]);
  const [selectedtravel_type, setSelectedtravel_type] = useState('');
  const [isSelectedtravel_type, setIsSelectedtravel_type] = useState(false);
  const [travel_typeDropGrid, settravel_typeDropGrid] = useState([]);


  const [travel_typeSC, settravel_typeSC] = useState("");
  const [travel_typeDropSc, settravel_typeDropSc] = useState([]);
  const [selectedtravel_typeSc, setSelectedtravel_typeSc] = useState('');
  const [isSelectedtravel_typeSc, setIsSelectedtravel_typeSc] = useState(false);

  const [selectedCountryId, setSelectedCountryId] = useState('');
  const [countryId, setCountryId] = useState('');
  const [isSelectedCountryId, setIsSelectedCountryId] = useState(false);

  const [selectedCountryIdSc, setSelectedCountryIdSc] = useState('');
  const [isSelectedCountryIdSc, setIsSelectedCountryIdSc] = useState(false);
  const [countryIdSc, setCountryIdSc] = useState('');
  const [countryIdDropGrid, setCountyIdDropGrid] = useState([]);

  const [transport_mode, settransport_mode] = useState("");
  const [transport_modeDrop, settransport_modeDrop] = useState([]);
  const [selectedtransport_mode, setSelectedtransport_mode] = useState('');
  const [isSelectedtransport_mode, setIsSelectedtransport_mode] = useState(false);
  const [transport_modeDropGrid, settransport_modeDropGrid] = useState([]);

  const [transport_modeSc, settransport_modeSc] = useState("");
  const [transport_modeDropSc, settransport_modeDropSc] = useState([]);
  const [selectedtransport_modeSc, setSelectedtransport_modeSc] = useState('');
  const [isSelectedtransport_modeSc, setIsSelectedtransport_modeSc] = useState(false);

  const [accommodation_required, setaccommodation_required] = useState("");
  const [accommodation_requiredDrop, setaccommodation_requiredDrop] = useState([]);
  const [selectedaccommodation_required, setSelectedaccommodation_required] = useState('');
  const [isSelectedaccommodation_required, setIsSelectedaccommodation_required] = useState(false);
  const [accommodation_requiredDropGrid, setaccommodation_requiredDropGrid] = useState([]);

  const [accommodation_requiredSc, setaccommodation_requiredSc] = useState("");
  const [accommodation_requiredDropSc, setaccommodation_requiredDropSc] = useState([]);
  const [selectedaccommodation_requiredSc, setSelectedaccommodation_requiredSc] = useState('');
  const [isSelectedaccommodation_requiredSc, setIsSelectedaccommodation_requiredSc] = useState(false);

  const [empIdDropGrid, setEmpIdDropGrid] = useState([]);

  const Location_Code = sessionStorage.getItem('selectedLocationCode')

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    fetch(`${config.apiBaseUrl}/getEmployeeId`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code, Location_Code }),
    })
      .then((data) => data.json())
      .then((val) => setEmpIdDrop(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");
    fetch(`${config.apiBaseUrl}/getPriority`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => setPriorityDrop(val));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");
    fetch(`${config.apiBaseUrl}/status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => setReqStatusDrop(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

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
      .catch((error) => console.error("Error fetching warehouse:", error));
  }, []);

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
      .then((data) => data.json())
      .then((val) => {
        const Manager = val.map((option) => ({
          value: option.EmployeeId,
          label: `${option.EmployeeId} - ${option.full_name}`,
        }));

        setManagerdropAG(Manager);
      })
      .catch((error) => console.error("Error fetching Travel request:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");
    fetch(`${config.apiBaseUrl}/getLeaveStatus`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => {
        const reqStatus = val.map((option) => option.attributedetails_name);
        setReqStatusDropAG(reqStatus);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const fetchProductCodes = async (selectedValue) => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    try {
      const response = await fetch(`${config.apiBaseUrl}/getDesgination`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dept_id: selectedValue, company_code }),
      });

      const data = await response.json();
      const formattedData = data.map((product) => ({
        value: product.Desgination,
        label: product.Desgination,
      }));

      setDynamicOptions(formattedData);
      return formattedData;
    } catch (error) {
      console.error("Error fetching product codes:", error);
      return [];
    }
  };

  const fetchProductCodesSC = async (selectedValue) => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    try {
      const response = await fetch(`${config.apiBaseUrl}/getDesgination`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dept_id: selectedValue, company_code }),
      });

      const data = await response.json();
      const formattedData = data.map((product) => ({
        value: product.Desgination,
        label: product.Desgination,
      }));

      setDynamicOptions(formattedData);
      return formattedData;
    } catch (error) {
      console.error("Error fetching product codes:", error);
      return [];
    }
  };

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    fetch(`${config.apiBaseUrl}/getCurrenyCode`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => setCurrencyDrop(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    fetch(`${config.apiBaseUrl}/getVisaType`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => settravel_typeDrop(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    fetch(`${config.apiBaseUrl}/getTransportMode`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => settransport_modeDrop(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    fetch(`${config.apiBaseUrl}/getKids`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => setaccommodation_requiredDrop(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const filteredOptionEmpId = Array.isArray(empIdDrop)
    ? empIdDrop.map((option) => ({
      value: option.EmployeeId,
      label: `${option.EmployeeId}-${option.First_Name}`,
    }))
    : [];

  const filteredOptionPriority = Array.isArray(priorityDrop)
    ? priorityDrop.map((option) => ({
      value: option.attributedetails_name,
      label: option.attributedetails_name,
    }))
    : [];

  const filteredOptionReqStatus = Array.isArray(reqStatusDrop)
    ? reqStatusDrop.map((option) => ({
      value: option.attributedetails_name,
      label: option.attributedetails_name,
    }))
    : [];

  const filteredOptionManager = Array.isArray(Managerdrop)
    ? Managerdrop.map((option) => ({
      value: option.EmployeeId,
      label: `${option.EmployeeId}-${option.full_name}`,
    }))
    : [];

  const filteredOptionManagerSC = Array.isArray(ManagerdropSC)
    ? ManagerdropSC.map((option) => ({
      value: option.EmployeeId,
      label: `${option.EmployeeId}-${option.full_name}`,
    }))
    : [];

  const filteredOptionCurrency = Array.isArray(currencyDrop)
    ? currencyDrop.map((option) => ({
      value: option?.attributedetails_name,
      label: option?.attributedetails_name,
    }))
    : [];

  const filteredOptiontravel_type = Array.isArray(travel_typeDrop)
    ? travel_typeDrop.map((option) => ({
      value: option?.attributedetails_name,
      label: option?.attributedetails_name,
    }))
    : [];

  const filteredOptiontransport_mode = Array.isArray(transport_modeDrop)
    ? transport_modeDrop.map((option) => ({
      value: option?.attributedetails_name,
      label: option?.attributedetails_name,
    }))
    : [];

  const filteredOptionaccommodation_required = Array.isArray(accommodation_requiredDrop)
    ? accommodation_requiredDrop.map((option) => ({
      value: option?.attributedetails_name,
      label: option?.attributedetails_name,
    }))
    : [];

  const filteredOptionCountryId = Array.isArray(countryIdDrop)
    ? countryIdDrop.map((option) => ({
      value: option?.Country_Code,
      label: `${option?.Country_Code} - ${option?.Country_Name}`,
    }))
    : [];

  const filteredOptionCountryIdSc = Array.isArray(countryIdDropSc)
    ? countryIdDropSc.map((option) => ({
      value: option?.Country_Code,
      label: `${option?.Country_Code} - ${option?.Country_Name}`,
    }))
    : [];

  const handleChangeCountryId = (selectedCountryId) => {
    setSelectedCountryId(selectedCountryId);
    setCountryId(selectedCountryId ? selectedCountryId.value : "");
  };

  const handleChangeCountryIdSc = (selectedCountryIdSc) => {
    setSelectedCountryIdSc(selectedCountryIdSc);
    setCountryIdSc(selectedCountryIdSc ? selectedCountryIdSc.value : "");
  };

  const handleChangeEmpId = (selectedEmpId) => {
    setSelectedEmpId(selectedEmpId);
    setEmpId(selectedEmpId ? selectedEmpId.value : "");
  };

  const handleChangePriority = (selectedPriority) => {
    setSelectedPriority(selectedPriority);
    setPriority(selectedPriority ? selectedPriority.value : "");
  };

  const handleChangeReqStatus = (selectedReqStatus) => {
    setSelectedReqStatus(selectedReqStatus);
    setReqStatus(selectedReqStatus ? selectedReqStatus.value : "");
  };

  const handleChangeReqStatusSC = (selectedReqStatusSC) => {
    setSelectedReqStatusSC(selectedReqStatusSC);
    setReqStatusSC(selectedReqStatusSC ? selectedReqStatusSC.value : "");
  };

  const handleChangemanager = (selectedOption) => {
    setselectedmanager(selectedOption);
    setProjectManager(selectedOption ? selectedOption.value : "");
  };
  const handleChangemanagerSC = (selectedOption) => {
    setselectedmanagerSC(selectedOption);
    setProjectManagerSC(selectedOption ? selectedOption.value : "");
  };

  const handleChangeCurrency = (selectedCurrency) => {
    setSelectedCurrency(selectedCurrency);
    setCurrency_Code(selectedCurrency ? selectedCurrency.value : "");
  };

  const handleChangetravel_type = (selectedtravel_type) => {
    setSelectedtravel_type(selectedtravel_type);
    settravel_type(selectedtravel_type ? selectedtravel_type.value : "");
  };

  const handleChangetransport_mode = (selectedtransport_mode) => {
    setSelectedtransport_mode(selectedtransport_mode);
    settransport_mode(selectedtransport_mode ? selectedtransport_mode.value : "");
  };

  const handleChangeaccommodation_required = (selectedaccommodation_required) => {
    setSelectedaccommodation_required(selectedaccommodation_required);
    setaccommodation_required(selectedaccommodation_required ? selectedaccommodation_required.value : "");
  };

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    fetch(`${config.apiBaseUrl}/getEmployeeId`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code, Location_Code }),
    })
      .then((data) => data.json())
      .then((val) => setEmpIdDropSc(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");
    fetch(`${config.apiBaseUrl}/getPriority`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => setPriorityDropSc(val));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");
    fetch(`${config.apiBaseUrl}/getLeaveStatus`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => setReqStatusDropSC(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/ESSManager`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // user_code: sessionStorage.getItem("selectedUserCode"),
        company_code: sessionStorage.getItem("selectedCompanyCode"),
        Location_Code: sessionStorage.getItem('selectedLocationCode'),
      }),
    })
      .then((response) => response.json())
      .then(setManagerdropSC)
      .catch((error) => console.error("Error fetching warehouse:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");
    fetch(`${config.apiBaseUrl}/getPriority`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Extract city names from the fetched data
        const statusOption = data.map((option) => option.attributedetails_name);
        setPriorityGridDrop(statusOption);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    fetch(`${config.apiBaseUrl}/getCurrenyCode`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => setCurrencyDropSc(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    fetch(`${config.apiBaseUrl}/getVisaType`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => settravel_typeDropSc(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    fetch(`${config.apiBaseUrl}/getTransportMode`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => settransport_modeDropSc(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    fetch(`${config.apiBaseUrl}/getKids`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => setaccommodation_requiredDropSc(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const filteredOptionEmpIdSc = Array.isArray(empIdDropSc)
    ? empIdDropSc.map((option) => ({
      value: option?.EmployeeId,
      label: `${option?.EmployeeId}-${option?.First_Name}`,
    }))
    : [];

  const filteredOptionPrioritySc = Array.isArray(priorityDropSc)
    ? priorityDropSc.map((option) => ({
      value: option?.attributedetails_name,
      label: option?.attributedetails_name,
    }))
    : [];

  const filteredOptionReqStatusSC = Array.isArray(reqStatusDropSC)
    ? [
      { value: "All", label: "All" },
      ...reqStatusDropSC.map((option) => ({
        value: option?.attributedetails_name,
        label: option?.attributedetails_name,
      })),
    ]
    : [{ value: "All", label: "All" }];

  const filteredOptionCurrencySc = Array.isArray(currencyDropSc)
    ? currencyDropSc.map((option) => ({
      value: option?.attributedetails_name,
      label: option?.attributedetails_name,
    }))
    : [];

  const filteredOptiontravel_typeSc = Array.isArray(travel_typeDropSc)
    ? travel_typeDropSc.map((option) => ({
      value: option?.attributedetails_name,
      label: option?.attributedetails_name,
    }))
    : [];

  const filteredOptiontransport_modeSc = Array.isArray(transport_modeDropSc)
    ? transport_modeDropSc.map((option) => ({
      value: option?.attributedetails_name,
      label: option?.attributedetails_name,
    }))
    : [];

  const filteredOptionaccommodation_requiredSc = Array.isArray(accommodation_requiredDropSc)
    ? accommodation_requiredDropSc.map((option) => ({
      value: option?.attributedetails_name,
      label: option?.attributedetails_name,
    }))
    : [];

  const handleChangeEmpIdSc = (selectedEmpIdSc) => {
    setSelectedEmpIdSc(selectedEmpIdSc);
    setEmpIdSc(selectedEmpIdSc ? selectedEmpIdSc.value : "");
  };

  const handleChangePrioritySc = (selectedPrioritySc) => {
    setSelectedPrioritySc(selectedPrioritySc);
    setPrioritySc(selectedPrioritySc ? selectedPrioritySc.value : "");
  };

  const handleChangeCurrencySc = (selectedCurrencySc) => {
    setSelectedCurrencySc(selectedCurrencySc);
    setCurrency_CodeSC(selectedCurrencySc ? selectedCurrencySc.value : "");
  };

  const handleChangetravel_typeSc = (selectedtravel_typeSc) => {
    setSelectedtravel_typeSc(selectedtravel_typeSc);
    settravel_typeSC(selectedtravel_typeSc ? selectedtravel_typeSc.value : "");
  };

  const handleChangetransport_modeSc = (selectedtransport_modeSc) => {
    setSelectedtransport_modeSc(selectedtransport_modeSc);
    settransport_modeSc(selectedtransport_modeSc ? selectedtransport_modeSc.value : "");
  };

  const handleChangeaccommodation_requiredSc = (selectedaccommodation_requiredSc) => {
    setSelectedaccommodation_requiredSc(selectedaccommodation_requiredSc);
    setaccommodation_requiredSc(selectedaccommodation_requiredSc ? selectedaccommodation_requiredSc.value : "");
  };

  const searchClearInputFields = () => {
    settravel_request_idSC("");
    setrequest_numberSC("");
    setSelectedEmpIdSc("");
    setEmpIdSc("");
    setselecteddeptSC("");
    setdptSC("");
    settravel_typeSC("");
    setdestination_country_idSC("");
    setdestination_citySC("");
    setpurpose_of_travelSC("");
    setTravelStartDateSc("");
    setTravelEndDateSc("");
    settransport_modeSc("");
    setaccommodation_requiredSc("");
    setestimated_costSC("");
    setCurrency_CodeSC("");
    setSelectedReqStatusSC("");
    setReqStatusSC("");
    setselectedmanagerSC("");
    setProjectManagerSC("");
    setRemarks("");
    setSelectedPrioritySc("");
    setPrioritySc("");
    setSelectedCurrencySc("");
    setSelectedCurrency("");
  };

  const handleDPT = (selectedDPT) => {
    setselecteddept(selectedDPT);
    setdpt(selectedDPT ? selectedDPT.value : "");
    fetchProductCodes(selectedDPT ? selectedDPT.value : "");
  };

  const handleDPTSC = (selectedDPTSC) => {
    setselecteddeptSC(selectedDPTSC);
    setdptSC(selectedDPTSC ? selectedDPTSC.value : "");
    fetchProductCodesSC(selectedDPTSC ? selectedDPTSC.value : "");
  };

  const filteredOptionDPt = Array.isArray(DPTdrop)
    ? DPTdrop.map((option) => ({
        value: option?.department_ID,
        label: `${option?.department_ID} - ${option?.dept_name}`,
    }))
    : [];

  const filteredOptionDPtSC = Array.isArray(DPTdropSC)
    ? DPTdropSC.map((option) => ({
        value: option?.department_ID,
        label: `${option?.department_ID} - ${option?.dept_name}`,
    }))
    : [];

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    fetch(`${config.apiBaseUrl}/GetCountry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setCountyIdDropSc(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    fetch(`${config.apiBaseUrl}/GetCountry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => {
        const country = val.map((option) => ({
          value: option.Country_Code,
          label: `${option.Country_Code} - ${option.Country_Name}`,
        }));
        setCountyIdDropGrid(country);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");
    fetch(`${config.apiBaseUrl}/getEmployeeTypeDD`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => setEmploymentdrop(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");
    const EmployeeId = sessionStorage.getItem("selectedUserCode");
    const Location_Code = sessionStorage.getItem("selectedLocationCode");

    const fetchDept = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/EmpDepartment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ company_code, EmployeeId,Location_Code }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const val = await response.json();
        setDPTdrop(val);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    if (company_code) {
      fetchDept();
    }
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");
    const EmployeeId = sessionStorage.getItem("selectedUserCode");
    const Location_Code = sessionStorage.getItem("selectedLocationCode");
    const fetchDept = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/EmpDepartment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ company_code, EmployeeId,Location_Code }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const val = await response.json();
        setDPTdropSC(val);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    if (company_code) {
      fetchDept();
    }
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");
    const EmployeeId = sessionStorage.getItem("selectedUserCode");
    const Location_Code = sessionStorage.getItem("selectedLocationCode");

    fetch(`${config.apiBaseUrl}/EmpDepartment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code, EmployeeId,Location_Code }),
    })
      .then((response) => response.json())
      .then((data) => {
        const deptOptions = data.map((option) => ({
          value: option.department_ID,
          label: `${option.department_ID} - ${option.dept_name}`,
        }));
        setDepartmentDrop(deptOptions);
      })
      // .then((val) => setDPTdrop(val))
      .catch((error) =>
        console.error("Error fetching department data:", error),
      );
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    fetch(`${config.apiBaseUrl}/GetCountry`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((response) => response.json())
      .then((data) => {
        const Countryptions = data.map((option) => ({
          value: option.Country_Code,
          label: `${option.Country_Code} - ${option.Country_Name}`,
        }));
        setCountrydropGR(Countryptions);
      })
      // .then((val) => setDPTdrop(val))
      .catch((error) => console.error("Error fetching country data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    fetch(`${config.apiBaseUrl}/GetCountry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setCountyIdDrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    fetch(`${config.apiBaseUrl}/getEmployeeTypeDD`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((response) => response.json())
      .then((data) => {
        const employmentptions = data.map((option) => ({
          value: option.attributedetails_name,
          label: `${option.attributedetails_name}`,
        }));
        setEmploymentdropGR(employmentptions);
      })
      // .then((val) => setDPTdrop(val))
      .catch((error) =>
        console.error("Error fetching employee type data:", error),
      );
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    fetch(`${config.apiBaseUrl}/getCurrenyCode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => {
        const currency = val.map(option => option.attributedetails_name);
        setCurrencyDropGrid(currency);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    fetch(`${config.apiBaseUrl}/getVisaType`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => {
        const currency = val.map(option => option.attributedetails_name);
        settravel_typeDropGrid(currency);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    fetch(`${config.apiBaseUrl}/getTransportMode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => {
        const currency = val.map(option => option.attributedetails_name);
        settransport_modeDropGrid(currency);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    fetch(`${config.apiBaseUrl}/getKids`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => {
        const currency = val.map(option => option.attributedetails_name);
        setaccommodation_requiredDropGrid(currency);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  // Ag grid drop down For Employee ID
  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    fetch(`${config.apiBaseUrl}/getEmployeeId`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code, Location_Code }),
    })
      .then((data) => data.json())
      .then((val) => {
        const emp = val.map((option) => ({
          value: option.EmployeeId,
          label: `${option.EmployeeId} - ${option.First_Name}`,
        }));
        setEmpIdDropGrid(emp);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const CancelActionRenderer = (params) => {
    const { data } = params;

    const handleCancel = async () => {
      if (data.request_status === 'Cancelled') return;

      showConfirmationToast("Are you sure you want to cancel this travel request?",
        async () => {

          try {
            const response = await fetch(`${config.apiBaseUrl}/travelCancellation`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                modified_by: sessionStorage.getItem('selectedUserCode'),
                request_status: "Cancelled",
                travel_request_id: data.travel_request_id,
                company_code: sessionStorage.getItem("selectedCompanyCode"),
                Location_Code: sessionStorage.getItem('selectedLocationCode'),
                travel_start_date: data.travel_start_date
              }),
            });

            const result = await response.json();
            if (response.ok) {
              toast.success("Travel request cancelled successfully!");
              await handleSearch();
            } else {
              console.error(result.message);
              toast.warning(result.message || "Failed to cancel leave");
            }
          } catch (err) {
            console.error(err);
            toast.error('Error: ' + err.message);
          }
        },
        () => {
          toast.info("Data updated cancelled.");
        }
      );
    };

    const isCancelled = data.LeaveStatus === 'Cancelled';

    return (
      <div className="action-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <button
          onClick={handleCancel}
          disabled={isCancelled}
          className={`icon-cancel-btn ${isCancelled ? 'disabled' : ''}`}
        >
          <XCircle size={18} strokeWidth={2.5} />
        </button>
      </div>
    );
  };

  const columnDefs = [
    {
      headerName: "S.No",
      field: "S.No",
      valueGetter: (params) => params.node.rowIndex + 1,
      width: 80,
    },
    {
      headerName: "Action",
      field: "action",
      width: 100,
      cellStyle: { textAlign: "center" },
      sortable: false,
      filter: false,
      cellRenderer: (params) => {
        const row = params.data;
        if (row.request_status !== "Cancelled") {
          return <CancelActionRenderer {...params} />;
        }

        return null;
      },
      tooltipValueGetter: (params) => {
        return params.data.request_status === 'Cancelled'
          ? "This request has already been cancelled."
          : "Click to cancel this visa request.";
      }
    },    
    {
      headerName: "Travel Request ID",
      field: "travel_request_id",
      editable: false,
    },
    {
      headerName: "Employee ID",
      field: "employee_id",
      editable: false,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: empIdDropGrid.map(d => d.value),
      },
      valueFormatter: (params) => {
        const dept = empIdDropGrid.find(d => d.value === params.value);
        return dept ? dept.label : params.value;
      },
    },
    {
      headerName: "Department",
      field: "department_id",
      editable: false,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: departmentDrop.map((d) => d.value),
      },
      valueFormatter: (params) => {
        const dept = departmentDrop.find((d) => d.value == params.value);
        return dept ? dept.label : params.value;
      },
    },
    {
      headerName: "Travel Type",
      field: "travel_type",
      editable: false,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: travel_typeDropGrid,
      },
    },
    {
      headerName: "Destination Country",
      field: "destination_country_id",
      editable: false,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: countryIdDropGrid.map(d => d.value),
      },
      valueFormatter: (params) => {
        const dept = countryIdDropGrid.find(d => d.value === params.value);
        return dept ? dept.label : params.value;
      },
    },
    {
      headerName: "Destination City",
      field: "destination_city",
      editable: false,
    },
    {
      headerName: "Purpose of Travel",
      field: "purpose_of_travel",
      editable: false,
    },
    {
      headerName: "Start Date",
      field: "travel_start_date",
      editable: false,
    },
    {
      headerName: "End Date",
      field: "travel_end_date",
      editable: false,
    },
    {
      headerName: "Transport Mode",
      field: "transport_mode",
      editable: false,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: transport_modeDropGrid,
      },
    },
    {
      headerName: "Accommodation Required",
      field: "accommodation_required",
      editable: false,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: accommodation_requiredDropGrid,
      },
    },
    {
      headerName: "Estimated Cost",
      field: "estimated_cost",
      editable: false,
    },
    {
      headerName: "Currency Code",
      field: "currency_code",
      editable: false,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: currencyDropGrid,
      },
    },
    {
      headerName: "Request Status",
      field: "request_status",
      editable: false,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: reqStatusDropAG,
      },
    },
    {
      headerName: "Remarks",
      field: "Remarks",
      editable: false,
    },
    {
      headerName: "Priority Level",
      field: "priority_level",
      editable: false,
      filter: "agNumberColumnFilter",
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: PriorityGridDrop,
      },
    },
    {
      headerName: "Manager",
      field: "manager_id",
      editable: false,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: ManagerdropAG.map((d) => d.value),
      },
      valueFormatter: (params) => {
        const loan = ManagerdropAG.find((d) => d.value === params.value);
        return loan ? loan.label : params.value;
      },
    },
    {
      headerName: "Keyfield",
      field: "keyfield",
      hide: true,
    },
  ];

  const gridOptions = {
    pagination: true,
  };

  const onFirstDataRendered = (params) => {
  const allColumnIds = params.columnApi
    .getColumns()
    .map((col) => col.getId());

  params.columnApi.autoSizeColumns(allColumnIds);
};

  const handleSave = async () => {
    if (
      // !travel_request_id ||
      // !empId ||
      !dpt ||
      !travel_type ||
      !countryId ||
      !destination_city ||
      !purpose_of_travel ||
      !travelStartDate ||
      !travelEndDate ||
      !transport_mode ||
      !accommodation_required ||
      !estimated_cost ||
      !priority ||
      !ProjectManager
      // !reqStatus
    ) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }
    if (new Date(travelStartDate) > new Date(travelEndDate)) {
      toast.warning("Start Date cannot be greater than End Date");
      return;
    }

    setLoading(true);

    try {
      const Header = {
        travel_request_id: travel_request_id,
        request_number: request_number,
        employee_id: sessionStorage.getItem("selectedUserCode"),
        department_id: dpt,
        travel_type: travel_type,
        destination_country_id: countryId,
        destination_city: destination_city,
        purpose_of_travel: purpose_of_travel,
        travel_start_date: travelStartDate,
        travel_end_date: travelEndDate,
        transport_mode: transport_mode,
        accommodation_required: accommodation_required,
        estimated_cost: estimated_cost,
        currency_code: Currency_Code,
        request_status: 'Pending',
        Remarks: remarks,
        priority_level: priority,
        manager_id: ProjectManager,
        company_code: sessionStorage.getItem("selectedCompanyCode"),
        Location_Code: sessionStorage.getItem('selectedLocationCode'),
        keyfield: "",
        created_by: sessionStorage.getItem("selectedUserCode"),
        created_date: new Date(),
        modified_by: "",
        modified_date: null,
      };

      const response = await fetch(`${config.apiBaseUrl}/travel_requestsInsert`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(Header),
        },
      );
      if (response.ok) {
        console.log("Data inserted successfully");
        toast.success("Data inserted successfully!", {
          onClose: () => window.location.reload(),
        });
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to insert sales data");
        console.error(errorResponse.details || errorResponse.message);
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error("Error inserting data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);

    try {
      const body = {
        travel_request_id: travel_request_idSC || null,
        request_number: request_numberSC || "",
        employee_id: sessionStorage.getItem("selectedUserCode") || "",
        department_id: dptSC || "",
        travel_type: travel_typeSC || "",
        destination_country_id: countryIdSc || null,
        destination_city: destination_citySC || "",
        purpose_of_travel: purpose_of_travelSC || "",
        travel_start_date: travelStartDateSc || null,
        travel_end_date: travelEndDateSc || null,
        transport_mode: transport_modeSc || "",
        accommodation_required: accommodation_requiredSc || "",
        estimated_cost: estimated_costSC || null,
        currency_code: Currency_CodeSC || "",
        request_status: reqStatusSC || "",
        Remarks: remarksSc || "",
        priority_level: prioritySc || "",
        manager_id: ProjectManagerSC || null,
        company_code: sessionStorage.getItem("selectedCompanyCode"),
        Location_Code: sessionStorage.getItem('selectedLocationCode'),
      };

      const response = await fetch(
        `${config.apiBaseUrl}/travel_requestsSearch`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        },
      );

      if (response.ok) {
        const fetchedData = await response.json();

        const newRows = fetchedData.map((item) => ({
          travel_request_id: item.travel_request_id,
          request_number: item.request_number,
          employee_id: item.employee_id,
          department_id: item.department_id,
          travel_type: item.travel_type,
          destination_country_id: item.destination_country_id,
          destination_city: item.destination_city,
          purpose_of_travel: item.purpose_of_travel,
          travel_start_date: item.travel_start_date,
          travel_end_date: item.travel_end_date,
          transport_mode: item.transport_mode,
          accommodation_required: item.accommodation_required,
          estimated_cost: item.estimated_cost,
          currency_code: item.currency_code,
          request_status: item.request_status,
          Remarks: item.Remarks,
          priority_level: item.priority_level,
          manager_id: item.manager_id,
          keyfield: item.keyfield,
        }));

        setRowData(newRows);
      } else if (response.status === 404) {
        toast.warning("Data Not found");
        setRowData([]);
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Search failed");
        setRowData([]);
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
      toast.error("Error fetching search data: " + error.message);
      setRowData([]);
    } finally {
      setLoading(false);
    }
  };

  const reloadGridData = () => {
    setRowData([]);
    searchClearInputFields();
  };

  const handleUpdate = async (rowData) => {
    showConfirmationToast(
      "Are you sure you want to update the selected travel request data?",
      async () => {
        try {
          setLoading(true);
          const company_code = sessionStorage.getItem("selectedCompanyCode");
          const Location_Code = sessionStorage.getItem('selectedLocationCode');
          const modified_by = sessionStorage.getItem("selectedUserCode");

          const dataToSend = {
            travel_requestsData: Array.isArray(rowData)
              ? rowData.map((row) => ({
                ...row,
                company_code,
                Location_Code,
                modified_by,
              }))
              : [
                {
                  ...rowData,
                  company_code,
                  Location_Code,
                  modified_by,
                },
              ],
          };

          const response = await fetch(
            `${config.apiBaseUrl}/travel_requestsLoopUpdate`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(dataToSend),
            },
          );

          if (response.ok) {
            toast.success("travel request updated successfully", {
              onClose: () => handleSearch(),
            });
          } else {
            const errorResponse = await response.json();
            toast.warning(errorResponse.message || "Update failed");
          }
        } catch (error) {
          console.error("Update error:", error);
          toast.error("Error updating data: " + error.message);
        } finally {
          setLoading(false);
        }
      },
      () => toast.info("Update cancelled"),
    );
  };

  const handleDelete = async (rowData) => {
    showConfirmationToast(
      "Are you sure you want to delete the selected travel request data?",
      async () => {
        try {
          setLoading(true);
          const company_code = sessionStorage.getItem("selectedCompanyCode");
          const Location_Code = sessionStorage.getItem('selectedLocationCode');
          const modified_by = sessionStorage.getItem("selectedUserCode");

          const dataToSend = {
            travel_requestsData: Array.isArray(rowData)
              ? rowData.map((row) => ({
                ...row,
                company_code,
                Location_Code,
                modified_by
              }))
              : [
                {
                  ...rowData,
                  company_code,
                  Location_Code,
                  modified_by
                },
              ],
          };

          const response = await fetch(
            `${config.apiBaseUrl}/travel_requestsLoopDelete`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                company_code: company_code,
              },
              body: JSON.stringify(dataToSend),
            },
          );

          if (response.ok) {
            toast.success("travel request deleted successfully", {
              onClose: () => handleSearch(), // refresh data
            });
          } else {
            const errorResponse = await response.json();
            toast.warning(errorResponse.message || "Delete failed");
          }
        } catch (error) {
          console.error("Error deleting travel request rows:", error);
          toast.error("Error deleting travel request data: " + error.message);
        } finally {
          setLoading(false);
        }
      },
      () => toast.info("Delete cancelled"),
    );
  };

  const getCSSVariable = (variableName) => {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(variableName)
      .trim();
  };

  const transformRowData = (data) => {
    return data.map((row) => {
      const deptObj = departmentDrop.find((d) => d.value == row.department_id);
      const deptName = deptObj ? deptObj.label : "";

      const managerObj = ManagerdropAG.find((d) => d.value == row.manager_id);
      const managerName = managerObj ? managerObj.label : "";

      const countryObj = CountrydropGR.find(
        (c) => c.value == row.destination_country_id,
      );
      const countryName = countryObj ? countryObj.label : "";

      return {
        "Travel Request ID": row.travel_request_id || "",
        "Employee ID": row.employee_id || "",
        Department: deptName,
        "Travel Type": row.travel_type || "",
        "Destination Country": countryName,
        "Destination City": row.destination_city || "",
        "Start Date": row.travel_start_date || "",
        "End Date": row.travel_end_date || "",
        "Transport Mode": row.transport_mode || "",
        "Estimated Cost": row.estimated_cost || "",
        Currency: row.currency_code || "",
        Status: row.request_status || "",
        Remarks: row.Remarks || "",
        Priority: row.priority_level || "",
        Manager: managerName || "",
      };
    });
  };

  const handleExportToExcel = () => {
    if (!rowData || rowData.length === 0) {
      toast.warning("There is no data to export.");
      return;
    }

    const screenName = "Travel Requests Search Report";
    const company = sessionStorage.getItem("selectedCompanyName") || "";

    const titleBg = getCSSVariable("--but").replace("#", "");
    const tableHeaderBg = getCSSVariable("--ag-header").replace("#", "");
    const fontColor = getCSSVariable("--font-color").replace("#", "");
    const altRowBg = getCSSVariable("--ag-row").replace("#", "");

    const headerData = [
      [screenName],
      company ? [`Company Name: ${company}`] : [],
      [],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(headerData);

    const transformedData = transformRowData(rowData);

    XLSX.utils.sheet_add_json(worksheet, transformedData, {
      origin: `A${headerData.length + 1}`,
    });

    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    const headerRowIndex = headerData.length;

    worksheet["A1"].s = {
      font: { bold: true, sz: 16, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: titleBg } },
      alignment: { horizontal: "center", vertical: "center" },
    };

    worksheet["!merges"] = [
      {
        s: { r: 0, c: 0 },
        e: { r: 0, c: Object.keys(transformedData[0]).length - 1 },
      },
    ];

    const totalColumns = Object.keys(transformedData[0]).length;

    for (let C = 0; C < totalColumns; C++) {
      const cell =
        worksheet[XLSX.utils.encode_cell({ r: headerRowIndex, c: C })];

      if (!cell) continue;

      cell.s = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: tableHeaderBg } },
        alignment: { horizontal: "center" },
        border: {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        },
      };
    }

    for (let R = headerRowIndex + 1; R <= range.e.r; R++) {
      for (let C = 0; C < totalColumns; C++) {
        const cell = worksheet[XLSX.utils.encode_cell({ r: R, c: C })];

        if (!cell) continue;

        cell.s = {
          font: { color: { rgb: fontColor } },
          fill: R % 2 === 0 ? { fgColor: { rgb: altRowBg } } : undefined,
          border: {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" },
          },
        };
      }
    }

    worksheet["!cols"] = Array(totalColumns).fill({ wch: 22 });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Travel Requests");

    XLSX.writeFile(workbook, "Travel_Requests_Search_Report.xlsx");
  };

  const handleReloadAdd = () => {
    clearInputsAdd([]);
  };

  const clearInputsAdd = () => {
    setselecteddept('');
    setdpt('');
    setSelectedtravel_type('');
    settravel_type('');
    setSelectedCountryId('');
    setCountryId('');
    setdestination_city('');
    setpurpose_of_travel('');
    setTravelStartDate('');
    setTravelEndDate('');
    setSelectedtransport_mode('');
    settransport_mode('');
    setSelectedaccommodation_required('');
    setaccommodation_required('');
    setestimated_cost('');
    setSelectedCurrency('');
    setCurrency_Code('');
    setRemarks('');
    setSelectedPriority('');
    setPriority('');
    setselectedmanager('');
    setProjectManager('');
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
          <h1 className="page-title">Travel Request</h1>
          <div className="action-wrapper desktop-actions">
            {['add', 'all permission'].some(permission => travelRequestPermissions.includes(permission)) && (
              <div onClick={handleSave} className="action-icon add">
                <span className="tooltip">Save</span>
                <i class="fa-solid fa-floppy-disk"></i>
              </div>
            )}
            <div className="action-icon print" onClick={handleReloadAdd}>
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
              {['add', 'all permission'].some(permission => travelRequestPermissions.includes(permission)) && (
                <li>
                  <button className="dropdown-item" onClick={handleSave}>
                    <i className="fa-solid fa-floppy-disk add fs-4"></i>
                  </button>
                </li>
              )}
              <li>
                <button className="dropdown-item" onClick={handleReloadAdd}>
                  <i className="fa-solid fa-arrow-rotate-right text-dark fs-4"></i>
                </button>
              </li>
            </ul>
          </div>

        </div>
      </div>
      <div className="shadow-lg p-3 bg-light rounded mt-2 container-form-box">
        <div className="row g-3">

          {/* <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                maxLength={15}
                inputMode="numeric"
                pattern="[0-9]*"
                required
                title="Please enter the Travel Request ID"
                autoComplete="off"
                value={travel_request_id}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  settravel_request_id(value);
                }}
              />
              <label
                for="sname"
                className={`exp-form-labels ${error && !travel_request_id ? "text-danger" : ""}`}
              >
                Travel Request ID<span className="text-danger">*</span>
              </label>
            </div>
          </div> */}

          {/* <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="text"
                maxLength={50}
                placeholder=""
                required
                title="Please enter the Request Number"
                autoComplete="off"
                value={request_number}
                onChange={(e) => setrequest_number(e.target.value)}
              />
              <label
                for="sname"
                className={`exp-form-labels ${error && !travel_request_id ? "text-danger" : ""}`}
              >
                Request Number<span className="text-danger">*</span>
              </label>
            </div>
          </div> */}

          {/* <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
                ${selectedEmpId ? "has-value" : ""} 
                ${isSelectedEmpId ? "is-focused" : ""}`}
              title="Please select the Employee ID"
            >
              <Select
                id="department"
                placeholder=" "
                onFocus={() => setIsSelectedEmpId(true)}
                onBlur={() => setIsSelectedEmpId(false)}
                classNamePrefix="react-select"
                isClearable
                type="text"
                value={selectedEmpId}
                onChange={handleChangeEmpId}
                options={filteredOptionEmpId}
              />
              <label
                htmlFor="selecteddpt"
                className={`floating-label ${error && !empId ? "text-danger" : ""}`}
              >
                Employee ID<span className="text-danger">*</span>
              </label>
            </div>
          </div> */}

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selecteddpt ? "has-value" : ""} 
              ${isSelectDepartment ? "is-focused" : ""}`}
              title="Please select the Department"
            >
              <Select
                id="department"
                placeholder=" "
                onFocus={() => setIsSelectDepartment(true)}
                onBlur={() => setIsSelectDepartment(false)}
                classNamePrefix="react-select"
                isClearable
                title="Please enter the Department"
                type="text"
                value={selecteddpt}
                onChange={handleDPT}
                options={filteredOptionDPt}
              />
              <label
                htmlFor="selecteddpt"
                className={`floating-label ${error && !dpt ? "text-danger" : ""}`}
              >
                Department
                {showAsterisk && <span className="text-danger">*</span>}
              </label>
            </div>
          </div>

          {/* <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="text"
                maxLength={20}
                placeholder=""
                required
                title="Please enter the Travel Type"
                autoComplete="off"
                value={travel_type}
                onChange={(e) => settravel_type(e.target.value)}
              />
              <label
                for="sname"
                className={`exp-form-labels ${error && !travel_type ? "text-danger" : ""}`}
              >
                Travel Type<span className="text-danger">*</span>
              </label>
            </div>
          </div> */}

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedtravel_type ? "has-value" : ""} 
              ${isSelectedtravel_type ? "is-focused" : ""}`}
              title="Please select the Travel Type"
            >
              <Select
                id="country"
                type="text"
                classNamePrefix="react-select"
                placeholder=""
                onFocus={() => setIsSelectedtravel_type(true)}
                onBlur={() => setIsSelectedtravel_type(false)}
                isClearable
                title="Please enter the Travel Type"
                value={selectedtravel_type}
                onChange={handleChangetravel_type}
                options={filteredOptiontravel_type}
              />
              <label for="sname" className={`floating-label ${error && !travel_type ? 'text-danger' : ''}`}>Travel Type<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
                  ${selectedCountryId ? "has-value" : ""} 
                  ${isSelectedCountryId ? "is-focused" : ""}`}
              title="Please select the Destination Country ID"
            >
              <Select
                id="country"
                type="text"
                classNamePrefix="react-select"
                placeholder=""
                onFocus={() => setIsSelectedCountryId(true)}
                onBlur={() => setIsSelectedCountryId(false)}
                isClearable
                title="Please enter the Destination Country ID"
                value={selectedCountryId}
                onChange={handleChangeCountryId}
                options={filteredOptionCountryId}
              />
              <label for="sname" className={`floating-label ${error && !countryId ? 'text-danger' : ''}`}>Destination Country ID<span className="text-danger">*</span></label>
            </div>
          </div>


          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="Text"
                maxLength={100}
                placeholder=""
                required
                title="Please enter the Destination City"
                autoComplete="off"
                value={destination_city}
                onChange={(e) => setdestination_city(e.target.value)}
              />
              <label
                for="sname"
                className={`exp-form-labels ${error && !destination_city ? "text-danger" : ""}`}
              >
                Destination City<span className="text-danger">*</span>
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required
                title="Please enter the Purpose of Travel"
                autoComplete="off"
                value={purpose_of_travel}
                onChange={(e) => setpurpose_of_travel(e.target.value)}
              />
              <label
                for="sname"
                className={`exp-form-labels ${error && !purpose_of_travel ? "text-danger" : ""}`}
              >
                Purpose of Travel<span className="text-danger">*</span>
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="date"
                placeholder=""
                required
                title="Please select the Travel Start Date"
                autoComplete="off"
                value={travelStartDate}
                onChange={(e) => setTravelStartDate(e.target.value)}
              />
              <label
                for="sname"
                className={`exp-form-labels ${error && !travelStartDate ? "text-danger" : ""}`}
              >
                Travel Start Date<span className="text-danger">*</span>
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="date"
                placeholder=""
                required
                title="Please select the Travel End Date"
                autoComplete="off"
                value={travelEndDate}
                onChange={(e) => setTravelEndDate(e.target.value)}
              />
              <label
                for="sname"
                className={`exp-form-labels ${error && !travelEndDate ? "text-danger" : ""}`}
              >
                Travel End Date<span className="text-danger">*</span>
              </label>
            </div>
          </div>

          {/* <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="text"
                maxLength={50}
                placeholder=""
                required
                title="Please enter the Transport Mode"
                autoComplete="off"
                value={transport_mode}
                onChange={(e) => settransport_mode(e.target.value)}
              />
              <label
                for="sname"
                className={`exp-form-labels ${error && !transport_mode ? "text-danger" : ""}`}
              >
                Transport Mode<span className="text-danger">*</span>
              </label>
            </div>
          </div> */}

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedtransport_mode ? "has-value" : ""} 
              ${isSelectedtransport_mode ? "is-focused" : ""}`}
              title="Please select the Transport Mode"
            >
              <Select
                id="country"
                type="text"
                classNamePrefix="react-select"
                title="Please enter the Transport Mode"
                placeholder=""
                onFocus={() => setIsSelectedtransport_mode(true)}
                onBlur={() => setIsSelectedtransport_mode(false)}
                isClearable
                value={selectedtransport_mode}
                onChange={handleChangetransport_mode}
                options={filteredOptiontransport_mode}
              />
              <label for="sname" className={`floating-label ${error && !transport_mode ? 'text-danger' : ''}`}>Transport Mode<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedaccommodation_required ? "has-value" : ""} 
              ${isSelectedaccommodation_required ? "is-focused" : ""}`}
              title="Please select the Accommodation Required"
            >
              <Select
                id="country"
                type="text"
                classNamePrefix="react-select"
                title="Please enter the Accommodation Required"
                placeholder=""
                onFocus={() => setIsSelectedaccommodation_required(true)}
                onBlur={() => setIsSelectedaccommodation_required(false)}
                isClearable
                value={selectedaccommodation_required}
                onChange={handleChangeaccommodation_required}
                options={filteredOptionaccommodation_required}
              />
              <label for="sname" className={`floating-label ${error && !transport_mode ? 'text-danger' : ''}`}>Accommodation Required<span className="text-danger">*</span></label>
            </div>
          </div>

          {/* <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                className="exp-input-field form-control"
                type="text"
                placeholder=""
                maxLength={1}
                inputMode="numeric"
                pattern="[0-1]"
                required
                title="Please enter the Accommodation Required (Only - 0 or 1)"
                autoComplete="off"
                value={accommodation_required}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^01]/g, "");
                  setaccommodation_required(value);
                }}
              />
              <label
                htmlFor="fdate"
                className={`exp-form-labels ${error && !accommodation_required ? "text-danger" : ""}`}
              >
                Accommodation Required<span className="text-danger">*</span>
              </label>
            </div>
          </div> */}

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                maxLength={14}
                inputMode="numeric"
                pattern="[0-9]*"
                required
                title="Please enter the Estimated Cost"
                autoComplete="off"
                value={estimated_cost}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setestimated_cost(value);
                }}
              />
              <label
                for="sname"
                className={`exp-form-labels ${error && !estimated_cost ? "text-danger" : ""}`}
              >
                Estimated Cost<span className="text-danger">*</span>
              </label>
            </div>
          </div>

          {/* <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="add3"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                maxLength={10}
                required
                title="Please enter the Currency Code"
                value={Currency_Code}
                onChange={(e) => setCurrency_Code(e.target.value)}
              />
              <label className="exp-form-labels">Currency Code</label>
            </div>
          </div> */}

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedCurrency ? "has-value" : ""} 
              ${isSelectedCurrency ? "is-focused" : ""}`}
              title="Please select the Currency Code"
            >
              <Select
                id="country"
                type="text"
                classNamePrefix="react-select"
                placeholder=""
                onFocus={() => setIsSelectedCurrency(true)}
                onBlur={() => setIsSelectedCurrency(false)}
                isClearable
                title="Please enter the Currency Code"
                value={selectedCurrency}
                onChange={handleChangeCurrency}
                options={filteredOptionCurrency}
              />
              <label for="sname" className={`floating-label ${error && !Currency_Code ? 'text-danger' : ''}`}>Currency Code<span className="text-danger">*</span></label>
            </div>
          </div>

          {/* <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
                ${selectedReqStatus ? "has-value" : ""} 
                ${isSelectedReqStatus ? "is-focused" : ""}`}
                title="Please select the Request Status"
            >
              <Select
                id="country"
                type="text"
                classNamePrefix="react-select"
                placeholder=""
                onFocus={() => setIsSelectedReqStatus(true)}
                onBlur={() => setIsSelectedReqStatus(false)}
                isClearable
                value={selectedReqStatus}
                onChange={handleChangeReqStatus}
                options={filteredOptionReqStatus}
              />
              <label
                for="sname"
                className={`floating-label ${error && !Country_Code ? "text-danger" : ""}`}
              >
                Request Status<span className="text-danger">*</span>
              </label>
            </div>
          </div> */}

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="text"
                maxLength={255}
                placeholder=""
                required
                title="Please enter the Remarks"
                autoComplete="off"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
              <label
                for="sname"
                className={`exp-form-labels ${error && !remarks ? "text-danger" : ""}`}
              >
                Remarks<span className="text-danger">*</span>
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
               ${selectedPriority ? "has-value" : ""} 
               ${isSelectedPriority ? "is-focused" : ""}`}
              title="Please select the Priority Level"
            >
              <Select
                id="country"
                type="text"
                classNamePrefix="react-select"
                placeholder=""
                onFocus={() => setIsSelectedPriority(true)}
                onBlur={() => setIsSelectedPriority(false)}
                isClearable
                title="Please select the Priority Level"
                value={selectedPriority}
                onChange={handleChangePriority}
                options={filteredOptionPriority}
              />
              <label
                for="sname"
                className={`floating-label ${error && !selectedPriority ? "text-danger" : ""}`}
              >
                Priority Level<span className="text-danger">*</span>
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedmanager ? "has-value" : ""} 
              ${isSelectManager ? "is-focused" : ""}`}
              title="Please select the Manager"
            >
              <Select
                id="LoanEligibleAmount"
                type="text"
                placeholder=" "
                onFocus={() => setIsSelectManager(true)}
                onBlur={() => setIsSelectManager(false)}
                classNamePrefix="react-select"
                isClearable
                value={selectedmanager}
                options={filteredOptionManager}
                onChange={handleChangemanager}
                maxLength={18}
              />
              <label
                for="add1"
                className={`floating-label ${error && !ProjectManager ? "text-danger" : ""}`}
              >
                Manager<span className="text-danger">*</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="shadow-lg p-3 bg-light rounded mt-2 container-form-box">
        <div className="header-flex">
          <h6 className="">Search Criteria:</h6>
        </div>
        <div className="row g-3">
          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                maxLength={15}
                inputMode="numeric"
                pattern="[0-9]*"
                required
                title="Please enter the Travel Request ID"
                autoComplete="off"
                value={travel_request_idSC}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  settravel_request_idSC(value);
                }}
              />
              <label for="sname" className={`exp-form-labels`}>
                Travel Request ID
              </label>
            </div>
          </div>

          {/* <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                maxLength={50}
                required
                title="Please enter the Request Number"
                autoComplete="off"
                value={request_numberSC}
                onChange={(e) => setrequest_numberSC(e.target.value)}
              />
              <label for="sname" className={`exp-form-labels`}>
                Request Number
              </label>
            </div>
          </div> */}

          {/* <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
                ${selectedEmpIdSc ? "has-value" : ""} 
                ${isSelectedEmpIdSc ? "is-focused" : ""}`}
              title="Please select the Employee ID"
            >
              <Select
                id="department"
                placeholder=" "
                onFocus={() => setIsSelectedEmpIdSc(true)}
                onBlur={() => setIsSelectedEmpIdSc(false)}
                classNamePrefix="react-select"
                isClearable
                type="text"
                value={selectedEmpIdSc}
                onChange={handleChangeEmpIdSc}
                options={filteredOptionEmpIdSc}
              />
              <label htmlFor="selecteddpt" className={`floating-label`}>
                Employee ID
              </label>
            </div>
          </div> */}

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selecteddptSC ? "has-value" : ""} 
              ${isSelectDepartmentSC ? "is-focused" : ""}`}
              title="Please select the Department"
            >
              <Select
                id="department"
                placeholder=" "
                onFocus={() => setIsSelectDepartmentSC(true)}
                onBlur={() => setIsSelectDepartmentSC(false)}
                classNamePrefix="react-select"
                isClearable
                type="text"
                value={selecteddptSC}
                onChange={handleDPTSC}
                options={filteredOptionDPtSC}
              />
              <label htmlFor="selecteddpt" className={`floating-label`}>
                Department
              </label>
            </div>
          </div>

          {/* <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                maxLength={20}
                required
                title="Please enter the Travel Type"
                autoComplete="off"
                value={travel_typeSC}
                onChange={(e) => settravel_typeSC(e.target.value)}
              />
              <label for="sname" className={`exp-form-labels`}>
                Travel Type
              </label>
            </div>
          </div> */}

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedtravel_typeSc ? "has-value" : ""} 
              ${isSelectedtravel_typeSc ? "is-focused" : ""}`}
              title="Please select the Travel Type"
            >
              <Select
                id="country"
                type="text"
                classNamePrefix="react-select"
                placeholder=""
                onFocus={() => setIsSelectedtravel_typeSc(true)}
                onBlur={() => setIsSelectedtravel_typeSc(false)}
                isClearable
                value={selectedtravel_typeSc}
                onChange={handleChangetravel_typeSc}
                options={filteredOptiontravel_typeSc}
              />
              <label for="sname" className={`floating-label`}>Travel Type</label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedCountryIdSc ? "has-value" : ""} 
              ${isSelectedCountryIdSc ? "is-focused" : ""}`}
              title="Please select the Destination Country ID"
            >
              <Select
                id="country"
                type="text"
                classNamePrefix="react-select"
                placeholder=""
                onFocus={() => setIsSelectedCountryIdSc(true)}
                onBlur={() => setIsSelectedCountryIdSc(false)}
                isClearable
                value={selectedCountryIdSc}
                onChange={handleChangeCountryIdSc}
                options={filteredOptionCountryIdSc}
              />
              <label for="sname" className={`floating-label`}>Destination Country ID</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="Text"
                placeholder=""
                maxLength={100}
                required
                title="Please enter the Destination City"
                autoComplete="off"
                value={destination_citySC}
                onChange={(e) => setdestination_citySC(e.target.value)}
              />
              <label for="sname" className={`exp-form-labels`}>
                Destination City
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required
                title="Please enter the Purpose of Travel"
                autoComplete="off"
                value={purpose_of_travelSC}
                onChange={(e) => setpurpose_of_travelSC(e.target.value)}
              />
              <label for="sname" className={`exp-form-labels`}>
                Purpose of Travel
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="date"
                placeholder=""
                required
                title="Please Select the Travel Start Date"
                autoComplete="off"
                value={travelStartDateSc}
                onChange={(e) => setTravelStartDateSc(e.target.value)}
              />
              <label for="sname" className={`exp-form-labels`}>
                Travel Start Date
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="date"
                placeholder=""
                required
                title="Please Select the Travel End Date"
                autoComplete="off"
                value={travelEndDateSc}
                onChange={(e) => setTravelEndDateSc(e.target.value)}
              />
              <label for="sname" className={`exp-form-labels`}>
                Travel End Date
              </label>
            </div>
          </div>

          {/* <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                maxLength={50}
                required
                title="Please enter the Transport Mode"
                autoComplete="off"
                value={transport_modeSc}
                onChange={(e) => settransport_modeSc(e.target.value)}
              />
              <label for="sname" className={`exp-form-labels`}>
                Transport Mode
              </label>
            </div>
          </div> */}

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedtransport_modeSc ? "has-value" : ""} 
              ${isSelectedtransport_modeSc ? "is-focused" : ""}`}
              title="Please select the Transport Mode"
            >
              <Select
                id="country"
                type="text"
                classNamePrefix="react-select"
                placeholder=""
                onFocus={() => setIsSelectedtransport_modeSc(true)}
                onBlur={() => setIsSelectedtransport_modeSc(false)}
                isClearable
                value={selectedtransport_modeSc}
                onChange={handleChangetransport_modeSc}
                options={filteredOptiontransport_modeSc}
              />
              <label for="sname" className={`floating-label`}>Transport Mode</label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedaccommodation_requiredSc ? "has-value" : ""} 
              ${isSelectedaccommodation_requiredSc ? "is-focused" : ""}`}
              title="Please select the Accommodation Required"
            >
              <Select
                id="country"
                type="text"
                classNamePrefix="react-select"
                placeholder=""
                onFocus={() => setIsSelectedaccommodation_requiredSc(true)}
                onBlur={() => setIsSelectedaccommodation_requiredSc(false)}
                isClearable
                value={selectedaccommodation_requiredSc}
                onChange={handleChangeaccommodation_requiredSc}
                options={filteredOptionaccommodation_requiredSc}
              />
              <label for="sname" className={`floating-label`}>Accommodation Required</label>
            </div>
          </div>

          {/* <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                maxLength={1}
                inputMode="numeric"
                pattern="[0-1]"
                required
                title="Please enter the Accommodation Required (Only - 0 or 1)"
                autoComplete="off"
                value={accommodation_requiredSc}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^01]/g, "");
                  setaccommodation_requiredSc(value);
                }}
              />
              <label for="sname" className={`exp-form-labels`}>
                Accommodation Required
              </label>
            </div>
          </div> */}

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                maxLength={14}
                inputMode="numeric"
                pattern="[0-9]*"
                required
                title="Please enter the Estimated Cost"
                autoComplete="off"
                value={estimated_costSC}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setestimated_costSC(value);
                }}
              />
              <label for="sname" className={`exp-form-labels `}>
                Estimated Cost
              </label>
            </div>
          </div>

          {/* <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="add3"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                maxLength={10}
                required
                title="Please enter the Currency Code"
                value={Currency_CodeSC}
                onChange={(e) => setCurrency_CodeSC(e.target.value)}
              />
              <label className="exp-form-labels">Currency Code</label>
            </div>
          </div> */}

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedCurrencySc ? "has-value" : ""} 
              ${isSelectedCurrencySc ? "is-focused" : ""}`}
              title="Please select the Currency Code"
            >
              <Select
                id="country"
                type="text"
                classNamePrefix="react-select"
                placeholder=""
                onFocus={() => setIsSelectedCurrencySc(true)}
                onBlur={() => setIsSelectedCurrencySc(false)}
                isClearable
                value={selectedCurrencySc}
                onChange={handleChangeCurrencySc}
                options={filteredOptionCurrencySc}
              />
              <label for="sname" className={`floating-label`}>Currency Code</label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
                ${selectedReqStatusSC ? "has-value" : ""} 
                ${isSelectedReqStatusSC ? "is-focused" : ""}`}
              title="Please select the Request Status"
            >
              <Select
                id="country"
                type="text"
                classNamePrefix="react-select"
                placeholder=""
                onFocus={() => setIsSelectedReqStatusSC(true)}
                onBlur={() => setIsSelectedReqStatusSC(false)}
                isClearable
                value={selectedReqStatusSC}
                onChange={handleChangeReqStatusSC}
                options={filteredOptionReqStatusSC}
              />
              <label for="sname" className={`floating-label`}>
                Request Status
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="text"
                maxLength={255}
                placeholder=""
                required
                title="Please enter the Remarks"
                autoComplete="off"
                value={remarksSc}
                onChange={(e) => setRemarksSc(e.target.value)}
              />
              <label for="sname" className={`exp-form-labels`}>
                Remarks
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
                ${selectedPrioritySc ? "has-value" : ""} 
                ${isSelectedPrioritySc ? "is-focused" : ""}`}
              title="Please select the Priority Level"
            >
              <Select
                id="country"
                type="text"
                classNamePrefix="react-select"
                placeholder=""
                onFocus={() => setIsSelectedPrioritySc(true)}
                onBlur={() => setIsSelectedPrioritySc(false)}
                isClearable
                value={selectedPrioritySc}
                onChange={handleChangePrioritySc}
                options={filteredOptionPrioritySc}
              />
              <label for="sname" className={`floating-label`}>
                Priority Level
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedmanagerSC ? "has-value" : ""} 
              ${isSelectManagerSC ? "is-focused" : ""}`}
              title="Please select the Manager"
            >
              <Select
                id="LoanEligibleAmount"
                type="text"
                placeholder=" "
                onFocus={() => setIsSelectManagerSC(true)}
                onBlur={() => setIsSelectManagerSC(false)}
                classNamePrefix="react-select"
                isClearable
                value={selectedmanagerSC}
                options={filteredOptionManagerSC}
                onChange={handleChangemanagerSC}
                maxLength={18}
              />
              <label for="add1" className={`floating-label `}>
                Manager
              </label>
            </div>
          </div>

          {/* Search + Reload Buttons */}
          <div className="col-12">
            <div className="search-btn-wrapper">
              <div className="icon-btn search" onClick={handleSearch}>
                <span className="tooltip">Search</span>
                <i className="fa-solid fa-magnifying-glass"></i>
              </div>

              <div className="icon-btn reload" onClick={reloadGridData}>
                <span className="tooltip">Reload</span>
                <i className="fa-solid fa-rotate-right"></i>
              </div>

              <div className="icon-btn excel" onClick={handleExportToExcel}>
                <span className="tooltip">Excel</span>
                <i className="fa-solid fa-file-excel"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="shadow-lg pt-3 pb-3 bg-light rounded mt-2 container-form-box"
        style={{ width: "100%" }}
      >
        <div class="ag-theme-alpine" style={{ height: 455, width: "100%" }}>
          <AgGridReact
            columnDefs={columnDefs}
            rowData={rowData}
            pagination={true}
            paginationAutoPageSize={true}
            gridOptions={gridOptions}
            onFirstDataRendered={onFirstDataRendered}
          />
        </div>
      </div>
    </div>
  );
}
export default TravelRequest;
