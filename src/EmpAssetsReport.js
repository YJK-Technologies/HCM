import { useState, useEffect, useRef } from "react";
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

function EmpAssetsReport({ }) {
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
  const [statusDropGrid, setstatusDropGrid] = useState([]);
  const gridApiRef = useRef(null);
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
  const [Bar_codeSC, setBar_codeSC] = useState("");
  const [BrandSC, setBrandSC] = useState("");
  const [ModelSC, setModelSC] = useState("");
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
  const [LastAllocationDateSC, setLastAllocationDateSC] = useState("");
  const [SerialNumberSC, setSerialNumberSC] = useState("");

  const [EmployeeIDDropGrid, setEmployeeIDDropGrid] = useState([]);

  const Location_Code = sessionStorage.getItem('selectedLocationCode')

  const permissions = JSON.parse(sessionStorage.getItem("permissions")) || {};
  const empAssetsReportPermissions = permissions
    .filter((permission) => permission.screen_type === "EmpAssetsReport")
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

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    fetch(`${config.apiBaseUrl}/getEmployeeId`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((data) => {
        const EmpID = data.map((option) => ({
          value: option.EmployeeId,
          label: `${option.EmployeeId} - ${option.First_Name}`,
        }));
        setEmployeeIDDropGrid(EmpID);
      })
      .catch((error) => console.error('Error fetching data:', error));
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
    setLocation("");
    setStatus("");
    setAsset_CodeSC("");
    setAssetNameSC("");
    setAssetCategorySC("");
    setSerialNumberSC("");
    setBar_codeSC("");
    setBrandSC("");
    setModelSC("");
    setExpectedReturnDateSC("");
    setSelectedAssetIDSc("");
    setAssetIDSC("");
    setSelectedEmpIdSc("");
    setEmpIdSc("");
    setAllocationDateSC("");
    setLastAllocationDateSC("");
    setAllocationStatusSc("");
    setSelectedAllocationStatus("");
  };

  const navigate = useNavigate();

  const columnDefs = [

    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
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
      headerName: "Employee ID",
      field: "EmployeeID",
      editable: false,
      // cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: EmployeeIDDropGrid,
      },
      valueFormatter: (params) => {
        const dept = EmployeeIDDropGrid.find(d => d.value === params.value);
        return dept ? dept.label : params.value;
      },
    },

    {
      headerName: "Allocation Date",
      field: "AllocationDate",
      editable: false,
    },

    {
      headerName: "Expected Return Date",
      field: "ExpectedReturnDate",
      editable: false,
    },

    {
      headerName: "Allocation Status",
      field: "AllocationStatus",
      editable: false,
    },
    {
      headerName: "Last Allocation Date",
      field: "LastAllocationDate",
      editable: false,
    },
    {
      headerName: "Serial Number",
      field: "SerialNumber",
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

  const gridOptions = {
    pagination: true,
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    gridApiRef.current = params.api;
  };

  const onFirstDataRendered = (params) => {
  const allColumnIds = params.columnApi
    .getColumns()
    .map((col) => col.getId());

  params.columnApi.autoSizeColumns(allColumnIds);
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
        EmployeeID: empIdSc,
        AllocationStatus: AllocationStatusSc,
        AllocationDate: AllocationDateSC,
        ExpectedReturnDate: ExpectedReturnDateSC,
        LastAllocationDate: LastAllocationDateSC,
        SerialNumber: SerialNumberSC,
      };

      const response = await fetch(`${config.apiBaseUrl}/EmployeeAssetReport_EAR`, {
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
    const selectedRows = gridApi.getSelectedRows();
    if (selectedRows.length === 0) {
      toast.warning("Please select at least one row to generate a report");
      return;
    }

    const reportData = selectedRows.map((row) => {
      const formatValue = (val) => (val !== undefined && val !== null ? val : '');

      return {
        "Asset ID": formatValue(row.AssetID),
        "Asset Name": formatValue(row.AssetName),
        "Asset Category": formatValue(row.AssetCategory),
        "Employee ID": formatValue(row.EmployeeID),
        "Allocation Date": formatValue(row.AllocationDate),
        "Expected Return Date": formatValue(row.ExpectedReturnDate),
        "Allocation Status": formatValue(row.AllocationStatus),
        "Last Allocation Date": formatValue(row.LastAllocationDate),
      };
    });

    /* ================= READ THEME COLORS ================= */

    const headerGradientStart = getCSSVariable("--but");
    const tableHeaderBg = getCSSVariable("--ag-header");
    const fontColor = getCSSVariable("--font-color");
    const rowAltColor = getCSSVariable("--ag-row");
    const hoverColor = getCSSVariable("--ag-hover");

    const logoUrl = window.location.origin + "/favicon.ico";
    const reportWindow = window.open("", "_blank");

    const link = reportWindow.document.createElement("link");
    link.rel = "icon";
    link.type = "image/x-icon";
    link.href = logoUrl;

    // 🔥 append to HEAD
    reportWindow.document.head.appendChild(link);
    reportWindow.document.write(`<html><head><title>Employee Asset Report</title>`);
    reportWindow.document.write("<style>");
    reportWindow.document.write(`
        body {
              font-family: 'Segoe UI', sans-serif;
              margin: 0;
              padding: 20px;
              background-color: #f4f6f9;
              color: ${fontColor};
            }
    
            .header {
              display: flex;
              align-items: center;
              background: ${tableHeaderBg};
              padding: 15px 20px;
              color: white;
              border-radius: 8px;
            }
            
            .logo {
              height: 60px;
            }
            
            .title-section {
              flex: 1;
              text-align: center;
            }
          
            .title-section h2 {
              margin: 0;
            }
    
            .sub-info {
              margin: 15px 0;
              font-size: 14px;
              color: #555;
              display: flex;
              justify-content: space-between;
            }
    
            table {
              width: 100%;
              border-collapse: collapse;
              background: white;
              border-radius: 8px;
              overflow: hidden;
            }
    
            th {
              background-color: ${tableHeaderBg};
              color: white;
              padding: 10px;
              text-align: left;
            }
    
            td {
              padding: 8px;
              text-align: left;
              border-bottom: 1px solid #ddd;
            }
    
            tr:nth-child(even) {
              text-align: left;
              background-color: ${rowAltColor};
            }
    
            tr:hover {
              background-color: ${hoverColor};
            }
    
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 13px;
              color: #777;
            }
    
            .print-btn {
              margin-top: 20px;
              padding: 10px 20px;
              background: ${headerGradientStart};
              color: white;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              font-size: 14px;
            }
    
            .print-btn:hover {
              opacity: 0.85;
            }
    
          @media print {
            body {
              background: white;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
              
            th {
              background-color: ${tableHeaderBg} !important;
              color: white !important;
            }
              
            tr:nth-child(even) {
              background-color: ${rowAltColor} !important;
            }
              
            .header {
              background: ${tableHeaderBg} !important;
              color: white !important;
            }
              
            .print-btn {
              display: none;
            }
          }
      `);

    reportWindow.document.write("</style></head><body>");
    reportWindow.document.write(`<div class="header">
      <img src="${logoUrl}" class="logo" />
      <div class="title-section">
        <h2>Employee Asset Report</h2>
      </div>
      </div>`);
    reportWindow.document.write(`<div style="margin-top:10px;">
      <strong>Total Records: ${selectedRows.length}</strong>
      <span style="float:right;">
        Printed Date: ${new Date().toLocaleDateString()}
      </span>
    </div>`);
    // reportWindow.document.write("<h1><u>Company Information</u></h1>");

    // Create table with headers
    reportWindow.document.write("<table><thead><tr>");
    Object.keys(reportData[0]).forEach((key) => {
      reportWindow.document.write(`<th>${key}</th>`);
    });
    reportWindow.document.write("</tr></thead><tbody>");

    // Populate the rows with safe empty strings
    reportData.forEach((row) => {
      reportWindow.document.write("<tr>");
      Object.values(row).forEach((value) => {
        reportWindow.document.write(`<td>${value || ''}</td>`);
      });
      reportWindow.document.write("</tr>");
    });

    reportWindow.document.write("</tbody></table>");
    reportWindow.document.write(`
    <div style="text-align:center;">
      <button class="print-btn" onclick="window.print()">Print</button>
    </div>
  `);
    reportWindow.document.write("</body></html>");
    reportWindow.document.close();
  };

  const hexToRgb = (hex) => {
    const cleanHex = hex.replace("#", "");
    const num = parseInt(cleanHex, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  };

  const exportToPDF = () => {
    if (!gridApiRef.current || rowData.length === 0) {
      toast.warning("Please select at least one row to export pdf");
      return;
    }

    const selectedRows = gridApiRef.current.getSelectedRows();
    const dataSource = selectedRows.length > 0 ? selectedRows : rowData;

    /* 🎨 Theme colors */
    const headerBg = getCSSVariable("--ag-header") || "#6a1b9a";
    const fontColor = getCSSVariable("--font-color") || "#000";

    const hexToRgb = (hex) => {
      hex = hex.replace("#", "");
      if (hex.length === 3) {
        hex = hex.split("").map(c => c + c).join("");
      }
      const bigint = parseInt(hex, 16);
      return [
        (bigint >> 16) & 255,
        (bigint >> 8) & 255,
        bigint & 255
      ];
    };

    const headerRGB = hexToRgb(headerBg);

    const doc = new jsPDF("l", "pt", "a4");
    const pageWidth = doc.internal.pageSize.width;

    /* ================= HEADER DESIGN ================= */

    // 🎨 Header background bar
    doc.setFillColor(...headerRGB);
    doc.rect(0, 0, pageWidth, 60, "F");

    // 🖼 Logo (left side)
    const logoUrl = window.location.origin + "/favicon.ico";

    // NOTE: image must be base64 for jsPDF
    const loadImage = (url, callback) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = function () {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL("image/png");
        callback(dataURL);
      };
      img.src = url;
    };

    loadImage(logoUrl, (logoBase64) => {

      // Add logo
      doc.addImage(logoBase64, "PNG", 20, 10, 40, 40);

      // 📝 Title (center)
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont(undefined, "bold");
      doc.text("Employee Asset Report", pageWidth / 2, 35, { align: "center" });

      /* ================= SUB HEADER ================= */

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);

      doc.text(`Total Records: ${dataSource.length}`, 40, 80);

      doc.text(
        `Printed Date: ${new Date().toLocaleDateString()}`,
        pageWidth - 180,
        80
      );

      /* ================= TABLE ================= */

      const headers = [
        columnDefs
          .filter(col => col.field)
          .map(col => col.headerName)
      ];

      const body = dataSource.map(row =>
        columnDefs
          .filter(col => col.field)
          .map(col => row[col.field] ?? "")
      );

      autoTable(doc, {
        startY: 100,
        head: headers,
        body: body,

        styles: {
          fontSize: 9,
        },

        headStyles: {
          fillColor: headerRGB,
          textColor: [255, 255, 255],
        },

        margin: { left: 40, right: 40 },
      });

      doc.save("Employee_Asset_Report.pdf");
    });
  };


  const transformRowData = (data) => {
    return data.map((row) => ({
      "Asset ID": row.AssetID || "",
      "Asset Name": row.AssetName || "",
      "Asset Category": row.AssetCategory || "",
      "Employee ID": row.EmployeeID || "",
      "Allocation Date": row.AllocationDate || "",
      "Expected Return Date": row.ExpectedReturnDate || "",
      "Allocation Status": row.AllocationStatus || "",
      "Last Allocation Date": row.LastAllocationDate || ""
    }));
  };

  const handleExportToExcel = () => {
    if (!gridApiRef.current) return;

    const selectedRows = gridApiRef.current.getSelectedRows();

    const dataSource = selectedRows.length > 0 ? selectedRows : rowData;

    if (!dataSource || dataSource.length === 0) {
      toast.warning("No data to export");
      return;
    }

    const screenName = "Employee Asset Report";
    const company = sessionStorage.getItem("selectedCompanyName") || "";

    /* ================= THEME COLORS ================= */

    const titleBg = getCSSVariable("--but").replace("#", "");
    const tableHeaderBg = getCSSVariable("--ag-header").replace("#", "");
    const fontColor = getCSSVariable("--font-color").replace("#", "");
    const altRowBg = getCSSVariable("--ag-row").replace("#", "");

    /* ================= HEADER ================= */

    const headerData = [
      [screenName],
      company ? [`Company Name: ${company}`] : [],
      [],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(headerData);

    /* ================= TABLE DATA ================= */

    const transformedData = transformRowData(rowData);

    XLSX.utils.sheet_add_json(worksheet, transformedData, {
      origin: `A${headerData.length + 1}`,
    });

    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    const headerRowIndex = headerData.length;

    /* ================= TITLE STYLE ================= */

    worksheet["A1"].s = {
      font: { bold: true, sz: 16, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: titleBg } },
      alignment: { horizontal: "center", vertical: "center" },
    };

    worksheet["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: Object.keys(transformedData[0]).length - 1 } },
    ];

    /* ================= TABLE HEADER STYLE ================= */

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

    /* ================= TABLE BODY STYLE ================= */

    for (let R = headerRowIndex + 1; R <= range.e.r; R++) {
      for (let C = 0; C < totalColumns; C++) {
        const cell =
          worksheet[XLSX.utils.encode_cell({ r: R, c: C })];

        if (!cell) continue;

        cell.s = {
          font: { color: { rgb: fontColor } },
          fill:
            R % 2 === 0
              ? { fgColor: { rgb: altRowBg } }
              : undefined,
          border: {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" },
          },
        };
      }
    }

    /* ================= COLUMN WIDTH ================= */

    worksheet["!cols"] = Array(totalColumns).fill({ wch: 22 });

    /* ================= EXPORT ================= */

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employee Asset Report");

    XLSX.writeFile(workbook, "Employee_Asset_Report.xlsx");
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
          <h1 className="page-title">Employee Asset Report</h1>
          <div className="action-wrapper desktop-actions">
            {["all permission", "view"].some((p) => empAssetsReportPermissions.includes(p)) && (
              <div className="action-icon print" onClick={generateReport}>
                <span className="tooltip">Print</span>
                <i className="fa-solid fa-print"></i>
              </div>
            )}
            {["all permission", "PDF"].some((p) => empAssetsReportPermissions.includes(p)) && (
              <div className="action-icon print" onClick={exportToPDF}>
                <span className="tooltip">Pdf</span>
                <i className="fa-solid fa-file-pdf"></i>
              </div>
            )}
            {["all permission", "Excel"].some((p) => empAssetsReportPermissions.includes(p)) && (
              <div className="action-icon print" onClick={handleExportToExcel}>
                <span className="tooltip">Excel</span>
                <i class="fa-solid fa-file-excel"></i>
              </div>
            )}
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
              {["all permission", "view"].some((p) => empAssetsReportPermissions.includes(p)) && (
                <li>
                  <button className="dropdown-item" onClick={generateReport}>
                    <i className="fa-solid fa-print text-dark fs-4"></i>
                  </button>
                </li>
              )}
              {["all permission", "Pdf"].some((p) => empAssetsReportPermissions.includes(p)) && (
                <li>
                  <button className="dropdown-item" onClick={exportToPDF}>
                    <i className="fa-solid fa-file-pdf text-dark fs-4"></i>
                  </button>
                </li>
              )}
              {["all permission", "Excel"].some((p) => empAssetsReportPermissions.includes(p)) && (
                <li>
                  <button className="dropdown-item" onClick={handleExportToExcel}>
                    <i className="fa-solid fa-file-excel add fs-4"></i>
                  </button>
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
            <div
              className={`inputGroup selectGroup 
              ${selectedAllocationStatus ? "has-value" : ""} 
              ${isSelectAllocationStatus ? "is-focused" : ""}`}
              title="Please Select the Allocation Status"
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
                type="Date"
                placeholder=""
                required
                title="Please Enter the Last Allocation Date"
                value={LastAllocationDateSC}
                onChange={(e) => setLastAllocationDateSC(e.target.value)}
                maxLength={100}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <label className="exp-form-labels">Last Allocation Date</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="Location"
                class="exp-input-field form-control"
                type="TEXT"
                placeholder=""
                required
                title="Please Enter the Serial Number"
                value={SerialNumberSC}
                onChange={(e) => setSerialNumberSC(e.target.value)}
                maxLength={100}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <label className="exp-form-labels">Serial Number</label>
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
            onFirstDataRendered={onFirstDataRendered}
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

export default EmpAssetsReport;
