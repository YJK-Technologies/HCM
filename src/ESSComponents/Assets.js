
import { useState, useEffect } from "react";
import "../input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import { showConfirmationToast } from '../ToastConfirmation';
import LoadingScreen from '../Loading';
import * as XLSX from "xlsx-js-style";
import Select from "react-select";

const config = require('../Apiconfig');

function Assets({ }) {
  const [loading, setLoading] = useState(false);
  const [saveButtonVisible, setSaveButtonVisible] = useState(true);
  const [Asset_Code, setAsset_Code] = useState('');
  const [AssetName, setAssetName] = useState('');
  const [AssetCategory, setAssetCategory] = useState('');
  const [SerialNumber, setSerialNumber] = useState('');
  const [Bar_code, setBar_code] = useState('');
  const [Brand, setBrand] = useState('');
  const [Model, setModel] = useState('');
  const [PurchaseDate, setPurchaseDate] = useState('');
  const [PurchaseCost, setPurchaseCost] = useState('');
  const [CurrencyCode, setCurrencyCode] = useState('');
  const [VendorName, setVendorName] = useState('');
  const [WarrantyStart, setWarrantyStart] = useState('');
  const [WarrantyEnd, setWarrantyEnd] = useState('');
  const [AssetStatus, setAssetStatus] = useState('');
  const [Location, setLocation] = useState('');
  const [Country, setCountry] = useState('');
  const [Status, setStatus] = useState('');
  const [error, setError] = useState('');
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
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [isSelectedCurrency, setIsSelectedCurrency] = useState(false);
  const [selectedCurrencySc, setSelectedCurrencySc] = useState('');
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
  const [status, setstatus] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedStatusSC, setSelectedStatusSC] = useState('');
  const [isSelectstatus, setIsSelectstatus] = useState(false);
  const [isSelectstatusSC, setIsSelectstatusSC] = useState(false);
  const [selectedstatus, setselectedStatus] = useState('');
  const [AssetIDSC, setAssetIDSC] = useState('');
  const [Asset_CodeSC, setAsset_CodeSC] = useState('');
  const [AssetNameSC, setAssetNameSC] = useState('');
  const [AssetCategorySC, setAssetCategorySC] = useState('');
  const [SerialNumberSC, setSerialNumberSC] = useState('');
  const [Bar_codeSC, setBar_codeSC] = useState('');
  const [BrandSC, setBrandSC] = useState('');
  const [ModelSC, setModelSC] = useState('');
  const [PurchaseDateSC, setPurchaseDateSC] = useState('');
  const [PurchaseCostSC, setPurchaseCostSC] = useState('');
  const [CurrencyCodeSC, setCurrencyCodeSC] = useState('');
  const [VendorNameSC, setVendorNameSC] = useState('');
  const [WarrantyStartSC, setWarrantyStartSC] = useState('');
  const [WarrantyEndSC, setWarrantyEndSC] = useState('');
  const [AssetStatusSC, setAssetStatusSC] = useState('');
  const [LocationSC, setLocationSC] = useState('');
  const [CountrySC, setCountrySC] = useState('');
  const [StatusSC, setStatusSC] = useState('');

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
    setCountry(selectedCountry ? selectedCountry.value : '');
  };
  const filteredOptionCountry = Countrydrop.map(option => ({
    value: option.Country_Code,
    label: `${option.Country_Code} - ${option.Country_Name}`
  }));


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
      .then((val) => setCountrydrop(val))
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
      .then((val) => setCountrydropSC(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const filteredOptionCountrySC = CountrydropSC.map(option => ({
    value: option.Country_Code,
    label: `${option.Country_Code} - ${option.Country_Name}`
  }));

  const handleCountryChangeSC = (selectedCountrySC) => {
    setselectedCountrySC(selectedCountrySC);
    setCountry(selectedCountrySC ? selectedCountrySC.value : '');
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
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    fetch(`${config.apiBaseUrl}/getCurrenyCode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((response) => response.json())
      .then((data) => {
        const CurrencyDrop = data.map(option => option.attributedetails_name);
        setCurrencyDropGrid(CurrencyDrop);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    fetch(`${config.apiBaseUrl}/getAllocationStatus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((response) => response.json())
      .then((data) => {
        const statusDrop = data.map(option => option.attributedetails_name);
        setstatusDropGrid(statusDrop);
      })
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
      .then((response) => response.json())
      .then((data) => {
        const Countrydrop = data.map((option) => ({
          value: option.Country_Code,
          label: `${option.Country_Code} - ${option.Country_Name}`,
        }));
        setCountrydropGrid(Countrydrop);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    fetch(`${config.apiBaseUrl}/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((response) => response.json())
      .then((data) => {
        const statusDrop = data.map(option => option.attributedetails_name);
        setStatusGriddrop(statusDrop);
      })
      .catch((error) => console.error('Error fetching data:', error));
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
        setStatusDrop(val)
        setstatusdrop(val)

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
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((response) => response.json())
      .then((data) => {
        const statusOption = data.map(option => option.attributedetails_name);
        setStatusGriddrop(statusOption);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleChangeStatus = (Status) => {
    setSelectedStatus(Status);
    setStatus(Status ? Status.value : '');
  };

  const handlechangestatusSC = (status) => {
    setSelectedStatusSC(status);
    setStatusSC(status ? status.value : '');
  };

  const searchClearInputFields = () => {
    setAsset_Code("");
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
    setAssetIDSC("");
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
      headerName: "Actions",
      field: "actions",
      headerCheckboxSelection: true,
      // checkboxSelection: true,

      cellRenderer: (params) => {
        const cellWidth = params.column.getActualWidth();
        const isWideEnough = cellWidth > 20;
        const showIcons = isWideEnough;
        return (
          <div className="position-relative d-flex align-items-center" style={{ minHeight: '100%', justifyContent: 'center' }}>
            {showIcons && (
              <>
                <span
                  className="icon mx-2"
                  onClick={() => saveEditedData(params.data, params.node.data)}
                  style={{ cursor: 'pointer' }}
                >
                  <i className="fa-regular fa-floppy-disk"></i>
                </span>

                <span
                  className="icon mx-2"
                  onClick={() => deleteSelectedRows(params.data)}
                  style={{ cursor: 'pointer' }}
                >
                  <i className="fa-solid fa-trash"></i>
                </span>
              </>
            )}
          </div>
        );
      },
    },
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
          <span
            style={{ cursor: "pointer" }}
            onClick={handleClick}
          >
            {params.value}
          </span>
        );
      },
    },
    {
      headerName: "Asset Code",
      field: "Asset_Code",
      filter: 'agTextColumnFilter',
      editable: false
    },
    {
      headerName: "Asset Name",
      field: "AssetName",
      filter: 'agTextColumnFilter',
      editable: true
    },

    {
      headerName: "Asset Category",
      field: "AssetCategory",
      filter: 'agTextColumnFilter',
      editable: true
    },

    {
      headerName: "Serial Number",
      field: "SerialNumber",
      filter: 'agTextColumnFilter',
      editable: true
    },
    {
      headerName: "Barcode",
      field: "Bar_code",
      filter: 'agTextColumnFilter',
      editable: true
    },
    {
      headerName: "Brand",
      field: "Brand",
      filter: 'agTextColumnFilter',
      editable: true
    },
    {
      headerName: "Model",
      field: "Model",
      filter: 'agTextColumnFilter',
      editable: true
    },
    {
      headerName: "Purchase Date",
      field: "PurchaseDate",
      editable: true,
      cellStyle: { textAlign: "left" },
      valueFormatter: (params) => {
        if (!params.value) return "";

        const date = new Date(params.value);

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
      }
    },
    {
      headerName: "Purchase Cost",
      field: "PurchaseCost",
      filter: 'agTextColumnFilter',
      editable: true
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
      filter: 'agTextColumnFilter',
      editable: true
    },
    {
      headerName: "Warranty Start",
      field: "WarrantyStart",
      editable: true,
      cellStyle: { textAlign: "left" },
      valueFormatter: (params) => {
        if (!params.value) return "";

        const date = new Date(params.value);

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
      }
    },
    {
      headerName: "Warranty End",
      field: "WarrantyEnd",
      editable: true,
      cellStyle: { textAlign: "left" },
      valueFormatter: (params) => {
        if (!params.value) return "";

        const date = new Date(params.value);

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
      }
    },

    {
      headerName: "Asset Status",
      field: "AssetStatus",
      filter: 'agTextColumnFilter',
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: statusDropGrid,
      },
    },
    {
      headerName: "Location",
      field: "Location",
      filter: 'agTextColumnFilter',
      editable: true
    },
    {
      headerName: "Country",
      field: "Country",
      filter: 'agTextColumnFilter',
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: CountrydropGrid.map(d => d.value),
      },
      valueFormatter: (params) => {
        const dept = CountrydropGrid.find(d => d.value === params.value);
        return dept ? dept.label : params.value;
      },
    },
    {
      headerName: "Status",
      field: "Status",
      filter: 'agTextColumnFilter',
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: statusgriddrop,
      },
    },
  ]

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

  const handleExportToExcel = () => {
    if (!rowData || rowData.length === 0) {
      toast.warning("There is no data to export.");
      return;
    }
    const screenName = "Asset Details Report";
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Asset Details");

    XLSX.writeFile(workbook, "Asset_Details_Report.xlsx");
  };

  const transformRowData = (data) => {
    return data.map((row) => ({
      "Asset ID": row.AssetID || "",
      "Asset Code": row.Asset_Code || "",
      "Asset Name": row.AssetName || "",
      "Asset Category": row.AssetCategory || "",
      "Serial Number": row.SerialNumber || "",
      "Bar code": row.Bar_code || "",
      "Brand": row.Brand || "",
      "Model": row.Model || "",
      "Purchase Date": row.PurchaseDate || "",
      "Purchase Cost": row.PurchaseCost || "",
      "Currency Code": row.CurrencyCode || "",
      " VendorName": row.VendorName || "",
      "Warranty Start": row.WarrantyStart || "",
      "Warranty End": row.WarrantyEnd || "",
      "AssetStatus": row.AssetStatus || "",
      "Location": row.Location || "",
      "Country": row.Country || "",
      "Status": row.Status || "",

    }));
  };

  const getCSSVariable = (variableName) => {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(variableName)
      .trim();
  };

  const handleReload = () => {
    window.location.reload();
  }

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

  const handleSave = async () => {
    if (!Asset_Code || !AssetName || !AssetCategory ||
      !SerialNumber || !Bar_code || !Brand || !Model || !PurchaseDate || !PurchaseCost
      || !CurrencyCode || !VendorName || !WarrantyStart || !WarrantyEnd || !Location) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }
    setLoading(true);
    try {

      const Header = {
        Asset_Code: Asset_Code,
        AssetName: AssetName,
        AssetCategory: AssetCategory,
        SerialNumber: SerialNumber,
        Bar_code: Bar_code,
        Brand: Brand,
        Model: Model,
        PurchaseDate: PurchaseDate,
        PurchaseCost: PurchaseCost,
        CurrencyCode: CurrencyCode,
        VendorName: VendorName,
        WarrantyStart: WarrantyStart,
        WarrantyEnd: WarrantyEnd,
        AssetStatus: 'Not Allocated',
        Location: Location,
        Country: Country,
        Status: Status,
        company_code: sessionStorage.getItem("selectedCompanyCode"),
        created_by: sessionStorage.getItem("selectedUserCode")
      };

      const response = await fetch(`${config.apiBaseUrl}/EmployeeAssets_HdrInsert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Header),
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

  // UPDATE
  const saveEditedData = async (rowData) => {
    showConfirmationToast(
      "Are you sure you want to update the data in the selected rows?",
      async () => {
        try {
          setLoading(true);

          const company_code = sessionStorage.getItem("selectedCompanyCode");
          const modify_by = sessionStorage.getItem("selectedUserCode");

          // const rows = Array.isArray(rowData) ? rowData : [rowData];

          const dataToSend = {
            EmployeeAssets_HdrData: Array.isArray(rowData)
              ? rowData.map((row) => ({
                ...row,
                company_code,
                modify_by,
              }))
              : [
                {
                  ...rowData,
                  company_code,
                  modify_by,
                },
              ],
          };

          // const dataToSend = {
          //   EmployeeAssets_HdrData: rows.map((row) => ({
          //     AssetID: row.AssetID || 0,
          //     Asset_Code: row.Asset_Code || null,
          //     AssetName: row.AssetName || null,
          //     AssetCategory: row.AssetCategory || null,
          //     SerialNumber: row.SerialNumber || null,
          //     Bar_code: row.Bar_code || null,
          //     Brand: row.Brand || null,
          //     Model: row.Model || null,
          //     // Dates (safe handling)
          //     PurchaseDate: row.PurchaseDate || null,
          //     WarrantyStart: row.WarrantyStart || null,
          //     WarrantyEnd: row.WarrantyEnd || null,
          //     // Numbers
          //     PurchaseCost: row.PurchaseCost
          //       ? parseFloat(row.PurchaseCost)
          //       : 0,
          //     CurrencyCode: row.CurrencyCode || null,
          //     VendorName: row.VendorName || null,
          //     AssetStatus: row.AssetStatus || null,
          //     Location: row.Location || null,
          //     Country: row.Country || null,
          //     Status: row.Status || null,

          //     company_code:  sessionStorage.getItem("selectedCompanyCode"),
          //     Keyfield: row.Keyfield || null,

          //     modify_by: modify_by,
          //     modify_date: new Date().toISOString(), // safer
          //   })),
          // };

          const response = await fetch(`${config.apiBaseUrl}/EmployeeAssets_HdrLoopUpdate`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(dataToSend),
            }
          );

          if (response.ok) {
            toast.success("Data updated successfully", {
              onClose: () => handleSearch(),
            });
          } else {
            const errorResponse = await response.json();
            toast.error(errorResponse.message || "Update failed");
          }
        } catch (error) {
          console.error("Error updating rows:", error);
          toast.error("Error Updating Data: " + error.message);
        } finally {
          setLoading(false);
        }
      },
      () => {
        toast.info("Update cancelled");
      }
    );
  };

  // DELETE
  const deleteSelectedRows = async (rowData) => {
    showConfirmationToast(
      "Are you sure you want to delete the data in the selected rows?",
      async () => {
        try {
          setLoading(true);

          const company_code = sessionStorage.getItem("selectedCompanyCode");
          const modify_by = sessionStorage.getItem("selectedUserCode");

          // const rows = Array.isArray(rowData) ? rowData : [rowData];

          const dataToSend = {
            EmployeeAssets_HdrData: Array.isArray(rowData)
              ? rowData.map((row) => ({
                ...row,
                company_code,
                modify_by,
              }))
              : [
                {
                  ...rowData,
                  company_code,
                  modify_by,
                },
              ],
          };

          // const dataToSend = {
          //   EmployeeAssets_HdrData: rows.map((row) => ({
          //     AssetID: row.AssetID,
          //     company_code: company_code,
          //   })),
          // };

          const response = await fetch(
            `${config.apiBaseUrl}/EmployeeAssets_HdrLoopDelete`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(dataToSend),
            }
          );

          if (response.ok) {
            toast.success("Data deleted successfully", {
              onClose: () => handleSearch(),
            });
          } else {
            const errorResponse = await response.json();
            toast.error(errorResponse.message || "Failed to delete data");
          }
        } catch (error) {
          console.error("Error deleting rows:", error);
          toast.error("Error deleting data: " + error.message);
        } finally {
          setLoading(false);
        }
      },
      () => {
        toast.info("Data delete cancelled.");
      }
    );
  };

  return (
    <div class="container-fluid Topnav-screen ">
      {loading && <LoadingScreen />}
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="shadow-lg p-1 bg-light rounded main-header-box">
        <div className="header-flex">
          <h1 className="page-title">Assets Master</h1>

          <div className="action-wrapper desktop-actions">
            {saveButtonVisible && (
              <div className="action-icon add"
                onClick={handleSave}
              >
                <span className="tooltip">save</span>
                <i class="fa-solid fa-floppy-disk"></i>
              </div>
            )}
            <div className="action-icon print"
              onClick={handleReload}
            >
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

              {/* {saveButtonVisible && ['add', 'all permission'].some(p => employeePermissions.includes(p)) && ( */}
              {saveButtonVisible && (
                <li className="dropdown-item"
                  onClick={handleSave}
                >
                  <i className="fa-solid fa-floppy-disk text-success fs-4"></i>
                </li>
              )}
              {/*})}*/}

              <li className="dropdown-item"
                onClick={handleReload}
              >
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
                id="Grade Name "
                class="exp-input-field form-control"
                type="Text"
                placeholder=""
                required title="Please Enter the Grade Name"
                value={Asset_Code}
                onChange={(e) => setAsset_Code(e.target.value)}
                maxLength={100}
              />
              <label className={` exp-form-labels ${error && !Asset_Code ? 'text-danger' : ''}`}> Asset Code<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="Asset Name "
                class="exp-input-field form-control"
                type="Text"
                placeholder=""
                required title="Please Enter the Grade Name"
                value={AssetName}
                onChange={(e) => setAssetName(e.target.value)}
                maxLength={100}
              />
              <label className={` exp-form-labels ${error && !AssetName ? 'text-danger' : ''}`}> Asset Name<span className="text-danger">*</span></label>
            </div>
          </div>
          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="Asset Category "
                class="exp-input-field form-control"
                type="Text"
                placeholder=""
                required title="Please Enter the Grade Name"
                value={AssetCategory}
                onChange={(e) => setAssetCategory(e.target.value)}
                maxLength={100}
              />
              <label className={` exp-form-labels ${error && !AssetCategory ? 'text-danger' : ''}`}> Asset Category<span className="text-danger">*</span></label>
            </div>
          </div>
          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="SerialNumber"
                class="exp-input-field form-control"
                type="Text"
                placeholder=""
                required title="Please Enter the Grade Name"
                value={SerialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                maxLength={100}
              />
              <label className={` exp-form-labels ${error && !SerialNumber ? 'text-danger' : ''}`}> Serial Number<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="SerialNumber"
                class="exp-input-field form-control"
                type="Text"
                placeholder=""
                required title="Please Enter the Grade Name"
                value={Bar_code}
                onChange={(e) => setBar_code(e.target.value)}
                maxLength={100}
              />
              <label className={` exp-form-labels ${error && !Bar_code ? 'text-danger' : ''}`}> Barcode<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="SerialNumber"
                class="exp-input-field form-control"
                type="Text"
                placeholder=""
                required title="Please Enter the Grade Name"
                value={Brand}
                onChange={(e) => setBrand(e.target.value)}
                maxLength={100}
              />
              <label className={` exp-form-labels ${error && !Brand ? 'text-danger' : ''}`}> Brand<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="SerialNumber"
                class="exp-input-field form-control"
                type="Text"
                placeholder=""
                required title="Please Enter the Grade Name"
                value={Model}
                onChange={(e) => setModel(e.target.value)}
                maxLength={100}
              />
              <label className={` exp-form-labels ${error && !Model ? 'text-danger' : ''}`}> Model<span className="text-danger">*</span></label>
            </div>
          </div>
          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="SerialNumber"
                class="exp-input-field form-control"
                type="date"
                placeholder=""
                required title="Please Enter the Grade Name"
                value={PurchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                maxLength={100}
              />
              <label className={` exp-form-labels ${error && !PurchaseDate ? 'text-danger' : ''}`}> PurchaseDate<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="PurchaseCost"
                class="exp-input-field form-control"
                type="Number"
                placeholder=""
                required title="Please Enter the Grade Name"
                value={PurchaseCost}
                onChange={(e) => setPurchaseCost(e.target.value)}
                maxLength={100}
              />
              <label className={` exp-form-labels ${error && !PurchaseCost ? 'text-danger' : ''}`}> PurchaseCost<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-2">
            <div className={`inputGroup selectGroup 
              ${selectedCurrency ? "has-value" : ""} 
              ${isSelectedCurrency ? "is-focused" : ""}`}
              title="Please select the Currency Code"
            >
              <Select
                id="PurchaseCost"
                class="exp-input-field form-control"
                type="date"
                placeholder=""
                required title="Please Enter the Grade Name"
                onFocus={() => setIsSelectedCurrency(true)}
                onBlur={() => setIsSelectedCurrency(false)}
                classNamePrefix="react-select"
                value={selectedCurrency}
                onChange={handleChangeCurrency}
                options={filteredOptionCurrency}
                maxLength={100}
                isClearable
              />
              <label for="sname" className={`floating-label ${error && !CurrencyCode ? 'text-danger' : ''}`}>Currency Code<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="PurchaseCost"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the Grade Name"
                value={VendorName}
                onChange={(e) => setVendorName(e.target.value)}
                maxLength={100}
              />
              <label className={` exp-form-labels ${error && !VendorName ? 'text-danger' : ''}`}> VendorName<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="PurchaseCost"
                class="exp-input-field form-control"
                type="date"
                placeholder=""
                required title="Please Enter the Grade Name"
                value={WarrantyStart}
                onChange={(e) => setWarrantyStart(e.target.value)}
                maxLength={100}
              />
              <label className={` exp-form-labels ${error && !WarrantyStart ? 'text-danger' : ''}`}> Warranty Start<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="Warranty End"
                class="exp-input-field form-control"
                type="date"
                placeholder=""
                required title="Please Enter the Grade Name"
                isClearable
                value={WarrantyEnd}
                onChange={(e) => setWarrantyEnd(e.target.value)}
                maxLength={100}
              />
              <label className={` exp-form-labels ${error && !WarrantyEnd ? 'text-danger' : ''}`}> Warranty End<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="Location"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the Grade Name"
                value={Location}
                onChange={(e) => setLocation(e.target.value)}
                maxLength={100}
              />
              <label className={` exp-form-labels ${error && !Location ? 'text-danger' : ''}`}>Location<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-2">
            <div className={`inputGroup selectGroup 
              ${selectedCountry ? "has-value" : ""} 
              ${isSelectCountry ? "is-focused" : ""}`}
            >
              <Select
                id="Country"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                onFocus={() => setIsSelectCountry(true)}
                onBlur={() => setIsSelectCountry(false)}
                classNamePrefix="react-select"
                value={selectedCountry}
                onChange={handleCountryChange}
                options={filteredOptionCountry}
                maxLength={100}
                isClearable
              />
              <label for="sname" className={`floating-label ${error && !Country ? 'text-danger' : ''}`}>Country<span className="text-danger">*</span></label>
            </div>
          </div>



          <div className="col-md-2">
            <div className={`inputGroup selectGroup 
              ${selectedStatus ? "has-value" : ""} 
              ${isSelectstatus ? "is-focused" : ""}`}
            >
              <Select
                id="Status"
                classNamePrefix="react-select"
                type="text"
                onFocus={() => setIsSelectstatus(true)}
                onBlur={() => setIsSelectstatus(false)}
                value={selectedStatus}
                onChange={handleChangeStatus}
                options={filteredOptionStatus}
                isClearable
              />
              <label for="sname" className={`floating-label ${error && !Status ? 'text-danger' : ''}`}>Status<span className="text-danger">*</span></label>
            </div>
          </div>
        </div>
      </div>


      <div className="shadow-lg p-3 bg-light rounded  container-form-box mt-2">
        <div className="header-flex">
          <h5 className="">Search Criteria:</h5>
        </div>


        <div className="row g-3">

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="Grade Name "
                class="exp-input-field form-control"
                type="Number"
                placeholder=""
                required title="Please Enter the Grade Name"
                value={AssetIDSC}
                onChange={(e) => setAssetIDSC(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}

                maxLength={100}
              />
              <label className="exp-form-labels">Asset ID</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="Grade Name "
                class="exp-input-field form-control"
                type="Text"
                placeholder=""
                required title="Please Enter the Grade Name"
                value={Asset_CodeSC}
                onChange={(e) => setAsset_CodeSC(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}

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
                required title="Please Enter the Grade Name"
                value={AssetNameSC}
                onChange={(e) => setAssetNameSC(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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
                required title="Please Enter the Grade Name"
                value={AssetCategorySC}
                onChange={(e) => setAssetCategorySC(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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
                required title="Please Enter the Grade Name"
                value={SerialNumberSC}
                onChange={(e) => setSerialNumberSC(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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
                required title="Please Enter the Grade Name"
                value={Bar_codeSC}
                onChange={(e) => setBar_codeSC(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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
                required title="Please Enter the Grade Name"
                value={BrandSC}
                onChange={(e) => setBrandSC(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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
                required title="Please Enter the Grade Name"
                value={ModelSC}
                onChange={(e) => setModelSC(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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
                required title="Please Enter the Grade Name"
                value={PurchaseDateSC}
                onChange={(e) => setPurchaseDateSC(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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
                required title="Please Enter the Grade Name"
                value={PurchaseCostSC}
                onChange={(e) => setPurchaseCostSC(e.target.value)}
                maxLength={100}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}

              />
              <label className="exp-form-labels">Purchase Cost</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className={`inputGroup selectGroup 
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
                required title="Please Enter the Grade Name"
                onFocus={() => setIsSelectedCurrencySc(true)}
                onBlur={() => setIsSelectedCurrencySc(false)}
                value={selectedCurrencySc}
                onChange={handleChangeCurrencySc}
                options={filteredOptionCurrencySc}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                maxLength={100}
                isClearable
              />
              <label for="sname" className={`floating-label`}>Currency Code</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="PurchaseCost"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the Grade Name"
                value={VendorNameSC}
                onChange={(e) => setVendorNameSC(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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
                required title="Please Enter the Grade Name"
                value={WarrantyStartSC}
                onChange={(e) => setWarrantyStartSC(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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
                required title="Please Enter the Grade Name"
                value={WarrantyEndSC}
                onChange={(e) => setWarrantyEndSC(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                maxLength={100}
              />
              <label className="exp-form-labels">Warranty End</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className={`inputGroup selectGroup 
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
              <label for="sname" className={`floating-label`}>Asset Status </label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="Location"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the Grade Name"
                value={LocationSC}
                onChange={(e) => setLocationSC(e.target.value)}
                maxLength={100}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}

              />
              <label className="exp-form-labels">Location</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className={`inputGroup selectGroup 
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
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                classNamePrefix="react-select"
                maxLength={100}
                isClearable
              />
              <label for="sname" className={`floating-label`}>Country</label>
            </div>
          </div>



          <div className="col-md-2">
            <div className={`inputGroup selectGroup 
              ${selectedStatusSC ? "has-value" : ""} 
              ${isSelectstatusSC ? "is-focused" : ""}`}
            >
              <Select
                id="Status"
                value={selectedStatusSC}
                onChange={handlechangestatusSC}
                options={filteredoptionstatus}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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
              <div className="icon-btn search"
                onClick={handleSearch}
              >
                <span className="tooltip">Search</span>
                <i className="fa-solid fa-magnifying-glass"></i>
              </div>

              <div className="icon-btn reload"
                onClick={reloadGridData}
              >
                <span className="tooltip">Reload</span>
                <i className="fa-solid fa-rotate-right"></i>
              </div>

              <div className="icon-btn excel"
                onClick={handleExportToExcel}
              >
                <span className="tooltip">Excel</span>
                <i className="fa-solid fa-file-excel"></i>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="shadow-lg pt-3 pb-3 bg-light rounded mt-2 container-form-box" style={{ width: "100%" }}>
        <div class="ag-theme-alpine" style={{ height: 455, width: "100%" }}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            onGridReady={onGridReady}
            // onCellValueChanged={onCellValueChanged}
            rowSelection="multiple"
            // onSelectionChanged={onSelectionChanged}
            paginationAutoPageSize={true}
            gridOptions={gridOptions}
            pagination={true}
          />
        </div>
      </div>


    </div>








  )
}

export default Assets;