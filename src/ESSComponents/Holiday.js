import { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { showConfirmationToast } from '../ToastConfirmation';
import Select from "react-select";
import * as XLSX from "xlsx-js-style";
import LoadingScreen from '../Loading';
const config = require('../Apiconfig');

const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

function HoliDays() {
  const [HolidayDate, setHolidayDate] = useState("");
  const [error, setError] = useState("");
  const [Description, setDescription] = useState("");
  const [rowData, setRowData] = useState([]);
  const [startdate, setstartdate] = useState(getTodayDate)
  const [enddate, setenddate] = useState(getTodayDate);
  const [description, setdescription] = useState("");
  const [showAsterisk, setShowAsterisk] = useState(true);

  const [holidayName, setHolidayName] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [locationId, setLocationId] = useState('');
  const [holidayType, setHolidayType] = useState('');
  const [selectedHolidayType, setSelectedHolidayType] = useState('');
  const [holidayTypeDrop, setHolidayTypeDrop] = useState([]);
  const [holidayTypeDropGrid, setHolidayTypeDropGrid] = useState([]);
  const [isPaid, setIsPaid] = useState('');
  const [selectedIsPaid, setSelectedIsPaid] = useState('');
  const [isPaidDrop, setIsPaidDrop] = useState([]);
  const [isPaidDropGrid, setIsPaidDropGrid] = useState([]);
  const [status, setStatus] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [statusDrop, setStatusDrop] = useState([]);
  const [statusDropGrid, setStatusDroGrid] = useState([]);

  const [holidayNameSc, setHolidayNameSc] = useState('');
  const [countryCodeSc, setCountryCodeSc] = useState('');
  const [locationIdSc, setLocationIdSc] = useState('');
  const [holidayTypeSc, setHolidayTypeSc] = useState('');
  const [selectedHolidayTypeSc, setSelectedHolidayTypeSc] = useState('');
  const [holidayTypeDropSc, setHolidayTypeDropSc] = useState([]);
  const [isPaidSc, setIsPaidSc] = useState('');
  const [selectedIsPaidSc, setSelectedIsPaidSc] = useState('');
  const [isPaidDropSc, setIsPaidDropSc] = useState([]);
  const [statusSc, setStatusSc] = useState('');
  const [selectedStatusSc, setSelectedStatusSc] = useState('');
  const [statusDropSc, setStatusDropSc] = useState([]);

  const [isSelectStatus, setIsSelectStatus] = useState(false);
  const [isSelectStatusSC, setIsSelectStatusSC] = useState(false);
  const [isSelectIsPaid, setIsSelectIsPaid] = useState(false);
  const [isSelectIsPaidSc, setIsSelectIsPaidSc] = useState(false);
  const [isSelectHolidayType, setIsSelectHolidayType] = useState(false);
  const [isSelectHolidayTypeSc, setIsSelectHolidayTypeSc] = useState(false);
  const [loading, setLoading] = useState(false);
  

  const searchClearInputFields = () => {
    setstartdate("");
    setenddate("");
    setHolidayNameSc("");
    setCountryCodeSc("");
    setLocationIdSc("");
    setSelectedHolidayTypeSc("");
    setHolidayTypeSc("");
    setSelectedIsPaidSc("");
    setIsPaidSc("");
    setSelectedStatusSc("");
    setStatusSc("");
  };

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    fetch(`${config.apiBaseUrl}/getboolean`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => setIsPaidDrop(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    fetch(`${config.apiBaseUrl}/getboolean`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => setIsPaidDropSc(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    fetch(`${config.apiBaseUrl}/getboolean`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((response) => response.json())
      .then((data) => {
        const isPaidOption = data.map(option => option.attributedetails_name);
        setIsPaidDropGrid(isPaidOption);
      })
      .catch((error) => console.error('Error fetching data:', error));
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
      .then((val) => setStatusDrop(val))
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
      .then((data) => data.json())
      .then((val) => setStatusDropSc(val))
      .catch((error) => console.error("Error fetching data:", error));
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
        const statusOption = data.map(option => option.attributedetails_name);
        setStatusDroGrid(statusOption);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    fetch(`${config.apiBaseUrl}/getHolidayType`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => setHolidayTypeDrop(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    fetch(`${config.apiBaseUrl}/getHolidayType`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => setHolidayTypeDropSc(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    fetch(`${config.apiBaseUrl}/getHolidayType`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((response) => response.json())
      .then((data) => {
        const holidayTypeOption = data.map(option => option.attributedetails_name);
        setHolidayTypeDropGrid(holidayTypeOption);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const filteredOptionIsPaid = isPaidDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionIsPaidSc = isPaidDropSc.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionHolidayType = holidayTypeDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionHolidayTypeSc = holidayTypeDropSc.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionStatus = statusDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionStatusSc = statusDropSc.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleChangeIsPaid = (selectedIsPaid) => {
    setSelectedIsPaid(selectedIsPaid);
    setIsPaid(selectedIsPaid ? selectedIsPaid.value : "");
  };

  const handleChangeIsPaidSc = (selectedIsPaidSc) => {
    setSelectedIsPaidSc(selectedIsPaidSc);
    setIsPaidSc(selectedIsPaidSc ? selectedIsPaidSc.value : "");
  };

  const handleChangeHolidayType = (selectedHolidayType) => {
    setSelectedHolidayType(selectedHolidayType);
    setHolidayType(selectedHolidayType ? selectedHolidayType.value : "");
  };

  const handleChangeHolidayTypeSc = (selectedHolidayTypeSc) => {
    setSelectedHolidayTypeSc(selectedHolidayTypeSc);
    setHolidayTypeSc(selectedHolidayTypeSc ? selectedHolidayTypeSc.value : "");
  };

  const handleChangeStatus = (selectedStatus) => {
    setSelectedStatus(selectedStatus);
    setStatus(selectedStatus ? selectedStatus.value : "");
  };

  const handleChangeStatusSc = (selectedStatusSc) => {
    setSelectedStatusSc(selectedStatusSc);
    setStatusSc(selectedStatusSc ? selectedStatusSc.value : "");
  };

  const columnDefs = [
    {
      headerName: "Actions",
      field: "actions",
      editedData: "true",
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
      headerName: "Holiday ID",
      field: "Holiday_ID",
      editable: false,
      cellStyle: { textAlign: "center" },
    },
    {
      headerName: "Holiday Name",
      field: "Holiday_Name",
      editable: true,
      cellStyle: { textAlign: "center" },
    },
    {
      headerName: "Holiday Date",
      field: "Holiday_Date",
      filter: "agDateColumnFilter",
      editable: true,
      cellStyle: { textAlign: "center" },
    },
    {
      headerName: "Holiday Type",
      field: "Holiday_Type",
      editable: true,
      cellStyle: { textAlign: "center" },
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: holidayTypeDropGrid,
      },
    },
    {
      headerName: "Country Code",
      field: "Country_Code",
      editable: true,
      cellStyle: { textAlign: "center" },
    },
    {
      headerName: "Location ID",
      field: "Location_ID",
      editable: true,
      cellStyle: { textAlign: "center" },
    },
    {
      headerName: "Is Paid",
      field: "Is_Paid",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellStyle: { textAlign: "center" },
      cellEditorParams: {
        values: isPaidDropGrid,
      },
    },
    {
      headerName: "Status",
      field: "Status",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellStyle: { textAlign: "center" },
      cellEditorParams: {
        values: statusDropGrid,
      },
    },
  ]

  const gridOptions = {
    pagination: true,
    paginationPageSize: 10,
  };

  const reloadGridData = () => {
    setRowData([]);
    searchClearInputFields();
  };

  const handleReload = () => {
    window.location.reload();
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getsearchHoliday`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          StartDate: startdate,
          EndDate: enddate,
          Country_Code: countryCodeSc,
          Location_ID: locationIdSc,
          Holiday_Name: holidayNameSc,
          Holiday_Type: holidayTypeSc,
          Is_Paid: isPaidSc,
          Status: statusSc,
          company_code: sessionStorage.getItem("selectedCompanyCode"),
        }),
      });

      if (response.ok) {
        const resultData = await response.json();
        setRowData(resultData);
      } else if (response.status === 404) {
        setRowData([]);
        toast.warning("Data not found");
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
      toast.error("Error fetching search data: " + error.message);
    }
  };

  const handleSave = async () => {
    if (!HolidayDate || !holidayName || !status || !holidayType || !isPaid) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }

    try {
      const Header = {
        Holiday_Date: HolidayDate,
        Country_Code: countryCode,
        Location_ID: locationId,
        Holiday_Name: holidayName,
        Holiday_Type: holidayType,
        Is_Paid: isPaid,
        Status: status,
        company_code: sessionStorage.getItem("selectedCompanyCode"),
        created_by: sessionStorage.getItem('selectedUserCode'),
      };

      const response = await fetch(`${config.apiBaseUrl}/addEmployeeHoliday`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Header),
      });

      if (response.ok) {
        console.log("Data inserted successfully");
        toast.success("Data inserted successfully!", {
          onClose: () => window.location.reload(),
        });
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to insert Holiday data");
        console.error(errorResponse.details || errorResponse.message);
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error('Error inserting data: ' + error.message);
    }
  };

  const saveEditedData = async (rowData) => {
    showConfirmationToast(
      "Are you sure you want to update the data in the selected rows?",
      async () => {
        try {

          const company_code = sessionStorage.getItem("selectedCompanyCode");
          const modified_by = sessionStorage.getItem('selectedUserCode');

          const dataToSend = {
            editedData: Array.isArray(rowData)
              ? rowData.map((row) => ({
                ...row,
                modified_by,
                company_code
              }))
              : [
                {
                  ...rowData,
                  modified_by,
                  company_code
                },
              ],
          };

          const response = await fetch(`${config.apiBaseUrl}/updateEmployeeHoliday`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
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
        }
      },
      () => {
        toast.info("Data updated cancelled.");
      }
    );
  };


  const deleteSelectedRows = async (rowData) => {
    showConfirmationToast(
      "Are you sure you want to Delete the data in the selected rows?",
      async () => {
        try {
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

          const response = await fetch(`${config.apiBaseUrl}/deleteEmployeeHoliday`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "company_code": company_code
            },
            body: JSON.stringify(dataToSend)
          });

          if (response.ok) {
            toast.success("Data deleted successfully", {
              onClose: () => handleSearch(),
            });
          } else {
            const errorResponse = await response.json();
            toast.warning(errorResponse.message || "Failed to insert sales data");
          }
        } catch (error) {
          console.error("Error deleting rows:", error);
          toast.error('Error Deleting Data: ' + error.message);
        }
      },
      () => {
        toast.info("Data Delete cancelled.");
      }
    );
  };

  const getCSSVariable = (variableName) => {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(variableName)
      .trim();
  };

  const transformRowData = (data) => {
    return data.map((row) => ({
      "Holiday ID": row.Holiday_ID || "",
      "Holiday Name": row.Holiday_Name || "",
      "Holiday Date": row.Holiday_Date || "",
      "Holiday Type": row.Holiday_Type || "",
      "Country Code": row.Country_Code || "",
      "Location ID": row.Location_ID || "",
      "Is Paid": row.Is_Paid || "",
      "Status": row.Status || "",
    }));
  };

  const handleExportToExcel = () => {
    if (!rowData || rowData.length === 0) {
      toast.warning("There is no data to export.");
      return;
    }

    const screenName = "Employee Holiday Search Report";
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employee Holiday");

    XLSX.writeFile(workbook, "Employee_Holiday_Search_Report.xlsx");
  };

  return (
    <div className="container-fluid Topnav-screen">
      {loading && <LoadingScreen />}
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="shadow-lg p-1 bg-light rounded main-header-box">
        <div className="header-flex">
          <h1 className="page-title">Employee Holiday</h1>
          <div className="action-wrapper desktop-actions">
            <div className="action-icon add" onClick={handleSave}>
              <span className="tooltip">save</span>
              <i class="fa-solid fa-floppy-disk"></i>
            </div>
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

              <li className="dropdown-item" onClick={handleSave}>
                <i className="fa-solid fa-floppy-disk text-success fs-4"></i>
              </li>

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
                id="HolidayDate"
                class="exp-input-field form-control"
                type="Date"
                placeholder=""
                required
                title="Please Enter the Holiday Date"
                value={HolidayDate}
                onChange={(e) => setHolidayDate(e.target.value)}
              />
              <label for="add1" className={` exp-form-labels ${error && !HolidayDate ? 'text-danger' : ''}`}>Holiday Date<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="Description"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required
                title="Please Enter the Holiday Name"
                value={holidayName}
                onChange={(e) => setHolidayName(e.target.value)}
                maxLength={255}
              />
              <label for="cname" className={` exp-form-labels ${error && !holidayName ? 'text-danger' : ''}`}>Holiday Name<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="Description"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required
                title="Please Enter the Country Code"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                maxLength={255}
              />
              <label for="cname" className={`exp-form-labels`}>Country Code</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="Description"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                maxLength={15}
                inputMode="numeric"
                pattern="[0-9]*"
                required
                title="Please Enter the Location ID"
                value={locationId}
                onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setLocationId(value);
                }}
              />
              <label for="cname" className={`exp-form-labels`}>Location ID</label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedHolidayType ? "has-value" : ""} 
              ${isSelectHolidayType ? "is-focused" : ""}`}
              title="Please Select the Holiday Type"
            >
              <Select
                id="status"
                isClearable
                value={selectedHolidayType}
                onChange={handleChangeHolidayType}
                options={filteredOptionHolidayType}
                classNamePrefix="react-select"
                placeholder=""
                onFocus={() => setIsSelectHolidayType(true)}
                onBlur={() => setIsSelectHolidayType(false)}
              />
              <label className={`floating-label ${error && !holidayType ? 'text-danger' : ''}`}>Holiday Type<span className="text-danger">*</span></label>
            </div>
          </div>

          {/* <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="Description"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required
                title="Please Enter the Description"
                value={description}
                onChange={(e) => setdescription(e.target.value)}
                maxLength={255}
              />
              <label for="cname" className={` exp-form-labels ${error && !description ? 'text-danger' : ''}`}>Description{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div> */}

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedIsPaid ? "has-value" : ""} 
              ${isSelectIsPaid ? "is-focused" : ""}`}
              title="Please Select the Is Paid"
            >
              <Select
                id="status"
                isClearable
                value={selectedIsPaid}
                onChange={handleChangeIsPaid}
                options={filteredOptionIsPaid}
                classNamePrefix="react-select"
                placeholder=""
                onFocus={() => setIsSelectIsPaid(true)}
                onBlur={() => setIsSelectIsPaid(false)}
              />
              <label className={`floating-label ${error && !isPaid ? 'text-danger' : ''}`}>Is Paid<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedStatus ? "has-value" : ""} 
              ${isSelectStatus ? "is-focused" : ""}`}
              title="Please Select the Status"
            >
              <Select
                id="status"
                isClearable
                value={selectedStatus}
                onChange={handleChangeStatus}
                options={filteredOptionStatus}
                classNamePrefix="react-select"
                placeholder=""
                onFocus={() => setIsSelectStatus(true)}
                onBlur={() => setIsSelectStatus(false)}
              />
              <label className={`floating-label ${error && !status ? 'text-danger' : ''}`}>Status<span className="text-danger">*</span></label>
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
                id="startdate"
                class="exp-input-field form-control"
                type="date"
                placeholder=""
                required title="Please Enter the Start Date"
                value={startdate}
                onChange={(e) => setstartdate(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <label for="add1" className="exp-form-labels">Start Date</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="enddate"
                class="exp-input-field form-control"
                type="date"
                placeholder=""
                required title="Please Enter the End Date"
                value={enddate}
                onChange={(e) => setenddate(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <label for="add1" className="exp-form-labels">End Date</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="Description"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required
                title="Please Enter the Holiday Name"
                value={holidayNameSc}
                onChange={(e) => setHolidayNameSc(e.target.value)}
                maxLength={255}
              />
              <label for="cname" className={` exp-form-labels`}>Holiday Name</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="Description"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required
                title="Please Enter the Country Code"
                value={countryCodeSc}
                onChange={(e) => setCountryCodeSc(e.target.value)}
                maxLength={255}
              />
              <label for="cname" className={`exp-form-labels`}>Country Code</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="Description"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required
                title="Please Enter the Location ID"
                value={locationIdSc}
                onChange={(e) => setLocationIdSc(e.target.value)}
                maxLength={255}
              />
              <label for="cname" className={`exp-form-labels`}>Location ID</label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedHolidayTypeSc ? "has-value" : ""} 
              ${isSelectHolidayTypeSc ? "is-focused" : ""}`}
              title="Please Select the Holiday Type"
            >
              <Select
                id="status"
                isClearable
                value={selectedHolidayTypeSc}
                onChange={handleChangeHolidayTypeSc}
                options={filteredOptionHolidayTypeSc}
                classNamePrefix="react-select"
                placeholder=""
                onFocus={() => setIsSelectHolidayTypeSc(true)}
                onBlur={() => setIsSelectHolidayTypeSc(false)}
              />
              <label className={`floating-label`}>Holiday Type</label>
            </div>
          </div>

          {/* <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="Description"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required
                title="Please Enter the Description"
                value={description}
                onChange={(e) => setdescription(e.target.value)}
                maxLength={255}
              />
              <label for="cname" className={` exp-form-labels ${error && !description ? 'text-danger' : ''}`}>Description{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div> */}

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedIsPaidSc ? "has-value" : ""} 
              ${isSelectIsPaidSc ? "is-focused" : ""}`}
              title="Please Select the Is Paid"
            >
              <Select
                id="status"
                isClearable
                value={selectedIsPaidSc}
                onChange={handleChangeIsPaidSc}
                options={filteredOptionIsPaidSc}
                classNamePrefix="react-select"
                placeholder=""
                onFocus={() => setIsSelectIsPaidSc(true)}
                onBlur={() => setIsSelectIsPaidSc(false)}
              />
              <label className={`floating-label`}>Is Paid</label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedStatusSc ? "has-value" : ""} 
              ${isSelectStatusSC ? "is-focused" : ""}`}
              title="Please Select the Status"
            >
              <Select
                id="status"
                isClearable
                value={selectedStatusSc}
                onChange={handleChangeStatusSc}
                options={filteredOptionStatusSc}
                classNamePrefix="react-select"
                placeholder=""
                onFocus={() => setIsSelectStatusSC(true)}
                onBlur={() => setIsSelectStatusSC(false)}
              />
              <label className={`floating-label`}>Status</label>
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
            rowSelection="multiple"
            pagination={true}
            paginationAutoPageSize={true}
            gridOptions={gridOptions}
          />
        </div>
      </div>
    </div>
  )
}

export default HoliDays;