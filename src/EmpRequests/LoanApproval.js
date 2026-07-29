import { useState, useEffect } from "react";
import "../input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { AgGridReact } from "ag-grid-react";
import LoadingScreen from "../Loading";
import Select from "react-select";
import * as XLSX from "xlsx-js-style";
const config = require("../Apiconfig");

function LoanApproval({ }) {
    const [loading, setLoading] = useState(false);

    const handleApproval = async (row, status) => {
        try {
            const company_code = sessionStorage.getItem("selectedCompanyCode");

            const response = await fetch(`${config.apiBaseUrl}/ApprovalLoan`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    loan_request_id: row.loan_request_id,
                    company_code,
                    Location_Code: sessionStorage.getItem('selectedLocationCode'),
                    request_status: status ? "Approved" : "Rejected",
                }),
            });

            if (response.ok) {
                toast.success(`Loan ${status ? "approved" : "rejected"} successfully`);
                await handLoanSearch();
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || "Failed to process request");
            }
        } catch (error) {
            console.error("Approval error:", error);
            toast.error("Something went wrong");
        }
    };

    //Loan Report Screen Input Fields
    const [rowLoanData, setRowLoanData] = useState([]);
    const [loanReqIdSc, setLoanReqIdSc] = useState("");
    const [empIdLoanDropSc, setEmpIdLoanDropSc] = useState([]);
    const [empIdLoanSc, setEmpIdLoanSc] = useState("");
    const [selectedEmpIdLoanSc, setSelectedEmpIdLoanSc] = useState("");
    const [ReqNoLoanSc, setReqNoLoanSc] = useState("");
    const [loanTypeIdDropSc, setLoanTypeIdDropSc] = useState([]);
    const [loanTypeIdSc, setLoanTypeIdSc] = useState("");
    const [selectedLoanTypeIdSc, setSelectedLoanIypeIdSc] = useState("");
    const [loanAmountFromSc, setLoanAmountFromSc] = useState("");
    const [loanAmountToSc, setLoanAmountToSc] = useState("");
    const [interestRateLoanFromSc, setInterestRateLoanFromSc] = useState("");
    const [interestRateLoanToSc, setInterestRateLoanToSc] = useState("");
    const [repayMonthLoanFromSc, setRepayMonthLoanFromSc] = useState("");
    const [repayMonthLoanToSc, setRepayMonthLoanToSc] = useState("");
    const [monthlyInstallmentLoanFromSc, setMonthlyInstallmentLoanFromSc] = useState("");
    const [monthlyInstallmentLoanToSc, setMonthlyInstallmentLoanToSc] = useState("");
    const [currencyCodeLoanSc, setCurrencyCodeLoanSc] = useState("");
    const [purposeLoanSc, setPurposeLoanSc] = useState("");
    const [repaymentDateLoanFromSc, setRepaymentDateLoanFromSc] = useState("");
    const [repaymentDateLoanToSc, setRepaymentDateLoanToSc] = useState("");

    const [empIdLoanDropGrid, setEmpIdLoanDropGrid] = useState([]);

    const [isSelectedEmpIdLoanSc, setIsSelectedEmpIdLoanSc] = useState(false);
    const [isSelectedLoanTypeSc, setIsSelectedLoanTypeSc] = useState(false);

    const [currencyDropLoanSc, setCurrencyDropLoanSc] = useState([]);
    const [selectedCurrencyLoanSc, setSelectedCurrencyLoanSc] = useState("");
    const [isSelectedCurrencyLoanSc, setIsSelectedCurrencyLoanSc] = useState(false);

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
            .then((val) => setEmpIdLoanDropSc(val))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    useEffect(() => {
        const company_code = sessionStorage.getItem("selectedCompanyCode");
        fetch(`${config.apiBaseUrl}/LoanTypeIdDropDown`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ company_code, Location_Code }),
        })
            .then((data) => data.json())
            .then((val) => setLoanTypeIdDropSc(val))
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
            .then((val) => setCurrencyDropLoanSc(val))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    const filteredOptionEmpIdLoanSc = Array.isArray(empIdLoanDropSc)
        ? empIdLoanDropSc.map((option) => ({
            value: option?.EmployeeId,
            label: `${option?.EmployeeId}-${option?.First_Name}`,
        }))
        : [];

    const filteredOptionLoanTypeSc = Array.isArray(loanTypeIdDropSc)
        ? loanTypeIdDropSc.map((option) => ({
            value: option?.Loan_Type_ID,
            label: `${option.Loan_Type_ID} - ${option.Loan_Type_Name}`,
        }))
        : [];

    const filteredOptionCurrencyLoanSc = Array.isArray(currencyDropLoanSc)
        ? currencyDropLoanSc.map((option) => ({
            value: option?.attributedetails_name,
            label: option?.attributedetails_name,
        }))
        : [];

    const handleChangeEmpIdLoanSc = (selectedEmpIdSc) => {
        setSelectedEmpIdLoanSc(selectedEmpIdSc);
        setEmpIdLoanSc(selectedEmpIdSc ? selectedEmpIdSc.value : "");
    };

    const handleChangeLoanTypeSc = (selectedLoanTypeIdSc) => {
        setSelectedLoanIypeIdSc(selectedLoanTypeIdSc);
        setLoanTypeIdSc(selectedLoanTypeIdSc ? selectedLoanTypeIdSc.value : "");
    };

    const handleChangeCurrencyLoanSc = (selectedCurrencySc) => {
        setSelectedCurrencyLoanSc(selectedCurrencySc);
        setCurrencyCodeLoanSc(selectedCurrencySc ? selectedCurrencySc.value : "");
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
            .then((val) => {
                const emp = val.map((option) => ({
                    value: option.EmployeeId,
                    label: `${option.EmployeeId} - ${option.First_Name}`,
                }));
                setEmpIdLoanDropGrid(emp);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    const searchClearLoanInputFields = () => {
        setLoanReqIdSc("");
        setEmpIdLoanSc("");
        setSelectedEmpIdLoanSc("");
        setLoanTypeIdSc("");
        setSelectedLoanIypeIdSc("");
        setLoanAmountFromSc("");
        setLoanAmountToSc("");
        setInterestRateLoanFromSc("");
        setInterestRateLoanToSc("");
        setRepayMonthLoanFromSc("");
        setRepayMonthLoanToSc("");
        setMonthlyInstallmentLoanFromSc("");
        setMonthlyInstallmentLoanToSc("");
        setCurrencyCodeLoanSc("");
        setPurposeLoanSc("");
        setRepaymentDateLoanFromSc("");
        setRepaymentDateLoanToSc("");
    };

    const columnLoanDefs = [
        {
            headerName: "Actions",
            field: "actions",
            width: 120,
            cellRenderer: (params) => {
                const row = params.data;

                return (
                    <div className="grid-action-buttons">
                        <button
                            className="grid-approve-btn"
                            title="Approve"
                            aria-label="Approve"
                            onClick={() =>
                                handleApproval(
                                    row,
                                    true
                                )
                            }
                        >
                            <i className="fa-solid fa-check"></i>
                        </button>

                        <button
                            className="grid-reject-btn"
                            title="Reject"
                            aria-label="Reject"
                            onClick={() =>
                                handleApproval(
                                    row,
                                    false
                                )
                            }
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                );
            },
        },
        {
            headerName: "Loan Request ID",
            field: "loan_request_id",
            editable: false,
        },
        {
            headerName: "Employee ID",
            field: "employee_id",
            editable: false,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: empIdLoanDropGrid.map((d) => d.value),
            },
            valueFormatter: (params) => {
                const dept = empIdLoanDropGrid.find((d) => d.value === params.value);
                return dept ? dept.label : params.value;
            },
        },
        // {
        //     headerName: "Request Number",
        //     field: "request_number",
        //     editable: false,
        // },
        {
            headerName: "Loan Type ID",
            field: "loan_type_id",
            editable: false,
        },
        {
            headerName: "Loan Type Name",
            field: "Loan_Type_Name",
            editable: false,
        },
        {
            headerName: "Loan Amount",
            field: "loan_amount",
            editable: false,
        },
        {
            headerName: "Interest Rate",
            field: "interest_rate",
            editable: false,
        },
        {
            headerName: "Repayment Months",
            field: "repayment_months",
            editable: false,
        },
        {
            headerName: "Monthly Installment",
            field: "monthly_installment",
            editable: false,
        },
        {
            headerName: "Currency Code",
            field: "currency_code",
            editable: false,
        },
        {
            headerName: "Purpose",
            field: "purpose",
            editable: false,
        },
        {
            headerName: "Request Status",
            field: "request_status",
            editable: false,
        },
        {
            headerName: "Repayment Date",
            field: "repayment_date",
            editable: false,
        },
        {
            headerName: "Keyfield",
            field: "keyfield",
            editable: false,
            hide: true,
        },
    ];

    const gridLoanOptions = {
        pagination: true,
        paginationPageSize: 10,
    };

  const onFirstDataRendered = (params) => {
  const allColumnIds = params.columnApi
    .getColumns()
    .map((col) => col.getId());

  params.columnApi.autoSizeColumns(allColumnIds);
};

    const handLoanSearch = async () => {
        setLoading(true);
        try {
            const body = {
                loan_request_id: loanReqIdSc,
                employee_id: empIdLoanSc,
                request_number: ReqNoLoanSc,
                loan_type_id: loanTypeIdSc,
                LoanAmountFrom: loanAmountFromSc ? loanAmountFromSc : 0,
                LoanAmountTo: loanAmountToSc ? loanAmountToSc : 0,
                InterestRateFrom: interestRateLoanFromSc ? interestRateLoanFromSc : 0,
                InterestRateTo: interestRateLoanToSc ? interestRateLoanToSc : 0,
                RepaymentMonthsFrom: repayMonthLoanFromSc,
                RepaymentMonthsTo: repayMonthLoanToSc,
                MonthlyInstallmentFrom: monthlyInstallmentLoanFromSc ? monthlyInstallmentLoanFromSc : 0,
                MonthlyInstallmentTo: monthlyInstallmentLoanToSc ? monthlyInstallmentLoanToSc : 0,
                currency_code: currencyCodeLoanSc,
                purpose: purposeLoanSc,
                request_status: "pending",
                RepaymentDateFrom: repaymentDateLoanFromSc,
                RepaymentDateTo: repaymentDateLoanToSc,
                company_code: sessionStorage.getItem("selectedCompanyCode"),
                Location_Code: sessionStorage.getItem('selectedLocationCode'),
                manager_id: sessionStorage.getItem('selectedUserCode'),
            };

            const response = await fetch(`${config.apiBaseUrl}/approvalLoanRequestSearch`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                const fetchedData = await response.json();
                setRowLoanData(fetchedData);
            } else if (response.status === 404) {
                console.log("Data Not found");
                toast.warning("Data Not found");
                setRowLoanData([]);
            } else {
                const errorResponse = await response.json();
                toast.warning(errorResponse.message || "Failed to insert sales data");
                console.error(errorResponse.details || errorResponse.message);
                setRowLoanData([]);
            }
        } catch (error) {
            console.error("Error fetching search data:", error);
            toast.error("Error fetching search data:", error);
            setRowLoanData([]);
        } finally {
            setLoading(false);
        }
    };

    const reloadGridLoanData = () => {
        setRowLoanData([]);
        searchClearLoanInputFields();
    };

    const getCSSVariable = (variableName) => {
        return getComputedStyle(document.documentElement)
            .getPropertyValue(variableName)
            .trim();
    };

    const transformRowLoanData = (data) => {
        return data.map((row) => {
            const empObj = empIdLoanDropGrid.find((d) => d.value === row.employee_id);

            const empName = empObj
                ? empObj.label.split(" - ").slice(1).join(" - ")
                : "";

            return {
                "Loan Request ID": row.loan_request_id || "",
                "Employee ID": `${row.employee_id} - ${empName}` || "",
                "Loan Type ID": row.loan_type_id || "",
                "Loan Type Name": row.Loan_Type_Name || "",
                "Loan Amount": row.loan_amount || "",
                "Interest Rate": row.interest_rate || "",
                "Repayment Months": row.repayment_months || "",
                "Monthly Installment": row.monthly_installment || "",
                "Currency Code": row.currency_code || "",
                Purpose: row.purpose || "",
                "Request Status": row.request_status || "",
                "Repayment Date": row.repayment_date || "",
            };
        });
    };

    const handleExportToExcelLoan = () => {
        if (!rowLoanData || rowLoanData.length === 0) {
            toast.warning("There is no data to export.");
            return;
        }

        const screenName = "Loan Request Search Report";
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

        const transformedData = transformRowLoanData(rowLoanData);

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
            {
                s: { r: 0, c: 0 },
                e: { r: 0, c: Object.keys(transformedData[0]).length - 1 },
            },
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

        /* ================= COLUMN WIDTH ================= */

        worksheet["!cols"] = Array(totalColumns).fill({ wch: 22 });

        /* ================= EXPORT ================= */

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Loan Request");

        XLSX.writeFile(workbook, "Loan_Request_Search_Report.xlsx");
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
                    <h1 className="page-title">Loan Approvals</h1>
                </div>
            </div>

            <>
                <div className="shadow-lg p-3 bg-light rounded mt-2 container-form-box">

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
                                    title="Please enter the Loan Request ID"
                                    autoComplete="off"
                                    value={loanReqIdSc}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, "");
                                        setLoanReqIdSc(value);
                                    }}
                                />
                                <label for="sname" className={`exp-form-labels`}>
                                    Loan Request ID
                                </label>
                            </div>
                        </div>

                        <div className="col-md-2">
                            <div
                                className={`inputGroup selectGroup 
                                ${selectedEmpIdLoanSc ? "has-value" : ""} 
                                ${isSelectedEmpIdLoanSc ? "is-focused" : ""}`}
                                title="Please enter the Employee ID"
                            >
                                <Select
                                    id="department"
                                    placeholder=" "
                                    onFocus={() => setIsSelectedEmpIdLoanSc(true)}
                                    onBlur={() => setIsSelectedEmpIdLoanSc(false)}
                                    classNamePrefix="react-select"
                                    isClearable
                                    type="text"
                                    value={selectedEmpIdLoanSc}
                                    onChange={handleChangeEmpIdLoanSc}
                                    options={filteredOptionEmpIdLoanSc}
                                />
                                <label htmlFor="selecteddpt" className={`floating-label`}>
                                    Employee ID
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
                                    maxLength={15}
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    required
                                    title="Please Enter the Request Number"
                                    autoComplete="off"
                                    value={ReqNoLoanSc}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, "");
                                        setReqNoLoanSc(value);
                                    }}
                                />
                                <label for="sname" className={`exp-form-labels`}>
                                    Request Number
                                </label>
                            </div>
                        </div> */}

                        <div className="col-md-2">
                            <div
                                className={`inputGroup selectGroup 
                                ${selectedLoanTypeIdSc ? "has-value" : ""} 
                                ${isSelectedLoanTypeSc ? "is-focused" : ""}`}
                                title="Please enter the Loan Type ID"
                            >
                                <Select
                                    id="country"
                                    type="text"
                                    classNamePrefix="react-select"
                                    placeholder=""
                                    onFocus={() => setIsSelectedLoanTypeSc(true)}
                                    onBlur={() => setIsSelectedLoanTypeSc(false)}
                                    isClearable
                                    value={selectedLoanTypeIdSc}
                                    onChange={handleChangeLoanTypeSc}
                                    options={filteredOptionLoanTypeSc}
                                />
                                <label for="sname" className={`floating-label`}>
                                    Loan Type ID
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
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    required
                                    title="Please Enter the Loan Amount From"
                                    autoComplete="off"
                                    value={loanAmountFromSc}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, "");
                                        setLoanAmountFromSc(value);
                                    }}
                                />
                                <label for="sname" className={`exp-form-labels`}>
                                    Loan Amount From
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
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    required
                                    title="Please Enter the Loan Amount To"
                                    autoComplete="off"
                                    value={loanAmountToSc}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, "");
                                        setLoanAmountToSc(value);
                                    }}
                                />
                                <label for="sname" className={`exp-form-labels`}>
                                    Loan Amount To
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
                                    maxLength={5}
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    required
                                    title="Please Enter the Interest Rate From"
                                    autoComplete="off"
                                    value={interestRateLoanFromSc}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/[^0-9.]/g, "");
                                        setInterestRateLoanFromSc(value);
                                    }}
                                />
                                <label for="sname" className={`exp-form-labels`}>
                                    Interest Rate From
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
                                    maxLength={5}
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    required
                                    title="Please Enter the Interest Rate To"
                                    autoComplete="off"
                                    value={interestRateLoanToSc}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/[^0-9.]/g, "");
                                        setInterestRateLoanToSc(value);
                                    }}
                                />
                                <label for="sname" className={`exp-form-labels`}>
                                    Interest Rate To
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
                                    maxLength={5}
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    required
                                    title="Please Enter the Repayment Months From"
                                    autoComplete="off"
                                    value={repayMonthLoanFromSc}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, "");
                                        setRepayMonthLoanFromSc(value);
                                    }}
                                />
                                <label for="sname" className={`exp-form-labels`}>
                                    Repayment Months From
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
                                    maxLength={5}
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    required
                                    title="Please Enter the Repayment Months To"
                                    autoComplete="off"
                                    value={repayMonthLoanToSc}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, "");
                                        setRepayMonthLoanToSc(value);
                                    }}
                                />
                                <label for="sname" className={`exp-form-labels`}>
                                    Repayment Months To
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
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    required
                                    title="Please Enter the Monthly Installment From"
                                    autoComplete="off"
                                    value={monthlyInstallmentLoanFromSc}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, "");
                                        setMonthlyInstallmentLoanFromSc(value);
                                    }}
                                />
                                <label for="sname" className={`exp-form-labels`}>
                                    Monthly Installment From
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
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    required
                                    title="Please Enter the Monthly Installment To"
                                    autoComplete="off"
                                    value={monthlyInstallmentLoanToSc}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, "");
                                        setMonthlyInstallmentLoanToSc(value);
                                    }}
                                />
                                <label for="sname" className={`exp-form-labels`}>
                                    Monthly Installment To
                                </label>
                            </div>
                        </div>

                        <div className="col-md-2">
                            <div
                                className={`inputGroup selectGroup 
                                ${selectedCurrencyLoanSc ? "has-value" : ""} 
                                ${isSelectedCurrencyLoanSc ? "is-focused" : ""}`}
                                title="Please select the Salary Currency"
                            >
                                <Select
                                    id="country"
                                    type="text"
                                    classNamePrefix="react-select"
                                    placeholder=""
                                    onFocus={() => setIsSelectedCurrencyLoanSc(true)}
                                    onBlur={() => setIsSelectedCurrencyLoanSc(false)}
                                    isClearable
                                    value={selectedCurrencyLoanSc}
                                    onChange={handleChangeCurrencyLoanSc}
                                    options={filteredOptionCurrencyLoanSc}
                                />
                                <label for="sname" className={`floating-label`}>
                                    Currency Code
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
                                    title="Please Enter the Purpose"
                                    autoComplete="off"
                                    value={purposeLoanSc}
                                    maxLength={100}
                                    onChange={(e) => setPurposeLoanSc(e.target.value)}
                                />
                                <label for="sname" className={`exp-form-labels`}>
                                    Purpose
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
                                    maxLength={2}
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    required
                                    title="Please Enter the Repayment Date From"
                                    autoComplete="off"
                                    value={repaymentDateLoanFromSc}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, "");

                                        if (value === "") {
                                            setRepaymentDateLoanFromSc("");
                                            return;
                                        }

                                        const num = parseInt(value, 10);

                                        if (num === 0 || num > 31) {
                                            toast.warning("Please enter a date between 1 and 31");
                                            return;
                                        }

                                        setRepaymentDateLoanFromSc(value);
                                    }}
                                />
                                <label for="sname" className={`exp-form-labels`}>
                                    Repayment Date From
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
                                    maxLength={2}
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    required
                                    title="Please Enter the Repayment Date To"
                                    autoComplete="off"
                                    value={repaymentDateLoanToSc}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, "");

                                        if (value === "") {
                                            setRepaymentDateLoanToSc("");
                                            return;
                                        }

                                        const num = parseInt(value, 10);

                                        if (num === 0 || num > 31) {
                                            toast.warning("Please enter a date between 1 and 31");
                                            return;
                                        }

                                        setRepaymentDateLoanToSc(value);
                                    }}
                                />
                                <label for="sname" className={`exp-form-labels`}>
                                    Repayment Date To
                                </label>
                            </div>
                        </div>

                        {/* Search + Reload Buttons */}
                        <div className="col-12">
                            <div className="search-btn-wrapper">
                                <div className="icon-btn search" onClick={handLoanSearch}>
                                    <span className="tooltip">Search</span>
                                    <i className="fa-solid fa-magnifying-glass"></i>
                                </div>

                                <div className="icon-btn reload" onClick={reloadGridLoanData}>
                                    <span className="tooltip">Reload</span>
                                    <i className="fa-solid fa-rotate-right"></i>
                                </div>

                                <div
                                    className="icon-btn excel"
                                    onClick={handleExportToExcelLoan}
                                >
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
                            columnDefs={columnLoanDefs}
                            rowData={rowLoanData}
                            pagination={true}
                            paginationAutoPageSize={true}
                            gridOptions={gridLoanOptions}
                            onFirstDataRendered={onFirstDataRendered}
                        />
                    </div>
                </div>
            </>

        </div>
    );
}
export default LoanApproval;