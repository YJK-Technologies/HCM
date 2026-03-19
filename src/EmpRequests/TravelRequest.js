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
const config = require("../Apiconfig");

function TravelRequest({ }) {
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
  const [travel_type, settravel_type] = useState("");
  const [destination_country_id, setdestination_country_id] = useState("");
  const [destination_city, setdestination_city] = useState("");
  const [purpose_of_travel, setpurpose_of_travel] = useState("");
  const [countryIdDrop, setCountyIdDrop] = useState([]);
  const [visaTypeDrop, setVisaTypeDrop] = useState([]);
  const [travelStartDate, setTravelStartDate] = useState("");
  const [travelEndDate, setTravelEndDate] = useState("");
  const [transport_mode, settransport_mode] = useState("");
  const [accommodation_required, setaccommodation_required] = useState("");
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
  const [travel_typeSC, settravel_typeSC] = useState("");
  const [destination_country_idSC, setdestination_country_idSC] = useState("");
  const [purpose_of_travelSC, setpurpose_of_travelSC] = useState("");
  const [transport_modeSc, settransport_modeSc] = useState("");
  const [accommodation_requiredSc, setaccommodation_requiredSc] = useState("");
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

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    fetch(`${config.apiBaseUrl}/getEmployeeId`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
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
      }),
    })
      .then((data) => data.json())
      .then((val) => {
        const Manager = val.map((option) => ({
          value: option.EmployeeId,
          label: `${option.EmployeeId}`,
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

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    fetch(`${config.apiBaseUrl}/getEmployeeId`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
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

  const filteredOptionDPt = DPTdrop.map((option) => ({
    value: option.dept_id,
    label: `${option.dept_id} - ${option.dept_name}`,
  }));

  const filteredOptionDPtSC = DPTdropSC.map((option) => ({
    value: option.dept_id,
    label: `${option.dept_id} - ${option.dept_name}`,
  }));

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");
    fetch(`${config.apiBaseUrl}/GetCountry`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => setCountrydrop(val))
      .catch((error) => console.error("Error fetching data:", error));
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
      .then((data) => data.json())
      .then((val) => setCountrydropSC(val))
      .catch((error) => console.error("Error fetching data:", error));
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

    const fetchDept = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/DeptID`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ company_code }),
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

    const fetchDept = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/DeptID`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ company_code }),
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

    fetch(`${config.apiBaseUrl}/DeptID`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((response) => response.json())
      .then((data) => {
        const deptOptions = data.map((option) => ({
          value: option.dept_id,
          label: `${option.dept_id} - ${option.dept_name}`,
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

  const columnDefs = [
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params) => {
        return (
          <div className="d-flex justify-content-center">
            <span
              className="icon mx-2"
              onClick={() => handleUpdate(params.data)}
              title="Update"
              style={{ cursor: "pointer" }}
            >
              <i className="fa-regular fa-floppy-disk"></i>
            </span>

            <span
              className="icon mx-2"
              onClick={() => handleDelete(params.data)}
              title="Delete"
              style={{ cursor: "pointer" }}
            >
              <i className="fa-solid fa-trash"></i>
            </span>
          </div>
        );
      },
    },
    {
      headerName: "Travel Request ID",
      field: "travel_request_id",
      editable: true,
    },

    // {
    //   headerName: "Request Number",
    //   field: "request_number",
    //   editable: true,
    // },

    {
      headerName: "Employee ID",
      field: "employee_id",
      editable: false,
    },

    {
      headerName: "Department",
      field: "department_id",
      editable: true,
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
      editable: true,
    },

    {
      headerName: "Destination Country",
      field: "destination_country_id",
      editable: true,
      // cellEditor: "agSelectCellEditor",
      // cellEditorParams: {
      //   values: CountrydropGR.map((d) => d.value),
      // },
      // valueFormatter: (params) => {
      //   const country = CountrydropGR.find((d) => d.value == params.value);
      //   return country ? country.label : params.value;
      // },
    },

    {
      headerName: "Destination City",
      field: "destination_city",
      editable: true,
    },

    {
      headerName: "Purpose of Travel",
      field: "purpose_of_travel",
      editable: true,
    },

    {
      headerName: "Start Date",
      field: "travel_start_date",
      editable: true,
    },

    {
      headerName: "End Date",
      field: "travel_end_date",
      editable: true,
    },

    {
      headerName: "Transport Mode",
      field: "transport_mode",
      editable: true,
    },

    {
      headerName: "Accommodation Required",
      field: "accommodation_required",
      editable: true,
    },

    {
      headerName: "Estimated Cost",
      field: "estimated_cost",
      editable: true,
    },

    {
      headerName: "Currency Code",
      field: "currency_code",
      editable: true,
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
      editable: true,
    },

    {
      headerName: "Priority Level",
      field: "priority_level",
      editable: true,
      filter: "agNumberColumnFilter",
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: PriorityGridDrop,
      },
    },

    {
      headerName: "Manager",
      field: "manager_id",
      editable: true,
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
    paginationPageSize: 10,
  };

  const handleSave = async () => {
    if (
      // !travel_request_id ||
      !empId ||
      !dpt ||
      !travel_type ||
      !destination_country_id ||
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
        employee_id: empId,
        department_id: dpt,
        travel_type: travel_type,
        destination_country_id: destination_country_id,
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
        keyfield: "",
        created_by: sessionStorage.getItem("selectedUserCode"),
        created_date: new Date(),
        modified_by: "",
        modified_date: null,
      };

      const response = await fetch(
        `${config.apiBaseUrl}/travel_requestsInsert`,
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
        employee_id: empIdSc || "",
        department_id: dptSC || "",
        travel_type: travel_typeSC || "",
        destination_country_id: destination_country_idSC || null,
        destination_city: destination_citySC || "",
        purpose_of_travel: purpose_of_travelSC || "",
        travel_start_date: travelStartDateSc || null,
        travel_end_date: travelEndDateSc || null,
        transport_mode: transport_modeSc || "",
        accommodation_required: accommodation_requiredSc || null,
        estimated_cost: estimated_costSC || null,
        currency_code: Currency_CodeSC || "",
        request_status: reqStatusSC || "",
        Remarks: remarksSc || "",
        priority_level: prioritySc || "",
        manager_id: ProjectManagerSC || null,
        company_code: sessionStorage.getItem("selectedCompanyCode"),
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
          const modified_by = sessionStorage.getItem("selectedUserCode");

          const dataToSend = {
            travel_requestsData: Array.isArray(rowData)
              ? rowData.map((row) => ({
                ...row,
                company_code,
                modified_by,
              }))
              : [
                {
                  ...rowData,
                  company_code,
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

          const dataToSend = {
            travel_requestsData: Array.isArray(rowData)
              ? rowData.map((row) => ({
                ...row,
                company_code,
              }))
              : [
                {
                  ...rowData,
                  company_code,
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

      const countryObj = CountrydropGR.find(
        (c) => c.value == row.destination_country_id,
      );
      const countryName = countryObj ? countryObj.label : "";

      return {
        "Travel Request ID": row.travel_request_id || "",
        "Request Number": row.request_number || "",
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
        Manager: row.manager_id || "",
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
          <div className="action-wrapper">
            <div onClick={handleSave} className="action-icon add">
              <span className="tooltip">Save</span>
              <i class="fa-solid fa-floppy-disk"></i>
            </div>
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

          <div className="col-md-2">
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
          </div>

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

          <div className="col-md-2">
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
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="Text"
                maxLength={10}
                placeholder=""
                required
                title="Please enter the Destination Country ID"
                autoComplete="off"
                value={destination_country_id}
                onChange={(e) => setdestination_country_id(e.target.value)}
              />
              <label
                for="sname"
                className={`exp-form-labels ${error && !destination_country_id ? "text-danger" : ""}`}
              >
                Destination Country ID<span className="text-danger">*</span>
              </label>
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

          <div className="col-md-2">
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
          </div>

          <div className="col-md-2">
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
          </div>

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
                value={selectedPriority}
                onChange={handleChangePriority}
                options={filteredOptionPriority}
              />
              <label
                for="sname"
                className={`floating-label ${error && !Country_Code ? "text-danger" : ""}`}
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

          <div className="col-md-2">
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
          </div>

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

          <div className="col-md-2">
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
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                maxLength={10}
                required
                title="Please enter the Destination Country ID"
                autoComplete="off"
                value={destination_country_idSC}
                onChange={(e) => setdestination_country_idSC(e.target.value)}
              />
              <label for="sname" className={`exp-form-labels`}>
                Destination Country ID
              </label>
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
                title="Please select the Travel Start Date"
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
                title="Please select the Travel End Date"
                autoComplete="off"
                value={travelEndDateSc}
                onChange={(e) => setTravelEndDateSc(e.target.value)}
              />
              <label for="sname" className={`exp-form-labels`}>
                Travel End Date
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
          </div>

          <div className="col-md-2">
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
          </div>

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
          />
        </div>
      </div>
    </div>
  );
}
export default TravelRequest;
