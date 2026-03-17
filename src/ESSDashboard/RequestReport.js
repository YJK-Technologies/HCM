import { useState, useEffect } from "react";
import "../input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { AgGridReact } from "ag-grid-react";
import LoadingScreen from '../Loading';
import Select from 'react-select';
import * as XLSX from "xlsx-js-style";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { format } from 'date-fns';
const config = require('../Apiconfig');

function RequestReport({ }) {

    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const requestData = location.state || {};
    const [requestType, setRequestType] = useState("");
    const [searchId, setSearchId] = useState("");
    const [Status, setStatus] = useState("");
    const [mode, setMode] = useState("");
    const navigate = useNavigate();

    useEffect(() => {

        if (requestData.type) {
            setRequestType(requestData.type);
            setStatus(requestData.status || "Pending");
            setMode(requestData.mode);

            if (requestData.mode === "item") {
                setSearchId(requestData.id || requestData.EmployeeId);
                handleSearch(
                    requestData.type,
                    requestData.id || requestData.EmployeeId,
                    requestData.status,
                    requestData.fromDate,
                    requestData.toDate
                );
            }

            if (requestData.mode === "type") {
                setSearchId(requestData.id || requestData.EmployeeId);
                handleSearch(
                    requestData.type,
                    requestData.id || requestData.EmployeeId || 0,
                    requestData.status
                );
            }
        }

    }, []);

    const handleSearch = async (type, id, status, fromDate, toDate) => {

        console.log(id)

        const company_code = sessionStorage.getItem("selectedCompanyCode");

        let url = "";
        let body = {};
        const safeId = id ? id.toString() : "";

        if (type === "Leave") {

            url = `${config.apiBaseUrl}/getEmployeeLeaveReport`;

            body = {
                EmployeeId: safeId,
                LeaveStatus: status,
                FromDate: fromDate,
                ToDate: toDate,
                company_code,
                ReportingManager: sessionStorage.getItem('selectedUserCode')
            };

        }

        else if (type === "Loan") {

            url = `${config.apiBaseUrl}/loanRequestSearch`;

            body = {
                loan_request_id: safeId,
                request_status: status,
                company_code
            };

        }

        else if (type === "Visa") {

            url = `${config.apiBaseUrl}/visaRequestSearch`;

            body = {
                visa_request_id: safeId,
                request_status: status,
                company_code
            };

        }

        else if (type === "Travel") {

            url = `${config.apiBaseUrl}/travel_requestsSearch`;

            body = {
                travel_request_id: safeId,
                request_status: status,
                company_code
            };

        }

        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        if (res.ok) {
            const data = await res.json();
            if (type === "Leave") {
                setLeaveRowData(data);
            }

            else if (type === "Loan") {
                setRowLoanData(data);
            }

            else if (type === "Visa") {
                setRowVisaData(data);
            }

            else if (type === "Travel") {
                setRowTavelData(data);
            }
        }

    };

    const handleApproval = async (type, id, FromDate, isApproved) => {
        try {
            const company_code = sessionStorage.getItem("selectedCompanyCode");

            let url = "";
            let body = {};
            const status = isApproved ? "Approved" : "Rejected";

            if (type === "Leave") {

                const [day, month, year] = FromDate.split("-");
                const backendDate = `${year}-${month}-${day}`;

                url = `${config.apiBaseUrl}/LeaveAuthorization`;

                body = {
                    EmployeeId: id,
                    LeaveStatus: status,
                    FromDate: FromDate
                };
            }

            else if (type === "Loan") {

                url = `${config.apiBaseUrl}/ApprovalLoan`;

                body = {
                    loan_request_id: id,
                    company_code,
                    request_status: status
                };
            }

            else if (type === "Visa") {

                url = `${config.apiBaseUrl}/ApprovalVisa`;

                body = {
                    visa_request_id: id,
                    company_code,
                    request_status: status
                };
            }

            else if (type === "Travel") {

                url = `${config.apiBaseUrl}/ApprovalTravel`;

                body = {
                    travel_request_id: id,
                    company_code,
                    request_status: status
                };
            }

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                toast.success(`${type} ${status} successfully`);
                handleSearch(requestType, searchId, Status);
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
    const [loanReqIdSc, setLoanReqIdSc] = useState('');
    const [empIdLoanDropSc, setEmpIdLoanDropSc] = useState([]);
    const [empIdLoanSc, setEmpIdLoanSc] = useState('');
    const [selectedEmpIdLoanSc, setSelectedEmpIdLoanSc] = useState('');
    const [ReqNoLoanSc, setReqNoLoanSc] = useState('');
    const [loanTypeIdDropSc, setLoanTypeIdDropSc] = useState([]);
    const [loanTypeIdSc, setLoanTypeIdSc] = useState('');
    const [selectedLoanTypeIdSc, setSelectedLoanIypeIdSc] = useState('');
    const [loanAmountSc, setLoanAmountSc] = useState('');
    const [interestRateLoanSc, setInterestRateLoanSc] = useState('');
    const [repayMonthLoanSc, setRepayMonthLoanSc] = useState('');
    const [monthlyInstallmentLoanSc, setMonthlyInstallmentLoanSc] = useState('');
    const [currencyCodeLoanSc, setCurrencyCodeLoanSc] = useState('');
    const [purposeLoanSc, setPurposeLoanSc] = useState("");
    const [repaymentDateLoanSc, setRepaymentDateLoanSc] = useState('');

    const [empIdLoanDropGrid, setEmpIdLoanDropGrid] = useState([]);

    const [isSelectedEmpIdLoanSc, setIsSelectedEmpIdLoanSc] = useState(false);
    const [isSelectedLoanTypeSc, setIsSelectedLoanTypeSc] = useState(false);

    const [currencyDropLoanSc, setCurrencyDropLoanSc] = useState([]);
    const [selectedCurrencyLoanSc, setSelectedCurrencyLoanSc] = useState('');
    const [isSelectedCurrencyLoanSc, setIsSelectedCurrencyLoanSc] = useState(false);

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
            .then((val) => setEmpIdLoanDropSc(val))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    useEffect(() => {
        const company_code = sessionStorage.getItem('selectedCompanyCode');
        fetch(`${config.apiBaseUrl}/getLoanTypes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ company_code })
        })
            .then((data) => data.json())
            .then((val) => setLoanTypeIdDropSc(val))
            .catch((error) => console.error('Error fetching data:', error));
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
            value: option?.attributedetails_name,
            label: option?.attributedetails_name,
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
            body: JSON.stringify({ company_code }),
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
        setLoanAmountSc("");
        setInterestRateLoanSc("");
        setRepayMonthLoanSc("");
        setMonthlyInstallmentLoanSc("");
        setCurrencyCodeLoanSc("");
        setPurposeLoanSc("");
        setRepaymentDateLoanSc("");
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
                            onClick={() =>
                                handleApproval(
                                    requestType,
                                    row.loan_request_id || row.visa_request_id || row.travel_request_id,
                                    row.travel_start_date || row.FromDate,
                                    true
                                )
                            }
                        >
                            <i className="fa-solid fa-check"></i>
                        </button>

                        <button
                            className="grid-reject-btn"
                            onClick={() =>
                                handleApproval(
                                    requestType,
                                    row.loan_request_id || row.visa_request_id || row.travel_request_id,
                                    row.travel_start_date || row.FromDate,
                                    false
                                )
                            }
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>

                    </div>
                );
            }
        },
        {
            headerName: "Loan Request ID",
            field: "loan_request_id",
            editable: false
        },
        {
            headerName: "Employee ID",
            field: "employee_id",
            editable: false,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: empIdLoanDropGrid.map(d => d.value),
            },
            valueFormatter: (params) => {
                const dept = empIdLoanDropGrid.find(d => d.value === params.value);
                return dept ? dept.label : params.value;
            },
        },
        {
            headerName: "Request Number",
            field: "request_number",
            editable: false
        },
        {
            headerName: "Loan Type ID",
            field: "loan_type_id",
            editable: false,
        },
        {
            headerName: "Loan Amount",
            field: "loan_amount",
            editable: false
        },
        {
            headerName: "Interest Rate",
            field: "interest_rate",
            editable: false
        },
        {
            headerName: "Repayment Months",
            field: "repayment_months",
            editable: false
        },
        {
            headerName: "Monthly Installment",
            field: "monthly_installment",
            editable: false
        },
        {
            headerName: "Currency Code",
            field: "currency_code",
            editable: false,
        },
        {
            headerName: "Purpose",
            field: "purpose",
            editable: false
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
            hide: true
        }
    ]

    const gridLoanOptions = {
        pagination: true,
        paginationPageSize: 10,
    };

    const handLoanSearch = async () => {
        setLoading(true);
        try {
            const body = {
                loan_request_id: loanReqIdSc,
                employee_id: empIdLoanSc,
                request_number: ReqNoLoanSc,
                loan_type_id: loanTypeIdSc,
                loan_amount: loanAmountSc ? loanAmountSc : 0,
                interest_rate: interestRateLoanSc ? interestRateLoanSc : 0,
                repayment_months: repayMonthLoanSc,
                monthly_installment: monthlyInstallmentLoanSc ? monthlyInstallmentLoanSc : 0,
                currency_code: currencyCodeLoanSc,
                purpose: purposeLoanSc,
                request_status: "pending",
                repayment_date: repaymentDateLoanSc,
                company_code: sessionStorage.getItem('selectedCompanyCode'),
            };

            const response = await fetch(`${config.apiBaseUrl}/loanRequestSearch`, {
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

            const empObj = empIdLoanDropGrid.find(
                (d) => d.value === row.employee_id
            );

            const empName = empObj
                ? empObj.label.split(" - ").slice(1).join(" - ")
                : "";

            return {
                "Loan Request ID": row.loan_request_id || "",
                "Employee ID": `${row.employee_id} - ${empName}` || "",
                "Request Number": row.request_number || "",
                "Loan Type ID": row.loan_type_id || "",
                "Loan Amount": row.loan_amount || "",
                "Interest Rate": row.interest_rate || "",
                "Repayment Months": row.repayment_months || "",
                "Monthly Installment": row.monthly_installment || "",
                "Currency Code": row.currency_code || "",
                "Purpose": row.purpose || "",
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
        XLSX.utils.book_append_sheet(workbook, worksheet, "Loan Request");

        XLSX.writeFile(workbook, "Loan_Request_Search_Report.xlsx");
    };

    //Visa Report Screen Input Field
    const [rowVisaData, setRowVisaData] = useState([]);
    const [visaRequestIdSc, setVisaRequestIdSc] = useState('');
    const [empIdDropVisaSc, setEmpIdDropVisaSc] = useState([]);
    const [empIdVisaSc, setEmpIdVisaSc] = useState('');
    const [selectedEmpIdVisaSc, setSelectedEmpIdVisaSc] = useState('');
    const [passportIdVisaSc, setPassportIdVisaSc] = useState('');
    const [countryIdDropVisaSc, setCountyIdDropVisaSc] = useState([]);
    const [countryIdVisaSc, setCountryIdVisaSc] = useState('');
    const [selectedCountryIdVisaSc, setSelectedCountryIdVisaSc] = useState('');
    const [visaTypeDropSc, setVisaTypeDropSc] = useState([]);
    const [visaTypeSc, setVisaTypeSc] = useState('');
    const [selectedVisaTypeSc, setSelectedVisaTypeSc] = useState('');
    const [purposeVisaSc, setPurposeVisaSc] = useState('');
    const [travelStartDateVisaSc, setTravelStartDateVisaSc] = useState('');
    const [travelEndDateVisaSc, setTravelEndDateVisaSc] = useState('');
    const [reqStatusDropVisaSc, setReqStatusDropVisaSc] = useState([]);
    const [reqStatusVisaSc, setReqStatusVisaSc] = useState('');
    const [selectedReqStatusVisaSc, setSelectedReqStatusVisaSc] = useState('');
    const [priorityDropVisaSc, setPriorityDropVisaSc] = useState([]);
    const [priorityVisaSc, setPriorityVisaSc] = useState('');
    const [selectedPriorityVisaSc, setSelectedPriorityVisaSc] = useState('');
    const [sponsorNameVisaSc, setSponsorNameVisaSc] = useState('');
    const [estimatedCostVisaSc, setEstimatedCostVisaSc] = useState('');
    const [remarksVisaSc, setRemarksVisaSc] = useState('');

    const [isSelectedEmpIdVisaSc, setIsSelectedEmpIdVisaSc] = useState(false);
    const [isSelectedCountryIdVisaSc, setIsSelectedCountryIdVisaSc] = useState(false);
    const [isSelectedVisaTypeSc, setIsSelectedVisaTypeSc] = useState(false);
    const [isSelectedReqStatusVisaSc, setIsSelectedReqStatusVisaSc] = useState(false);
    const [isSelectedPriorityVisaSc, setIsSelectedPriorityVisaSc] = useState(false);

    const [empIdVisaDropGrid, setEmpIdVisaDropGrid] = useState([]);
    const [countryIdVisaDropGrid, setCountyIdVisaDropGrid] = useState([]);

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
            .then((val) => setEmpIdDropVisaSc(val))
            .catch((error) => console.error("Error fetching data:", error));
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
            .then((val) => setCountyIdDropVisaSc(val))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    useEffect(() => {
        const company_code = sessionStorage.getItem('selectedCompanyCode');
        fetch(`${config.apiBaseUrl}/getVisaType`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ company_code })
        })
            .then((data) => data.json())
            .then((val) => setVisaTypeDropSc(val))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    useEffect(() => {
        const company_code = sessionStorage.getItem('selectedCompanyCode');
        fetch(`${config.apiBaseUrl}/getPriority`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ company_code })
        })
            .then((data) => data.json())
            .then((val) => setPriorityDropVisaSc(val));
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
            .then((val) => setReqStatusDropVisaSc(val))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    const filteredOptionEmpIdVisaSc = Array.isArray(empIdDropVisaSc)
        ? empIdDropVisaSc.map((option) => ({
            value: option?.EmployeeId,
            label: `${option?.EmployeeId}-${option?.First_Name}`,
        }))
        : [];

    const filteredOptionCountryIdVisaSc = Array.isArray(countryIdDropVisaSc)
        ? countryIdDropVisaSc.map((option) => ({
            value: option?.Country_Code,
            label: `${option?.Country_Code} - ${option?.Country_Name}`,
        }))
        : [];

    const filteredOptionVisaTypeSc = Array.isArray(visaTypeDropSc)
        ? visaTypeDropSc.map((option) => ({
            value: option?.attributedetails_name,
            label: option?.attributedetails_name,
        }))
        : [];

    const filteredOptionPriorityVisaSc = Array.isArray(priorityDropVisaSc)
        ? priorityDropVisaSc.map((option) => ({
            value: option?.attributedetails_name,
            label: option?.attributedetails_name,
        }))
        : [];

    const filteredOptionReqStatusVisaSc = Array.isArray(reqStatusDropVisaSc)
        ? [
            { value: "All", label: "All" },
            ...reqStatusDropVisaSc.map((option) => ({
                value: option?.attributedetails_name,
                label: option?.attributedetails_name,
            })),
        ]
        : [{ value: "All", label: "All" }];

    const handleChangeEmpIdVisaSc = (selectedEmpIdVisaSc) => {
        setSelectedEmpIdVisaSc(selectedEmpIdVisaSc);
        setEmpIdVisaSc(selectedEmpIdVisaSc ? selectedEmpIdVisaSc.value : "");
    };

    const handleChangeCountryIdVisaSc = (selectedCountryIdVisaSc) => {
        setSelectedCountryIdVisaSc(selectedCountryIdVisaSc);
        setCountryIdVisaSc(selectedCountryIdVisaSc ? selectedCountryIdVisaSc.value : "");
    };

    const handleChangePriorityVisaSc = (selectedPriorityVisaSc) => {
        setSelectedPriorityVisaSc(selectedPriorityVisaSc);
        setPriorityVisaSc(selectedPriorityVisaSc ? selectedPriorityVisaSc.value : "");
    };

    const handleChangeVisaTypeSc = (selectedVisaTypeSc) => {
        setSelectedVisaTypeSc(selectedVisaTypeSc);
        setVisaTypeSc(selectedVisaTypeSc ? selectedVisaTypeSc.value : "");
    };

    const handleChangeReqStatusVisaSc = (selectedReqStatusVisaSc) => {
        setSelectedReqStatusVisaSc(selectedReqStatusVisaSc);
        setReqStatusVisaSc(selectedReqStatusVisaSc ? selectedReqStatusVisaSc.value : "");
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
            .then((val) => {
                const emp = val.map((option) => ({
                    value: option.EmployeeId,
                    label: `${option.EmployeeId} - ${option.First_Name}`,
                }));
                setEmpIdVisaDropGrid(emp);
            })
            .catch((error) => console.error("Error fetching data:", error));
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
            .then((val) => {
                const country = val.map((option) => ({
                    value: option.Country_Code,
                    label: `${option.Country_Code} - ${option.Country_Name}`,
                }));
                setCountyIdVisaDropGrid(country);
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    const searchClearVisaInputFields = () => {
        setVisaRequestIdSc("");
        setEmpIdVisaSc("");
        setSelectedEmpIdVisaSc("");
        setPassportIdVisaSc("");
        setCountryIdVisaSc("");
        setSelectedCountryIdVisaSc("");
        setVisaTypeSc("");
        setSelectedVisaTypeSc("");
        setPurposeVisaSc("");
        setTravelStartDateVisaSc("");
        setTravelEndDateVisaSc("");
        setReqStatusVisaSc("");
        setSelectedReqStatusVisaSc("");
        setPriorityVisaSc("");
        setSelectedPriorityVisaSc("");
        setSponsorNameVisaSc("");
        setEstimatedCostVisaSc("");
        setRemarksVisaSc("");
    };

    const columnVisaDefs = [
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
                            onClick={() =>
                                handleApproval(
                                    requestType,
                                    row.loan_request_id || row.visa_request_id || row.travel_request_id,
                                    row.travel_start_date || row.FromDate,
                                    true
                                )
                            }
                        >
                            <i className="fa-solid fa-check"></i>
                        </button>

                        <button
                            className="grid-reject-btn"
                            onClick={() =>
                                handleApproval(
                                    requestType,
                                    row.loan_request_id || row.visa_request_id || row.travel_request_id,
                                    row.travel_start_date || row.FromDate,
                                    false
                                )
                            }
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>

                    </div>
                );
            }
        },
        {
            headerName: "Visa Request ID",
            field: "visa_request_id",
            editable: false
        },
        {
            headerName: "Employee ID",
            field: "employee_id",
            editable: false,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: empIdVisaDropGrid.map(d => d.value),
            },
            valueFormatter: (params) => {
                const dept = empIdVisaDropGrid.find(d => d.value === params.value);
                return dept ? dept.label : params.value;
            },
        },
        {
            headerName: "Passport ID",
            field: "passport_id",
            editable: true
        },
        {
            headerName: "Country ID",
            field: "destination_country_id",
            editable: false,
            cellStyle: { textAlign: "left" },
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: countryIdVisaDropGrid.map(d => d.value),
            },
            valueFormatter: (params) => {
                const dept = countryIdVisaDropGrid.find(d => d.value === params.value);
                return dept ? dept.label : params.value;
            },
        },
        {
            headerName: "Visa Type",
            field: "visa_type_id",
            editable: false,
            cellStyle: { textAlign: "left" },
        },
        {
            headerName: "Purpose",
            field: "purpose",
            editable: false
        },
        {
            headerName: "Travel Start Date",
            field: "travel_start_date",
            editable: false
        },
        {
            headerName: "Travel End Date",
            field: "travel_end_date",
            editable: false
        },
        {
            headerName: "Request Status",
            field: "request_status",
            editable: false,
            cellStyle: { textAlign: "left" },
        },
        {
            headerName: "Request Number",
            field: "request_number",
            editable: false
        },
        {
            headerName: "Priority Level",
            field: "priority_level",
            editable: false,
            cellStyle: { textAlign: "left" },
        },
        {
            headerName: "Sponsor Name",
            field: "sponsor_name",
            editable: false
        },
        {
            headerName: "Estimated Cost",
            field: "estimated_cost",
            editable: false
        },
        {
            headerName: "Remarks",
            field: "Remarks",
            editable: false
        },
        {
            headerName: "Keyfield",
            field: "keyfield",
            editable: false,
            hide: true
        }
    ]

    const gridVisaOptions = {
        pagination: true,
        paginationPageSize: 10,
    };

    const handleVisaSearch = async () => {
        setLoading(true);
        try {
            const body = {
                visa_request_id: visaRequestIdSc,
                employee_id: empIdVisaSc,
                passport_id: passportIdVisaSc,
                destination_country_id: countryIdVisaSc,
                visa_type_id: visaTypeSc,
                purpose: purposeVisaSc,
                travel_start_date: travelStartDateVisaSc,
                travel_end_date: travelEndDateVisaSc,
                request_status: reqStatusVisaSc,
                priority_level: priorityVisaSc,
                sponsor_name: sponsorNameVisaSc,
                estimated_cost: estimatedCostVisaSc ? estimatedCostVisaSc : 0,
                Remarks: remarksVisaSc,
                company_code: sessionStorage.getItem('selectedCompanyCode'),
            };

            const response = await fetch(`${config.apiBaseUrl}/visaRequestSearch`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                const fetchedData = await response.json();
                setRowVisaData(fetchedData);
            } else if (response.status === 404) {
                console.log("Data Not found");
                toast.warning("Data Not found");
                setRowVisaData([]);
            } else {
                const errorResponse = await response.json();
                toast.warning(errorResponse.message || "Failed to insert sales data");
                console.error(errorResponse.details || errorResponse.message);
                setRowVisaData([]);
            }
        } catch (error) {
            console.error("Error fetching search data:", error);
            toast.error("Error fetching search data:", error);
            setRowVisaData([]);
        } finally {
            setLoading(false);
        }
    };

    const reloadGridVisaData = () => {
        setRowVisaData([]);
        searchClearVisaInputFields();
    };

    const transformRowVisaData = (data) => {
        return data.map((row) => {

            const empObj = empIdVisaDropGrid.find(
                (d) => d.value === row.employee_id
            );

            const empName = empObj
                ? empObj.label.split(" - ").slice(1).join(" - ")
                : "";

            const countryObj = countryIdVisaDropGrid.find(
                (d) => d.value === row.destination_country_id
            );

            const countryName = countryObj
                ? countryObj.label.split(" - ").slice(1).join(" - ")
                : "";

            return {
                "Visa Request ID": row.visa_request_id || "",
                "Employee ID": `${row.employee_id} - ${empName}` || "",
                "Passport ID": row.passport_id || "",
                "Country ID": `${row.destination_country_id} - ${countryName}` || "",
                "Visa Type": row.visa_type_id || "",
                "Purpose": row.purpose || "",
                "Travel Start Date": row.travel_start_date || "",
                "Travel End Date": row.travel_end_date || "",
                "Request Status": row.request_status || "",
                "Request Number": row.request_number || "",
                "Priority Level": row.priority_level || "",
                "Sponsor Name": row.sponsor_name || "",
                "Estimated Cost": row.estimated_cost || "",
                "Remarks": row.Remarks || "",
            };
        });
    };

    const handleExportToExcelVisa = () => {
        if (!rowVisaData || rowVisaData.length === 0) {
            toast.warning("There is no data to export.");
            return;
        }

        const screenName = "Visa Request Search Report";
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

        const transformedData = transformRowVisaData(rowVisaData);

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
        XLSX.utils.book_append_sheet(workbook, worksheet, "Visa Request");

        XLSX.writeFile(workbook, "Visa_Request_Search_Report.xlsx");
    };

    //Travel Report Screen Input Fields
    const [rowTravelData, setRowTavelData] = useState([]);
    const [travelReqIdSc, setTravelReqIdSc] = useState('');
    const [empIdTravelDropSc, setEmpIdTravelDropSc] = useState([]);
    const [selectedEmpIdTravelSc, setSelectedEmpIdTravelSc] = useState('');
    const [empIdTravelSc, setEmpIdTravelSc] = useState('');
    const [DepTravelDropSc, setDepTravelDropSc] = useState([]);
    const [selectedDepTravelSc, setSelectedDepTravelSc] = useState('');
    const [depTravelSc, setDepTravelSc] = useState('');
    const [travelTypeSc, setTravelTypeSc] = useState('');
    const [countryTravelSc, setCountryTravelSc] = useState('');
    const [destinationTravelSc, setDestinationTravelSc] = useState('');
    const [purposeTravelSc, setPurposeTravelSc] = useState('');
    const [travelStartDateSc, setTravelStartDateSc] = useState('');
    const [travelEndDateSc, setTravelEndDateSc] = useState('');
    const [transportModeTravel, setTransportModeTravel] = useState('');
    const [accReqTravelSc, setAccReqTravelSc] = useState('');
    const [estimatedCostTravel, setEstimatedCostTravel] = useState('');
    const [currencyTravelDropSc, setCurrencyTravelDropSc] = useState([]);
    const [selectedCurrencyTravelSc, setSelectedCurrencyTravelSc] = useState('');
    const [currencyTravelSc, setCurrencyTravelSc] = useState('');
    const [remarksTravelSc, setRemarksTravelSc] = useState('');
    const [priorityDropTravelSc, setPriorityDropTravelSc] = useState([]);
    const [priorityTravelSc, setPriorityTravelSc] = useState('');
    const [selectedPriorityTravelSc, setSelectedPriorityTravelSc] = useState('');
    const [managerDropTravelSc, setManagerDropTravelSc] = useState([]);
    const [managerTravelSc, setManagerTravelSc] = useState('');
    const [selectedManagerTravelSc, setSelectedManagerTravelSc] = useState('');

    const [isSelectedEmpIdTravelSc, setIsSelectedEmpIdTravelSc] = useState(false);
    const [isSelectedDepTravelSc, setIsSelectedDepTravelSc] = useState(false);
    const [isSelectedCurrencyTravelSc, setIsSelectedCurrencyTravelSc] = useState(false);
    const [isSelectedPriorityTravelSc, setIsSelectedPriorityTravelSc] = useState(false);
    const [isSelectedManagerTravelSc, setIsSelectedManagerTravelSc] = useState(false);

    const [empIdTravelDropGrid, setEmpIdTravelDropGrid] = useState([]);
    const [depTavelDropGrid, setDepTavelDropGrid] = useState([]);

    useEffect(() => {
        const company_code = sessionStorage.getItem("selectedCompanyCode");
        fetch(`${config.apiBaseUrl}/DeptID`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ company_code }),
        })
            .then((data) => data.json())
            .then((val) => setDepTravelDropSc(val));
    }, []);

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
            .then((val) => setEmpIdTravelDropSc(val));
    }, []);

    useEffect(() => {
        const company_code = sessionStorage.getItem("selectedCompanyCode");
        fetch(`${config.apiBaseUrl}/ESSManager`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ company_code }),
        })
            .then((data) => data.json())
            .then((val) => setManagerDropTravelSc(val));
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
            .then((val) => setPriorityDropTravelSc(val));
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
            .then((val) => setCurrencyTravelDropSc(val))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    const filteredOptionDepTravel = Array.isArray(DepTravelDropSc)
        ? DepTravelDropSc.map((option) => ({
            value: option?.dept_id,
            label: `${option?.dept_id}-${option?.dept_name}`,
        }))
        : [];

    const filteredOptionEmpIdTravel = Array.isArray(empIdTravelDropSc)
        ? empIdTravelDropSc.map((option) => ({
            value: option?.EmployeeId,
            label: `${option?.EmployeeId}-${option?.First_Name}`,
        }))
        : [];

    const filteredOptionManagerTravel = Array.isArray(managerDropTravelSc)
        ? managerDropTravelSc.map((option) => ({
            value: option?.EmployeeId,
            label: `${option?.EmployeeId}-${option?.full_name}`,
        }))
        : [];

    const filteredOptionPriorityTravel = Array.isArray(priorityDropTravelSc)
        ? priorityDropTravelSc.map((option) => ({
            value: option?.attributedetails_name,
            label: option?.attributedetails_name,
        }))
        : [];

    const filteredOptionCurrencyTravel = Array.isArray(currencyTravelDropSc)
        ? currencyTravelDropSc.map((option) => ({
            value: option?.attributedetails_name,
            label: option?.attributedetails_name,
        }))
        : [];

    const handleChangeDepTravel = (selectedDepTravelSc) => {
        setSelectedDepTravelSc(selectedDepTravelSc);
        setDepTravelSc(selectedDepTravelSc ? selectedDepTravelSc.value : "");
    };

    const handleChangeEmpIdTravel = (selectedEmpIdTravelSc) => {
        setSelectedEmpIdTravelSc(selectedEmpIdTravelSc);
        setEmpIdTravelSc(selectedEmpIdTravelSc ? selectedEmpIdTravelSc.value : "");
    };

    const handleChangeManagerTravel = (selectedManagerTravelSc) => {
        setSelectedManagerTravelSc(selectedManagerTravelSc);
        setManagerTravelSc(selectedManagerTravelSc ? selectedManagerTravelSc.value : "");
    };

    const handleChangePriorityTravel = (selectedPriorityTravelSc) => {
        setSelectedPriorityTravelSc(selectedPriorityTravelSc);
        setPriorityTravelSc(selectedPriorityTravelSc ? selectedPriorityTravelSc.value : "");
    };

    const handleChangeTravelCurrency = (selectedCurrencyTravelSc) => {
        setSelectedCurrencyTravelSc(selectedCurrencyTravelSc);
        setCurrencyTravelSc(selectedCurrencyTravelSc ? selectedCurrencyTravelSc.value : "");
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
            .then((val) => {
                const emp = val.map((option) => ({
                    value: option.EmployeeId,
                    label: `${option.EmployeeId} - ${option.First_Name}`,
                }));
                setEmpIdTravelDropGrid(emp);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    useEffect(() => {
        const company_code = sessionStorage.getItem('selectedCompanyCode');
        fetch(`${config.apiBaseUrl}/DeptID`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ company_code })
        })
            .then((data) => data.json())
            .then((val) => {
                const department = val.map((option) => ({
                    value: option?.dept_id,
                    label: `${option?.dept_id}-${option?.dept_name}`,
                }));
                setDepTavelDropGrid(department);
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    const searchClearTravelInputFields = () => {
        setTravelReqIdSc("");
        setSelectedEmpIdTravelSc("");
        setEmpIdTravelSc("");
        setSelectedDepTravelSc("");
        setDepTravelSc("");
        setTravelTypeSc("");
        setCountryTravelSc("");
        setDestinationTravelSc("");
        setPurposeTravelSc("");
        setTravelStartDateSc("");
        setTravelEndDateSc("");
        setTransportModeTravel("");
        setAccReqTravelSc("");
        setEstimatedCostTravel("");
        setSelectedCurrencyTravelSc("");
        setCurrencyTravelSc("");
        setRemarksTravelSc("");
        setPriorityTravelSc("");
        setSelectedPriorityTravelSc("");
        setManagerTravelSc("");
        setSelectedManagerTravelSc("");
    };

    const columnTravelDefs = [
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
                            title="Approved"
                            aria-label="Approve"
                            onClick={() =>
                                handleApproval(
                                    requestType,
                                    row.loan_request_id || row.visa_request_id || row.travel_request_id,
                                    row.travel_start_date || row.FromDate,
                                    true
                                )
                            }
                        >
                            <i className="fa-solid fa-check"></i>
                        </button>

                        <button
                            className="grid-reject-btn"
                            title="Rejected"
                            aria-label="Reject"
                            onClick={() =>
                                handleApproval(
                                    requestType,
                                    row.loan_request_id || row.visa_request_id || row.travel_request_id,
                                    row.travel_start_date || row.FromDate,
                                    false
                                )
                            }
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>

                    </div>
                );
            }
        },
        {
            headerName: "Travel Request ID",
            field: "travel_request_id",
            editable: false,
        },
        {
            headerName: "Employee ID",
            field: "employee_id",
            editable: false,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: empIdTravelDropGrid.map(d => d.value),
            },
            valueFormatter: (params) => {
                const dept = empIdTravelDropGrid.find(d => d.value === params.value);
                return dept ? dept.label : params.value;
            },
        },
        {
            headerName: "Department",
            field: "department_id",
            editable: false,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: depTavelDropGrid.map(d => d.value),
            },
            valueFormatter: (params) => {
                const dept = depTavelDropGrid.find(d => d.value === params.value);
                return dept ? dept.label : params.value;
            },
        },
        {
            headerName: "Travel Type",
            field: "travel_type",
            editable: false,
        },
        {
            headerName: "Destination Country",
            field: "destination_country_id",
            editable: false,
        },
        {
            headerName: "Destination City",
            field: "destination_city",
            editable: false,
        },
        {
            headerName: "Purpose of Travel",
            field: "purpose_of_travel",
            editable: false,
        },
        {
            headerName: "Start Date",
            field: "travel_start_date",
            editable: false,
        },
        {
            headerName: "End Date",
            field: "travel_end_date",
            editable: false,
        },
        {
            headerName: "Transport Mode",
            field: "transport_mode",
            editable: false,
        },
        {
            headerName: "Accommodation Required",
            field: "accommodation_required",
            editable: false,
        },
        {
            headerName: "Estimated Cost",
            field: "estimated_cost",
            editable: true,
        },
        {
            headerName: "Currency Code",
            field: "currency_code",
            editable: false,
        },
        {
            headerName: "Request Status",
            field: "request_status",
            editable: false,
        },
        {
            headerName: "Remarks",
            field: "Remarks",
            editable: false,
        },
        {
            headerName: "Priority",
            field: "priority_level",
            editable: false,
        },
        {
            headerName: "Manager",
            field: "manager_id",
            editable: false,
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

    const handleTravelSearch = async () => {
        setLoading(true);

        try {
            const body = {
                travel_request_id: travelReqIdSc || null,
                employee_id: empIdTravelSc || "",
                department_id: depTravelSc || "",
                travel_type: travelTypeSc || "",
                destination_country_id: countryTravelSc || null,
                destination_city: destinationTravelSc || "",
                purpose_of_travel: purposeTravelSc || "",
                travel_start_date: travelStartDateSc || null,
                travel_end_date: travelEndDateSc || null,
                transport_mode: transportModeTravel || "",
                accommodation_required: accReqTravelSc || null,
                estimated_cost: estimatedCostTravel || null,
                currency_code: currencyTravelSc || "",
                request_status: "Pending",
                Remarks: remarksTravelSc || "",
                priority_level: priorityTravelSc || "",
                manager_id: managerTravelSc || null,
                company_code: sessionStorage.getItem("selectedCompanyCode"),
            };

            const response = await fetch(`${config.apiBaseUrl}/travel_requestsSearch`,
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
                setRowTavelData(fetchedData);
            } else if (response.status === 404) {
                toast.warning("Data Not found");
                setRowTavelData([]);
            } else {
                const errorResponse = await response.json();
                toast.warning(errorResponse.message || "Search failed");
                setRowTavelData([]);
            }
        } catch (error) {
            console.error("Error fetching search data:", error);
            toast.error("Error fetching search data: " + error.message);
            setRowTavelData([]);
        } finally {
            setLoading(false);
        }
    };

    const reloadGridTravelData = () => {
        setRowTavelData([]);
        searchClearTravelInputFields();
    };

    const transformRowTravelData = (data) => {
        return data.map((row) => {

            const empObj = empIdTravelDropGrid.find(
                (d) => d.value === row.employee_id
            );

            const empName = empObj
                ? empObj.label.split(" - ").slice(1).join(" - ")
                : "";

            const depObj = depTavelDropGrid.find(
                (d) => d.value === row.destination_country_id
            );

            const depName = depObj
                ? depObj.label.split(" - ").slice(1).join(" - ")
                : "";

            return {
                "Travel Request ID": row.travel_request_id || "",
                "Employee ID": `${row.employee_id} - ${empName}` || "",
                "Department": `${row.department_id} - ${depName}` || "",
                "Travel Type": row.travel_type || "",
                "Destination Country": row.destination_country_id || "",
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

    const handleExportToExcelTravel = () => {
        if (!rowTravelData || rowTravelData.length === 0) {
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

        const transformedData = transformRowTravelData(rowTravelData);

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

    const goBack = () => {
        navigate('/ESSDashboard');
    };

    //Leave Request Screen Input Fields
    const [leaveRowData, setLeaveRowData] = useState([]);
    const [leaveFromDate, setLeaveFromDate] = useState("");
    const [leaveToDate, setLeaveToDate] = useState("");
    const [leaveDrop, setLeaveDrop] = useState([]);
    const [leaveType, setLeaveType] = useState("");
    const [selectedLeave, setSelectedLeave] = useState("");
    const [isSearchLeave, setIsSearchLeave] = useState(false);

    useEffect(() => {
        fetch(`${config.apiBaseUrl}/getapplyLeavetype`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                company_code: sessionStorage.getItem("selectedCompanyCode"),
            }),
        })
            .then((data) => data.json())
            .then((val) => setLeaveDrop(val))
    }, []);

    const filterOptionLeaves = [{ value: 'All', label: 'All' }, ...leaveDrop.map((option) => ({
        value: option.LeaveId,
        label: option.LeaveId,
    }))];

    const handleLeaves = (SelectedLeave) => {
        setSelectedLeave(SelectedLeave);
        setLeaveType(SelectedLeave ? SelectedLeave.value : '');
    };

    const leaveColumnDefs = [
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
                            title="Approved"
                            aria-label="Approve"
                            onClick={() =>
                                handleApproval(
                                    requestType,
                                    row.loan_request_id || row.visa_request_id || row.travel_request_id,
                                    row.travel_start_date || row.FromDate || row.EmployeeId,
                                    true
                                )
                            }
                        >
                            <i className="fa-solid fa-check"></i>
                        </button>

                        <button
                            className="grid-reject-btn"
                            title="Rejected"
                            aria-label="Reject"
                            onClick={() =>
                                handleApproval(
                                    requestType,
                                    row.loan_request_id || row.visa_request_id || row.travel_request_id,
                                    row.travel_start_date || row.FromDate || row.EmployeeId,
                                    false
                                )
                            }
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>

                    </div>
                );
            }
        },
        {
            headerName: "Employee ID",
            field: "EmployeeId",
            cellStyle: { textAlign: "center" },
            editable: false,
        },
        {
            headerName: "Employee Name",
            field: "EmployeeName",
            cellStyle: { textAlign: "center" },
            editable: false,
        },
        {
            headerName: "Leave Type",
            field: "LeaveType",
            cellStyle: { textAlign: "center" },
            editable: false,
        },
        {
            headerName: "From Date",
            field: "FromDate",
            editable: false,
            cellStyle: { textAlign: "center" },
        },
        {
            headerName: "To Date",
            field: "ToDate",
            editable: false,
            cellStyle: { textAlign: "center" },
        },
        {
            headerName: "Leave Status",
            field: "LeaveStatus",
            editable: false,
            cellStyle: { textAlign: "center" },
        },
    ];

    const handleSearchItem = async () => {
        const from = new Date(leaveFromDate);
        const to = new Date(leaveToDate);

        if (from > to) {
            toast.warning("From Date should not be greater than To Date");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${config.apiBaseUrl}/getEmployeeLeaveReport`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    company_code: sessionStorage.getItem('selectedCompanyCode'),
                    EmployeeId: sessionStorage.getItem('selectedUserCode'),
                    FromDate: leaveFromDate,
                    ToDate: leaveToDate,
                    LeaveStatus: 'Pending',
                    LeaveType: leaveType,
                    getEmployeeLeaveReport: sessionStorage.getItem('selectedUserCode'),
                })
            });
            if (response.ok) {
                const searchData = await response.json();
                setLeaveRowData(searchData);
                console.log("data fetched successfully")
            } else if (response.status === 404) {
                setLeaveRowData([]);
                toast.warning("Data not found")
                console.log("Data not found");
            } else {
                const errorResponse = await response.json();
                console.error(errorResponse.message);
                toast.warning(errorResponse.message, {
                })
            }
        } catch (error) {
            console.error("Error fetching search data:", error);
        } finally {
            setLoading(false);
        }
    };

    const clearLeaveInputs = () => {
        setLeaveFromDate('');
        setLeaveToDate('');
        setLeaveType('');
        setSelectedLeave("");
    };

    const handleLeaveReload = () => {
        clearLeaveInputs([])
        setLeaveRowData([])
    };

    const transformRowLeaveData = (data) => {
        return data.map((row) => {

            return {
                "Employee ID": row.EmployeeId || "",
                "Employee Name": row.EmployeeName || "",
                "Leave Type": row.LeaveType || "",
                "From Date": row.FromDate || "",
                "To Date": row.ToDate || "",
                "Leave Status": row.LeaveStatus || "",
            };
        });
    };

    const handleExportToExcelLeave = () => {
        if (!leaveRowData || leaveRowData.length === 0) {
            toast.warning("There is no data to export.");
            return;
        }

        const screenName = "Leave Requests Search Report";
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

        const transformedData = transformRowLeaveData(leaveRowData);

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
        XLSX.utils.book_append_sheet(workbook, worksheet, "Leave Requests");

        XLSX.writeFile(workbook, "Leave_Requests_Search_Report.xlsx");
    };

    return (
        <div class="container-fluid Topnav-screen ">
            {loading && <LoadingScreen />}
            <ToastContainer position="top-right" className="toast-design" theme="colored" />
            <div className="shadow-lg p-1 bg-light rounded main-header-box">
                <div className="header-flex">
                    <h1 className="page-title">Request Report</h1>
                    <div className="action-wrapper">
                        <div className="action-icon delete" onClick={goBack}>
                            <span className="tooltip">Close</span>
                            <i className="fa-solid fa-xmark"></i>
                        </div>
                    </div>
                </div>
            </div>

            <>
                {requestType === "Loan" && mode === "type" && (
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
                                        title="Please enter the Loan Request ID"
                                        autoComplete="off"
                                        value={loanReqIdSc}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, "");
                                            setLoanReqIdSc(value);
                                        }}
                                    />
                                    <label for="sname" className={`exp-form-labels`}>Loan Request ID</label>
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
                                        required title="Please Enter the Request Number"
                                        autoComplete="off"
                                        value={ReqNoLoanSc}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, "");
                                            setReqNoLoanSc(value);
                                        }}
                                    />
                                    <label for="sname" className={`exp-form-labels`}>Request Number</label>
                                </div>
                            </div>

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
                                    <label for="sname" className={`floating-label`}>Loan Type ID</label>
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
                                        required title="Please Enter the Loan Amount"
                                        autoComplete="off"
                                        value={loanAmountSc}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, "");
                                            setLoanAmountSc(value);
                                        }}
                                    />
                                    <label for="sname" className={`exp-form-labels`}>Loan Amount</label>
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
                                        required title="Please Enter the Interest Rate"
                                        autoComplete="off"
                                        value={interestRateLoanSc}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/[^0-9.]/g, "");
                                            setInterestRateLoanSc(value);
                                        }}
                                    />
                                    <label for="sname" className={`exp-form-labels`}>Interest Rate</label>
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
                                        required title="Please Enter the Repayment Months"
                                        autoComplete="off"
                                        value={repayMonthLoanSc}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, "");
                                            setRepayMonthLoanSc(value);
                                        }}
                                    />
                                    <label for="sname" className={`exp-form-labels`}>Repayment Months</label>
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
                                        required title="Please Enter the Monthly Installment"
                                        autoComplete="off"
                                        value={monthlyInstallmentLoanSc}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, "");
                                            setMonthlyInstallmentLoanSc(value);
                                        }}
                                    />
                                    <label for="sname" className={`exp-form-labels`}>Monthly Installment</label>
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
                                    <label for="sname" className={`floating-label`}>Currency Code</label>
                                </div>
                            </div>

                            <div className="col-md-2">
                                <div className="inputGroup">
                                    <input
                                        id="fdate"
                                        class="exp-input-field form-control"
                                        type="text"
                                        placeholder=""
                                        required title="Please Enter the Purpose"
                                        autoComplete="off"
                                        value={purposeLoanSc}
                                        maxLength={100}
                                        onChange={(e) => setPurposeLoanSc((e.target.value))}
                                    />
                                    <label for="sname" className={`exp-form-labels`}>Purpose</label>
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
                                        required title="Please Enter the Repayment Date"
                                        autoComplete="off"
                                        value={repaymentDateLoanSc}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, "");

                                            if (value === "") {
                                                setRepaymentDateLoanSc("");
                                                return;
                                            }

                                            const num = parseInt(value, 10);

                                            if (num === 0 || num > 31) {
                                                toast.warning("Please enter a date between 1 and 31");
                                                return;
                                            }

                                            setRepaymentDateLoanSc(value);
                                        }}
                                    />
                                    <label for="sname" className={`exp-form-labels`}>Repayment Date</label>
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

                                    <div className="icon-btn excel" onClick={handleExportToExcelLoan}>
                                        <span className="tooltip">Excel</span>
                                        <i className="fa-solid fa-file-excel"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {requestType === "Loan" && (
                    <div className="shadow-lg pt-3 pb-3 bg-light rounded mt-2 container-form-box" style={{ width: "100%" }}>
                        <div class="ag-theme-alpine" style={{ height: 455, width: "100%" }}>
                            <AgGridReact
                                columnDefs={columnLoanDefs}
                                rowData={rowLoanData}
                                pagination={true}
                                paginationAutoPageSize={true}
                                gridOptions={gridLoanOptions}
                            />
                        </div>
                    </div>
                )}
            </>

            <>
                {requestType === "Visa" && mode === "type" && (
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
                                        required title="Please Enter the Annual Bonus"
                                        autoComplete="off"
                                        value={visaRequestIdSc}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, "");
                                            setVisaRequestIdSc(value);
                                        }}
                                    />
                                    <label for="sname" className={`exp-form-labels`}>Visa Request ID</label>
                                </div>
                            </div>

                            <div className="col-md-2">
                                <div
                                    className={`inputGroup selectGroup 
                            ${selectedEmpIdVisaSc ? "has-value" : ""} 
                            ${isSelectedEmpIdVisaSc ? "is-focused" : ""}`}
                                >
                                    <Select
                                        id="department"
                                        placeholder=" "
                                        onFocus={() => setIsSelectedEmpIdVisaSc(true)}
                                        onBlur={() => setIsSelectedEmpIdVisaSc(false)}
                                        classNamePrefix="react-select"
                                        isClearable
                                        type="text"
                                        value={selectedEmpIdVisaSc}
                                        onChange={handleChangeEmpIdVisaSc}
                                        options={filteredOptionEmpIdVisaSc}
                                    />
                                    <label htmlFor="selecteddpt" className={`floating-label`}>
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
                                        maxLength={15}
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        required title="Please Enter the Annual Bonus"
                                        autoComplete="off"
                                        value={passportIdVisaSc}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, "");
                                            setPassportIdVisaSc(value);
                                        }}
                                    />
                                    <label for="sname" className={`exp-form-labels`}>Passport ID</label>
                                </div>
                            </div>

                            <div className="col-md-2">
                                <div
                                    className={`inputGroup selectGroup 
                            ${selectedCountryIdVisaSc ? "has-value" : ""} 
                            ${isSelectedCountryIdVisaSc ? "is-focused" : ""}`}
                                >
                                    <Select
                                        id="country"
                                        type="text"
                                        classNamePrefix="react-select"
                                        placeholder=""
                                        onFocus={() => setIsSelectedCountryIdVisaSc(true)}
                                        onBlur={() => setIsSelectedCountryIdVisaSc(false)}
                                        isClearable
                                        value={selectedCountryIdVisaSc}
                                        onChange={handleChangeCountryIdVisaSc}
                                        options={filteredOptionCountryIdVisaSc}
                                    />
                                    <label for="sname" className={`floating-label`}>Country ID</label>
                                </div>
                            </div>

                            <div className="col-md-2">
                                <div
                                    className={`inputGroup selectGroup 
                            ${selectedVisaTypeSc ? "has-value" : ""} 
                            ${isSelectedVisaTypeSc ? "is-focused" : ""}`}
                                >
                                    <Select
                                        id="country"
                                        type="text"
                                        classNamePrefix="react-select"
                                        placeholder=""
                                        onFocus={() => setIsSelectedVisaTypeSc(true)}
                                        onBlur={() => setIsSelectedVisaTypeSc(false)}
                                        isClearable
                                        value={selectedVisaTypeSc}
                                        onChange={handleChangeVisaTypeSc}
                                        options={filteredOptionVisaTypeSc}
                                    />
                                    <label for="sname" className={`floating-label`}>Visa Type ID</label>
                                </div>
                            </div>

                            <div className="col-md-2">
                                <div className="inputGroup">
                                    <input
                                        id="fdate"
                                        class="exp-input-field form-control"
                                        type="text"
                                        placeholder=""
                                        required title="Please Enter the Annual Bonus"
                                        autoComplete="off"
                                        value={purposeVisaSc}
                                        maxLength={100}
                                        onChange={(e) => setPurposeVisaSc((e.target.value))}
                                    />
                                    <label for="sname" className={`exp-form-labels`}>Purpose</label>
                                </div>
                            </div>

                            <div className="col-md-2">
                                <div className="inputGroup">
                                    <input
                                        id="fdate"
                                        class="exp-input-field form-control"
                                        type="date"
                                        placeholder=""
                                        required title="Please Enter the Annual Bonus"
                                        autoComplete="off"
                                        value={travelStartDateVisaSc}
                                        onChange={(e) => setTravelStartDateVisaSc((e.target.value))}
                                    />
                                    <label for="sname" className={`exp-form-labels`}>Travel Start Date</label>
                                </div>
                            </div>

                            <div className="col-md-2">
                                <div className="inputGroup">
                                    <input
                                        id="fdate"
                                        class="exp-input-field form-control"
                                        type="date"
                                        placeholder=""
                                        required title="Please Enter the Annual Bonus"
                                        autoComplete="off"
                                        value={travelEndDateVisaSc}
                                        onChange={(e) => setTravelEndDateVisaSc((e.target.value))}
                                    />
                                    <label for="sname" className={`exp-form-labels`}>Travel End Date</label>
                                </div>
                            </div>

                            <div className="col-md-2">
                                <div
                                    className={`inputGroup selectGroup 
                            ${selectedReqStatusVisaSc ? "has-value" : ""} 
                            ${isSelectedReqStatusVisaSc ? "is-focused" : ""}`}
                                >
                                    <Select
                                        id="country"
                                        type="text"
                                        classNamePrefix="react-select"
                                        placeholder=""
                                        onFocus={() => setIsSelectedReqStatusVisaSc(true)}
                                        onBlur={() => setIsSelectedReqStatusVisaSc(false)}
                                        isClearable
                                        value={selectedReqStatusVisaSc}
                                        onChange={handleChangeReqStatusVisaSc}
                                        options={filteredOptionReqStatusVisaSc}
                                    />
                                    <label for="sname" className={`floating-label`}>Request Status</label>
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
                                required title="Please Enter the Annual Bonus"
                                autoComplete="off"
                                value={reqNumberSc}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "");
                                    setReqNumberSc(value);
                                }}
                            />
                            <label for="sname" className={`exp-form-labels`}>Request Number</label>
                        </div>
                    </div> */}

                            <div className="col-md-2">
                                <div
                                    className={`inputGroup selectGroup 
                            ${selectedPriorityVisaSc ? "has-value" : ""} 
                            ${isSelectedPriorityVisaSc ? "is-focused" : ""}`}
                                >
                                    <Select
                                        id="country"
                                        type="text"
                                        classNamePrefix="react-select"
                                        placeholder=""
                                        onFocus={() => setIsSelectedPriorityVisaSc(true)}
                                        onBlur={() => setIsSelectedPriorityVisaSc(false)}
                                        isClearable
                                        value={selectedPriorityVisaSc}
                                        onChange={handleChangePriorityVisaSc}
                                        options={filteredOptionPriorityVisaSc}
                                    />
                                    <label for="sname" className={`floating-label`}>Priority Level</label>
                                </div>
                            </div>

                            <div className="col-md-2">
                                <div className="inputGroup">
                                    <input
                                        id="fdate"
                                        class="exp-input-field form-control"
                                        type="text"
                                        placeholder=""
                                        required title="Please Enter the Annual Bonus"
                                        autoComplete="off"
                                        value={sponsorNameVisaSc}
                                        maxLength={150}
                                        onChange={(e) => setSponsorNameVisaSc((e.target.value))}
                                    />
                                    <label for="sname" className={`exp-form-labels`}>Sponsor Name</label>
                                </div>
                            </div>

                            <div className="col-md-2">
                                <div className="inputGroup">
                                    <input
                                        id="fdate"
                                        class="exp-input-field form-control"
                                        type="text"
                                        placeholder=""
                                        maxLength={6}
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        required title="Please Enter the Annual Bonus"
                                        autoComplete="off"
                                        value={estimatedCostVisaSc}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, "");
                                            setEstimatedCostVisaSc(value);
                                        }}
                                    />
                                    <label for="sname" className={`exp-form-labels`}>Estimated Cost</label>
                                </div>
                            </div>

                            <div className="col-md-2">
                                <div className="inputGroup">
                                    <input
                                        id="fdate"
                                        class="exp-input-field form-control"
                                        type="text"
                                        placeholder=""
                                        required title="Please Enter the Annual Bonus"
                                        autoComplete="off"
                                        value={remarksVisaSc}
                                        maxLength={255}
                                        onChange={(e) => setRemarksVisaSc((e.target.value))}
                                    />
                                    <label for="sname" className={`exp-form-labels`}>Remarks</label>
                                </div>
                            </div>

                            {/* Search + Reload Buttons */}
                            <div className="col-12">
                                <div className="search-btn-wrapper">
                                    <div className="icon-btn search" onClick={handleVisaSearch}>
                                        <span className="tooltip">Search</span>
                                        <i className="fa-solid fa-magnifying-glass"></i>
                                    </div>

                                    <div className="icon-btn reload" onClick={reloadGridVisaData}>
                                        <span className="tooltip">Reload</span>
                                        <i className="fa-solid fa-rotate-right"></i>
                                    </div>

                                    <div className="icon-btn excel" onClick={handleExportToExcelVisa}>
                                        <span className="tooltip">Excel</span>
                                        <i className="fa-solid fa-file-excel"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {requestType === "Visa" && (
                    <div className="shadow-lg pt-3 pb-3 bg-light rounded mt-2 container-form-box" style={{ width: "100%" }}>
                        <div class="ag-theme-alpine" style={{ height: 455, width: "100%" }}>
                            <AgGridReact
                                columnDefs={columnVisaDefs}
                                rowData={rowVisaData}
                                pagination={true}
                                paginationAutoPageSize={true}
                                gridOptions={gridVisaOptions}
                            />
                        </div>
                    </div>
                )}
            </>

            <>
                {requestType === "Travel" && mode === "type" && (

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
                                        value={travelReqIdSc}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, "");
                                            setTravelReqIdSc(value);
                                        }}
                                    />
                                    <label for="sname" className={`exp-form-labels`}>
                                        Travel Request ID
                                    </label>
                                </div>
                            </div>

                            <div className="col-md-2">
                                <div
                                    className={`inputGroup selectGroup 
                                ${selectedEmpIdTravelSc ? "has-value" : ""} 
                                ${isSelectedEmpIdTravelSc ? "is-focused" : ""}`}
                                    title="Please select the Employee ID"
                                >
                                    <Select
                                        id="department"
                                        placeholder=" "
                                        onFocus={() => setIsSelectedEmpIdTravelSc(true)}
                                        onBlur={() => setIsSelectedEmpIdTravelSc(false)}
                                        classNamePrefix="react-select"
                                        isClearable
                                        type="text"
                                        value={selectedEmpIdTravelSc}
                                        onChange={handleChangeEmpIdTravel}
                                        options={filteredOptionEmpIdTravel}
                                    />
                                    <label htmlFor="selecteddpt" className={`floating-label`}>
                                        Employee ID
                                    </label>
                                </div>
                            </div>

                            <div className="col-md-2">
                                <div
                                    className={`inputGroup selectGroup 
                                ${selectedDepTravelSc ? "has-value" : ""} 
                                ${isSelectedDepTravelSc ? "is-focused" : ""}`}
                                    title="Please select the Department"
                                >
                                    <Select
                                        id="department"
                                        placeholder=" "
                                        onFocus={() => setIsSelectedDepTravelSc(true)}
                                        onBlur={() => setIsSelectedDepTravelSc(false)}
                                        classNamePrefix="react-select"
                                        isClearable
                                        type="text"
                                        value={selectedDepTravelSc}
                                        onChange={handleChangeDepTravel}
                                        options={filteredOptionDepTravel}
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
                                        value={travelTypeSc}
                                        onChange={(e) => setTravelTypeSc(e.target.value)}
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
                                        type="number"
                                        placeholder=""
                                        maxLength={10}
                                        required
                                        title="Please enter the Destination Country ID"
                                        autoComplete="off"
                                        value={countryTravelSc}
                                        onChange={(e) => setCountryTravelSc(e.target.value)}
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
                                        value={destinationTravelSc}
                                        onChange={(e) => setDestinationTravelSc(e.target.value)}
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
                                        value={purposeTravelSc}
                                        onChange={(e) => setPurposeTravelSc(e.target.value)}
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
                                        value={transportModeTravel}
                                        onChange={(e) => setTransportModeTravel(e.target.value)}
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
                                        value={accReqTravelSc}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/[^01]/g, "");
                                            setAccReqTravelSc(value);
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
                                        value={estimatedCostTravel}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, "");
                                            setEstimatedCostTravel(value);
                                        }}
                                    />
                                    <label for="sname" className={`exp-form-labels `}>
                                        Estimated Cost
                                    </label>
                                </div>
                            </div>

                            <div className="col-md-2">
                                <div
                                    className={`inputGroup selectGroup 
                                ${selectedCurrencyTravelSc ? "has-value" : ""} 
                                ${isSelectedCurrencyTravelSc ? "is-focused" : ""}`}
                                    title="Please select the Currency Code"
                                >
                                    <Select
                                        id="country"
                                        type="text"
                                        classNamePrefix="react-select"
                                        placeholder=""
                                        onFocus={() => setIsSelectedCurrencyTravelSc(true)}
                                        onBlur={() => setIsSelectedCurrencyTravelSc(false)}
                                        isClearable
                                        value={selectedCurrencyTravelSc}
                                        onChange={handleChangeTravelCurrency}
                                        options={filteredOptionCurrencyTravel}
                                    />
                                    <label for="sname" className={`floating-label`}>Currency Code</label>
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
                                        value={remarksTravelSc}
                                        onChange={(e) => setRemarksTravelSc(e.target.value)}
                                    />
                                    <label for="sname" className={`exp-form-labels`}>
                                        Remarks
                                    </label>
                                </div>
                            </div>

                            <div className="col-md-2">
                                <div
                                    className={`inputGroup selectGroup 
                                ${selectedPriorityTravelSc ? "has-value" : ""} 
                                ${isSelectedPriorityTravelSc ? "is-focused" : ""}`}
                                    title="Please select the Priority Level"
                                >
                                    <Select
                                        id="country"
                                        type="text"
                                        classNamePrefix="react-select"
                                        placeholder=""
                                        onFocus={() => setIsSelectedPriorityTravelSc(true)}
                                        onBlur={() => setIsSelectedPriorityTravelSc(false)}
                                        isClearable
                                        value={selectedPriorityTravelSc}
                                        onChange={handleChangePriorityTravel}
                                        options={filteredOptionPriorityTravel}
                                    />
                                    <label for="sname" className={`floating-label`}>
                                        Priority Level
                                    </label>
                                </div>
                            </div>

                            <div className="col-md-2">
                                <div
                                    className={`inputGroup selectGroup 
                                ${selectedManagerTravelSc ? "has-value" : ""} 
                                ${isSelectedManagerTravelSc ? "is-focused" : ""}`}
                                    title="Please select the Manager"
                                >
                                    <Select
                                        id="LoanEligibleAmount"
                                        type="text"
                                        placeholder=" "
                                        onFocus={() => setIsSelectedManagerTravelSc(true)}
                                        onBlur={() => setIsSelectedManagerTravelSc(false)}
                                        classNamePrefix="react-select"
                                        isClearable
                                        value={selectedManagerTravelSc}
                                        options={filteredOptionManagerTravel}
                                        onChange={handleChangeManagerTravel}
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
                                    <div className="icon-btn search" onClick={handleTravelSearch}>
                                        <span className="tooltip">Search</span>
                                        <i className="fa-solid fa-magnifying-glass"></i>
                                    </div>

                                    <div className="icon-btn reload" onClick={reloadGridTravelData}>
                                        <span className="tooltip">Reload</span>
                                        <i className="fa-solid fa-rotate-right"></i>
                                    </div>

                                    <div className="icon-btn excel" onClick={handleExportToExcelTravel}>
                                        <span className="tooltip">Excel</span>
                                        <i className="fa-solid fa-file-excel"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {requestType === "Travel" && (
                    <div
                        className="shadow-lg pt-3 pb-3 bg-light rounded mt-2 container-form-box"
                        style={{ width: "100%" }}
                    >
                        <div class="ag-theme-alpine" style={{ height: 455, width: "100%" }}>
                            <AgGridReact
                                columnDefs={columnTravelDefs}
                                rowData={rowTravelData}
                                pagination={true}
                                paginationAutoPageSize={true}
                                gridOptions={gridOptions}
                            />
                        </div>
                    </div>
                )}
            </>

            <>
                {requestType === "Leave" && mode === "type" && (

                    <div className="shadow-lg p-3 bg-light rounded mt-2 container-form-box">
                        <div className="header-flex">
                            <h6 className="">Search Criteria:</h6>
                        </div>

                        <div className="row g-3">

                            <div className="col-md-2">
                                <div className="inputGroup">
                                    <input
                                        type="date"
                                        className="exp-input-field form-control"
                                        value={leaveFromDate}
                                        placeholder=" "
                                        autoComplete="off"
                                        onChange={(e) => setLeaveFromDate(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                                    />
                                    <label className="exp-form-labels">From Date</label>
                                </div>
                            </div>

                            <div className="col-md-2">
                                <div className="inputGroup">
                                    <input
                                        type="date"
                                        className="exp-input-field form-control"
                                        value={leaveToDate}
                                        placeholder=" "
                                        autoComplete="off"
                                        onChange={(e) => setLeaveToDate(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                                    />
                                    <label className="exp-form-labels">To Date</label>
                                </div>
                            </div>

                            <div className="col-md-2">
                                <div
                                    className={`inputGroup selectGroup 
                                    ${selectedLeave ? "has-value" : ""} 
                                    ${isSearchLeave ? "is-focused" : ""}`}
                                >
                                    <Select
                                        id="LeaveType"
                                        value={selectedLeave}
                                        onChange={handleLeaves}
                                        options={filterOptionLeaves}
                                        placeholder=" "
                                        onFocus={() => setIsSearchLeave(true)}
                                        onBlur={() => setIsSearchLeave(false)}
                                        classNamePrefix="react-select"
                                        isClearable
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                                    />
                                    <label className="floating-label">Leave Type</label>
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="search-btn-wrapper">
                                    <div className="icon-btn search" onClick={handleSearchItem}>
                                        <span className="tooltip">Search</span>
                                        <i className="fa-solid fa-magnifying-glass"></i>
                                    </div>

                                    <div className="icon-btn reload" onClick={handleLeaveReload}>
                                        <span className="tooltip">Reload</span>
                                        <i className="fa-solid fa-rotate-right"></i>
                                    </div>

                                    <div className="icon-btn excel" onClick={handleExportToExcelLeave}>
                                        <span className="tooltip">Excel</span>
                                        <i className="fa-solid fa-file-excel"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {requestType === "Leave" && (
                    <div
                        className="shadow-lg pt-3 pb-3 bg-light rounded mt-2 container-form-box"
                        style={{ width: "100%" }}
                    >
                        <div class="ag-theme-alpine" style={{ height: 455, width: "100%" }}>
                            <AgGridReact
                                rowData={leaveRowData}
                                columnDefs={leaveColumnDefs}
                                rowSelection="single"
                            />
                        </div>
                    </div>
                )}
            </>

        </div>
    );
}
export default RequestReport;