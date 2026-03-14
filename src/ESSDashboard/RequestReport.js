import React, { useState, useEffect } from "react";
import "../input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { AgGridReact } from "ag-grid-react";
import { showConfirmationToast } from '../ToastConfirmation';
import LoadingScreen from '../Loading';
import Select from 'react-select';
import * as XLSX from "xlsx-js-style";
const config = require('../Apiconfig');

function RequestReport({ }) {

    const [rowLoanData, setRowLoanData] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    //Loan Report Screen Input Fields
    const [loanReqIdSc, setLoanReqIdSc] = useState('');
    const [empIdLoanDropSc, setEmpIdLoanDropSc] = useState([]);
    const [empIdLoanSc, setEmpIdLoanSc] = useState('');
    const [selectedEmpIdLoanSc, setSelectedEmpIdLoanSc] = useState('');
    const [loanTypeIdDropSc, setLoanTypeIdDropSc] = useState([]);
    const [loanTypeIdSc, setLoanTypeIdSc] = useState('');
    const [selectedLoanTypeIdSc, setSelectedLoanIypeIdSc] = useState('');
    const [loanAmountSc, setLoanAmountSc] = useState('');
    const [interestRateLoanSc, setInterestRateLoanSc] = useState('');
    const [repayMonthLoanSc, setRepayMonthLoanSc] = useState('');
    const [monthlyInstallmentLoanSc, setMonthlyInstallmentLoanSc] = useState('');
    const [currencyCodeLoanSc, setCurrencyCodeLoanSc] = useState('');
    const [purposeLoanSc, setPurposeLoanSc] = useState("");
    const [reqStatusDropLoanSc, setReqStatusDropLoanSc] = useState([]);
    const [reqStatusLoanSc, setReqStatusLoanSc] = useState('');
    const [selectedReqStatusLoanSc, setSelectedReqStatusLoanSc] = useState('');
    const [repaymentDateLoanSc, setRepaymentDateLoanSc] = useState('');

    const [isSelectedEmpIdLoanSc, setIsSelectedEmpIdLoanSc] = useState(false);
    const [isSelectedLoanTypeSc, setIsSelectedLoanTypeSc] = useState(false);
    const [isSelectedReqStatusLoanSc, setIsSelectedReqStatusLoanSc] = useState(false);

    const [empIdDropLoanGrid, setEmpIdDropLoanGrid] = useState([]);
    const [loanTypeIdDropGrid, setLoanTypeIdDropGrid] = useState([]);
    const [reqStatusDropLoanGrid, setReqStatusDropLoanGrid] = useState([]);
    const [currencyDropLoanGrid, setCurrencyDropLoanGrid] = useState([]);

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
        const company_code = sessionStorage.getItem('selectedCompanyCode');
        fetch(`${config.apiBaseUrl}/getLeaveStatus`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ company_code })
        })
            .then((data) => data.json())
            .then((val) => setReqStatusDropLoanSc(val))
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

    const filteredOptionReqStatusLoanSc = Array.isArray(reqStatusDropLoanSc)
        ? [
            { value: "All", label: "All" },
            ...reqStatusDropLoanSc.map((option) => ({
                value: option?.attributedetails_name,
                label: option?.attributedetails_name,
            })),
        ]
        : [{ value: "All", label: "All" }];

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

    const handleChangeReqStatusLoanSc = (selectedReqStatusSc) => {
        setSelectedReqStatusLoanSc(selectedReqStatusSc);
        setReqStatusLoanSc(selectedReqStatusSc ? selectedReqStatusSc.value : "");
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
                setEmpIdDropLoanGrid(emp);
            })
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
            .then((val) => {
                const visaType = val.map(option => option.attributedetails_name);
                setLoanTypeIdDropGrid(visaType);
            })
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
                setReqStatusDropLoanGrid(reqStatus);
            })
            .catch((error) => console.error('Error fetching data:', error));
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
            .then((data) => data.json())
            .then((val) => {
                const currency = val.map(option => option.attributedetails_name);
                setCurrencyDropLoanGrid(currency);
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    const searchClearLoanInputFields = () => {
        setLoanReqIdSc("");
        setReqNumberSc("");
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
        setReqStatusLoanSc("");
        setSelectedReqStatusLoanSc("");
        setRepaymentDateLoanSc("");
    };

    const columnLoanDefs = [
        {
            headerName: "Actions",
            field: "actions",
        },

        {
            headerName: "Loan Request ID",
            field: "loan_request_id",
            editable: false
        },
        {
            headerName: "Employee ID",
            field: "employee_id",
            editable: true,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: empIdDropLoanGrid.map(d => d.value),
            },
            valueFormatter: (params) => {
                const dept = empIdDropLoanGrid.find(d => d.value === params.value);
                return dept ? dept.label : params.value;
            },
        },
        {
            headerName: "Request Number",
            field: "request_number",
            editable: true
        },
        {
            headerName: "Loan Type ID",
            field: "loan_type_id",
            editable: true,
            cellStyle: { textAlign: "left" },
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: loanTypeIdDropGrid,
            },
        },
        {
            headerName: "Loan Amount",
            field: "loan_amount",
            editable: true
        },
        {
            headerName: "Interest Rate",
            field: "interest_rate",
            editable: true
        },
        {
            headerName: "Repayment Months",
            field: "repayment_months",
            editable: true
        },
        {
            headerName: "Monthly Installment",
            field: "monthly_installment",
            editable: true
        },
        {
            headerName: "Currency Code",
            field: "currency_code",
            editable: true,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: currencyDropLoanGrid,
            },
        },
        {
            headerName: "Purpose",
            field: "purpose",
            editable: true
        },
        {
            headerName: "Request Status",
            field: "request_status",
            editable: false,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: reqStatusDropLoanGrid,
            },
        },
        {
            headerName: "Repayment Date",
            field: "repayment_date",
            editable: true,
        },
        {
            headerName: "Keyfield",
            field: "keyfield",
            editable: true,
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
                request_number: reqNumberSc,
                employee_id: empIdSc,
                loan_type_id: loanTypeIdSc,
                loan_amount: loanAmountSc ? loanAmountSc : 0,
                interest_rate: interestRateLoanSc ? interestRateLoanSc : 0,
                repayment_months: repayMonthLoanSc,
                monthly_installment: monthlyInstallmentLoanSc ? monthlyInstallmentLoanSc : 0,
                currency_code: currencyCodeLoanSc,
                purpose: purposeSc,
                request_status: reqStatusSc,
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

    const transformRowanData = (data) => {
        return data.map((row) => {
            const empObj = empIdDropLoanGrid.find(
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

        const transformedData = transformRowanData(rowLoanData);

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

    const [empIdDropVisaGrid, setEmpIdDropVisaGrid] = useState([]);
    const [countryIdDropVisaGrid, setCountyIdDropVisaGrid] = useState([]);
    const [visaTypeDropGrid, setVisaTypeDropGrid] = useState([]);
    const [reqStatusDropVisaGrid, setReqStatusDropVisaGrid] = useState([]);
    const [priorityDropVisaGrid, setPriorityDropVisaGrid] = useState([]);

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
                setEmpIdDropVisaGrid(emp);
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
                setCountyIdDropVisaGrid(country);
            })
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
            .then((val) => {
                const visaType = val.map(option => option.attributedetails_name);
                setVisaTypeDropGrid(visaType);
            })
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
            .then((val) => {
                const priority = val.map(option => option.attributedetails_name);
                setPriorityDropVisaGrid(priority);
            })
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
                setReqStatusDropVisaGrid(reqStatus);
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
                values: empIdDropVisaGrid.map(d => d.value),
            },
            valueFormatter: (params) => {
                const dept = empIdDropVisaGrid.find(d => d.value === params.value);
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
            editable: true,
            cellStyle: { textAlign: "left" },
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: countryIdDropVisaGrid.map(d => d.value),
            },
            valueFormatter: (params) => {
                const dept = countryIdDropVisaGrid.find(d => d.value === params.value);
                return dept ? dept.label : params.value;
            },
        },
        {
            headerName: "Visa Type",
            field: "visa_type_id",
            editable: true,
            cellStyle: { textAlign: "left" },
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: visaTypeDropGrid,
            },
        },
        {
            headerName: "Purpose",
            field: "purpose",
            editable: true
        },
        {
            headerName: "Travel Start Date",
            field: "travel_start_date",
            editable: true
        },
        {
            headerName: "Travel End Date",
            field: "travel_end_date",
            editable: true
        },
        {
            headerName: "Request Status",
            field: "request_status",
            editable: false,
            cellStyle: { textAlign: "left" },
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: reqStatusDropVisaGrid,
            },
        },
        {
            headerName: "Request Number",
            field: "request_number",
            editable: true
        },
        {
            headerName: "Priority Level",
            field: "priority_level",
            editable: true,
            cellStyle: { textAlign: "left" },
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: priorityDropVisaGrid,
            },
        },
        {
            headerName: "Sponsor Name",
            field: "sponsor_name",
            editable: true
        },
        {
            headerName: "Estimated Cost",
            field: "estimated_cost",
            editable: true
        },
        {
            headerName: "Remarks",
            field: "Remarks",
            editable: true
        },
        {
            headerName: "Keyfield",
            field: "keyfield",
            editable: true,
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
                request_number: reqNumberVisaSc,
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
            const empObj = empIdDropVisaGrid.find(
                (d) => d.value === row.employee_id
            );

            const empName = empObj
                ? empObj.label.split(" - ").slice(1).join(" - ")
                : "";

            const countryObj = countryIdDropVisaGrid.find(
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
        if (!rowData || rowData.length === 0) {
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
    const [travelReqIdSc, setTravelReqIdSc] = useState('');
    const [empIdTravelDropSc, setEmpIdTravelDropSc] = useState([]);
    const [selectedEmpIdTravelSc, setSelectedEmpIdTravelSc] = useState('');
    const [empIdTravelSc, setEmpIdTravelSc] =useState('');
    const [DepTravelDropSc, setDepTravelDropSc] = useState([]);
    const [selectedDepTravelSc, setSelectedDepTravelSc] = useState('');
    const [depTravelSc, setDepTravelSc] =useState('');
    const [travelTypeSc, setTravelTypeSc] = useState('');
    const [countryTravelSc, setCountryTravelSc]= useState('');
    const [destinationTravelSc, setDestinationTravelSc]= useState('');
    const [purposeTravelSc, setPurposeTravelSc]= useState('');
    const [travelStartDateSc, setTravelStartDateSc]= useState('');
    const [travelEndDateSc, setTravelEndDateSc]= useState('');
    const [transportModeTravel, setTransportModeTravel] = useState('');
    const [accReqTravelSc, setAccReqTravelSc] = useState('');
    const [estimatedCostTravel, setEstimatedCostTravel] = useState('');
    const [currencyTravelDropSc, setCurrencyTravelDropSc] = useState([]);
    const [selectedCurrencyTravelSc, setSelectedCurrencyTravelSc] = useState('');
    const [currencyTravelSc, setCurrencyTravelSc] = useState('');
    const [reqStatusDropTravelSc, setReqStatusDropTravelSc] = useState([]);
    const [reqStatusTravelSc, setReqStatusTravelSc] = useState('');
    const [selectedReqStatusTravelSc, setSelectedReqStatusTravelSc] = useState('');
    const [remarksTravelSc, setRemarksTravelSc] = useState('');
    const [priorityDropTravelSc, setPriorityDropTravelSc] = useState([]);
    const [priorityTravelSc, setPriorityTravelSc] = useState('');
    const [selectedPriorityTravelSc, setSelectedPriorityTravelSc] = useState('');
    const [managerDropTravelSc, setManagerDropTravelSc] = useState([]);
    const [managerTravelSc, setManagerTravelSc] = useState('');
    const [selectedManagerTravelSc, setSelectedManagerTravelSc] = useState('');
   
    const [isSelectedEmpIdTravelSc, setIsSelectedEmpIdTravelSc] = useState(false);
    const [isSelectedCurrencyTravelSc, setIsSelectedCurrencyTravelSc] = useState(false);
    const [isSelectedReqStatusTravelSc, setIsSelectedReqStatusTravelSc] = useState(false);
    const [isSelectedPriorityTravelSc, setIsSelectedPriorityTravelSc] = useState(false);
    const [isSelectedManagerTravelSc, setIsSelectedManagerTravelSc] = useState(false);

    const [DepTravelDropGrid, setDepTravelDropGrid] = useState([]);
    const [currencyTravelDropGrid, setCurrencyTravelDropGrid] = useState([]);
    const [reqStatusDropTravelGrid, setReqStatusDropTravelGrid] = useState([]);
    const [priorityDropTravelGrid, setPriorityDropTravelGrid] = useState([]);
    const [managerDropTravelGrid, setManagerDropTravelGrid] = useState([]);

    useEffect(() => {
        fetch(`${config.apiBaseUrl}/ESSManager`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                company_code: sessionStorage.getItem("selectedCompanyCode"),
            }),
        })
            .then((data) => data.json())
            .then((val) => {
                const Manager = val.map((option) => ({
                    value: option.EmployeeId,
                    label: `${option.EmployeeId}`,
                }));

                setManagerdropAG(Manager);
            })
            .catch((error) => console.error("Error fetching Travel request:", error));
    }, []);

    useEffect(() => {
        const company_code = sessionStorage.getItem("selectedCompanyCode");
        fetch(`${config.apiBaseUrl}/getLeaveStatus`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ company_code }),
        })
            .then((data) => data.json())
            .then((val) => {
                const reqStatus = val.map((option) => option.attributedetails_name);
                setReqStatusDropAG(reqStatus);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    const fetchProductCodesSC = async (selectedValue) => {
        const company_code = sessionStorage.getItem("selectedCompanyCode");

        try {
            const response = await fetch(`${config.apiBaseUrl}/getDesgination`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ dept_id: selectedValue, company_code }),
            });

            const data = await response.json();
            const formattedData = data.map((product) => ({
                value: product.Desgination,
                label: product.Desgination,
            }));

            setDynamicOptions(formattedData);
            return formattedData;
        } catch (error) {
            console.error("Error fetching product codes:", error);
            return [];
        }
    };

    const filteredOptionManagerSC = Array.isArray(ManagerdropSC)
        ? ManagerdropSC.map((option) => ({
            value: option.EmployeeId,
            label: `${option.EmployeeId}-${option.full_name}`,
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
            .then((val) => setPriorityDropSc(val));
    }, []);

    useEffect(() => {
        const company_code = sessionStorage.getItem("selectedCompanyCode");
        fetch(`${config.apiBaseUrl}/getLeaveStatus`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ company_code }),
        })
            .then((data) => data.json())
            .then((val) => setReqStatusDropSC(val))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    useEffect(() => {
        fetch(`${config.apiBaseUrl}/ESSManager`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                // user_code: sessionStorage.getItem("selectedUserCode"),
                company_code: sessionStorage.getItem("selectedCompanyCode"),
            }),
        })
            .then((response) => response.json())
            .then(setManagerdropSC)
            .catch((error) => console.error("Error fetching warehouse:", error));
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
            .then((response) => response.json())
            .then((data) => {
                // Extract city names from the fetched data
                const statusOption = data.map((option) => option.attributedetails_name);
                setPriorityGridDrop(statusOption);
            })
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

    const filteredOptionEmpIdSc = Array.isArray(empIdDropSc)
        ? empIdDropSc.map((option) => ({
            value: option?.EmployeeId,
            label: `${option?.EmployeeId}-${option?.First_Name}`,
        }))
        : [];

    const filteredOptionPrioritySc = Array.isArray(priorityDropSc)
        ? priorityDropSc.map((option) => ({
            value: option?.attributedetails_name,
            label: option?.attributedetails_name,
        }))
        : [];

    const filteredOptionReqStatusSC = Array.isArray(reqStatusDropSC)
        ? [
            { value: "All", label: "All" },
            ...reqStatusDropSC.map((option) => ({
                value: option?.attributedetails_name,
                label: option?.attributedetails_name,
            })),
        ]
        : [{ value: "All", label: "All" }];

    const filteredOptionCurrencySc = Array.isArray(currencyDropSc)
        ? currencyDropSc.map((option) => ({
            value: option?.attributedetails_name,
            label: option?.attributedetails_name,
        }))
        : [];

    const handleChangeEmpIdSc = (selectedEmpIdSc) => {
        setSelectedEmpIdSc(selectedEmpIdSc);
        setEmpIdSc(selectedEmpIdSc ? selectedEmpIdSc.value : "");
    };

    const handleChangePrioritySc = (selectedPrioritySc) => {
        setSelectedPrioritySc(selectedPrioritySc);
        setPrioritySc(selectedPrioritySc ? selectedPrioritySc.value : "");
    };

    const handleChangeCurrencySc = (selectedCurrencySc) => {
        setSelectedCurrencySc(selectedCurrencySc);
        setCurrency_CodeSC(selectedCurrencySc ? selectedCurrencySc.value : "");
    };

    const searchClearInputFields = () => {
        settravel_request_idSC("");
        setrequest_numberSC("");
        setSelectedEmpIdSc("");
        setEmpIdSc("");
        setselecteddeptSC("");
        setdptSC("");
        settravel_typeSC("");
        setdestination_country_idSC("");
        setdestination_citySC("");
        setpurpose_of_travelSC("");
        setTravelStartDateSc("");
        setTravelEndDateSc("");
        settransport_modeSc("");
        setaccommodation_requiredSc("");
        setestimated_costSC("");
        setCurrency_CodeSC("");
        setSelectedReqStatusSC("");
        setReqStatusSC("");
        setselectedmanagerSC("");
        setProjectManagerSC("");
        setSelectedPrioritySc("");
        setPrioritySc("");
        setSelectedCurrencySc("");
    };

    const handleDPTSC = (selectedDPTSC) => {
        setselecteddeptSC(selectedDPTSC);
        setdptSC(selectedDPTSC ? selectedDPTSC.value : "");
        fetchProductCodesSC(selectedDPTSC ? selectedDPTSC.value : "");
    };

    const filteredOptionDPtSC = DPTdropSC.map((option) => ({
        value: option.dept_id,
        label: `${option.dept_id} - ${option.dept_name}`,
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
            .then((val) => setCountrydropSC(val))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    useEffect(() => {
        const company_code = sessionStorage.getItem("selectedCompanyCode");

        const fetchDept = async () => {
            try {
                const response = await fetch(`${config.apiBaseUrl}/DeptID`, {
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
                setDPTdropSC(val);
            } catch (error) {
                console.error("Error fetching departments:", error);
            }
        };

        if (company_code) {
            fetchDept();
        }
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
                const Countryptions = data.map((option) => ({
                    value: option.Country_Code,
                    label: `${option.Country_Code} - ${option.Country_Name}`,
                }));
                setCountrydropGR(Countryptions);
            })
            .catch((error) => console.error("Error fetching country data:", error));
    }, []);

    useEffect(() => {
        const company_code = sessionStorage.getItem("selectedCompanyCode");

        fetch(`${config.apiBaseUrl}/getEmployeeTypeDD`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ company_code }),
        })
            .then((response) => response.json())
            .then((data) => {
                const employmentptions = data.map((option) => ({
                    value: option.attributedetails_name,
                    label: `${option.attributedetails_name}`,
                }));
                setEmploymentdropGR(employmentptions);
            })
            .catch((error) =>
                console.error("Error fetching employee type data:", error),
            );
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
            .then((data) => data.json())
            .then((val) => {
                const currency = val.map(option => option.attributedetails_name);
                setCurrencyDropGrid(currency);
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    const columnDefs = [
        {
            headerName: "Actions",
            field: "actions",
        },
        {
            headerName: "Travel Request ID",
            field: "travel_request_id",
            editable: true,
        },
        // {
        //   headerName: "Request Number",
        //   field: "request_number",
        //   editable: true,
        // },
        {
            headerName: "Employee ID",
            field: "employee_id",
            editable: false,
        },
        {
            headerName: "Department",
            field: "department_id",
            editable: true,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: departmentDrop.map((d) => d.value),
            },
            valueFormatter: (params) => {
                const dept = departmentDrop.find((d) => d.value == params.value);
                return dept ? dept.label : params.value;
            },
        },
        {
            headerName: "Travel Type",
            field: "travel_type",
            editable: true,
        },
        {
            headerName: "Destination Country",
            field: "destination_country_id",
            editable: true,
            // cellEditor: "agSelectCellEditor",
            // cellEditorParams: {
            //   values: CountrydropGR.map((d) => d.value),
            // },
            // valueFormatter: (params) => {
            //   const country = CountrydropGR.find((d) => d.value == params.value);
            //   return country ? country.label : params.value;
            // },
        },
        {
            headerName: "Destination City",
            field: "destination_city",
            editable: true,
        },
        {
            headerName: "Purpose of Travel",
            field: "purpose_of_travel",
            editable: true,
        },
        {
            headerName: "Start Date",
            field: "travel_start_date",
            editable: true,
        },
        {
            headerName: "End Date",
            field: "travel_end_date",
            editable: true,
        },
        {
            headerName: "Transport Mode",
            field: "transport_mode",
            editable: true,
        },
        {
            headerName: "Accommodation Required",
            field: "accommodation_required",
            editable: true,
        },
        {
            headerName: "Estimated Cost",
            field: "estimated_cost",
            editable: true,
        },
        {
            headerName: "Currency Code",
            field: "currency_code",
            editable: true,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: currencyDropGrid,
            },
        },
        {
            headerName: "Request Status",
            field: "request_status",
            editable: false,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: reqStatusDropAG,
            },
        },
        {
            headerName: "Remarks",
            field: "Remarks",
            editable: true,
        },
        {
            headerName: "Priority",
            field: "priority_level",
            editable: true,
            filter: "agNumberColumnFilter",
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: PriorityGridDrop,
            },
        },
        {
            headerName: "Manager",
            field: "manager_id",
            editable: true,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: ManagerdropAG.map((d) => d.value),
            },
            valueFormatter: (params) => {
                const loan = ManagerdropAG.find((d) => d.value === params.value);
                return loan ? loan.label : params.value;
            },
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

    const handleSearch = async () => {
        setLoading(true);

        try {
            const body = {
                travel_request_id: travel_request_idSC || null,
                request_number: request_numberSC || "",
                employee_id: empIdSc || "",
                department_id: dptSC || "",
                travel_type: travel_typeSC || "",
                destination_country_id: destination_country_idSC || null,
                destination_city: destination_citySC || "",
                purpose_of_travel: purpose_of_travelSC || "",
                travel_start_date: travelStartDateSc || null,
                travel_end_date: travelEndDateSc || null,
                transport_mode: transport_modeSc || "",
                accommodation_required: accommodation_requiredSc || null,
                estimated_cost: estimated_costSC || null,
                currency_code: Currency_CodeSC || "",
                request_status: reqStatusSC || "",
                Remarks: remarksSc || "",
                priority_level: prioritySc || "",
                manager_id: ProjectManagerSC || null,
                company_code: sessionStorage.getItem("selectedCompanyCode"),
            };

            const response = await fetch(
                `${config.apiBaseUrl}/travel_requestsSearch`,
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

                const newRows = fetchedData.map((item) => ({
                    travel_request_id: item.travel_request_id,
                    request_number: item.request_number,
                    employee_id: item.employee_id,
                    department_id: item.department_id,
                    travel_type: item.travel_type,
                    destination_country_id: item.destination_country_id,
                    destination_city: item.destination_city,
                    purpose_of_travel: item.purpose_of_travel,
                    travel_start_date: item.travel_start_date,
                    travel_end_date: item.travel_end_date,
                    transport_mode: item.transport_mode,
                    accommodation_required: item.accommodation_required,
                    estimated_cost: item.estimated_cost,
                    currency_code: item.currency_code,
                    request_status: item.request_status,
                    Remarks: item.Remarks,
                    priority_level: item.priority_level,
                    manager_id: item.manager_id,
                    keyfield: item.keyfield,
                }));

                setRowData(newRows);
            } else if (response.status === 404) {
                toast.warning("Data Not found");
                setRowData([]);
            } else {
                const errorResponse = await response.json();
                toast.warning(errorResponse.message || "Search failed");
                setRowData([]);
            }
        } catch (error) {
            console.error("Error fetching search data:", error);
            toast.error("Error fetching search data: " + error.message);
            setRowData([]);
        } finally {
            setLoading(false);
        }
    };

    const reloadGridData = () => {
        setRowData([]);
        searchClearInputFields();
    };

    const transformRowData = (data) => {
        return data.map((row) => {
            const deptObj = departmentDrop.find((d) => d.value == row.department_id);
            const deptName = deptObj ? deptObj.label : "";

            const countryObj = CountrydropGR.find(
                (c) => c.value == row.destination_country_id,
            );
            const countryName = countryObj ? countryObj.label : "";

            return {
                "Travel Request ID": row.travel_request_id || "",
                "Request Number": row.request_number || "",
                "Employee ID": row.employee_id || "",
                Department: deptName,
                "Travel Type": row.travel_type || "",
                "Destination Country": countryName,
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

    const handleExportToExcel = () => {
        if (!rowData || rowData.length === 0) {
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

        const transformedData = transformRowData(rowData);

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

    return (
        <div class="container-fluid Topnav-screen ">
            {loading && <LoadingScreen />}
            <ToastContainer position="top-right" className="toast-design" theme="colored" />
            <div className="shadow-lg p-1 bg-light rounded main-header-box">
                <div className="header-flex">
                    <h1 className="page-title">Request Report</h1>
                    <div className="action-wrapper">
                        <div onClick={handleSave} className="action-icon add">
                            <span className="tooltip">Save</span>
                            <i class="fa-solid fa-floppy-disk"></i>
                        </div>
                    </div>
                </div>
            </div>

            <>
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
                            <div
                                className={`inputGroup selectGroup 
                            ${selectedReqStatusLoanSc ? "has-value" : ""} 
                            ${isSelectedReqStatusLoanSc ? "is-focused" : ""}`}
                                title="Please enter the Request Status"
                            >
                                <Select
                                    id="country"
                                    type="text"
                                    classNamePrefix="react-select"
                                    placeholder=""
                                    onFocus={() => setIsSelectedReqStatusLoanSc(true)}
                                    onBlur={() => setIsSelectedReqStatusLoanSc(false)}
                                    isClearable
                                    value={selectedReqStatusLoanSc}
                                    onChange={handleChangeReqStatusLoanSc}
                                    options={filteredOptionReqStatusLoanSc}
                                />
                                <label for="sname" className={`floating-label`}>Request Status</label>
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

                <div className="shadow-lg pt-3 pb-3 bg-light rounded mt-2 container-form-box" style={{ width: "100%" }}>
                    <div class="ag-theme-alpine" style={{ height: 455, width: "100%" }}>
                        <AgGridReact
                            columnDefs={columnLoanDefs}
                            rowData={rowLoanData}
                            pagination={true}
                            paginationAutoPageSize={true}
                            gridOptions={gridOptions}
                        />
                    </div>
                </div>
            </>

            <>
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
            </>

        </div>
    );
}
export default RequestReport;