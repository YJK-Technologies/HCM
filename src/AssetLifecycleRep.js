import { useState, useEffect } from "react";
import "./input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import { showConfirmationToast } from "./ToastConfirmation";
import LoadingScreen from "./Loading";
import * as XLSX from "xlsx-js-style";
import Select from "react-select";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
const config = require("./Apiconfig");

function AssetLifecycleRep({}) {
  const [loading, setLoading] = useState(false);
  const [saveButtonVisible, setSaveButtonVisible] = useState(true);
  const [Asset_Code, setAsset_Code] = useState("");
  const [AssetName, setAssetName] = useState("");
  const [AssetCategory, setAssetCategory] = useState("");
  const [SerialNumber, setSerialNumber] = useState("");
  const [Bar_code, setBar_code] = useState("");
  const [Brand, setBrand] = useState("");
  const [Model, setModel] = useState("");
  const [PurchaseDate, setPurchaseDate] = useState("");
  const [PurchaseCost, setPurchaseCost] = useState("");
  const [CurrencyCode, setCurrencyCode] = useState("");
  const [VendorName, setVendorName] = useState("");
  const [WarrantyStart, setWarrantyStart] = useState("");
  const [WarrantyEnd, setWarrantyEnd] = useState("");
  const [AssetStatus, setAssetStatus] = useState("");
  const [Location, setLocation] = useState("");
  const [Country, setCountry] = useState("");
  const [Status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [rowData, setrowData] = useState([]);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [gridApi, setGridApi] = useState(null);
  const [isSelectCountry, setIsSelectCountry] = useState(false);
  const [selectedCountry, setselectedCountry] = useState("");
  const [Countrydrop, setCountrydrop] = useState([]);
  const [CountrydropSC, setCountrydropSC] = useState([]);
  const [CountrydropGrid, setCountrydropGrid] = useState([]);
  const [selectedCountrySC, setselectedCountrySC] = useState("");
  const [isSelectCountrySC, setIsSelectCountrySC] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [isSelectedCurrency, setIsSelectedCurrency] = useState(false);
  const [selectedCurrencySc, setSelectedCurrencySc] = useState("");
  const [isSelectedCurrencySc, setIsSelectedCurrencySc] = useState(false);
  const [currencyDrop, setCurrencyDrop] = useState([]);
  const [currencyDropSc, setCurrencyDropSc] = useState([]);
  const [currencyDropGrid, setCurrencyDropGrid] = useState([]);
  const [statusDrop, setstatusDrop] = useState([]);
  const [statusDropSC, setstatusDropSC] = useState([]);
  const [statusDropGrid, setstatusDropGrid] = useState([]);
  const [selectedAssetStatusSC, setselectedAssetStatusSC] = useState("");
  const [isSelectedAssetStatusSC, setIsSelectedAssetStatusSC] = useState(false);
  //status
  const [isSelectStatus, setIsSelectStatus] = useState(false);
  const [StatusDrop, setStatusDrop] = useState([]);
  const [statusdrop, setstatusdrop] = useState([]);
  const [statusgriddrop, setStatusGriddrop] = useState([]);
  const [status, setstatus] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedStatusSC, setSelectedStatusSC] = useState("");
  const [isSelectstatus, setIsSelectstatus] = useState(false);
  const [isSelectstatusSC, setIsSelectstatusSC] = useState(false);
  const [selectedstatus, setselectedStatus] = useState("");
  const [AssetIDSC, setAssetIDSC] = useState("");
  const [Asset_CodeSC, setAsset_CodeSC] = useState("");
  const [AssetNameSC, setAssetNameSC] = useState("");
  const [AssetCategorySC, setAssetCategorySC] = useState("");
  const [SerialNumberSC, setSerialNumberSC] = useState("");
  const [Bar_codeSC, setBar_codeSC] = useState("");
  const [BrandSC, setBrandSC] = useState("");
  const [ModelSC, setModelSC] = useState("");
  const [PurchaseDateSC, setPurchaseDateSC] = useState("");
  const [PurchaseCostSC, setPurchaseCostSC] = useState("");
  const [CurrencyCodeSC, setCurrencyCodeSC] = useState("");
  const [VendorNameSC, setVendorNameSC] = useState("");
  const [WarrantyStartSC, setWarrantyStartSC] = useState("");
  const [WarrantyEndSC, setWarrantyEndSC] = useState("");
  const [AssetStatusSC, setAssetStatusSC] = useState("");
  const [LocationSC, setLocationSC] = useState("");
  const [CountrySC, setCountrySC] = useState("");
  const [StatusSC, setStatusSC] = useState("");

  const [selectedAssetIDSc, setSelectedAssetIDSc] = useState("");
  const [AssetIDDrop, setAssetIDDrop] = useState([]);
  const [isSelectedAssetIDSc, setIsSelectedAssetIDSc] = useState(false);
  const [selectedEmpIdSc, setSelectedEmpIdSc] = useState("");
  const [selectedAllocationStatus, setSelectedAllocationStatus] = useState("");
  const [empIdSc, setEmpIdSc] = useState("");
  const [empIdDropSc, setEmpIdDropSc] = useState([]);
  const [isSelectedEmpIdSc, setIsSelectedEmpIdSc] = useState(false);
  const [isSelectAllocationStatus, setIsSelectAllocationStatus] = useState({});
  const [AllocationStatusSc, setAllocationStatusSc] = useState("");
  const [Allostatusdrop, setAlloStatusdrop] = useState([]);

  const permissions = JSON.parse(sessionStorage.getItem("permissions")) || {};
  const companyPermissions = permissions
    .filter((permission) => permission.screen_type === "AssetLifecycleRep")
    .map((permission) => permission.permission_type.toLowerCase());


  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getLeaveStatus`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((data) => data.json())
      .then((val) => setstatusDrop(val));
  }, []);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getAllocationStatus`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((data) => data.json())
      .then((val) => setstatusDropSC(val));
  }, []);

  const handlechangeAssetStatusSC = (SelectedStatus) => {
    setselectedAssetStatusSC(SelectedStatus);
    setAssetStatus(SelectedStatus ? SelectedStatus.value : "");
  };

  const filterOptionStatusSC = Array.isArray(statusDropSC)
    ? statusDropSC.map((option) => ({
        value: option.attributedetails_name,
        label: option.attributedetails_name,
      }))
    : [];

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getAllocationStatus`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((data) => data.json())
      .then((val) => setstatusDropSC(val));
  }, []);

  const handleCountryChange = (selectedCountry) => {
    setselectedCountry(selectedCountry);
    setCountry(selectedCountry ? selectedCountry.value : "");
  };
  const filteredOptionCountry = Countrydrop.map((option) => ({
    value: option.Country_Code,
    label: `${option.Country_Code} - ${option.Country_Name}`,
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

  const filteredOptionCountrySC = CountrydropSC.map((option) => ({
    value: option.Country_Code,
    label: `${option.Country_Code} - ${option.Country_Name}`,
  }));

  const handleCountryChangeSC = (selectedCountrySC) => {
    setselectedCountrySC(selectedCountrySC);
    setCountry(selectedCountrySC ? selectedCountrySC.value : "");
  };

  const handleChangeCurrency = (selectedCurrency) => {
    setSelectedCurrency(selectedCurrency);
    setCurrencyCode(selectedCurrency ? selectedCurrency.value : "");
  };

  const filteredOptionCurrency = Array.isArray(currencyDrop)
    ? currencyDrop.map((option) => ({
        value: option?.attributedetails_name,
        label: option?.attributedetails_name,
      }))
    : [];

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
    fetch(`${config.apiBaseUrl}/getCurrenyCode`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((response) => response.json())
      .then((data) => {
        const CurrencyDrop = data.map((option) => option.attributedetails_name);
        setCurrencyDropGrid(CurrencyDrop);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");
    fetch(`${config.apiBaseUrl}/getAllocationStatus`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((response) => response.json())
      .then((data) => {
        const statusDrop = data.map((option) => option.attributedetails_name);
        setstatusDropGrid(statusDrop);
      })
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
      .then((response) => response.json())
      .then((data) => {
        const Countrydrop = data.map((option) => ({
          value: option.Country_Code,
          label: `${option.Country_Code} - ${option.Country_Name}`,
        }));
        setCountrydropGrid(Countrydrop);
      })
      .catch((error) => console.error("Error fetching data:", error));
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
      .then((response) => response.json())
      .then((data) => {
        const statusDrop = data.map((option) => option.attributedetails_name);
        setStatusGriddrop(statusDrop);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const filteredOptionCurrencySc = Array.isArray(currencyDropSc)
    ? currencyDropSc.map((option) => ({
        value: option?.attributedetails_name,
        label: option?.attributedetails_name,
      }))
    : [];

  const handleChangeCurrencySc = (selectedCurrencySc) => {
    setSelectedCurrencySc(selectedCurrencySc);
    setCurrencyCode(selectedCurrencySc ? selectedCurrencySc.value : "");
  };

  const handleChangeAssetIDSc = (selectedAssetIDSc) => {
    setSelectedAssetIDSc(selectedAssetIDSc);
    setAssetIDSC(selectedAssetIDSc ? selectedAssetIDSc.value : "");
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
        const response = await fetch(`${config.apiBaseUrl}/AssetIDDrop`, {
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
        setAssetIDDrop(val);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    if (company_code) {
      fetchAssetId();
    }
  }, []);

  const handleChangeEmpIdSc = (selectedEmpIdSc) => {
    setSelectedEmpIdSc(selectedEmpIdSc);
    setEmpIdSc(selectedEmpIdSc ? selectedEmpIdSc.value : "");
  };

  const filteredOptionEmpIdSc = Array.isArray(empIdDropSc)
    ? empIdDropSc.map((option) => ({
        value: option?.EmployeeId,
        label: `${option?.EmployeeId}-${option?.First_Name}`,
      }))
    : [];

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

  const handleChangeAllocationStatus = (selectedAllocationStatus) => {
    setSelectedAllocationStatus(selectedAllocationStatus);
    setAllocationStatusSc(selectedAllocationStatus ? selectedAllocationStatus.value : "");
  };

  const filteredOptionAlloStatus = Allostatusdrop.map((option) => ({
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
      .then((val) => setAlloStatusdrop(val));
  }, []);


  useEffect(() => {
    fetch(`${config.apiBaseUrl}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((data) => data.json())
      .then((val) => {
        setStatusDrop(val);
        setstatusdrop(val);
      });
  }, []);

  const filteredOptionStatus = StatusDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredoptionstatus = statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    fetch(`${config.apiBaseUrl}/status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((response) => response.json())
      .then((data) => {
        const statusOption = data.map((option) => option.attributedetails_name);
        setStatusGriddrop(statusOption);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleChangeStatus = (Status) => {
    setSelectedStatus(Status);
    setStatus(Status ? Status.value : "");
  };

  const handlechangestatusSC = (status) => {
    setSelectedStatusSC(status);
    setStatusSC(status ? status.value : "");
  };

  const searchClearInputFields = () => {
    setAssetName("");
    setAssetCategory("");
    setSerialNumber("");
    setBar_code("");
    setBrand("");
    setModel("");
    setPurchaseDate("");
    setPurchaseCost("");
    setCurrencyCode("");
    setVendorName("");
    setWarrantyStart("");
    setWarrantyEnd("");
    setAssetStatus("");
    setLocation("");
    setCountry("");
    setStatus("");
    setAsset_CodeSC("");
    setAssetNameSC("");
    setAssetCategorySC("");
    setSerialNumberSC("");
    setBar_codeSC("");
    setBrandSC("");
    setModelSC("");
    setPurchaseDateSC("");
    setPurchaseCostSC("");
    setVendorNameSC("");
    setWarrantyStartSC("");
    setWarrantyEndSC("");
    setLocationSC("");
    setStatusSC("");
    setselectedAssetStatusSC("");
    setselectedCountrySC("");
    setSelectedStatusSC("");
    setSelectedCurrencySc("");
  };

  const navigate = useNavigate();

  const columnDefs = [
    {
      headerName: "Asset ID",
      field: "AssetID",
      cellStyle: { textAlign: "left" },
      editable: false,
      cellEditorParams: {
        maxLength: 50,
      },

      cellRenderer: (params) => {
        const handleClick = () => {
          handleNavigateWithRowData(params.data);
        };
        return (
          <span style={{ cursor: "pointer" }} onClick={handleClick}>
            {params.value}
          </span>
        );
      },
    },
    {
      headerName: "Asset Code",
      field: "Asset_Code",
      filter: "agTextColumnFilter",
      editable: false,
    },
    {
      headerName: "Asset Name",
      field: "AssetName",
      filter: "agTextColumnFilter",
      editable: true,
    },

    {
      headerName: "Asset Category",
      field: "AssetCategory",
      filter: "agTextColumnFilter",
      editable: true,
    },

    {
      headerName: "Serial Number",
      field: "SerialNumber",
      filter: "agTextColumnFilter",
      editable: true,
    },
    {
      headerName: "Barcode",
      field: "Bar_code",
      filter: "agTextColumnFilter",
      editable: true,
    },
    {
      headerName: "Brand",
      field: "Brand",
      filter: "agTextColumnFilter",
      editable: true,
    },
    {
      headerName: "Model",
      field: "Model",
      filter: "agTextColumnFilter",
      editable: true,
    },
    {
      headerName: "Purchase Date",
      field: "PurchaseDate",
      editable: true,
      cellStyle: { textAlign: "left" },
    },
    {
      headerName: "Purchase Cost",
      field: "PurchaseCost",
      filter: "agTextColumnFilter",
      editable: true,
    },
    {
      headerName: "Currency Code",
      field: "CurrencyCode",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: currencyDropGrid,
      },
    },
    {
      headerName: "Vendor Name",
      field: "VendorName",
      filter: "agTextColumnFilter",
      editable: true,
    },
    {
      headerName: "Warranty Start",
      field: "WarrantyStart",
      editable: true,
      cellStyle: { textAlign: "left" },
    },
    {
      headerName: "Warranty End",
      field: "WarrantyEnd",
      editable: true,
      cellStyle: { textAlign: "left" },
    },

    {
      headerName: "Asset Status",
      field: "AssetStatus",
      filter: "agTextColumnFilter",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: statusDropGrid,
      },
    },
    {
      headerName: "Location",
      field: "Location",
      filter: "agTextColumnFilter",
      editable: true,
    },
    {
      headerName: "Country",
      field: "Country",
      filter: "agTextColumnFilter",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: CountrydropGrid.map((d) => d.value),
      },
      valueFormatter: (params) => {
        const dept = CountrydropGrid.find((d) => d.value === params.value);
        return dept ? dept.label : params.value;
      },
    },
    {
      headerName: "Status",
      field: "Status",
      filter: "agTextColumnFilter",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: statusgriddrop,
      },
    },
  ];

  const defaultColDef = {
    resizable: true,
    wrapText: true,
    editable: true,
  };

  const handleNavigateWithRowData = (selectedRow) => {
    navigate("/Assets", { state: { mode: "update", selectedRow } });
  };

  const gridOptions = {
    pagination: true,
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  const reloadGridData = () => {
    setrowData([]);
    searchClearInputFields();
  };

  const getCSSVariable = (variableName) => {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(variableName)
      .trim();
  };

  const handleSearch = async () => {
    setLoading(true);

    try {
      const body = {
        AssetID: AssetIDSC ? parseInt(AssetIDSC) : 0,
        Asset_Code: Asset_CodeSC,
        AssetName: AssetNameSC,
        AssetCategory: AssetCategorySC,
        SerialNumber: SerialNumberSC,
        Bar_code: Bar_codeSC,
        Brand: BrandSC,
        Model: ModelSC,
        PurchaseDate: PurchaseDateSC ? PurchaseDateSC : null,
        WarrantyStart: WarrantyStartSC ? WarrantyStartSC : null,
        WarrantyEnd: WarrantyEndSC ? WarrantyEndSC : null,
        PurchaseCost: PurchaseCostSC ? parseFloat(PurchaseCostSC) : 0,
        CurrencyCode: CurrencyCode,
        VendorName: VendorNameSC,
        AssetStatus: AssetStatus,
        Location: LocationSC,
        Country: Country,

        Status: StatusSC,
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      };

      const response = await fetch(`${config.apiBaseUrl}/EmployeeAssets_SC`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const fetchedData = await response.json();

        setrowData(fetchedData);
      } else if (response.status === 404) {
        toast.warning("Data Not found");
        setrowData([]);
      } else {
        const errorResponse = await response.json();
        toast.error(errorResponse.message || "Something went wrong");
        setrowData([]);
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
      toast.error("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

    const getSafeData = () => {
    if (!rowData || rowData.length === 0) {
      return [
        {
          info_request_id: "",
          EmployeeId: "",
          purpose: "No Data Found",
          request_status: "",
          TotalItems: "",
          PendingItems: "",
          ApprovedItems: "",
          company_code: "",
          created_date: "",
        },
      ];
    }
    return rowData;
  };


    const generateReport = () => {
      const dataSource = getSafeData();
  
      const headerGradientStart = getCSSVariable("--but");
      const tableHeaderBg = getCSSVariable("--ag-header");
      const fontColor = getCSSVariable("--font-color");
      const rowAltColor = getCSSVariable("--ag-row");
      const hoverColor = getCSSVariable("--ag-hover");
  
      const reportWindow = window.open("", "_blank");
  
      reportWindow.document.write(`
      <html>
      <head>
      <title>Pending Asset Requests</title>
      <style>
        body {
          font-family: 'Segoe UI', sans-serif;
          padding: 20px;
          background-color: #f4f6f9;
          color: ${fontColor};
        }
        .header {
          background: ${tableHeaderBg};
          padding: 15px;
          color: white;
          text-align: center;
          border-radius: 8px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
          background: white;
        }
        th {
          background-color: ${tableHeaderBg};
          color: white;
          padding: 10px;
        }
        td {
          padding: 8px;
          border-bottom: 1px solid #ddd;
        }
        tr:nth-child(even) {
          background-color: ${rowAltColor};
        }
        tr:hover {
          background-color: ${hoverColor};
        }
        .print-btn {
          margin-top: 20px;
          padding: 10px 20px;
          background: ${headerGradientStart};
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        @media print {
          .print-btn { display: none; }
        }
      </style>
      </head>
      <body>
  
      <div class="header">
        <h2>Pending Asset Requests Report</h2>
        <p>Total Records: ${rowData.length || 0}</p>
      </div>
  
      <table>
        <thead>
          <tr>
            <th>Request ID</th>
            <th>Employee ID</th>
            <th>Purpose</th>
            <th>Status</th>
            <th>Total</th>
            <th>Pending</th>
            <th>Approved</th>
            <th>Company</th>
            <th>Created Date</th>
          </tr>
        </thead>
        <tbody>
    `);
  
      dataSource.forEach((row) => {
        reportWindow.document.write(`
        <tr>
          <td>${row.info_request_id || ""}</td>
          <td>${row.EmployeeId || ""}</td>
          <td>${row.purpose || ""}</td>
          <td>${row.request_status || ""}</td>
          <td>${row.TotalItems || ""}</td>
          <td>${row.PendingItems || ""}</td>
          <td>${row.ApprovedItems || ""}</td>
          <td>${row.company_code || ""}</td>
          <td>${row.created_date || ""}</td>
        </tr>
      `);
      });
  
      reportWindow.document.write(`
        </tbody>
      </table>
  
      <div style="text-align:center;">
        <button class="print-btn" onclick="window.print()">Print</button>
      </div>
  
      </body>
      </html>
    `);
  
      reportWindow.document.close();
    };
    const hexToRgb = (hex) => {
      const cleanHex = hex.replace("#", "");
      const num = parseInt(cleanHex, 16);
      return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
    };
  
    const exportToPDF = () => {
      const dataSource = getSafeData();
  
      const headerBg = hexToRgb(getCSSVariable("--but"));
      const tableHeader = hexToRgb(getCSSVariable("--ag-header"));
      const fontColor = hexToRgb(getCSSVariable("--font-color"));
      const altRow = hexToRgb(getCSSVariable("--ag-row"));
  
      const headers = [
        [
          "Request ID",
          "Employee ID",
          "Purpose",
          "Status",
          "Total",
          "Pending",
          "Approved",
          "Company",
          "Created Date",
        ],
      ];
  
      const body = dataSource.map((row) => [
        row.info_request_id || "",
        row.EmployeeId || "",
        row.purpose || "",
        row.request_status || "",
        row.TotalItems || "",
        row.PendingItems || "",
        row.ApprovedItems || "",
        row.company_code || "",
        row.created_date || "",
      ]);
  
      const doc = new jsPDF("l", "pt", "a4");
      const pageWidth = doc.internal.pageSize.getWidth();
  
      doc.setFillColor(...headerBg);
      doc.roundedRect(20, 15, pageWidth - 40, 55, 8, 8, "F");
  
      doc.setTextColor(255);
      doc.setFontSize(18);
      doc.text("Pending Asset Requests Report", pageWidth / 2, 40, {
        align: "center",
      });
  
      doc.setFontSize(10);
      doc.text(
        `Generated: ${new Date().toLocaleDateString()}`,
        pageWidth / 2,
        60,
        { align: "center" },
      );
  
      autoTable(doc, {
        startY: 90,
        head: headers,
        body: body,
        styles: { fontSize: 9, textColor: fontColor },
        headStyles: { fillColor: tableHeader, textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: altRow },
      });
  
      doc.save("Pending_Asset_Requests.pdf");
    };
    const transformRowData = (data) => {
      return data.map((row) => ({
        "Request ID": row.info_request_id || "",
        "Employee ID": row.EmployeeId || "",
        Purpose: row.purpose || "",
        "Request Status": row.request_status || "",
        "Total Items": row.TotalItems || 0,
        "Pending Items": row.PendingItems || 0,
        "Approved Items": row.ApprovedItems || 0,
        "Company Code": row.company_code || "",
        "Created Date": row.created_date
          ? new Date(row.created_date).toLocaleDateString("en-GB")
          : "",
      }));
    };
    const handleExportToExcel = () => {
      const dataSource = getSafeData();
  
      const screenName = "Pending Asset Requests Report";
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
  
      const transformedData = transformRowData(dataSource);
  
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
      XLSX.utils.book_append_sheet(workbook, worksheet, "Asset Requests");
  
      XLSX.writeFile(workbook, "Pending_Asset_Requests_Report.xlsx");
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
          <h1 className="page-title">Asset Lifecycle Report</h1>
          <div className="action-wrapper desktop-actions">
            {["all permission", "view"].some((p) =>
              companyPermissions.includes(p),
            ) && (
              <div className="action-icon print" onClick={generateReport}>
                <span className="tooltip">Print</span>
                <i className="fa-solid fa-print"></i>
              </div>
            )}
            {["all permission", "PDF"].some((p) =>
              companyPermissions.includes(p),
            ) && (
              <div className="action-icon print" onClick={exportToPDF}>
                <span className="tooltip">Pdf</span>
                <i className="fa-solid fa-file-pdf"></i>
              </div>
            )}
            {["all permission", "Excel"].some((p) =>
              companyPermissions.includes(p),
            ) && (
              <div className="action-icon print" onClick={handleExportToExcel}>
                <span className="tooltip">Excel</span>
                <i class="fa-solid fa-file-excel"></i>
              </div>
            )}
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
              {["all permission", "view"].some((p) =>
                companyPermissions.includes(p),
              ) && (
                <li className="dropdown-item" onClick={generateReport}>
                  <i className="fa-solid fa-print text-dark fs-4"></i>
                </li>
              )}
              {["all permission", "Pdf"].some((p) =>
                companyPermissions.includes(p),
              ) && (
                <li className="dropdown-item" onClick={exportToPDF}>
                  <i className="fa-solid fa-file-pdf text-dark"></i>
                </li>
              )}
              {["all permission", "Excel"].some((p) =>
                companyPermissions.includes(p),
              ) && (
                <li className="dropdown-item" onClick={handleExportToExcel}>
                  <i class="fa-solid fa-file-excel text-success"></i>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="shadow-lg p-3 bg-light rounded  container-form-box mt-2">

        <div className="row g-3">

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="Grade Name "
                class="exp-input-field form-control"
                type="Text"
                placeholder=""
                required
                title="Please Enter the Grade Name"
                value={Asset_CodeSC}
                onChange={(e) => setAsset_CodeSC(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                maxLength={100}
              />
              <label className="exp-form-labels">Asset Code</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="Asset Name "
                class="exp-input-field form-control"
                type="Text"
                placeholder=""
                required
                title="Please Enter the Grade Name"
                value={AssetNameSC}
                onChange={(e) => setAssetNameSC(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                maxLength={100}
              />
              <label className="exp-form-labels">Asset Name</label>
            </div>
          </div>
          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="Asset Category "
                class="exp-input-field form-control"
                type="Text"
                placeholder=""
                required
                title="Please Enter the Grade Name"
                value={AssetCategorySC}
                onChange={(e) => setAssetCategorySC(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                maxLength={100}
              />
              <label className="exp-form-labels">Asset Category</label>
            </div>
          </div>
          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="SerialNumber"
                class="exp-input-field form-control"
                type="Text"
                placeholder=""
                required
                title="Please Enter the Grade Name"
                value={SerialNumberSC}
                onChange={(e) => setSerialNumberSC(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                maxLength={100}
              />
              <label className="exp-form-labels">Serial Number</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="SerialNumber"
                class="exp-input-field form-control"
                type="Text"
                placeholder=""
                required
                title="Please Enter the Grade Name"
                value={Bar_codeSC}
                onChange={(e) => setBar_codeSC(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                maxLength={100}
              />
              <label className="exp-form-labels">Bar Code</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="SerialNumber"
                class="exp-input-field form-control"
                type="Text"
                placeholder=""
                required
                title="Please Enter the Grade Name"
                value={BrandSC}
                onChange={(e) => setBrandSC(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                maxLength={100}
              />
              <label className="exp-form-labels">Brand</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="SerialNumber"
                class="exp-input-field form-control"
                type="Text"
                placeholder=""
                required
                title="Please Enter the Grade Name"
                value={ModelSC}
                onChange={(e) => setModelSC(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                maxLength={100}
              />
              <label className="exp-form-labels">Model</label>
            </div>
          </div>
          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="SerialNumber"
                class="exp-input-field form-control"
                type="date"
                placeholder=""
                required
                title="Please Enter the Grade Name"
                value={PurchaseDateSC}
                onChange={(e) => setPurchaseDateSC(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                maxLength={100}
              />
              <label className="exp-form-labels">Purchase Date</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="PurchaseCost"
                class="exp-input-field form-control"
                type="Number"
                placeholder=""
                required
                title="Please Enter the Grade Name"
                value={PurchaseCostSC}
                onChange={(e) => setPurchaseCostSC(e.target.value)}
                maxLength={100}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <label className="exp-form-labels">Purchase Cost</label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedAssetIDSc ? "has-value" : ""} 
              ${isSelectedAssetIDSc ? "is-focused" : ""}`}
              title="Please select the Currency Code"
            >
              <Select
                id="PurchaseCost"
                class="exp-input-field form-control"
                type="date"
                classNamePrefix="react-select"
                placeholder=""
                required
                title="Please Enter the Grade Name"
                onFocus={() => setIsSelectedAssetIDSc(true)}
                onBlur={() => setIsSelectedAssetIDSc(false)}
                value={selectedAssetIDSc}
                onChange={handleChangeAssetIDSc}
                options={filteredOptionAssetID}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                maxLength={100}
                isClearable
              />
              <label for="sname" className={`floating-label`}>
                Asset ID 
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedEmpIdSc ? "has-value" : ""} 
              ${isSelectedEmpIdSc ? "is-focused" : ""}`}
              title="Please enter the Employee ID"
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
              ${selectedAllocationStatus ? "has-value" : ""} 
              ${isSelectAllocationStatus ? "is-focused" : ""}`}
              title="Please enter the Employee ID"
            >
              <Select
                id="department"
                placeholder=" "
                onFocus={() => setIsSelectAllocationStatus(true)}
                onBlur={() => setIsSelectAllocationStatus(false)}
                classNamePrefix="react-select"
                isClearable
                type="text"
                value={selectedAllocationStatus}
                onChange={handleChangeAllocationStatus}
                options={filteredOptionAlloStatus}
              />
              <label htmlFor="selecteddpt" className={`floating-label`}>
                Allocation Status
              </label>
            </div>
          </div>

            <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedCurrencySc ? "has-value" : ""} 
              ${isSelectedCurrencySc ? "is-focused" : ""}`}
              title="Please select the Currency Code"
            >
              <Select
                id="PurchaseCost"
                class="exp-input-field form-control"
                type="date"
                classNamePrefix="react-select"
                placeholder=""
                required
                title="Please Enter the Grade Name"
                onFocus={() => setIsSelectedCurrencySc(true)}
                onBlur={() => setIsSelectedCurrencySc(false)}
                value={selectedCurrencySc}
                onChange={handleChangeCurrencySc}
                options={filteredOptionCurrencySc}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                maxLength={100}
                isClearable
              />
              <label for="sname" className={`floating-label`}>
                Currency Code
              </label>
            </div>
          </div>


          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="PurchaseCost"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required
                title="Please Enter the Grade Name"
                value={VendorNameSC}
                onChange={(e) => setVendorNameSC(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                maxLength={100}
              />
              <label className="exp-form-labels">Vendor Name</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="PurchaseCost"
                class="exp-input-field form-control"
                type="date"
                placeholder=""
                required
                title="Please Enter the Grade Name"
                value={WarrantyStartSC}
                onChange={(e) => setWarrantyStartSC(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                maxLength={100}
              />
              <label className="exp-form-labels">Warranty Start</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="Warranty End"
                class="exp-input-field form-control"
                type="date"
                placeholder=""
                required
                title="Please Enter the Grade Name"
                value={WarrantyEndSC}
                onChange={(e) => setWarrantyEndSC(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                maxLength={100}
              />
              <label className="exp-form-labels">Warranty End</label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedAssetStatusSC ? "has-value" : ""} 
              ${isSelectedAssetStatusSC ? "is-focused" : ""}`}
              title="Please enter the Status"
            >
              <Select
                id="AssetStatus"
                type="text"
                value={selectedAssetStatusSC}
                onChange={handlechangeAssetStatusSC}
                options={filterOptionStatusSC}
                placeholder=" "
                onFocus={() => setIsSelectedAssetStatusSC(true)}
                onBlur={() => setIsSelectedAssetStatusSC(false)}
                classNamePrefix="react-select"
                maxLength={100}
                isClearable
              />
              <label for="sname" className={`floating-label`}>
                Asset Status{" "}
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="Location"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required
                title="Please Enter the Grade Name"
                value={LocationSC}
                onChange={(e) => setLocationSC(e.target.value)}
                maxLength={100}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <label className="exp-form-labels">Location</label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedCountrySC ? "has-value" : ""} 
              ${isSelectCountrySC ? "is-focused" : ""}`}
            >
              <Select
                id="Country"
                class="exp-input-field form-control"
                type="text"
                onFocus={() => setIsSelectCountrySC(true)}
                onBlur={() => setIsSelectCountrySC(false)}
                value={selectedCountrySC}
                onChange={handleCountryChangeSC}
                options={filteredOptionCountrySC}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                classNamePrefix="react-select"
                maxLength={100}
                isClearable
              />
              <label for="sname" className={`floating-label`}>
                Country
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedStatusSC ? "has-value" : ""} 
              ${isSelectstatusSC ? "is-focused" : ""}`}
            >
              <Select
                id="Status"
                value={selectedStatusSC}
                onChange={handlechangestatusSC}
                options={filteredoptionstatus}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder=" "
                onFocus={() => setIsSelectstatusSC(true)}
                onBlur={() => setIsSelectstatusSC(false)}
                classNamePrefix="react-select"
                isClearable
              />
              <label className="floating-label">Status</label>
            </div>
          </div>
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
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            onGridReady={onGridReady}
            rowSelection="multiple"
            paginationAutoPageSize={true}
            gridOptions={gridOptions}
            pagination={true}
          />
        </div>
      </div>
    </div>
  );
}

export default AssetLifecycleRep;
