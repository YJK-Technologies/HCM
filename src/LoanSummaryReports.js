import { useState, useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "./App.css";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingScreen from "./Loading";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx-js-style";

const config = require("./Apiconfig");

function LoanSummaryReports() {
  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const gridApiRef = useRef(null);

  const [requestNumber, setrequestNumber] = useState("");
  const [FromDate, setFromDate] = useState("");
  const [ToDate, setToDate] = useState("");
  const [EmployeeID, setEmployeeID] = useState("");
  const [First_Name, setFirst_Name] = useState("");
  const [Last_Name, setLast_Name] = useState("");
  const [loan_amount, setloan_amount] = useState("");
  const [repayment_months, setrepayment_months] = useState("");
  const [monthly_installment, setmonthly_installment] = useState("");
  const [selectedLoanTypeNameSc, setSelectedLoanTypeNameSc] = useState("");
  const [loanTypeNameSc, setLoanTypeNameSc] = useState("");
  const [loanTypeNameDropSc, setLoanTypeNameDropSc] = useState([]);
  const [isSelectedLoanTypeNameSc, setIsSelectedLoanTypeNameSc] = useState(false);
  const [selectedReqStatusSc, setSelectedReqStatusSc] = useState("");
  const [isSelectedReqStatusSc, setIsSelectedReqStatusSc] = useState(false);
  const [reqStatusDropSc, setReqStatusDropSc] = useState([]);
  const [reqStatusSc, setReqStatusSc] = useState('');
  const [reqStatusDropGrid, setReqStatusDropGrid] = useState([]);

  //purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem("permissions")) || {};
  const companyPermissions = permissions
    .filter((permission) => permission.screen_type === "CandidateInterviewRe")
    .map((permission) => permission.permission_type.toLowerCase());

  const handleChangeLoanTypeSc = (selectedLoanTypeNameSc) => {
    setSelectedLoanTypeNameSc(selectedLoanTypeNameSc);
    setLoanTypeNameSc(
      selectedLoanTypeNameSc ? selectedLoanTypeNameSc.value : "",
    );
  };

  const filteredOptionLoanTypeSc = Array.isArray(loanTypeNameDropSc)
    ? loanTypeNameDropSc.map((option) => ({
      value: option?.attributedetails_name,
      label: option?.attributedetails_name,
    }))
    : [];

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");
    fetch(`${config.apiBaseUrl}/getLoanTypes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => setLoanTypeNameDropSc(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleChangeReqStatusSc = (selectedReqStatusSc) => {
    setSelectedReqStatusSc(selectedReqStatusSc);
    setReqStatusSc(selectedReqStatusSc ? selectedReqStatusSc.value : "");
  };

  const filteredOptionReqStatusSc = Array.isArray(reqStatusDropSc)
    ? [
      { value: "All", label: "All" },
      ...reqStatusDropSc.map((option) => ({
        value: option?.attributedetails_name,
        label: option?.attributedetails_name,
      })),
    ]
    : [{ value: "All", label: "All" }];

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    fetch(`${config.apiBaseUrl}/getLeaveStatus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setReqStatusDropSc(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    fetch(`${config.apiBaseUrl}/getLeaveStatus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => {
        const reqStatus = val.map(option => option.attributedetails_name);
        setReqStatusDropGrid(reqStatus);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleSearch = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `${config.apiBaseUrl}/GetLoanSummaryReport`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            company_code: sessionStorage.getItem("selectedCompanyCode"),

            // Text filters
            request_number: requestNumber?.trim() || "",
            EmployeeId: EmployeeID?.trim() || "",
            First_Name: First_Name?.trim() || "",
            Last_Name: Last_Name?.trim() || "",
            Loan_Type_Name: loanTypeNameSc?.trim() || "",
            request_status: reqStatusSc || "",

            // Numeric filters
            loan_amount: loan_amount ? Number(loan_amount) : 0,
            repayment_months: repayment_months ? Number(repayment_months) : 0,
            monthly_installment: monthly_installment
              ? Number(monthly_installment)
              : 0,

            // Date filters
            from_date: FromDate || null,
            to_date: ToDate || null,
          }),
        },
      );

      if (response.ok) {
        const searchData = await response.json();
        setRowData(searchData);
        console.log("Loan summary fetched successfully");
      } else if (response.status === 404) {
        toast.warning("Data not found");
        setRowData([]);
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Search failed");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error fetching data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

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
      headerName: "Request Number",
      field: "request_number",
      editable: false,
    },
    {
      headerName: "Employee ID",
      field: "EmployeeId",
      editable: false,
    },
    {
      headerName: "First Name",
      field: "First_Name",
      editable: false,
    },
    {
      headerName: "Last Name",
      field: "Last_Name",
      editable: false,
    },
    {
      headerName: "Loan Type Name",
      field: "loan_type_name",
      editable: false,
    },
    {
      headerName: "Loan Amount",
      field: "loan_amount",
      editable: false,
    },
    {
      headerName: "Monthly Installment",
      field: "monthly_installment",
      editable: false,
    },
    {
      headerName: "Repayment Months",
      field: "repayment_months",
      editable: false,
    },
    {
      headerName: "Request Status",
      field: "request_status",
      editable: false,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: reqStatusDropGrid,
      },
    },
    {
      headerName: "Created Date",
      field: "created_date",
      editable: false,
    },

    {
      headerName: "Keyfield",
      field: "keyfield",
      editable: false,
      hide: true,
    },
  ];

  const gridOptions = {
    pagination: true,
    paginationPageSize: 10,
  };

  const defaultColDef = {
    resizable: true,
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    gridApiRef.current = params.api;
  };

  const generateReport = () => {
    if (!gridApi) return;

    const selectedRows = gridApi.getSelectedRows();
    if (selectedRows.length === 0) {
      toast.warning("Please select at least one row to print");
      return;
    }

    const reportWindow = window.open("", "_blank");

    reportWindow.document.write(`
    <html>
    <head>
      <title>Loan Summary Report</title>
      <style>
        body { font-family: Arial; padding: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 8px; border: 1px solid #ccc; }
        th { background: #333; color: white; }
      </style>
    </head>
    <body>

      <h2 style="text-align:center;">Loan Summary Report</h2>
      <p>Total Records: ${selectedRows.length}</p>

      <table>
        <thead>
          <tr>
            <th>Request No</th>
            <th>Employee ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Loan Type</th>
            <th>Amount</th>
            <th>Installment</th>
            <th>Months</th>
            <th>Status</th>
            <th>Created Date</th>
          </tr>
        </thead>
        <tbody>
  `);

    selectedRows.forEach((row) => {
      reportWindow.document.write(`
      <tr>
        <td>${row.request_number}</td>
        <td>${row.EmployeeId}</td>
        <td>${row.First_Name}</td>
        <td>${row.Last_Name}</td>
        <td>${row.loan_type_name}</td>
        <td>${row.loan_amount}</td>
        <td>${row.monthly_installment}</td>
        <td>${row.repayment_months}</td>
        <td>${row.request_status}</td>
        <td>${formatDate(row.created_date)}</td>
      </tr>
    `);
    });

    reportWindow.document.write(`
        </tbody>
      </table>
      <script>window.print()</script>
    </body>
    </html>
  `);

    reportWindow.document.close();
  };

  const reloadGridData = () => {
    window.location.reload();
  };

  const getCSSVariable = (variableName) => {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(variableName)
      .trim();
  };

  // Convert HEX color to RGB array (jsPDF needs RGB)
  const hexToRgb = (hex) => {
    const cleanHex = hex.replace("#", "");
    const num = parseInt(cleanHex, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  };

  const exportToPDF = () => {
    if (!gridApiRef.current || rowData.length === 0) {
      toast.warning("No data to export");
      return;
    }

    const selectedRows = gridApiRef.current.getSelectedRows();
    const dataSource = selectedRows.length > 0 ? selectedRows : rowData;

    const doc = new jsPDF("l", "pt", "a4");

    const headers = [[
      "Request No",
      "Employee ID",
      "First Name",
      "Last Name",
      "Loan Type",
      "Amount",
      "Installment",
      "Months",
      "Status",
      "Created Date"
    ]];

    const body = dataSource.map(row => [
      row.request_number,
      row.EmployeeId,
      row.First_Name,
      row.Last_Name,
      row.loan_type_name,
      row.loan_amount,
      row.monthly_installment,
      row.repayment_months,
      row.request_status,
      formatDate(row.created_date)
    ]);

    doc.text("Loan Summary Report", 40, 40);

    autoTable(doc, {
      startY: 60,
      head: headers,
      body: body,
    });

    doc.save("Loan_Summary_Report.pdf");
  };

  const handleExportToExcel = () => {
    if (!gridApiRef.current) return;

    const selectedRows = gridApiRef.current.getSelectedRows();

    // ✅ Use selected rows OR fallback to all data
    const dataSource =
      selectedRows.length > 0 ? selectedRows : rowData;

    if (!dataSource || dataSource.length === 0) {
      toast.warning("No data to export");
      return;
    }

    const transformedData = dataSource.map((row) => ({
      "Request No": row.request_number,
      "Employee ID": row.EmployeeId,
      "First Name": row.First_Name,
      "Last Name": row.Last_Name,
      "Loan Type": row.loan_type_name,
      "Loan Amount": row.loan_amount,
      "Monthly Installment": row.monthly_installment,
      "Repayment Months": row.repayment_months,
      "Status": row.request_status,
      "Created Date": row.created_date,
    }));

    const worksheet = XLSX.utils.json_to_sheet(transformedData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Loan Summary");

    XLSX.writeFile(workbook, "Loan_Summary_Report.xlsx");
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
          <h1 className="page-title">Loan Summary Report</h1>

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

      <div className="shadow-lg p-3 bg-light rounded mt-2 container-form-box">
        <div className="row g-3">

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                title="Please Enter the Request Number"
                required
                autoComplete="off"
                value={requestNumber}
                onChange={(e) => setrequestNumber(e.target.value)}
              />
              <label for="add1" className={`exp-form-labels`}>
                Request Number
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
                title="Please Enter the Employee ID"
                required
                autoComplete="off"
                value={EmployeeID}
                onChange={(e) => setEmployeeID(e.target.value)}
              />
              <label for="add1" className={`exp-form-labels`}>
                Employee ID
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
                title="Please Enter the First Name"
                required
                autoComplete="off"
                value={First_Name}
                onChange={(e) => setFirst_Name(e.target.value)}
              />
              <label for="add1" className={`exp-form-labels`}>
                First Name
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
                title="Please Enter the Last Name"
                required
                autoComplete="off"
                value={Last_Name}
                onChange={(e) => setLast_Name(e.target.value)}
              />
              <label for="add1" className={`exp-form-labels`}>
                Last Name
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
                  ${selectedLoanTypeNameSc ? "has-value" : ""} 
                  ${isSelectedLoanTypeNameSc ? "is-focused" : ""}`}
              title="Please enter the Loan Type Name"
            >
              <Select
                id="country"
                type="text"
                classNamePrefix="react-select"
                placeholder=""
                onFocus={() => setIsSelectedLoanTypeNameSc(true)}
                onBlur={() => setIsSelectedLoanTypeNameSc(false)}
                isClearable
                maxLength={100}
                value={selectedLoanTypeNameSc}
                onChange={handleChangeLoanTypeSc}
                options={filteredOptionLoanTypeSc}
              />
              <label for="sname" className={`floating-label`}>
                Loan Type Name
              </label>
            </div>
          </div>

          {/* <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedStatus ? "has-value" : ""} 
              ${isSelectStatus ? "is-focused" : ""}`}
            >
              <Select
                id="status"
                isClearable
                value={selectedStatus}
                onChange={handleChangeStatus}
                options={filteredOptionStatus}
                placeholder=""
                classNamePrefix="react-select"
                onFocus={() => setIsSelectStatus(true)}
                onBlur={() => setIsSelectStatus(false)}
              />
              <label for="status" class="floating-label">
                Final Status
              </label>
            </div>
          </div> */}

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="number"
                placeholder=""
                required
                title="Please Enter the Loan Amount"
                autoComplete="off"
                value={loan_amount}
                onChange={(e) => setloan_amount(e.target.value)}
              />
              <label for="sname" className="exp-form-labels">
                Loan Amount
              </label>
            </div>
          </div>
          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="number"
                placeholder=""
                required
                title="Please Enter the Monthly Installment"
                autoComplete="off"
                value={monthly_installment}
                onChange={(e) => setmonthly_installment(e.target.value)}
              />
              <label for="sname" className="exp-form-labels">
                Monthly Installment
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="number"
                placeholder=""
                required
                title="Please Enter the Repayment Months"
                autoComplete="off"
                value={repayment_months}
                onChange={(e) => setrepayment_months(e.target.value)}
              />
              <label for="sname" className="exp-form-labels">
                Repayment Months
              </label>
            </div>
          </div>

          {/* <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedReqStatusSc ? "has-value" : ""} 
              ${isSelectedReqStatusSc ? "is-focused" : ""}`}
              title="Please enter the Request Status"
            >
              <Select
                id="country"
                type="text"
                classNamePrefix="react-select"
                placeholder=""
                onFocus={() => setIsSelectedReqStatusSc(true)}
                onBlur={() => setIsSelectedReqStatusSc(false)}
                isClearable
                value={selectedReqStatusSc}
                onChange={handleChangeReqStatusSc}
                options={filteredOptionReqStatusSc}
              />
              <label for="sname" className={`floating-label`}>
                Request Status
              </label>
            </div>
          </div> */}

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                type="date"
                className="exp-input-field form-control"
                title="Please Enter the From Date"
                value={FromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
              <label className="exp-form-labels">From Date</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                type="date"
                className="exp-input-field form-control"
                title="Please Enter the To Date"
                value={ToDate}
                onChange={(e) => setToDate(e.target.value)}
              />
              <label className="exp-form-labels">To Date</label>
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
            </div>
          </div>
        </div>
      </div>

      <div
        className="shadow-lg pt-3 bg-light rounded mt-2 container-form-box"
        style={{ width: "100%" }}
      >
        <div className="ag-theme-alpine" style={{ height: 455, width: "100%" }}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            onGridReady={onGridReady}
            rowSelection="multiple"
            pagination={true}
            paginationAutoPageSize={true}
          />
        </div>
      </div>
    </div>
  );
}

export default LoanSummaryReports;
