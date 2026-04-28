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

function Input({ }) {

  const [GradeID, setGradeID] = useState('');
  const [GradeName, setGradeName] = useState('');
  const [Basic, setBasic] = useState('');
  const [SalaryrrangeFrom, setSalaryrrangeFrom] = useState('');
  const [SalaryrangeTo, setSalaryrangeTo] = useState('');
  const [HRA, setHRA] = useState('');
  const [Conveyance, setConveyance] = useState('');
  const [Medical, setMedical] = useState('');
  const [Special_Allowance, setSpecial_Allowance] = useState('');
  const [Company_Pf_Contribution, setCompany_Pf_Contribution] = useState('');
  const [Bonus_Arrears, setBonus_Arrears] = useState('');
  const [Other_Allowance, setOther_Allowance] = useState('');
  const [LeaveDeduction, setLeaveDeduction] = useState('');
  const [minimum_take_salary, setMinimumTakeSalary] = useState('');
  const [ctc_currency, setCtcCurrency] = useState('');
  const [otherDeductions, setotherDeductions] = useState('');
  const [saveButtonVisible, setSaveButtonVisible] = useState(true);
  const [gridApi, setGridApi] = useState(null);
  const [rowData, setrowData] = useState([]);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [showAsterisk, setShowAsterisk] = useState(true);
  const [loading, setLoading] = useState(false);
  // selected input fields
  const [Gradeid, setGradeid] = useState('');
  const [Gradename, setGradename] = useState('');
  const [basic, setbasic] = useState('');
  const [salaryrrangefrom, setsalaryrrangefrom] = useState('');
  const [salaryrangeto, setsalaryrangeto] = useState('');
  const [Hra, setHra] = useState('');
  const [conveyance, setconveyance] = useState('');
  const [medical, setmedical] = useState('');
  const [SpecialAllowance, setSpecialAllowance] = useState('');
  const [CompanyPfContribution, setCompanyPfContribution] = useState('');
  const [BonusArrears, setBonusArrears] = useState('');
  const [OtherAllowance, setOtherAllowance] = useState('');
  const [Leavededuction, setLeavededuction] = useState('');
  const [otherdeductions, setotherdeductions] = useState('');
  const [ctccurrency, setCurrency] = useState('');
  const [minimumtakesalary, setMinimumSalary] = useState('');

  const [currencyCTCDrop, setCurrencyCTCDrop] = useState([]);
  const [currencyCTCDropGrid, setCurrencyCTCDropGrid] = useState([]);
  const [selectedCTCCurrency, setSelectedCTCCurrency] = useState('');
  const [isSelectedCTCCurrency, setIsSelectedCTCCurrency] = useState(false);

  const [currencyCTCDropSc, setCurrencyCTCDropSc] = useState([]);
  const [selectedCTCCurrencySc, setSelectedCTCCurrencySc] = useState('');
  const [isSelectedCTCCurrencySc, setIsSelectedCTCCurrencySc] = useState(false);

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const searchClearInputFields = () => {
    setGradeID("");
    setGradeName("");
    setSalaryrrangeFrom("");
    setSalaryrangeTo("");
    setBasic("");
    setHRA("");
    setConveyance("");
    setMedical("");
    setSpecial_Allowance("");
    setCompany_Pf_Contribution("");
    setBonus_Arrears("");
    setOther_Allowance("");
    setLeaveDeduction("");
    setotherDeductions("");
    setCtcCurrency("");
    setMinimumTakeSalary("");
    setSelectedCTCCurrency("");
    setSelectedCTCCurrencySc("");
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
      .then((val) => setCurrencyCTCDrop(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const filteredOptionCTCCurrency = Array.isArray(currencyCTCDrop)
    ? currencyCTCDrop.map((option) => ({
      value: option?.attributedetails_name,
      label: option?.attributedetails_name,
    }))
    : [];

  const handleChangeCTCCurrency = (selectedCTCCurrency) => {
    setSelectedCTCCurrency(selectedCTCCurrency);
    setCurrency(selectedCTCCurrency ? selectedCTCCurrency.value : "");
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
      .then((val) => setCurrencyCTCDropSc(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const filteredOptionCTCCurrencySc = Array.isArray(currencyCTCDropSc)
    ? currencyCTCDropSc.map((option) => ({
      value: option?.attributedetails_name,
      label: option?.attributedetails_name,
    }))
    : [];

  const handleChangeCTCCurrencySc = (selectedCTCCurrencySc) => {
    setSelectedCTCCurrencySc(selectedCTCCurrencySc);
    setCtcCurrency(selectedCTCCurrencySc ? selectedCTCCurrencySc.value : "");
  };

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
        setCurrencyCTCDropGrid(currency);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleNavigateWithRowData = (selectedRow) => {
    navigate("/EmployeeGrade", { state: { mode: "update", selectedRow } });
  };

  const handleReload = () => {
    window.location.reload();
  }

  const reloadGridData = () => {
    setrowData([]);
    searchClearInputFields();
  };

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
    {
      headerName: "Salary Range To",
      field: "salary_range_to",
      filter: 'agTextColumnFilter',
      editable: true
    },
    {
      headerName: "Basic",
      field: "Basic",
      filter: 'agTextColumnFilter',
      editable: true
    },
    {
      headerName: "HRA",
      field: "HRA",
      filter: 'agTextColumnFilter',
      editable: true
    },
    {
      headerName: "Conveyance",
      field: "Conveyance",
      filter: 'agTextColumnFilter',
      editable: true
    },
    {
      headerName: "Medical",
      field: "Medical",
      filter: 'agTextColumnFilter',
      editable: true
    },
    {
      headerName: "Special Allowance",
      field: "Special_Allowance",
      filter: 'agTextColumnFilter',
      editable: true
    },
    {
      headerName: "Company PF Contribution",
      field: "Company_Pf_Contribution",
      filter: 'agTextColumnFilter',
      editable: true
    },
    {
      headerName: "Bonus/Arrears",
      field: "Bonus_Arrears",
      filter: 'agTextColumnFilter',
      editable: true
    },
    {
      headerName: "Other Allowance",
      field: "Other_Allowance",
      filter: 'agTextColumnFilter',
      editable: true
    },
    {
      headerName: "Leave Deductions",
      field: "LeaveDeduction",
      filter: 'agTextColumnFilter',
      editable: true
    },
    {
      headerName: "Other Deductions",
      field: "otherDeductions",
      filter: 'agTextColumnFilter',
      editable: true
    },
    {
      headerName: "CTC Currency",
      field: "ctc_currency",
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: currencyCTCDropGrid,
      },
      editable: true
    },
    {
      headerName: "Minimum Take Salary",
      field: "minimum_take_salary",
      filter: 'agTextColumnFilter',
      editable: true
    },
  ]

  const gridOptions = {
    pagination: true,
  };

  const handleSave = async () => {
    if (!Gradeid || !Gradename || !basic || !salaryrrangefrom || !salaryrangeto) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }
    setLoading(true);
    try {

      const Header = {
        GradeID: Gradeid,
        GradeName: Gradename,
        Basic: basic,
        HRA: Hra,
        Conveyance: parseFloat(conveyance),
        Medical: parseFloat(medical),
        Special_Allowance: parseFloat(SpecialAllowance),
        Company_Pf_Contribution: parseFloat(CompanyPfContribution),
        Bonus_Arrears: parseFloat(BonusArrears),
        Other_Allowance: parseFloat(OtherAllowance),
        LeaveDeduction: parseFloat(Leavededuction),
        otherDeductions: parseFloat(otherdeductions),
        salary_range_from: salaryrrangefrom,
        salary_range_to: salaryrangeto,
        ctc_currency: ctccurrency,
        minimum_take_salary: parseFloat(minimumtakesalary),
        company_code: sessionStorage.getItem('selectedCompanyCode'),
        created_by: sessionStorage.getItem('selectedUserCode')
      };

      const response = await fetch(`${config.apiBaseUrl}/addGrade`, {
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

  const handleSearch = async () => {
    setLoading(true);
    try {
      const body = {
        GradeID: GradeID,
        GradeName: GradeName,
        Basic: parseFloat(Basic),
        HRA: parseFloat(HRA),
        Conveyance: parseFloat(Conveyance),
        Medical: parseFloat(Medical),
        Special_Allowance: parseFloat(Special_Allowance),
        Company_Pf_Contribution: parseFloat(Company_Pf_Contribution),
        Bonus_Arrears: parseFloat(Bonus_Arrears),
        OtherAllowance: parseFloat(Other_Allowance),
        LeaveDeduction: parseFloat(LeaveDeduction),
        otherDeductions: parseFloat(otherDeductions),
        ctc_currency: ctc_currency,
        salary_range_from: parseFloat(SalaryrrangeFrom),
        salary_range_to: parseFloat(SalaryrangeTo),
        minimum_take_salary: parseFloat(minimum_take_salary),
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }
      const response = await fetch(`${config.apiBaseUrl}/GradeSC`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body) // Send company_no and company_name as search criteria
      });
      if (response.ok) {
        const fetchedData = await response.json();
        const newRows = fetchedData.map((matchedItem) => ({


          GradeID: matchedItem.GradeID,
          GradeName: matchedItem.GradeName,
          Basic: matchedItem.Basic,
          HRA: matchedItem.HRA,
          Conveyance: matchedItem.Conveyance,
          Medical: matchedItem.Medical,
          Special_Allowance: matchedItem.Special_Allowance,
          Company_Pf_Contribution: matchedItem.Company_Pf_Contribution,
          Bonus_Arrears: matchedItem.Bonus_Arrears,
          Other_Allowance: matchedItem.Other_Allowance,
          LeaveDeduction: matchedItem.LeaveDeduction,
          otherDeductions: matchedItem.otherDeductions,
          salary_range_from: matchedItem.salary_range_from,
          salary_range_to: matchedItem.salary_range_to,
          ctc_currency: matchedItem.ctc_currency,
          minimum_take_salary: matchedItem.minimum_take_salary,
        }));
        setrowData(newRows);
      } else if (response.status === 404) {
        console.log("Data Not found");
        toast.warning("Data Not found");
        setrowData([]);
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to insert sales data");
        console.error(errorResponse.details || errorResponse.message);
        setrowData([]);
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveEditedData = async (rowData) => {
    showConfirmationToast(
      "Are you sure you want to update the data in the selected rows?",
      async () => {
        try {
          setLoading(true);
          const company_code = sessionStorage.getItem('selectedCompanyCode');
          const modified_by = sessionStorage.getItem('selectedUserCode');

          const dataToSend = {
          editedData: Array.isArray(rowData)
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

          const response = await fetch(`${config.apiBaseUrl}/updateGrade `, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(dataToSend)
          });

          if (response.ok) {
            toast.success("Data updated successfully", {
              onClose: () => handleSearch(), // Runs handleSearch when toast closes
            });
          } else {
            const errorResponse = await response.json();
            toast.warning(errorResponse.message || "Failed to insert sales data");
          }
        } catch (error) {
          console.error("Error deleting rows:", error);
          toast.error('Error Deleting Data: ' + error.message);
        } finally {
          setLoading(false);
        }
      },
      () => {
        toast.info("Data updated cancelled.");
      }
    );
  };

  const deleteSelectedRows = async (rowData) => {

    const company_code = sessionStorage.getItem('selectedCompanyCode');
    const modified_by = sessionStorage.getItem('selectedUserCode');

          const GradeIDDelete = {
          GradeIDToDelete: Array.isArray(rowData)
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

    showConfirmationToast(
      "Are you sure you want to delete the data in the selected rows?",
      async () => {
        try {
          setLoading(true);
          const response = await fetch(`${config.apiBaseUrl}/deleteGrade`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "company_code": company_code,
            },
            body: JSON.stringify(GradeIDDelete),
          });

          if (response.ok) {
            setTimeout(() => {
              toast.success("Data deleted successfully");
              handleSearch();
            }, 3000);
          } else {
            const errorResponse = await response.json();
            toast.warning(errorResponse.message || "Failed to delete data");
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


  // const onCellValueChanged = (params) => {
  //   const updatedRowData = [...rowData];
  //   const rowIndex = updatedRowData.findIndex(
  //     (row) => row.ProjectID === params.data.ProjectID
  //   );
  //   if (rowIndex !== -1) {
  //     updatedRowData[rowIndex][params.colDef.field] = params.newValue;
  //     setrowData(updatedRowData);

  //     // Add the edited row data to the state
  //     setEditedData((prevData) => [...prevData, updatedRowData[rowIndex]]);
  //   }
  // };

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  const getCSSVariable = (variableName) => {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(variableName)
      .trim();
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Grade Details");

    XLSX.writeFile(workbook, "Grade_Details_Search_Report.xlsx");
  };

  return (
    <div class="container-fluid Topnav-screen ">
      {loading && <LoadingScreen />}
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="shadow-lg p-1 bg-light rounded main-header-box">
        <div className="header-flex">
          <h1 className="page-title">Add Grade Details</h1>

          <div className="action-wrapper desktop-actions">
            {saveButtonVisible && (
              <div className="action-icon add" onClick={handleSave}>
                <span className="tooltip">Save</span>
                <i class="fa-solid fa-floppy-disk"></i>
              </div>
            )}
            <div className="action-icon print" onClick={handleReload}>
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
                <li className="dropdown-item" onClick={handleSave}>
                  <i className="fa-solid fa-floppy-disk text-success fs-4"></i>
                </li>
              )}
              {/*})}*/}

              <li className="dropdown-item" onClick={handleReload}>
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
                id=" Grade ID"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the Grade ID"
                value={Gradeid}
                onChange={(e) => setGradeid(e.target.value)}
                // onKeyPress={handleKeyPress}
                maxLength={50}
              />
              <label for="cname" className={` exp-form-labels ${error && !Gradeid ? 'text-danger' : ''}`}>Grade ID<span className="text-danger">*</span></label>
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
                value={Gradename}
                onChange={(e) => setGradename(e.target.value)}
                maxLength={100}
              />
              <label className={` exp-form-labels ${error && !Gradename ? 'text-danger' : ''}`}>  Grade Name<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id=" Basic"
                class="exp-input-field form-control"
                type="number"
                placeholder=""
                required title="Please Enter the Salary Range From Amount"
                value={salaryrrangefrom}
                onChange={(e) => setsalaryrrangefrom(e.target.value)}
              />
              <label className={`exp-form-labels ${error && !salaryrrangefrom ? 'text-danger' : ''}`}>Salary Range From<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="Basic"
                class="exp-input-field form-control"
                type="Number"
                placeholder=""
                required title="Please Enter the Salary Range To Amount"
                value={salaryrangeto}
                onChange={(e) => setsalaryrangeto(e.target.value)}
              />
              <label className={`exp-form-labels ${error && !salaryrangeto ? 'text-danger' : ''}`}>Salary Range To<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id=" Basic"
                class="exp-input-field form-control"
                type="Number"
                placeholder=""
                required title="Please Enter the Basic Amount"
                value={basic}
                onChange={(e) => setbasic(e.target.value)}
              />
              <label className={` exp-form-labels ${error && !basic ? 'text-danger' : ''}`}>Basic<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="HRA "
                class="exp-input-field form-control"
                type="Number"
                placeholder=""
                required title="Please Enter the HRA Allowance Amount"
                value={Hra}
                onChange={(e) => setHra(e.target.value)}
                maxLength={250}
              />
              <label className={`exp-form-labels ${error && !Hra ? 'text-danger' : ''}`}>HRA<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="add3"
                class="exp-input-field form-control"
                type="Number"
                placeholder=""
                required title="Please Enter the Conveyance Allowance Amount"
                value={conveyance}
                onChange={(e) => setconveyance(e.target.value)}
                maxLength={250}
              />
              <label className="exp-form-labels">Conveyance</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="add3"
                class="exp-input-field form-control"
                type="Number"
                placeholder=""
                required title="Please Enter the Medical Allowance Amount"
                value={medical}
                onChange={(e) => setmedical(e.target.value)}
              />
              <label className="exp-form-labels">Medical</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="add3"
                class="exp-input-field form-control"
                type="Number"
                placeholder=""
                required title="Please Enter the Special Allowance"
                value={SpecialAllowance}
                onChange={(e) => setSpecialAllowance(e.target.value)}
              />
              <label className={` exp-form-labels ${error && !SpecialAllowance ? 'text-danger' : ''}`}>Special Allowance<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="add3"
                class="exp-input-field form-control"
                type="Number"
                placeholder=""
                required title="Please Enter the  Company PF Contribution"
                value={CompanyPfContribution}
                onChange={(e) => setCompanyPfContribution(e.target.value)}
              />
              <label className={` exp-form-labels ${error && !CompanyPfContribution ? 'text-danger' : ''}`}>  Company PF Contribution<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="add3"
                class="exp-input-field form-control"
                type="Number"
                placeholder=""
                required title="Please Enter the Bonus / Arrears"
                value={BonusArrears}
                onChange={(e) => setBonusArrears(e.target.value)}
              />
              <label className="exp-form-labels"> Bonus / Arrears</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="add3"
                class="exp-input-field form-control"
                type="Number"
                placeholder=""
                required title="Please Enter the Other Allowance"
                value={OtherAllowance}
                onChange={(e) => setOtherAllowance(e.target.value)}
              />
              <label className="exp-form-labels"> Other Allowance</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="add3"
                class="exp-input-field form-control"
                type="Number"
                placeholder=""
                required title="Please Enter the Leave Deductions"
                value={Leavededuction}
                onChange={(e) => setLeavededuction(e.target.value)}
                maxLength={250}
              />
              <label className="exp-form-labels"> Leave Deductions</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="add3"
                class="exp-input-field form-control"
                type="Number"
                placeholder=""
                required title="Please Enter the Other Deductions"
                value={otherdeductions}
                onChange={(e) => setotherdeductions(e.target.value)}
              />
              <label className="exp-form-labels">  Other Deductions</label>
            </div>
          </div>

          {/* <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="add3"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the CTC Currency"
                value={ctccurrency}
                onChange={(e) => setCurrency(e.target.value)}
                maxLength={10}
              />
              <label className={` exp-form-labels ${error && !ctccurrency ? 'text-danger' : ''}`}> CTC Currency<span className="text-danger">*</span></label>
            </div>
          </div> */}

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedCTCCurrency ? "has-value" : ""} 
              ${isSelectedCTCCurrency ? "is-focused" : ""}`}
              title="Please select the CTC Currency"
            >
              <Select
                id="country"
                type="text"
                classNamePrefix="react-select"
                placeholder=""
                onFocus={() => setIsSelectedCTCCurrency(true)}
                onBlur={() => setIsSelectedCTCCurrency(false)}
                isClearable
                value={selectedCTCCurrency}
                onChange={handleChangeCTCCurrency}
                options={filteredOptionCTCCurrency}
              />
              <label for="sname" className={`floating-label ${error && !ctccurrency ? 'text-danger' : ''}`}>CTC Currency<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="add3"
                class="exp-input-field form-control"
                type="Number"
                placeholder=""
                required title="Please Enter the  Minimum Take Salary"
                value={minimumtakesalary}
                onChange={(e) => setMinimumSalary(e.target.value)}
              />
              <label className="exp-form-labels">Minimum Take Salary</label>
            </div>
          </div>

        </div>
      </div>

      <div className="shadow-lg p-3 bg-light rounded mt-2 container-form-box">
        <div className="header-flex">
          <h5 className="">Search Criteria:</h5>
        </div>
        <div className="row g-3">

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id=" GradeID"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the Grade ID"
                value={GradeID}
                onChange={(e) => setGradeID(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <label className="exp-form-labels">Grade ID</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="GradeName"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the Grade Name"
                value={GradeName}
                onChange={(e) => setGradeName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <label className="exp-form-labels">Grade Name</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id=" Basic"
                class="exp-input-field form-control"
                type="number"
                placeholder=""
                required title="Please Enter the Salary Range Amount"
                value={SalaryrrangeFrom}
                onChange={(e) => setSalaryrrangeFrom(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <label className="exp-form-labels">Salary Range From</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="Basic"
                class="exp-input-field form-control"
                type="Number"
                placeholder=""
                required title="Please Enter the Salary Range Amount"
                value={SalaryrangeTo}
                onChange={(e) => setSalaryrangeTo(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <label className="exp-form-labels">Salary Range To</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id=" Basic"
                class="exp-input-field form-control"
                type="Number"
                placeholder=""
                required title="Please Enter the Basic Amount"
                value={Basic}
                onChange={(e) => setBasic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <label className="exp-form-labels">Basic</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="HRA"
                class="exp-input-field form-control"
                type="Number"
                placeholder=""
                required title="Please Enter the HRA Allowance Amount"
                value={HRA}
                onChange={(e) => setHRA(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                maxLength={250}
              />
              <label className="exp-form-labels">HRA</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="Conveyance"
                class="exp-input-field form-control"
                type="Number"
                placeholder=""
                required title="Please Enter the Conveyance Allowance Amount"
                value={Conveyance}
                onChange={(e) => setConveyance(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                maxLength={250}
              />
              <label className="exp-form-labels">Conveyance</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="Medical"
                class="exp-input-field form-control"
                type="Number"
                placeholder=""
                required title="Please Enter the Medical Allowance Amount"
                value={Medical}
                onChange={(e) => setMedical(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <label className="exp-form-labels">Medical</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="Special_Allowance"
                class="exp-input-field form-control"
                type="Number"
                placeholder=""
                required title="Please Enter the Special Allowance"
                value={Special_Allowance}
                onChange={(e) => setSpecial_Allowance(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <label className="exp-form-labels"> Special Allowance</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="Company_Pf_Contribution"
                class="exp-input-field form-control"
                type="Number"
                placeholder=""
                required title="Please Enter the Company PF Contribution"
                value={Company_Pf_Contribution}
                onChange={(e) => setCompany_Pf_Contribution(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <label className="exp-form-labels"> Company PF Contribution</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="Bonus_Arrears"
                class="exp-input-field form-control"
                type="Number"
                placeholder=""
                required title="Please Enter the Bonus / Arrears"
                value={Bonus_Arrears}
                onChange={(e) => setBonus_Arrears(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <label className="exp-form-labels"> Bonus / Arrears</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="Other_Allowance"
                class="exp-input-field form-control"
                type="Number"
                placeholder=""
                required title="Please Enter the Other Allowance"
                value={Other_Allowance}
                onChange={(e) => setOther_Allowance(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <label className="exp-form-labels"> Other Allowance</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="LeaveDeduction"
                class="exp-input-field form-control"
                type="Number"
                placeholder=""
                required title="Please Enter the Leave Deductions"
                value={LeaveDeduction}
                onChange={(e) => setLeaveDeduction(e.target.value)}
                maxLength={250}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <label className="exp-form-labels">Leave Deductions</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="otherDeductions"
                class="exp-input-field form-control"
                type="Number"
                placeholder=""
                required title="Please Enter the Other Deductions"
                value={otherDeductions}
                onChange={(e) => setotherDeductions(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <label className="exp-form-labels"> Other Deductions</label>
            </div>
          </div>

          {/* <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="ctc_currency"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the CTC Currency"
                value={ctc_currency}
                onChange={(e) => setCtcCurrency(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <label className="exp-form-labels">  CTC Currency</label>
            </div>
          </div> */}

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedCTCCurrencySc ? "has-value" : ""} 
              ${isSelectedCTCCurrencySc ? "is-focused" : ""}`}
              title="Please select the CTC Currency"
            >
              <Select
                id="country"
                type="text"
                classNamePrefix="react-select"
                placeholder=""
                onFocus={() => setIsSelectedCTCCurrencySc(true)}
                onBlur={() => setIsSelectedCTCCurrencySc(false)}
                isClearable
                value={selectedCTCCurrencySc}
                onChange={handleChangeCTCCurrencySc}
                options={filteredOptionCTCCurrencySc}
              />
              <label for="sname" className={`floating-label`}>CTC Currency</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="minimum_take_salary"
                class="exp-input-field form-control"
                type="Number"
                placeholder=""
                required title="Please Enter the Minimum Take Salary"
                value={minimum_take_salary}
                onChange={(e) => setMinimumTakeSalary(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <label className="exp-form-labels"> Minimum Take Salary</label>
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
  );
}
export default Input;
