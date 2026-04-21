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

function LoanRequest({ }) {

    const [rowData, setRowData] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [loanReqId, setLoanReqId] = useState('');
    const [reqNumber, setReqNumber] = useState('');
    const [empIdDrop, setEmpIdDrop] = useState([]);
    const [empId, setEmpId] = useState('');
    const [selectedEmpId, setSelectedEmpId] = useState('');
    const [loanTypeIdDrop, setLoanTypeIdDrop] = useState([]);
    const [loanTypeId, setLoanTypeId] = useState('');
    const [selectedLoanTypeId, setSelectedLoanIypeId] = useState('');
    const [loanAmount, setLoanAmount] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [repayMonth, setRepayMonth] = useState('');
    const [monthlyInstallment, setMonthlyInstallment] = useState('');
    const [currencyCode, setCurrencyCode] = useState('');
    const [purpose, setPurpose] = useState("");
    const [reqStatusDrop, setReqStatusDrop] = useState([]);
    const [reqStatus, setReqStatus] = useState('');
    const [selectedReqStatus, setSelectedReqStatus] = useState('');
    const [repaymentDate, setRepaymentDate] = useState('');
    const [selectedmanager, setselectedmanager] = useState("");
    const [ProjectManager, setProjectManager] = useState("");
    const [isSelectManager, setIsSelectManager] = useState(false);
    const [Managerdrop, setManagerdrop] = useState([]);
    const [ManagerdropAG, setManagerdropAG] = useState([]);

    const [loanReqIdSc, setLoanReqIdSc] = useState('');
    const [reqNumberSc, setReqNumberSc] = useState('');
    const [empIdDropSc, setEmpIdDropSc] = useState([]);
    const [empIdSc, setEmpIdSc] = useState('');
    const [selectedEmpIdSc, setSelectedEmpIdSc] = useState('');
    const [loanTypeIdDropSc, setLoanTypeIdDropSc] = useState([]);
    const [loanTypeIdSc, setLoanTypeIdSc] = useState('');
    const [selectedLoanTypeIdSc, setSelectedLoanIypeIdSc] = useState('');
    const [loanAmountSc, setLoanAmountSc] = useState('');
    const [interestRateSc, setInterestRateSc] = useState('');
    const [repayMonthSc, setRepayMonthSc] = useState('');
    const [monthlyInstallmentSc, setMonthlyInstallmentSc] = useState('');
    const [currencyCodeSc, setCurrencyCodeSc] = useState('');
    const [purposeSc, setPurposeSc] = useState("");
    const [reqStatusDropSc, setReqStatusDropSc] = useState([]);
    const [reqStatusSc, setReqStatusSc] = useState('');
    const [selectedReqStatusSc, setSelectedReqStatusSc] = useState('');
    const [repaymentDateSc, setRepaymentDateSc] = useState('');
    const [selectedmanagerSC, setselectedmanagerSC] = useState("");
    const [isSelectManagerSC, setIsSelectManagerSC] = useState(false);
    const [ManagerdropSC, setManagerdropSC] = useState([]);
    const [ProjectManagerSC, setProjectManagerSC] = useState("");

    const [isSelectedEmpId, setIsSelectedEmpId] = useState(false);
    const [isSelectedLoanType, setIsSelectedLoanType] = useState(false);
    const [isSelectedReqStatus, setIsSelectedReqStatus] = useState(false);

    const [isSelectedEmpIdSc, setIsSelectedEmpIdSc] = useState(false);
    const [isSelectedLoanTypeSc, setIsSelectedLoanTypeSc] = useState(false);
    const [isSelectedReqStatusSc, setIsSelectedReqStatusSc] = useState(false);

    const [empIdDropGrid, setEmpIdDropGrid] = useState([]);
    const [loanTypeIdDropGrid, setLoanTypeIdDropGrid] = useState([]);
    const [reqStatusDropGrid, setReqStatusDropGrid] = useState([]);

    const [currencyDrop, setCurrencyDrop] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState('');
    const [isSelectedCurrency, setIsSelectedCurrency] = useState(false);

    const [currencyDropSc, setCurrencyDropSc] = useState([]);
    const [selectedCurrencySc, setSelectedCurrencySc] = useState('');
    const [isSelectedCurrencySc, setIsSelectedCurrencySc] = useState(false);

    const [currencyDropGrid, setCurrencyDropGrid] = useState([]);

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
            .then((val) => setEmpIdDrop(val))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    // useEffect(() => {
    //     const company_code = sessionStorage.getItem('selectedCompanyCode');
    //     fetch(`${config.apiBaseUrl}/getLoanTypes`, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({ company_code })
    //     })
    //         .then((data) => data.json())
    //         .then((val) => setLoanTypeIdDrop(val))
    //         .catch((error) => console.error('Error fetching data:', error));
    // }, []);

    useEffect(() => {
        const company_code = sessionStorage.getItem('selectedCompanyCode');
        fetch(`${config.apiBaseUrl}/status`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ company_code })
        })
            .then((data) => data.json())
            .then((val) => setReqStatusDrop(val))
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
            .then((val) => setCurrencyDrop(val))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    useEffect(() => {
        const Company_Code = sessionStorage.getItem("selectedCompanyCode");

        fetch(`${config.apiBaseUrl}/LoanTypeIdDropDown`, { // match backend route name
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ Company_Code }),
        })
            .then((res) => res.json())
            .then((data) => setLoanTypeIdDrop(data))
            .catch((error) => console.error("Error fetching loan types:", error));
    }, []);

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
            .then((response) => response.json())
            .then(setManagerdrop)
            .catch((error) => console.error("Error fetching warehouse:", error));
    }, []);

    const filteredOptionEmpId = Array.isArray(empIdDrop)
        ? empIdDrop.map((option) => ({
            value: option?.EmployeeId,
            label: `${option?.EmployeeId}-${option?.First_Name}`,
        }))
        : [];

    // const filteredOptionLoanType = Array.isArray(loanTypeIdDrop)
    //     ? loanTypeIdDrop.map((option) => ({
    //         value: option?.attributedetails_name,
    //         label: option?.attributedetails_name,
    //     }))
    //     : [];

    const filteredOptionLoanType = Array.isArray(loanTypeIdDrop)
        ? loanTypeIdDrop.map((option) => ({
            value: option.Loan_Type_ID,
            label: `${option.Loan_Type_ID} - ${option.Loan_Type_Name}`,
        }))
        : [];

    const filteredOptionCurrency = Array.isArray(currencyDrop)
        ? currencyDrop.map((option) => ({
            value: option?.attributedetails_name,
            label: option?.attributedetails_name,
        }))
        : [];

    const filteredOptionReqStatus = Array.isArray(reqStatusDrop)
        ? reqStatusDrop.map((option) => ({
            value: option?.attributedetails_name,
            label: option?.attributedetails_name,
        }))
        : [];

    const filteredOptionManager = Array.isArray(Managerdrop)
        ? Managerdrop.map((option) => ({
            value: option.EmployeeId,
            label: `${option.EmployeeId}-${option.full_name}`,
        }))
        : [];

    const handleChangeEmpId = (selectedEmpId) => {
        setSelectedEmpId(selectedEmpId);
        setEmpId(selectedEmpId ? selectedEmpId.value : "");
    };

    const handleChangeLoanType = (selectedLoanTypeId) => {
        setSelectedLoanIypeId(selectedLoanTypeId);
        setLoanTypeId(selectedLoanTypeId ? selectedLoanTypeId.value : "");
    };

    const handleChangeReqStatus = (selectedReqStatus) => {
        setSelectedReqStatus(selectedReqStatus);
        setReqStatus(selectedReqStatus ? selectedReqStatus.value : "");
    };

    const handleChangeCurrency = (selectedCurrency) => {
        setSelectedCurrency(selectedCurrency);
        setCurrencyCode(selectedCurrency ? selectedCurrency.value : "");
    };

    const handleChangemanager = (selectedOption) => {
        setselectedmanager(selectedOption);
        setProjectManager(selectedOption ? selectedOption.value : "");
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
            .then((val) => setEmpIdDropSc(val))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    useEffect(() => {
        const company_code = sessionStorage.getItem('selectedCompanyCode');
        fetch(`${config.apiBaseUrl}/LoanTypeIdDropDown`, {
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
            .then((val) => setReqStatusDropSc(val))
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
            .then((val) => setCurrencyDropSc(val))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

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
            .then((response) => response.json())
            .then(setManagerdropSC)
            .catch((error) => console.error("Error fetching warehouse:", error));
    }, []);

    const filteredOptionEmpIdSc = Array.isArray(empIdDropSc)
        ? empIdDropSc.map((option) => ({
            value: option?.EmployeeId,
            label: `${option?.EmployeeId}-${option?.First_Name}`,
        }))
        : [];

    const filteredOptionLoanTypeSc = Array.isArray(loanTypeIdDropSc)
        ? loanTypeIdDropSc.map((option) => ({
            value: option.Loan_Type_ID,
            label: `${option.Loan_Type_ID} - ${option.Loan_Type_Name}`,
        }))
        : [];

    const filteredOptionReqStatusSc = Array.isArray(reqStatusDropSc)
        ? [
            { value: "All", label: "All" },
            ...reqStatusDropSc.map((option) => ({
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

    const filteredOptionManagerSC = Array.isArray(ManagerdropSC)
        ? ManagerdropSC.map((option) => ({
            value: option.EmployeeId,
            label: `${option.EmployeeId}-${option.full_name}`,
        }))
        : [];

    const handleChangeEmpIdSc = (selectedEmpIdSc) => {
        setSelectedEmpIdSc(selectedEmpIdSc);
        setEmpIdSc(selectedEmpIdSc ? selectedEmpIdSc.value : "");
    };

    const handleChangeLoanTypeSc = (selectedLoanTypeIdSc) => {
        setSelectedLoanIypeIdSc(selectedLoanTypeIdSc);
        setLoanTypeIdSc(selectedLoanTypeIdSc ? selectedLoanTypeIdSc.value : "");
    };

    const handleChangeReqStatusSc = (selectedReqStatusSc) => {
        setSelectedReqStatusSc(selectedReqStatusSc);
        setReqStatusSc(selectedReqStatusSc ? selectedReqStatusSc.value : "");
    };

    const handleChangeCurrencySc = (selectedCurrencySc) => {
        setSelectedCurrencySc(selectedCurrencySc);
        setCurrencyCodeSc(selectedCurrencySc ? selectedCurrencySc.value : "");
    };

    const handleChangemanagerSC = (selectedOption) => {
        setselectedmanagerSC(selectedOption);
        setProjectManagerSC(selectedOption ? selectedOption.value : "");
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
                setEmpIdDropGrid(emp);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    useEffect(() => {
        const Company_Code = sessionStorage.getItem('selectedCompanyCode');

        fetch(`${config.apiBaseUrl}/LoanTypeIdDropDown`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ Company_Code })
        })
            .then((response) => response.json())
            .then((data) => {
                const loanTypeOptions = data.map((option) => ({
                    value: option.Loan_Type_ID,           // adjust based on your DB column
                    label: `${option.Loan_Type_ID} - ${option.Loan_Type_Name}`,
                }));

                setLoanTypeIdDropGrid(loanTypeOptions);
            })
            .catch((error) => console.error('Error fetching loan types:', error));
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

    const searchClearInputFields = () => {
        setLoanReqIdSc("");
        setReqNumberSc("");
        setEmpIdSc("");
        setSelectedEmpIdSc("");
        setLoanTypeIdSc("");
        setSelectedLoanIypeIdSc("");
        setLoanAmountSc("");
        setInterestRateSc("");
        setRepayMonthSc("");
        setMonthlyInstallmentSc("");
        setCurrencyCodeSc("");
        setPurposeSc("");
        setReqStatusSc("");
        setSelectedReqStatusSc("");
        setRepaymentDateSc("");
        setSelectedCurrencySc("");
        setSelectedCurrency("");
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
                                    onClick={() => handleUpdate(params.data, params.node.data)}
                                    style={{ cursor: 'pointer' }}
                                    title="Update"
                                >
                                    <i className="fa-regular fa-floppy-disk"></i>
                                </span>

                                <span
                                    className="icon mx-2"
                                    onClick={() => handleDelete(params.data)}
                                    style={{ cursor: 'pointer' }}
                                    title="Delete"
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
                values: empIdDropGrid.map(d => d.value),
            },
            valueFormatter: (params) => {
                const dept = empIdDropGrid.find(d => d.value === params.value);
                return dept ? dept.label : params.value;
            },
        },
        // {
        //     headerName: "Request Number",
        //     field: "request_number",
        //     editable: true
        // },
        {
            headerName: "Loan Type ID",
            field: "loan_type_id",
            editable: true,
            cellStyle: { textAlign: "left" },
            cellEditor: "agSelectCellEditor",
            // cellEditorParams: {
            //     values: loanTypeIdDropGrid,
            // },
            cellEditorParams: {
                values: loanTypeIdDropGrid.map(d => d.value),
            },
            valueFormatter: (params) => {
                const dept = loanTypeIdDropGrid.find(d => d.value === params.value);
                return dept ? dept.label : params.value;
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
                values: currencyDropGrid,
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
                values: reqStatusDropGrid,
            },
        },
        {
            headerName: "Repayment Date",
            field: "repayment_date",
            editable: true,
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
            editable: true,
            hide: true
        }
    ]

    const gridOptions = {
        pagination: true,
        paginationPageSize: 10,
    };

    const handleSave = async () => {
        if (
            // !loanReqId ||
            // !empId ||
            !loanTypeId ||
            !loanAmount ||
            !interestRate ||
            !repayMonth ||
            !monthlyInstallment ||
            !currencyCode ||
            !ProjectManager ||
            // !reqStatus ||
            !repaymentDate
        ) {
            setError(" ");
            toast.warning("Error: Missing required fields");
            return;
        }

        setLoading(true);

        try {
            const Header = {
                loan_request_id: loanReqId,
                request_number: reqNumber,
                employee_id: sessionStorage.getItem('selectedUserCode'),
                loan_type_id: loanTypeId,
                loan_amount: loanAmount,
                interest_rate: interestRate,
                repayment_months: repayMonth,
                monthly_installment: monthlyInstallment,
                currency_code: currencyCode,
                purpose: purpose,
                request_status: 'Pending',
                repayment_date: repaymentDate,
                manager_id: ProjectManager,
                company_code: sessionStorage.getItem('selectedCompanyCode'),
                created_by: sessionStorage.getItem('selectedUserCode')
            };
            const response = await fetch(`${config.apiBaseUrl}/loan_requestsInsert`, {
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
                loan_request_id: loanReqIdSc,
                request_number: reqNumberSc,
                employee_id: sessionStorage.getItem('selectedUserCode'),
                loan_type_id: loanTypeIdSc,
                loan_amount: loanAmountSc ? loanAmountSc : 0,
                interest_rate: interestRateSc ? interestRateSc : 0,
                repayment_months: repayMonthSc,
                monthly_installment: monthlyInstallmentSc ? monthlyInstallmentSc : 0,
                currency_code: currencyCodeSc,
                purpose: purposeSc,
                request_status: reqStatusSc,
                repayment_date: repaymentDateSc,
                manager_id: ProjectManagerSC,
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
                setRowData(fetchedData);
            } else if (response.status === 404) {
                console.log("Data Not found");
                toast.warning("Data Not found");
                setRowData([]);
            } else {
                const errorResponse = await response.json();
                toast.warning(errorResponse.message || "Failed to insert sales data");
                console.error(errorResponse.details || errorResponse.message);
                setRowData([]);
            }
        } catch (error) {
            console.error("Error fetching search data:", error);
            toast.error("Error fetching search data:", error);
            setRowData([]);
        } finally {
            setLoading(false);
        }
    };

    const reloadGridData = () => {
        setRowData([]);
        searchClearInputFields();
    };

    const handleUpdate = async (rowData) => {

        showConfirmationToast(
            "Are you sure you want to update the selected loan request data?",
            async () => {
                try {
                    setLoading(true);
                    const company_code = sessionStorage.getItem("selectedCompanyCode");
                    const modified_by = sessionStorage.getItem("selectedUserCode");

                    const dataToSend = {
                        loan_requestsData: Array.isArray(rowData)
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

                    const response = await fetch(`${config.apiBaseUrl}/loan_requestsLoopUpdate`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(dataToSend),
                        },
                    );

                    if (response.ok) {
                        toast.success("loan request updated successfully", {
                            onClose: () => handleSearch(),
                        });
                    } else {
                        const errorResponse = await response.json();
                        toast.warning(errorResponse.message || "Update failed");
                    }
                } catch (error) {
                    console.error("Update error:", error);
                    toast.error("Error updating data: " + error.message);
                } finally {
                    setLoading(false);
                }
            },
            () => toast.info("Update cancelled"),
        );
    };

    const handleDelete = async (rowData) => {

        showConfirmationToast(
            "Are you sure you want to delete the selected loan request data?",
            async () => {
                try {
                    setLoading(true);
                    const company_code = sessionStorage.getItem("selectedCompanyCode");
                    const modified_by = sessionStorage.getItem("selectedUserCode");

                    const dataToSend = {
                        loan_requestsData: Array.isArray(rowData)
                            ? rowData.map((row) => ({
                                ...row,
                                company_code,
                                modified_by
                            }))
                            : [
                                {
                                    ...rowData,
                                    company_code,
                                    modified_by
                                },
                            ],
                    };

                    const response = await fetch(`${config.apiBaseUrl}/loan_requestsLoopDelete`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "company_code": company_code
                            },
                            body: JSON.stringify(dataToSend),
                        },
                    );

                    if (response.ok) {
                        toast.success("loan request deleted successfully", {
                            onClose: () => handleSearch(), // refresh data
                        });
                    } else {
                        const errorResponse = await response.json();
                        toast.warning(errorResponse.message || "Delete failed");
                    }
                } catch (error) {
                    console.error("Error deleting loan request rows:", error);
                    toast.error("Error deleting loan request data: " + error.message);
                } finally {
                    setLoading(false);
                }
            },
            () => toast.info("Delete cancelled"),
        );
    };

    const getCSSVariable = (variableName) => {
        return getComputedStyle(document.documentElement)
            .getPropertyValue(variableName)
            .trim();
    };

    const transformRowData = (data) => {
        return data.map((row) => {
            const empObj = empIdDropGrid.find(
                (d) => d.value === row.employee_id
            );

            const empName = empObj
                ? empObj.label.split(" - ").slice(1).join(" - ")
                : "";

            return {
                "Loan Request ID": row.loan_request_id || "",
                "Employee ID": `${row.employee_id} - ${empName}` || "",
                // "Request Number": row.request_number || "",
                "Loan Type ID": row.loan_type_id || "",
                "Loan Amount": row.loan_amount || "",
                "Interest Rate": row.interest_rate || "",
                "Repayment Months": row.repayment_months || "",
                "Monthly Installment": row.monthly_installment || "",
                "Currency Code": row.currency_code || "",
                "Purpose": row.purpose || "",
                "Request Status": row.request_status || "",
                "Repayment Date": row.repayment_date || "",
                Manager: row.manager_id || "",
            };
        });
    };

    const handleExportToExcel = () => {
        if (!rowData || rowData.length === 0) {
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
        XLSX.utils.book_append_sheet(workbook, worksheet, "Loan Request");

        XLSX.writeFile(workbook, "Loan_Request_Search_Report.xlsx");
    };

    return (
        <div class="container-fluid Topnav-screen ">
            {loading && <LoadingScreen />}
            <ToastContainer position="top-right" className="toast-design" theme="colored" />
            <div className="shadow-lg p-1 bg-light rounded main-header-box">
                <div className="header-flex">
                    <h1 className="page-title">Loan Request</h1>
                    <div className="action-wrapper">
                        <div onClick={handleSave} className="action-icon add">
                            <span className="tooltip">Save</span>
                            <i class="fa-solid fa-floppy-disk"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div className="shadow-lg p-3 bg-light rounded mt-2 container-form-box">
                <div className="row g-3">

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
                                title="Please enter the Loan Request ID"
                                autoComplete="off"
                                value={loanReqId}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "");
                                    setLoanReqId(value);
                                }}
                            />
                            <label for="sname" className={`exp-form-labels ${error && !loanReqId ? 'text-danger' : ''}`}>Loan Request ID<span className="text-danger">*</span></label>
                        </div>
                    </div> */}

                    {/* <div className="col-md-2">
                        <div
                            className={`inputGroup selectGroup 
                            ${selectedEmpId ? "has-value" : ""} 
                            ${isSelectedEmpId ? "is-focused" : ""}`}
                            title="Please enter the Employee ID"
                        >
                            <Select
                                id="department"
                                placeholder=" "
                                onFocus={() => setIsSelectedEmpId(true)}
                                onBlur={() => setIsSelectedEmpId(false)}
                                classNamePrefix="react-select"
                                isClearable
                                type="text"
                                value={selectedEmpId}
                                onChange={handleChangeEmpId}
                                options={filteredOptionEmpId}
                            />
                            <label htmlFor="selecteddpt" className={`floating-label ${error && !empId ? 'text-danger' : ''}`}>
                                Employee ID<span className="text-danger">*</span>
                            </label>
                        </div>
                    </div> */}

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
                                required title="Please Enter the Request Number"
                                autoComplete="off"
                                value={reqNumber}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "");
                                    setReqNumber(value);
                                }}
                            />
                            <label for="sname" className={`exp-form-labels`}>Request Number</label>
                        </div>
                    </div> */}

                    <div className="col-md-2">
                        <div
                            className={`inputGroup selectGroup 
                            ${selectedLoanTypeId ? "has-value" : ""} 
                            ${isSelectedLoanType ? "is-focused" : ""}`}
                            title="Please enter the Loan Type ID"
                        >
                            <Select
                                id="country"
                                type="text"
                                classNamePrefix="react-select"
                                placeholder=""
                                onFocus={() => setIsSelectedLoanType(true)}
                                onBlur={() => setIsSelectedLoanType(false)}
                                isClearable
                                value={selectedLoanTypeId}
                                onChange={handleChangeLoanType}
                                options={filteredOptionLoanType}
                            />
                            <label for="sname" className={`floating-label ${error && !loanTypeId ? 'text-danger' : ''}`}>Loan Type ID<span className="text-danger">*</span></label>
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
                                value={loanAmount}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "");
                                    setLoanAmount(value);
                                }}
                            />
                            <label for="sname" className={`exp-form-labels ${error && !loanAmount ? 'text-danger' : ''}`}>Loan Amount<span className="text-danger">*</span></label>
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
                                title="Please enter the Interest Rate"
                                required
                                autoComplete="off"
                                value={interestRate}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/[^0-9.]/g, "");
                                    setInterestRate(value);
                                }}
                            />
                            <label for="sname" className={`exp-form-labels ${error && !interestRate ? 'text-danger' : ''}`}>Interest Rate<span className="text-danger">*</span></label>
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
                                title="Please enter the Repayment Months"
                                autoComplete="off"
                                value={repayMonth}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "");
                                    setRepayMonth(value);
                                }}
                            />
                            <label for="sname" className={`exp-form-labels ${error && !repayMonth ? 'text-danger' : ''}`}>Repayment Months<span className="text-danger">*</span></label>
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
                                value={monthlyInstallment}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "");
                                    setMonthlyInstallment(value);
                                }}
                            />
                            <label for="sname" className={`exp-form-labels ${error && !monthlyInstallment ? 'text-danger' : ''}`}>Monthly Installment<span className="text-danger">*</span></label>
                        </div>
                    </div>

                    {/* <div className="col-md-2">
                        <div className="inputGroup">
                            <input
                                id="fdate"
                                class="exp-input-field form-control"
                                type="text"
                                placeholder=""
                                required title="Please Enter the Currency Code"
                                autoComplete="off"
                                maxLength={3}
                                value={currencyCode}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/[^a-zA-Z]/g, "").toUpperCase();
                                    setCurrencyCode(value);
                                }}
                            />
                            <label for="sname" className={`exp-form-labels ${error && !currencyCode ? 'text-danger' : ''}`}>Currency Code<span className="text-danger">*</span></label>
                        </div>
                    </div> */}

                    <div className="col-md-2">
                        <div
                            className={`inputGroup selectGroup 
                            ${selectedCurrency ? "has-value" : ""} 
                            ${isSelectedCurrency ? "is-focused" : ""}`}
                            title="Please select the Currency Code"
                        >
                            <Select
                                id="country"
                                type="text"
                                classNamePrefix="react-select"
                                placeholder=""
                                onFocus={() => setIsSelectedCurrency(true)}
                                onBlur={() => setIsSelectedCurrency(false)}
                                isClearable
                                value={selectedCurrency}
                                onChange={handleChangeCurrency}
                                options={filteredOptionCurrency}
                            />
                            <label for="sname" className={`floating-label ${error && !currencyCode ? 'text-danger' : ''}`}>Currency Code<span className="text-danger">*</span></label>
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
                                value={purpose}
                                maxLength={100}
                                onChange={(e) => setPurpose((e.target.value))}
                            />
                            <label for="sname" className={`exp-form-labels`}>Purpose</label>
                        </div>
                    </div>

                    {/* <div className="col-md-2">
                        <div
                            className={`inputGroup selectGroup 
                            ${selectedReqStatus ? "has-value" : ""} 
                            ${isSelectedReqStatus ? "is-focused" : ""}`}
                            required title="Please Enter the Request Status"
                        >
                            <Select
                                id="country"
                                type="text"
                                classNamePrefix="react-select"
                                placeholder=""
                                onFocus={() => setIsSelectedReqStatus(true)}
                                onBlur={() => setIsSelectedReqStatus(false)}
                                isClearable
                                value={selectedReqStatus}
                                onChange={handleChangeReqStatus}
                                options={filteredOptionReqStatus}
                            />
                            <label for="sname" className={`floating-label ${error && !reqStatus ? 'text-danger' : ''}`}>Request Status<span className="text-danger">*</span></label>
                        </div>
                    </div> */}

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
                                value={repaymentDate}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "");

                                    if (value === "") {
                                        setRepaymentDate("");
                                        return;
                                    }

                                    const num = parseInt(value, 10);

                                    if (num === 0 || num > 31) {
                                        toast.warning("Please enter a date between 1 and 31");
                                        return;
                                    }

                                    setRepaymentDate(value);
                                }}
                            />
                            <label for="sname" className={`exp-form-labels ${error && !repaymentDate ? 'text-danger' : ''}`}>Repayment Date<span className="text-danger">*</span></label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div
                            className={`inputGroup selectGroup 
                            ${selectedmanager ? "has-value" : ""} 
                            ${isSelectManager ? "is-focused" : ""}`}
                            title="Please select the Manager"
                        >
                            <Select
                                id="LoanEligibleAmount"
                                type="text"
                                placeholder=" "
                                onFocus={() => setIsSelectManager(true)}
                                onBlur={() => setIsSelectManager(false)}
                                classNamePrefix="react-select"
                                isClearable
                                value={selectedmanager}
                                options={filteredOptionManager}
                                onChange={handleChangemanager}
                                maxLength={18}
                            />
                            <label
                                for="add1"
                                className={`floating-label ${error && !ProjectManager ? "text-danger" : ""}`}
                            >
                                Manager<span className="text-danger">*</span>
                            </label>
                        </div>
                    </div>

                </div>
            </div>

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

                    {/* <div className="col-md-2">
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
                    </div> */}

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
                                required title="Please Enter the Request Number"
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
                                value={interestRateSc}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/[^0-9.]/g, "");
                                    setInterestRateSc(value);
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
                                value={repayMonthSc}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "");
                                    setRepayMonthSc(value);
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
                                value={monthlyInstallmentSc}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "");
                                    setMonthlyInstallmentSc(value);
                                }}
                            />
                            <label for="sname" className={`exp-form-labels`}>Monthly Installment</label>
                        </div>
                    </div>

                    {/* <div className="col-md-2">
                        <div className="inputGroup">
                            <input
                                id="fdate"
                                class="exp-input-field form-control"
                                type="text"
                                placeholder=""
                                required title="Please Enter the Currency Code"
                                autoComplete="off"
                                maxLength={3}
                                value={currencyCodeSc}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/[^a-zA-Z]/g, "").toUpperCase();
                                    setCurrencyCodeSc(value);
                                }}
                            />
                            <label for="sname" className={`exp-form-labels`}>Currency Code</label>
                        </div>
                    </div> */}

                    <div className="col-md-2">
                        <div
                            className={`inputGroup selectGroup 
                            ${selectedCurrencySc ? "has-value" : ""} 
                            ${isSelectedCurrencySc ? "is-focused" : ""}`}
                            title="Please select the Currency Code"
                        >
                            <Select
                                id="country"
                                type="text"
                                classNamePrefix="react-select"
                                placeholder=""
                                onFocus={() => setIsSelectedCurrencySc(true)}
                                onBlur={() => setIsSelectedCurrencySc(false)}
                                isClearable
                                value={selectedCurrencySc}
                                onChange={handleChangeCurrencySc}
                                options={filteredOptionCurrencySc}
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
                                value={purposeSc}
                                maxLength={100}
                                onChange={(e) => setPurposeSc((e.target.value))}
                            />
                            <label for="sname" className={`exp-form-labels`}>Purpose</label>
                        </div>
                    </div>

                    <div className="col-md-2">
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
                                value={repaymentDateSc}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "");

                                    if (value === "") {
                                        setRepaymentDateSc("");
                                        return;
                                    }

                                    const num = parseInt(value, 10);

                                    if (num === 0 || num > 31) {
                                        toast.warning("Please enter a date between 1 and 31");
                                        return;
                                    }

                                    setRepaymentDateSc(value);
                                }}
                            />
                            <label for="sname" className={`exp-form-labels`}>Repayment Date</label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div
                            className={`inputGroup selectGroup 
                            ${selectedmanagerSC ? "has-value" : ""} 
                            ${isSelectManagerSC ? "is-focused" : ""}`}
                            title="Please select the Manager"
                        >
                            <Select
                                id="LoanEligibleAmount"
                                type="text"
                                placeholder=" "
                                onFocus={() => setIsSelectManagerSC(true)}
                                onBlur={() => setIsSelectManagerSC(false)}
                                classNamePrefix="react-select"
                                isClearable
                                value={selectedmanagerSC}
                                options={filteredOptionManagerSC}
                                onChange={handleChangemanagerSC}
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
                        columnDefs={columnDefs}
                        rowData={rowData}
                        pagination={true}
                        paginationAutoPageSize={true}
                        gridOptions={gridOptions}
                    />
                </div>
            </div>


        </div>
    );
}
export default LoanRequest;