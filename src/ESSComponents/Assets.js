
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
 const [AssetID, setAssetID] = useState('');
const [AssetCode, setAssetCode] = useState('');
const [AssetName, setAssetName] = useState('');
const [AssetCategory, setAssetCategory] = useState('');
const [SerialNumber, setSerialNumber] = useState('');
const [Barcode, setBarcode] = useState('');
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
const [Status, setStatus] = useState(true);
const [error, setError] = useState('');
 const [rowData, setrowData] = useState([]);
   const [gridColumnApi, setGridColumnApi] = useState(null);
     const [gridApi, setGridApi] = useState(null);

     const searchClearInputFields = () => {
    setAssetID("");
    setAssetCode("");
    setAssetName("");
    setAssetCategory("");
    setSerialNumber("");
    setBarcode("");
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
  };

 const navigate = useNavigate();

      const columnDefs = [
    {
      headerName: "Actions",
      field: "actions",
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
                  // onClick={() => saveEditedData(params.data, params.node.data)}
                  style={{ cursor: 'pointer' }}
                >
                  <i className="fa-regular fa-floppy-disk"></i>
                </span>

                <span
                  className="icon mx-2"
                  // onClick={() => deleteSelectedRows(params.data)}
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
      headerName: "Grade ID",
      field: "GradeID",
      cellStyle: { textAlign: "left" },
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
      headerName: "Grade Name",
      field: "GradeName",
      filter: 'agTextColumnFilter',
      editable: true
    },
    {
      headerName: "Salary Range From",
      field: "salary_range_from",
      filter: 'agTextColumnFilter',
      editable: true
    },

  ]

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

    const screenName = "Grade Details Search Report";
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

    XLSX.writeFile(workbook, "Asset_Details_Search_Report.xlsx");
  };

const transformRowData = (data) => {
    return data.map((row) => ({
      "Grade ID": row.GradeID || "",
      "Grade Name": row.GradeName || "",
      "Salary Range From": row.salary_range_from || "",
      "Salary Range To": row.salary_range_to || "",
      "Basic": row.Basic || "",
      "HRA": row.HRA || "",
      "Conveyance": row.Conveyance || "",
      "Medical": row.Medical || "",
      "Special Allowance": row.Special_Allowance || "",
      "Company PF Contribution": row.Company_Pf_Contribution || "",
      "Bonus/Arrears": row.Bonus_Arrears || "",
      "Other Allowance": row.Other_Allowance || "",
      "Leave Deductions": row.LeaveDeduction || "",
      "Other Deductions": row.otherDeductions || "",
      "CTC Currency": row.ctc_currency || "",
      "Minimum Take Salary": row.minimum_take_salary || "",
    }));
  };

    const getCSSVariable = (variableName) => {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(variableName)
      .trim();
  };



    return(
       <div class="container-fluid Topnav-screen ">
      {loading && <LoadingScreen />}
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="shadow-lg p-1 bg-light rounded main-header-box">
        <div className="header-flex">
          <h1 className="page-title">Assets</h1>

          <div className="action-wrapper desktop-actions">
            {saveButtonVisible && (
              <div className="action-icon add" 
              //onClick={handleSave}
              >
                <span className="tooltip">save</span>
                <i class="fa-solid fa-floppy-disk"></i>
              </div>
            )}
            <div className="action-icon print" 
            //onClick={handleReload}
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
                // onClick={handleSave}
                >
                  <i className="fa-solid fa-floppy-disk text-success fs-4"></i>
                </li>
              )}
              {/*})}*/}

              <li className="dropdown-item" 
            //   onClick={handleReload}
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
                id=" Asset ID"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the Grade ID"
                value={AssetID}
                onChange={(e) => setAssetID(e.target.value)}
                // onKeyPress={handleKeyPress}
                maxLength={50}
              />
              <label for="cname" className={` exp-form-labels ${error && !AssetID ? 'text-danger' : ''}`}>AssetID <span className="text-danger">*</span></label>
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
                value={AssetCode}
                onChange={(e) => setAssetCode(e.target.value)}
                maxLength={100}
              />
              <label className={` exp-form-labels ${error && !AssetCode ? 'text-danger' : ''}`}> AssetCode<span className="text-danger">*</span></label>
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
              <label className={` exp-form-labels ${error && !SerialNumber ? 'text-danger' : ''}`}> Asset Category<span className="text-danger">*</span></label>
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
                value={Barcode}
                onChange={(e) => setBarcode(e.target.value)}
                maxLength={100}
              />
              <label className={` exp-form-labels ${error && !Barcode ? 'text-danger' : ''}`}> Barcode<span className="text-danger">*</span></label>
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
                type="date"
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
            <div className="inputGroup">
              <Select
                id="PurchaseCost"
                class="exp-input-field form-control"
                type="date"
                placeholder=""
                required title="Please Enter the Grade Name"
                value={CurrencyCode}
                onChange={(e) => setCurrencyCode(e.target.value)}
                maxLength={100}
              />
              <label className={` exp-form-labels ${error && !CurrencyCode ? 'text-danger' : ''}`}> CurrencyCode<span className="text-danger">*</span></label>
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
                id="AssetStatus"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the Grade Name"
                value={AssetStatus}
                onChange={(e) => setAssetStatus(e.target.value)}
                maxLength={100}
              />
              <label className={` exp-form-labels ${error && !AssetStatus ? 'text-danger' : ''}`}> Asset Status<span className="text-danger">*</span></label>
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
            <div className="inputGroup">
              <input
                id="Country"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the Grade Name"
                value={Country}
                onChange={(e) => setCountry(e.target.value)}
                maxLength={100}
              />
              <label className={` exp-form-labels ${error && !Country ? 'text-danger' : ''}`}>Country<span className="text-danger">*</span></label>
            </div>
          </div>

          

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="Status"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the Grade Name"
                value={Status}
                onChange={(e) => setStatus(e.target.value)}
                maxLength={100}
              />
              <label className={` exp-form-labels ${error && !Status ? 'text-danger' : ''}`}>Status<span className="text-danger">*</span></label>
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
                id=" Asset ID"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the Grade ID"
                value={AssetID}
                onChange={(e) => setAssetID(e.target.value)}
                // onKeyPress={handleKeyPress}
                maxLength={50}
              />
              <label for="cname" className={` exp-form-labels ${error && !AssetID ? 'text-danger' : ''}`}>AssetID <span className="text-danger">*</span></label>
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
                value={AssetCode}
                onChange={(e) => setAssetCode(e.target.value)}
                maxLength={100}
              />
              <label className={` exp-form-labels ${error && !AssetCode ? 'text-danger' : ''}`}> AssetCode<span className="text-danger">*</span></label>
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
              <label className={` exp-form-labels ${error && !SerialNumber ? 'text-danger' : ''}`}> Asset Category<span className="text-danger">*</span></label>
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
                value={Barcode}
                onChange={(e) => setBarcode(e.target.value)}
                maxLength={100}
              />
              <label className={` exp-form-labels ${error && !Barcode ? 'text-danger' : ''}`}> Barcode<span className="text-danger">*</span></label>
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
                type="date"
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
            <div className="inputGroup">
              <Select
                id="PurchaseCost"
                class="exp-input-field form-control"
                type="date"
                placeholder=""
                required title="Please Enter the Grade Name"
                value={CurrencyCode}
                onChange={(e) => setCurrencyCode(e.target.value)}
                maxLength={100}
              />
              <label className={` exp-form-labels ${error && !CurrencyCode ? 'text-danger' : ''}`}> CurrencyCode<span className="text-danger">*</span></label>
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
                id="AssetStatus"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the Grade Name"
                value={AssetStatus}
                onChange={(e) => setAssetStatus(e.target.value)}
                maxLength={100}
              />
              <label className={` exp-form-labels ${error && !AssetStatus ? 'text-danger' : ''}`}> Asset Status<span className="text-danger">*</span></label>
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
            <div className="inputGroup">
              <input
                id="Country"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the Grade Name"
                value={Country}
                onChange={(e) => setCountry(e.target.value)}
                maxLength={100}
              />
              <label className={` exp-form-labels ${error && !Country ? 'text-danger' : ''}`}>Country<span className="text-danger">*</span></label>
            </div>
          </div>

          

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="Status"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the Grade Name"
                value={Status}
                onChange={(e) => setStatus(e.target.value)}
                maxLength={100}
              />
              <label className={` exp-form-labels ${error && !Status ? 'text-danger' : ''}`}>Status<span className="text-danger">*</span></label>
            </div>
          </div>
  <div className="col-12">
            <div className="search-btn-wrapper">
              <div className="icon-btn search" 
              // onClick={handleSearch}
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
            // defaultColDef={defaultColDef}
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