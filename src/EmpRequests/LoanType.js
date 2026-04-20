import { useState, useEffect } from "react";
import "../input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { showConfirmationToast } from '../ToastConfirmation';
import LoadingScreen from '../Loading';
import * as XLSX from "xlsx-js-style";
import Select from 'react-select';
const config = require('../Apiconfig');

const getFinancialYearDates = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // getMonth() is 0-based
    let startYear, endYear;

    if (currentMonth < 4) {
        startYear = currentYear - 1;
        endYear = currentYear;
    } else {
        startYear = currentYear;
        endYear = currentYear + 1;
    }

    const FirstDate = `${startYear}-04-01`;
    const LastDate = `${endYear}-03-31`;

    return { FirstDate, LastDate };
};

const { FirstDate, LastDate } = getFinancialYearDates();

function LoanType({ }) {
    const [error, setError] = useState(false);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const [rowData, setRowData] = useState([]);
    const [gridApi, setGridApi] = useState(null);
    const [loading, setLoading] = useState(false);

    const [loanTypeId, setLoanTypeId] = useState('');
    const [loanTypeNameDrop, setLoanTypeNameDrop] = useState([]);
    const [loanTypeName, setLoanTypeName] = useState('');
    const [selectedLoanTypeName, setSelectedLoanTypeName] = useState('');
    const [maxAmount, setMaxAmount] = useState('');
    const [maxRepaymentMonths, setMaxRepaymentMonths] = useState('');
    const [defaultInterestRate, setDefaultInterestRate] = useState('');
    const [description, setDescription] = useState('');
    const [statusDrop, setStatusDrop] = useState([]);
    const [status, setStatus] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [startYear, setStartYear] = useState(FirstDate);
    const [endYear, setEndYear] = useState(LastDate);

    const [loanTypeIdSc, setLoanTypeIdSc] = useState('');
    const [loanTypeNameDropSc, setLoanTypeNameDropSc] = useState([]);
    const [loanTypeNameSc, setLoanTypeNameSc] = useState('');
    const [selectedLoanTypeNameSc, setSelectedLoanTypeNameSc] = useState('');
    const [maxAmountSc, setMaxAmountSc] = useState('');
    const [maxRepaymentMonthsSc, setMaxRepaymentMonthsSc] = useState('');
    const [defaultInterestRateSc, setDefaultInterestRateSc] = useState('');
    const [descriptionSc, setDescriptionSc] = useState('');
    const [statusDropSc, setStatusDropSc] = useState([]);
    const [statusSc, setStatusSc] = useState('');
    const [selectedStatusSc, setSelectedStatusSc] = useState('');
    const [startYearSc, setStartYearSc] = useState(FirstDate);
    const [endYearSc, setEndYearSc] = useState(LastDate);

    const [isSelectedLoanTypeName, setIsSelectedLoanTypeName] = useState(false);
    const [isSelectedStatus, setIsSelectedStatus] = useState(false);

    const [isSelectedLoanTypeNameSc, setIsSelectedLoanTypeNameSc] = useState(false);
    const [isSelectedStatusSc, setIsSelectedStatusSc] = useState(false);

    const [loanTypeNameDropGrid, setLoanTypeNameDropGrid] = useState([]);
    const [statusDropGrid, setStatusDropGrid] = useState([]);

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
            .then((val) => setLoanTypeNameDrop(val))
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
            .then((data) => data.json())
            .then((val) => setStatusDrop(val))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    const filteredOptionLoanType = Array.isArray(loanTypeNameDrop)
        ? loanTypeNameDrop.map((option) => ({
            value: option?.attributedetails_name,
            label: option?.attributedetails_name,
        }))
        : [];

    const filteredOptionStatus = Array.isArray(statusDrop)
        ? statusDrop.map((option) => ({
            value: option?.attributedetails_name,
            label: option?.attributedetails_name,
        }))
        : [];

    const handleChangeLoanType = (selectedLoanTypeName) => {
        setSelectedLoanTypeName(selectedLoanTypeName);
        setLoanTypeName(selectedLoanTypeName ? selectedLoanTypeName.value : "");
    };

    const handleChangeStatus = (selectedStatus) => {
        setSelectedStatus(selectedStatus);
        setStatus(selectedStatus ? selectedStatus.value : "");
    };

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
            .then((val) => setLoanTypeNameDropSc(val))
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
            .then((data) => data.json())
            .then((val) => setStatusDropSc(val))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    const filteredOptionLoanTypeSc = Array.isArray(loanTypeNameDropSc)
        ? loanTypeNameDropSc.map((option) => ({
            value: option?.attributedetails_name,
            label: option?.attributedetails_name,
        }))
        : [];

    const filteredOptionStatusSc = Array.isArray(statusDropSc)
        ? statusDropSc.map((option) => ({
            value: option?.attributedetails_name,
            label: option?.attributedetails_name,
        }))
        : [];

    const handleChangeLoanTypeSc = (selectedLoanTypeNameSc) => {
        setSelectedLoanTypeNameSc(selectedLoanTypeNameSc);
        setLoanTypeNameSc(selectedLoanTypeNameSc ? selectedLoanTypeNameSc.value : "");
    };

    const handleChangeStatusSc = (selectedStatusSc) => {
        setSelectedStatusSc(selectedStatusSc);
        setStatusSc(selectedStatusSc ? selectedStatusSc.value : "");
    };

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
                setLoanTypeNameDropGrid(visaType);
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
            .then((data) => data.json())
            .then((val) => {
                const status = val.map(option => option.attributedetails_name);
                setStatusDropGrid(status);
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    const searchClearInputFields = () => {
        setLoanTypeIdSc("");
        setLoanTypeNameSc("");
        setSelectedLoanTypeNameSc("");
        setMaxAmountSc("");
        setMaxRepaymentMonthsSc("");
        setDefaultInterestRateSc("");
        setDescriptionSc("");
        setStatusSc("");
        setSelectedStatusSc("");
        setStartYearSc("");
        setEndYearSc("");
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
            headerName: "Start Year",
            field: "Start_Year",
            editable: true,
        },
        {
            headerName: "End Year",
            field: "End_Year",
            editable: true,
        },
        {
            headerName: "Loan Type ID",
            field: "Loan_Type_ID",
            editable: false,
        },
        {
            headerName: "Loan Type Name",
            field: "Loan_Type_Name",
            editable: true,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: loanTypeNameDropGrid,
            },
        },
        {
            headerName: "Max Amount",
            field: "Max_amount",
            editable: true,
        },
        {
            headerName: "Max Repayment Months",
            field: "Max_repayment_months",
            editable: true,
        },
        {
            headerName: "Default Interest Rate",
            field: "Default_interest_rate",
            editable: true,
        },
        {
            headerName: "Description",
            field: "Description",
            editable: true,
        },
        {
            headerName: "Status",
            field: "Status",
            editable: true,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: statusDropGrid,
            },
        },
        {
            headerName: "Keyfield",
            field: "keyfield",
            hide: true
        },
    ]

    const gridOptions = {
        pagination: true,
        paginationPageSize: 10,
    };

    const reloadGridData = () => {
        setRowData([]);
        searchClearInputFields();
    }

    const onGridReady = (params) => {
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);
    };

    const handleSearch = async () => {
        setLoading(true)
        try {
            const body = {
                company_code: sessionStorage.getItem("selectedCompanyCode"),
                Loan_Type_ID: loanTypeIdSc,
                Loan_Type_Name: loanTypeNameSc,
                Max_amount: maxAmountSc ? maxAmountSc : 0,
                Max_repayment_months: maxRepaymentMonthsSc,
                Default_interest_rate: defaultInterestRateSc ? defaultInterestRateSc : 0,
                Description: descriptionSc,
                Status: statusSc,
                Start_Year: startYearSc,
                End_Year: endYearSc,
            };

            const response = await fetch(`${config.apiBaseUrl}/getLoanType`, {
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
                toast.warning(errorResponse.message || "Failed to fetch loan data");
                console.error(errorResponse.details || errorResponse.message);
                setRowData([]);
            }
        } catch (error) {
            console.error("Error fetching search data:", error);
            toast.error("An unexpected error occurred while fetching data.");
        } finally {
            setLoading(false);
        }
    };

    const handleInsert = async () => {
        if (!loanTypeId || !loanTypeName || !maxAmount || !maxRepaymentMonths || !defaultInterestRate || !status || !startYear || !endYear) {
            setError(true);
            toast.warning("Error: Missing required fields");
            return;
        }
        setError(false);
        setLoading(true);

        try {
            const Headers = {
                Loan_Type_ID: loanTypeId,
                Loan_Type_Name: loanTypeName,
                Max_amount: maxAmount,
                Max_repayment_months: maxRepaymentMonths,
                Default_interest_rate: defaultInterestRate,
                Description: description,
                Status: status,
                Start_Year: startYear,
                End_Year: endYear,
                company_code: sessionStorage.getItem("selectedCompanyCode"),
                Created_by: sessionStorage.getItem("selectedUserCode"),
            };

            const response = await fetch(`${config.apiBaseUrl}/addLoanType`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(Headers),
            });

            if (response.ok) {
                toast.success("Data inserted successfully!", {
                    onClose: () => window.location.reload(),
                });
            } else {
                const errorResponse = await response.json();
                toast.warning(errorResponse.message || "Failed to insert data");
            }
        } catch (error) {
            toast.error("Error inserting data: " + error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (rowData) => {

        showConfirmationToast(
            "Are you sure you want to update the selected loan type data?",
            async () => {
                try {
                    setLoading(true);
                    const company_code = sessionStorage.getItem("selectedCompanyCode");
                    const Modified_by = sessionStorage.getItem("selectedUserCode");

                    const dataToSend = {
                        editedData: Array.isArray(rowData)
                            ? rowData.map((row) => ({
                                ...row,
                                company_code,
                                Modified_by,
                            }))
                            : [
                                {
                                    ...rowData,
                                    company_code,
                                    Modified_by,
                                },
                            ],
                    };

                    const response = await fetch(`${config.apiBaseUrl}/updateLoanType`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(dataToSend),
                        },
                    );

                    if (response.ok) {
                        toast.success("loan type updated successfully", {
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
            "Are you sure you want to delete the selected loan type data?",
            async () => {
                try {
                    setLoading(true);
                    const company_code = sessionStorage.getItem("selectedCompanyCode");
                    const Modified_by = sessionStorage.getItem("selectedUserCode");


                    const dataToSend = {
                        editedData: Array.isArray(rowData)
                            ? rowData.map((row) => ({
                                ...row,
                                company_code,
                                Modified_by,
                            }))
                            : [
                                {
                                    ...rowData,
                                    company_code,
                                    Modified_by,
                                },
                            ],
                    };

                    const response = await fetch(`${config.apiBaseUrl}/deleteLoanType`,
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
                        toast.success("loan type deleted successfully", {
                            onClose: () => handleSearch(), // refresh data
                        });
                    } else {
                        const errorResponse = await response.json();
                        toast.warning(errorResponse.message || "Delete failed");
                    }
                } catch (error) {
                    console.error("Error deleting loan type rows:", error);
                    toast.error("Error deleting loan type data: " + error.message);
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
        return data.map((row) => ({
            "Start Year": row.Start_Year || "",
            "End Year": row.End_Year || "",
            "Loan Type ID": row.Loan_Type_ID || "",
            "Loan Type Name": row.Loan_Type_Name || "",
            "Max Amount": row.Max_amount || "",
            "Max Repayment Months": row.Max_repayment_months || "",
            "Default Interest Rate": row.Default_interest_rate || "",
            "Description": row.Description || "",
            "Status": row.Status || "",
        }));
    };

    const handleExportToExcel = () => {
        if (!rowData || rowData.length === 0) {
            toast.warning("There is no data to export.");
            return;
        }

        const screenName = "Loan Type Search Report";
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
        XLSX.utils.book_append_sheet(workbook, worksheet, "Loan Type");

        XLSX.writeFile(workbook, "Loan_Type_Search_Report.xlsx");
    };

    return (
        <div class="container-fluid Topnav-screen ">
            {loading && <LoadingScreen />}
            <ToastContainer position="top-right" className="toast-design" theme="colored" />
            <div className="shadow-lg p-1 bg-light rounded main-header-box">
                <div className="header-flex">
                    <h1 className="page-title">Loan Type</h1>
                    <div className="action-wrapper">
                        <div onClick={handleInsert} className="action-icon add">
                            <span className="tooltip">Save</span>
                            <i class="fa-solid fa-floppy-disk"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div className="shadow-lg p-3 bg-light rounded mt-2 container-form-box">
                <div className="row g-3">

                    <div className="col-md-2">
                        <div className="inputGroup">
                            <input
                                id="Start_Year"
                                class="exp-input-field form-control"
                                type="Date"
                                placeholder=""
                                title="Please enter the Start Year"
                                required
                                value={startYear}
                                autoComplete="off"
                                onChange={(e) => setStartYear(e.target.value)}
                            />
                            <label For="city" className={`exp-form-labels ${error && !startYear ? 'text-danger' : ''}`}>Start Year<span className="text-danger">*</span></label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div className="inputGroup">
                            <input
                                id="End_Year"
                                class="exp-input-field form-control"
                                type="date"
                                placeholder=""
                                required
                                title="Please enter the End Year"
                                value={endYear}
                                autoComplete="off"
                                onChange={(e) => setEndYear(e.target.value)}
                            />
                            <label For="city" className={`exp-form-labels ${error && !endYear ? 'text-danger' : ''}`}>End Year<span className="text-danger">*</span></label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div className="inputGroup">
                            <input
                                id="Loan_ID"
                                className="exp-input-field form-control"
                                type="text"
                                placeholder=""
                                maxLength={15}
                                inputMode="numeric"
                                pattern="[0-9]*"
                                required
                                title="Please enter the Loan Type ID"
                                value={loanTypeId}
                                autoComplete="off"
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "");
                                    setLoanTypeId(value);
                                }}
                            />
                            <label for="sname" className={`exp-form-labels ${error && !loanTypeId ? 'text-danger' : ''}`}>Loan Type ID<span className="text-danger">*</span></label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div
                            className={`inputGroup selectGroup 
                            ${selectedLoanTypeName ? "has-value" : ""} 
                            ${isSelectedLoanTypeName ? "is-focused" : ""}`}
                            title="Please enter the Loan Type Name"
                        >
                            <Select
                                id="country"
                                type="text"
                                classNamePrefix="react-select"
                                placeholder=""
                                onFocus={() => setIsSelectedLoanTypeName(true)}
                                onBlur={() => setIsSelectedLoanTypeName(false)}
                                isClearable
                                maxLength={100}
                                value={selectedLoanTypeName}
                                onChange={handleChangeLoanType}
                                options={filteredOptionLoanType}
                            />
                            <label for="sname" className={`floating-label ${error && !loanTypeName ? 'text-danger' : ''}`}>Loan Type Name<span className="text-danger">*</span></label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div className="inputGroup">
                            <input
                                id="Loan_Eligible_Amount"
                                class="exp-input-field form-control"
                                type="text"
                                placeholder=""
                                maxLength={10}
                                inputMode="numeric"
                                pattern="[0-9]*"
                                required
                                title="Please enter the Max Amount"
                                value={maxAmount}
                                autoComplete="off"
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "");
                                    setMaxAmount(value);
                                }}
                            />
                            <label for="sname" className={`exp-form-labels ${error && !maxAmount ? 'text-danger' : ''}`}>Max Amount<span className="text-danger">*</span></label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div className="inputGroup">
                            <input
                                id="Loan_Eligible_Amount"
                                class="exp-input-field form-control"
                                type="text"
                                placeholder=""
                                maxLength={5}
                                inputMode="numeric"
                                pattern="[0-9]*"
                                required
                                title="Please enter the Max Repayment Months"
                                value={maxRepaymentMonths}
                                autoComplete="off"
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "");
                                    setMaxRepaymentMonths(value);
                                }}
                            />
                            <label for="sname" className={`exp-form-labels ${error && !maxRepaymentMonths ? 'text-danger' : ''}`}>Max Repayment Months<span className="text-danger">*</span></label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div className="inputGroup">
                            <input
                                id="Loan_Eligible_Amount"
                                class="exp-input-field form-control"
                                type="text"
                                placeholder=""
                                maxLength={5}
                                inputMode="numeric"
                                pattern="[0-9]*"
                                required
                                title="Please enter the Default Interest Rate"
                                value={defaultInterestRate}
                                autoComplete="off"
                                onChange={(e) => {
                                    const value = e.target.value.replace(/[^0-9.]/g, "");
                                    setDefaultInterestRate(value);
                                }}
                            />
                            <label for="sname" className={`exp-form-labels ${error && !defaultInterestRate ? 'text-danger' : ''}`}>Default Interest Rate<span className="text-danger">*</span></label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div className="inputGroup">
                            <input
                                id="Loan_Eligible_Amount"
                                class="exp-input-field form-control"
                                type="text"
                                placeholder=""
                                required
                                title="Please enter the Description"
                                value={description}
                                autoComplete="off"
                                maxLength={255}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            <label for="sname" className={`exp-form-labels`}>Description</label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div
                            className={`inputGroup selectGroup 
                            ${selectedStatus ? "has-value" : ""} 
                            ${isSelectedStatus ? "is-focused" : ""}`}
                            title="Please enter the Status"
                        >
                            <Select
                                id="country"
                                type="text"
                                classNamePrefix="react-select"
                                placeholder=""
                                onFocus={() => setIsSelectedStatus(true)}
                                onBlur={() => setIsSelectedStatus(false)}
                                isClearable
                                value={selectedStatus}
                                onChange={handleChangeStatus}
                                options={filteredOptionStatus}
                            />
                            <label for="sname" className={`floating-label ${error && !status ? 'text-danger' : ''}`}>Status<span className="text-danger">*</span></label>
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
                                id="Start_Year"
                                class="exp-input-field form-control"
                                type="Date"
                                placeholder=""
                                required
                                title="Please enter the Start Year"
                                value={startYearSc}
                                autoComplete="off"
                                onChange={(e) => setStartYearSc(e.target.value)}
                            />
                            <label For="city" className={`exp-form-labels`}>Start Year</label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div className="inputGroup">
                            <input
                                id="End_Year"
                                class="exp-input-field form-control"
                                type="date"
                                placeholder=""
                                required
                                title="Please enter the End Year"
                                value={endYearSc}
                                autoComplete="off"
                                onChange={(e) => setEndYearSc(e.target.value)}
                            />
                            <label For="city" className={`exp-form-labels`}>End Year</label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div className="inputGroup">
                            <input
                                id="Loan_ID"
                                class="exp-input-field form-control"
                                type="text"
                                placeholder=""
                                maxLength={15}
                                inputMode="numeric"
                                pattern="[0-9]*"
                                required
                                title="Please enter the Loan Type ID"
                                value={loanTypeIdSc}
                                autoComplete="off"
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "");
                                    setLoanTypeIdSc(value);
                                }}
                            />
                            <label for="sname" className={`exp-form-labels`}>Loan Type ID</label>
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
                            <label for="sname" className={`floating-label`}>Loan Type Name</label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div className="inputGroup">
                            <input
                                id="Loan_Eligible_Amount"
                                class="exp-input-field form-control"
                                type="text"
                                placeholder=""
                                maxLength={10}
                                inputMode="numeric"
                                pattern="[0-9]*"
                                required
                                title="Please enter the Max Amount"
                                value={maxAmountSc}
                                autoComplete="off"
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "");
                                    setMaxAmountSc(value);
                                }}
                            />
                            <label for="sname" className={`exp-form-labels`}>Max Amount</label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div className="inputGroup">
                            <input
                                id="Loan_Eligible_Amount"
                                class="exp-input-field form-control"
                                type="text"
                                placeholder=""
                                maxLength={5}
                                inputMode="numeric"
                                pattern="[0-9]*"
                                required
                                title="Please enter the Max Repayment Months"
                                value={maxRepaymentMonthsSc}
                                autoComplete="off"
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "");
                                    setMaxRepaymentMonthsSc(value);
                                }}
                            />
                            <label for="sname" className={`exp-form-labels`}>Max Repayment Months</label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div className="inputGroup">
                            <input
                                id="Loan_Eligible_Amount"
                                class="exp-input-field form-control"
                                type="text"
                                placeholder=""
                                maxLength={5}
                                inputMode="numeric"
                                pattern="[0-9]*"
                                required
                                title="Please enter the Default Interest Rate"
                                value={defaultInterestRateSc}
                                autoComplete="off"
                                onChange={(e) => {
                                    const value = e.target.value.replace(/[^0-9.]/g, "");
                                    setDefaultInterestRateSc(value);
                                }}
                            />
                            <label for="sname" className={`exp-form-labels`}>Default Interest Rate</label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div className="inputGroup">
                            <input
                                id="Loan_Eligible_Amount"
                                class="exp-input-field form-control"
                                type="text"
                                placeholder=""
                                required
                                title="Please enter the Description"
                                value={descriptionSc}
                                autoComplete="off"
                                maxLength={255}
                                onChange={(e) => setDescriptionSc(e.target.value)}
                            />
                            <label for="sname" className={`exp-form-labels`}>Description</label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div
                            className={`inputGroup selectGroup 
                            ${selectedStatusSc ? "has-value" : ""} 
                            ${isSelectedStatusSc ? "is-focused" : ""}`}
                            title="Please enter the Status"
                        >
                            <Select
                                id="country"
                                type="text"
                                classNamePrefix="react-select"
                                placeholder=""
                                onFocus={() => setIsSelectedStatusSc(true)}
                                onBlur={() => setIsSelectedStatusSc(false)}
                                isClearable
                                value={selectedStatusSc}
                                onChange={handleChangeStatusSc}
                                options={filteredOptionStatusSc}
                            />
                            <label for="sname" className={`floating-label`}>Status</label>
                        </div>
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

            <div className="shadow-lg pt-3 pb-3 bg-light rounded mt-2 container-form-box" style={{ width: "100%" }}>
                <div class="ag-theme-alpine" style={{ height: 455, width: "100%" }}>
                    <AgGridReact
                        rowData={rowData}
                        columnDefs={columnDefs}
                        onGridReady={onGridReady}
                        pagination={true}
                        paginationAutoPageSize={true}
                        gridOptions={gridOptions}
                    />
                </div>
            </div>
        </div>
    );
}
export default LoanType;
