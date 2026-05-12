import { useState, useEffect } from "react";
import "./input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

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
  const [Status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [rowData, setRowData] = useState([]);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [gridApi, setGridApi] = useState(null);
  const [isSelectCountry, setIsSelectCountry] = useState(false);
  const [selectedCountry, setselectedCountry] = useState("");
  const [Countrydrop, setCountrydrop] = useState([]);
  const [CountrydropGrid, setCountrydropGrid] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [isSelectedCurrency, setIsSelectedCurrency] = useState(false);
  const [currencyDrop, setCurrencyDrop] = useState([]);
  const [currencyDropGrid, setCurrencyDropGrid] = useState([]);
  const [statusDrop, setstatusDrop] = useState([]);
  const [statusDropSC, setstatusDropSC] = useState([]);
  const [statusDropGrid, setstatusDropGrid] = useState([]);
  const [selectedAssetStatusSC, setselectedAssetStatusSC] = useState("");
  const [isSelectedAssetStatusSC, setIsSelectedAssetStatusSC] = useState(false);
  //status
  const [isSelectStatus, setIsSelectStatus] = useState(false);
  const [StatusDrop, setStatusDrop] = useState([]);
  const [statusgriddrop, setStatusGriddrop] = useState([]);
  const [status, setstatus] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isSelectstatus, setIsSelectstatus] = useState(false);
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
  const [AssetStatusSC, setAssetStatusSC] = useState("");
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
  const [isSelectAllocationStatus, setIsSelectAllocationStatus] = useState(false);
  const [AllocationStatusSc, setAllocationStatusSc] = useState("");
  const [Allostatusdrop, setAlloStatusdrop] = useState([]);
  const [AllocationDateSC, setAllocationDateSC] = useState("");
  const [ExpectedReturnDateSC, setExpectedReturnDateSC] = useState("");
  const [ActualReturnDateSC, setActualReturnDateSC] = useState("");
  const [TotalAllocationsSC, setTotalAllocationsSC] = useState("");
  const [FirstAllocationDateSC, setFirstAllocationDateSC] = useState("");
  const [LastReturnDateSC, setLastReturnDateSC] = useState("");
  const [TotalDaysUsedSC, setTotalDaysUsedSC] = useState("");

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


  const filteredOptionStatus = StatusDrop.map((option) => ({
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

  const searchClearInputFields = () => {
    setAssetName("");
    setAssetCategory("");
    setSerialNumber("");
    setBar_code("");
    setBrand("");
    setModel("");
    setPurchaseDate("");
    setPurchaseCost("");
    setVendorName("");
    setWarrantyStart("");
    setWarrantyEnd("");
    setAssetStatus("");
    setLocation("");
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
    setExpectedReturnDateSC("");
    setActualReturnDateSC("");
    setTotalAllocationsSC("");
    setSelectedAssetIDSc("");
    setAssetIDSC("");
    setSelectedEmpIdSc("");
    setEmpIdSc("");
    setAllocationDateSC("");
    setselectedAssetStatusSC("");
    setAssetStatus("");
    setFirstAllocationDateSC("");
    setLastReturnDateSC("");
    setTotalDaysUsedSC("");
    setAllocationStatusSc("");
    setSelectedAllocationStatus("");
  };

  const navigate = useNavigate();

const columnDefs = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      headerName: "S.No",
      field: "S.No",
      valueGetter: (params) => params.node.rowIndex + 1,
      width: 100,
    },   
    {
    headerName: "Asset ID",
    field: "AssetID",
    cellStyle: { textAlign: "left" },
    editable: false,
    // cellRenderer: (params) => {
    //   return (
    //     <span
    //       style={{ cursor: "pointer", }}
    //       onClick={() => handleNavigateWithRowData(params.data)}
    //     >
    //       {params.value}
    //     </span>
    //   );
    // },
  },

  {
    headerName: "Asset Name",
    field: "AssetName",
    // filter: "agTextColumnFilter",
    editable: false,
  },

  {
    headerName: "Asset Category",
    field: "AssetCategory",
    // filter: "agTextColumnFilter",
    editable: false,
  },

  {
    headerName: "Status",
    field: "AssetStatus",
    // filter: "agTextColumnFilter",
    editable: false,
  },

  {
    headerName: "Purchase Date",
    field: "PurchaseDate",
    editable: false,
  },

  {
    headerName: "Purchase Cost",
    field: "PurchaseCost",
    // filter: "agNumberColumnFilter",
    editable: false,
  },

  // 🔹 Allocation Info
  {
    headerName: "Employee ID",
    field: "EmployeeID",
    editable: false,
  },

  {
    headerName: "Allocation Date",
    field: "AllocationDate",
    editable: false,
  },

  {
    headerName: "Expected Return",
    field: "ExpectedReturnDate",
    editable: false,
  },

  {
    headerName: "Actual Return",
    field: "ActualReturnDate",
    editable: false,
  },

  {
    headerName: "Allocation Status",
    field: "AllocationStatus",
    editable: false,
  },

  // 🔹 Summary Fields
  {
    headerName: "Total Allocations",
    field: "TotalAllocations",
    editable: false,
    // filter: "agNumberColumnFilter",
  },

  {
    headerName: "First Allocation",
    field: "FirstAllocationDate",
    editable: false,
  },

  {
    headerName: "Last Return",
    field: "LastReturnDate",
    editable: false,
  },

  {
    headerName: "Total Days Used",
    field: "TotalDaysUsed",
    // filter: "agNumberColumnFilter",
    editable: false,
  },
];
  const defaultColDef = {
    resizable: true,
    editable: true,
  };

  const handleNavigateWithRowData = (selectedRow) => {
    navigate("/Assets", { state: { mode: "update", selectedRow } });
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  const reloadGridData = () => {
    setRowData([]);
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
      company_code: sessionStorage.getItem("selectedCompanyCode"),

      AssetID: AssetIDSC,
      AssetName: AssetNameSC,
      AssetCategory: AssetCategorySC,
      AssetStatus: AssetStatus,

      EmployeeID: empIdSc,
      AllocationStatus: AllocationStatusSc,

      PurchaseDate: PurchaseDateSC,
      PurchaseCost: PurchaseCostSC,

      AllocationDate: AllocationDateSC,
      ExpectedReturnDate: ExpectedReturnDateSC,
      ActualReturnDate: ActualReturnDateSC,

      TotalAllocations: TotalAllocationsSC,
      FirstAllocationDate: FirstAllocationDateSC,
      LastReturnDate: LastReturnDateSC,
      TotalDaysUsed: TotalDaysUsedSC,
    };

    const response = await fetch(`${config.apiBaseUrl}/AssetLifecycleReport_AS`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      const data = await response.json();
      setRowData(data);
    } else if (response.status === 404) {
      toast.warning("Data Not Found");
      setRowData([]);
    } else {
      const err = await response.json();
      toast.error(err.message || "Something went wrong");
      setRowData([]);
    }

  } catch (error) {
    console.error("Error fetching AS report:", error);
    toast.error("Error fetching data");
    setRowData([]);
  } finally {
    setLoading(false);
  }
};

const getSelectedOrAllData = () => {
  if (gridApi) {
    const selected = gridApi.getSelectedRows();
    if (selected && selected.length > 0) {
      return selected;
    }
  }
  return rowData && rowData.length > 0 ? rowData : [];
};

const generateReport = () => {
  const dataSource = getSelectedOrAllData();

  if (!dataSource.length) {
    toast.warning("No data to print");
    return;
  }

  const headerGradientStart = getCSSVariable("--but");
  const tableHeaderBg = getCSSVariable("--ag-header");
  const fontColor = getCSSVariable("--font-color");
  const rowAltColor = getCSSVariable("--ag-row");
  const hoverColor = getCSSVariable("--ag-hover");

  const reportWindow = window.open("", "_blank");

  reportWindow.document.write(`
  <html>
  <head>
  <title>Asset Lifecycle Report</title>
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
    <h2>Asset Lifecycle Report</h2>
    <p>Total Records: ${dataSource.length}</p>
  </div>

  <table>
    <thead>
      <tr>
        <th>Asset ID</th>
        <th>Asset Name</th>
        <th>Category</th>
        <th>Status</th>
        <th>Employee</th>
        <th>Allocation Date</th>
        <th>Expected Return</th>
        <th>Actual Return</th>
        <th>Total Days</th>
      </tr>
    </thead>
    <tbody>
  `);

  dataSource.forEach((row) => {
    reportWindow.document.write(`
      <tr>
        <td>${row.AssetID || ""}</td>
        <td>${row.AssetName || ""}</td>
        <td>${row.AssetCategory || ""}</td>
        <td>${row.AssetStatus || ""}</td>
        <td>${row.EmployeeID || ""}</td>
        <td>${row.AllocationDate ? new Date(row.AllocationDate).toLocaleDateString("en-GB") : ""}</td>
        <td>${row.ExpectedReturnDate ? new Date(row.ExpectedReturnDate).toLocaleDateString("en-GB") : ""}</td>
        <td>${row.ActualReturnDate ? new Date(row.ActualReturnDate).toLocaleDateString("en-GB") : ""}</td>
        <td>${row.TotalDaysUsed || ""}</td>
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
  const dataSource = getSelectedOrAllData();

  if (!dataSource.length) {
    toast.warning("No data to export");
    return;
  }

  const headerBg = hexToRgb(getCSSVariable("--but"));
  const tableHeader = hexToRgb(getCSSVariable("--ag-header"));
  const fontColor = hexToRgb(getCSSVariable("--font-color"));
  const altRow = hexToRgb(getCSSVariable("--ag-row"));

  const headers = [[
    "Asset ID",
    "Name",
    "Category",
    "Status",
    "Employee",
    "Allocation",
    "Expected",
    "Return",
    "Days"
  ]];

  const body = dataSource.map((row) => [
    row.AssetID || "",
    row.AssetName || "",
    row.AssetCategory || "",
    row.AssetStatus || "",
    row.EmployeeID || "",
    row.AllocationDate ? new Date(row.AllocationDate).toLocaleDateString("en-GB") : "",
    row.ExpectedReturnDate ? new Date(row.ExpectedReturnDate).toLocaleDateString("en-GB") : "",
    row.ActualReturnDate ? new Date(row.ActualReturnDate).toLocaleDateString("en-GB") : "",
    row.TotalDaysUsed || ""
  ]);

  const doc = new jsPDF("l", "pt", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFillColor(...headerBg);
  doc.roundedRect(20, 15, pageWidth - 40, 55, 8, 8, "F");

  doc.setTextColor(255);
  doc.setFontSize(18);
  doc.text("Asset Lifecycle Report", pageWidth / 2, 40, { align: "center" });

  doc.setFontSize(10);
  doc.text(
    `Generated: ${new Date().toLocaleDateString()}`,
    pageWidth / 2,
    60,
    { align: "center" }
  );

  autoTable(doc, {
    startY: 90,
    head: headers,
    body: body,
    styles: { fontSize: 9, textColor: fontColor },
    headStyles: { fillColor: tableHeader, textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: altRow },
  });

  doc.save("Asset_Lifecycle_Report.pdf");
};


const transformRowData = (data) => {
  return data.map((row) => ({
    "Asset ID": row.AssetID,
    "Asset Name": row.AssetName,
    Category: row.AssetCategory,
    Status: row.AssetStatus,
    Employee: row.EmployeeID,
    "Allocation Date": row.AllocationDate
      ? new Date(row.AllocationDate).toLocaleDateString("en-GB")
      : "",
    "Expected Return": row.ExpectedReturnDate
      ? new Date(row.ExpectedReturnDate).toLocaleDateString("en-GB")
      : "",
    "Actual Return": row.ActualReturnDate
      ? new Date(row.ActualReturnDate).toLocaleDateString("en-GB")
      : "",
    "Total Days Used": row.TotalDaysUsed,
  }));
};

const handleExportToExcel = () => {
  const dataSource = getSelectedOrAllData();

  if (!dataSource || dataSource.length === 0) {
    toast.warning("No data to export");
    return;
  }

  const screenName = "Asset Lifecycle Report";
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

  // 🔹 transform your current data
  const transformedData = dataSource.map((row) => ({
    "Asset ID": row.AssetID || "",
    "Asset Name": row.AssetName || "",
    Category: row.AssetCategory || "",
    Status: row.AssetStatus || "",
    Employee: row.EmployeeID || "",
    "Allocation Date": row.AllocationDate|| "",
    "Expected Return": row.ExpectedReturnDate || "",
    "Actual Return": row.ActualReturnDate || "",
    "Total Days Used": row.TotalDaysUsed || "",
  }));

  XLSX.utils.sheet_add_json(worksheet, transformedData, {
    origin: `A${headerData.length + 1}`,
  });

  const range = XLSX.utils.decode_range(worksheet["!ref"]);
  const headerRowIndex = headerData.length;

  // 🔹 Title style (same as reference)
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

  // 🔹 Header style
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

  // 🔹 Body styling (alternate rows)
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
  XLSX.utils.book_append_sheet(workbook, worksheet, "Asset Report");

  XLSX.writeFile(workbook, "Asset_Lifecycle_Report.xlsx");
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
            <div
              className={`inputGroup selectGroup 
              ${selectedAssetIDSc ? "has-value" : ""} 
              ${isSelectedAssetIDSc ? "is-focused" : ""}`}
              title="Please select the Asset ID"
            >
              <Select
                id="PurchaseCost"
                class="exp-input-field form-control"
                type="date"
                classNamePrefix="react-select"
                placeholder=""
                required
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
            <div className="inputGroup">
              <input
                id="Asset Name "
                class="exp-input-field form-control"
                type="Text"
                placeholder=""
                required
                title="Please Enter the Asset Name"
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
                title="Please Enter the Asset Category"
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
                type="date"
                placeholder=""
                required
                title="Please Enter the Purchase Date"
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
                title="Please Enter the Purchase Cost"
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
              ${selectedAssetStatusSC ? "has-value" : ""} 
              ${isSelectedAssetStatusSC ? "is-focused" : ""}`}
              title="Please enter the Asset Status"
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
            <div className="inputGroup">
              <input
                id="PurchaseCost"
                class="exp-input-field form-control"
                type="Date"
                placeholder=""
                required
                title="Please Enter the Allocation Date"
                value={AllocationDateSC}
                onChange={(e) => setAllocationDateSC(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                maxLength={100}
              />
              <label className="exp-form-labels">Allocation Date</label>
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
                title="Please Enter the Expected Return Date"
                value={ExpectedReturnDateSC}
                onChange={(e) => setExpectedReturnDateSC(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                maxLength={100}
              />
              <label className="exp-form-labels">Expected Return Date</label>
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
                title="Please Enter the Actual Return Date"
                value={ActualReturnDateSC}
                onChange={(e) => setActualReturnDateSC(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                maxLength={100}
              />
              <label className="exp-form-labels">Actual Return Date</label>
            </div>
          </div>
          
          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedAllocationStatus ? "has-value" : ""} 
              ${isSelectAllocationStatus ? "is-focused" : ""}`}
              title="Please enter the Allocation Status"
            >
              <Select
                id="AllocationStatus"
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
            <div className="inputGroup">
              <input
                id="Location"
                class="exp-input-field form-control"
                type="Number"
                placeholder=""
                required
                title="Please Enter the Total Allocations"
                value={TotalAllocationsSC}
                onChange={(e) => setTotalAllocationsSC(e.target.value)}
                maxLength={100}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <label className="exp-form-labels">Total Allocations</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="Location"
                class="exp-input-field form-control"
                type="Date"
                placeholder=""
                required
                title="Please Enter the First Allocation Date"
                value={FirstAllocationDateSC}
                onChange={(e) => setFirstAllocationDateSC(e.target.value)}
                maxLength={100}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <label className="exp-form-labels">First Allocation Date</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="Location"
                class="exp-input-field form-control"
                type="Date"
                placeholder=""
                required
                title="Please Enter the Last Return Date"
                value={LastReturnDateSC}
                onChange={(e) => setLastReturnDateSC(e.target.value)}
                maxLength={100}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <label className="exp-form-labels">Last Return Date</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="Location"
                class="exp-input-field form-control"
                type="number"
                placeholder=""
                required
                title="Please Enter the Total Days Used"
                value={TotalDaysUsedSC}
                onChange={(e) => setTotalDaysUsedSC(e.target.value)}
                maxLength={100}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <label className="exp-form-labels">Total Days Used</label>
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
            pagination={true}
            pagination={true}
          />
        </div>
      </div>
    </div>
  );
}

export default AssetLifecycleRep;
