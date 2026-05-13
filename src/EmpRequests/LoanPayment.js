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

function LoanPayment({ }) {

    //code added by Pavun purpose of set user permisssion
    const permissions = JSON.parse(sessionStorage.getItem('permissions')) || {};
    const loanPaymentPermissions = permissions
        .filter(permission => permission.screen_type === 'LoanPayment')
        .map(permission => permission.permission_type.toLowerCase());

    const [rowData, setRowData] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [paymentId, setPaymentId] = useState('');
    const [loanReqIdDrop, setLoanReqIdDrop] = useState([]);
    const [loanReqId, setLoanReqId] = useState('');
    const [selectedLoanReqId, setSelectedLoanReqId] = useState('');
    const [paymentDate, setPaymentDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentDrop, setPaymentDrop] = useState([]);
    const [payment, setPayment] = useState('');
    const [selectedPayment, setSelectedPayment] = useState('');
    const [payrolldrop, setPayrollDrop] = useState([]);
    const [payroll, setPayroll] = useState('');
    const [selectedPayroll, setSeelctedPayroll] = useState('');

    const [paymentIdSc, setPaymentIdSc] = useState('');
    const [loanReqIdDropSc, setLoanReqIdDropSc] = useState([]);
    const [loanReqIdSc, setLoanReqIdSc] = useState('');
    const [selectedLoanReqIdSc, setSelectedLoanReqIdSc] = useState('');
    const [paymentAmountSc, setPaymentAmountSc] = useState('');
    const [paymentDropSc, setPaymentDropSc] = useState([]);
    const [paymentSc, setPaymentSc] = useState('');
    const [selectedPaymentSc, setSelectedPaymentSc] = useState('');
    const [payrolldropSc, setPayrollDropSc] = useState([]);
    const [payrollSc, setPayrollSc] = useState('');
    const [selectedPayrollSc, setSeelctedPayrollSc] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    const [loanReqIdDropGrid, setLoanReqIdDropGrid] = useState([]);
    const [paymentDropGrid, setPaymentDropGrid] = useState([]);
    const [payrolldropGrid, setPayrollDropGrid] = useState([]);

    const [isSelectedLoanReqId, setIsSelectedLoanReqId] = useState('');
    const [isSelectedPayment, setIsSelectedPayment] = useState('');
    const [isSelectedPayroll, setIsSeelctedPayroll] = useState('');

    const [isSelectedLoanReqIdSc, setIsSelectedLoanReqIdSc] = useState('');
    const [isSelectedPaymentSc, setIsSelectedPaymentSc] = useState('');
    const [isSelectedPayrollSc, setIsSeelctedPayrollSc] = useState('');


    useEffect(() => {
        const company_code = sessionStorage.getItem("selectedCompanyCode");

        fetch(`${config.apiBaseUrl}/getApprovalLoanRequest`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ company_code }),
        })
            .then((data) => data.json())
            .then((val) => setLoanReqIdDrop(val))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    useEffect(() => {
        const company_code = sessionStorage.getItem('selectedCompanyCode');
        fetch(`${config.apiBaseUrl}/getPaymentMethod`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ company_code })
        })
            .then((data) => data.json())
            .then((val) => setPaymentDrop(val))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);


    const filteredOptionLoanReqId = Array.isArray(loanReqIdDrop)
        ? loanReqIdDrop.map((option) => ({
            value: option?.loan_request_id,
            label: option?.loan_request_id,
        }))
        : [];

    const filteredOptionPayment = Array.isArray(paymentDrop)
        ? paymentDrop.map((option) => ({
            value: option?.attributedetails_name,
            label: option?.attributedetails_name,
        }))
        : [];

    const handleChangeLoanReqId = (selectedLoanReqId) => {
        setSelectedLoanReqId(selectedLoanReqId);
        setLoanReqId(selectedLoanReqId ? selectedLoanReqId.value : "");
    };

    const handleChangePayment = (selectedPayment) => {
        setSelectedPayment(selectedPayment);
        setPayment(selectedPayment ? selectedPayment.value : "");
    };

    useEffect(() => {
        const company_code = sessionStorage.getItem("selectedCompanyCode");

        fetch(`${config.apiBaseUrl}/getApprovalLoanRequest`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ company_code }),
        })
            .then((data) => data.json())
            .then((val) => setLoanReqIdDropSc(val))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    useEffect(() => {
        const company_code = sessionStorage.getItem('selectedCompanyCode');
        fetch(`${config.apiBaseUrl}/getPaymentMethod`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ company_code })
        })
            .then((data) => data.json())
            .then((val) => setPaymentDropSc(val))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    const filteredOptionLoanReqIdSc = Array.isArray(loanReqIdDropSc)
        ? loanReqIdDropSc.map((option) => ({
            value: option?.loan_request_id,
            label: option?.loan_request_id,
        }))
        : [];

    const filteredOptionPaymentSc = Array.isArray(paymentDropSc)
        ? paymentDropSc.map((option) => ({
            value: option?.attributedetails_name,
            label: option?.attributedetails_name,
        }))
        : [];

    const handleChangeLoanReqIdSc = (selectedLoanReqIdSc) => {
        setSelectedLoanReqIdSc(selectedLoanReqIdSc);
        setLoanReqIdSc(selectedLoanReqIdSc ? selectedLoanReqIdSc.value : "");
    };

    const handleChangePaymentSc = (selectedPaymentSc) => {
        setSelectedPaymentSc(selectedPaymentSc);
        setPaymentSc(selectedPaymentSc ? selectedPaymentSc.value : "");
    };

    useEffect(() => {
        const company_code = sessionStorage.getItem('selectedCompanyCode');
        fetch(`${config.apiBaseUrl}/getApprovalLoanRequest`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ company_code })
        })
            .then((data) => data.json())
            .then((val) => {
                const payment = val.map(option => option.loan_request_id);
                setLoanReqIdDropGrid(payment);
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    useEffect(() => {
        const company_code = sessionStorage.getItem('selectedCompanyCode');
        fetch(`${config.apiBaseUrl}/getPaymentMethod`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ company_code })
        })
            .then((data) => data.json())
            .then((val) => {
                const payment = val.map(option => option.attributedetails_name);
                setPaymentDropGrid(payment);
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    const searchClearInputFields = () => {
        setPaymentIdSc("");
        setLoanReqIdSc("");
        setSelectedLoanReqIdSc("");
        setPaymentAmountSc("");
        setPaymentSc("");
        setSelectedPaymentSc("");
        setFromDate("");
        setToDate("");
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
                                    title="Update"
                                    style={{ cursor: 'pointer' }}
                                >
                                    <i className="fa-regular fa-floppy-disk"></i>
                                </span>

                                <span
                                    className="icon mx-2"
                                    onClick={() => handleDelete(params.data)}
                                    title="Delete"
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
            headerName: "Payment ID",
            field: "payment_id",
            editable: false
        },
        {
            headerName: "Loan Request ID",
            field: "loan_request_id",
            editable: true,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: loanReqIdDropGrid,
            },
        },
        {
            headerName: "Payment Date",
            field: "payment_date",
            editable: true,
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
            headerName: "Paid Amount",
            field: "paid_amount",
            editable: true
        },
        {
            headerName: "Payment Method",
            field: "payment_method",
            editable: true,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: paymentDropGrid,
            },
        },
        {
            headerName: "Payroll Reference",
            field: "payroll_reference",
            editable: false
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
        if (!paymentId ||
            !loanReqId ||
            !paymentDate ||
            !paymentAmount ||
            !payment
        ) {
            setError(" ");
            toast.warning("Error: Missing required fields");
            return;
        }

        setLoading(true);

        try {
            const Header = {
                payment_id: paymentId,
                loan_request_id: loanReqId,
                payment_date: paymentDate,
                paid_amount: paymentAmount,
                payment_method: payment,
                company_code: sessionStorage.getItem('selectedCompanyCode'),
                created_by: sessionStorage.getItem('selectedUserCode')
            };
            const response = await fetch(`${config.apiBaseUrl}/loan_paymentsInsert`, {
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
                payment_id: paymentIdSc,
                loan_request_id: loanReqIdSc,
                FromDate: fromDate,
                ToDate: toDate,
                paid_amount: paymentAmountSc ? paymentAmountSc : 0,
                payment_method: paymentSc,
                company_code: sessionStorage.getItem('selectedCompanyCode'),
            };

            const response = await fetch(`${config.apiBaseUrl}/loanPaymentSearch`, {
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
            "Are you sure you want to update the selected loan payment data?",
            async () => {
                try {
                    setLoading(true);
                    const company_code = sessionStorage.getItem("selectedCompanyCode");
                    const modified_by = sessionStorage.getItem("selectedUserCode");

                    const dataToSend = {
                        loan_paymentsData: Array.isArray(rowData)
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

                    const response = await fetch(`${config.apiBaseUrl}/loan_paymentsLoopUpdate`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(dataToSend),
                        },
                    );

                    if (response.ok) {
                        toast.success("loan payment updated successfully", {
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
            "Are you sure you want to delete the selected loan payment data?",
            async () => {
                try {
                    setLoading(true);
                    const company_code = sessionStorage.getItem("selectedCompanyCode");
                    const modified_by = sessionStorage.getItem("selectedUserCode");

                    const dataToSend = {
                        loan_paymentsData: Array.isArray(rowData)
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

                    const response = await fetch(`${config.apiBaseUrl}/loan_paymentsLoopDelete`,
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
                        toast.success("loan payment deleted successfully", {
                            onClose: () => handleSearch(), // refresh data
                        });
                    } else {
                        const errorResponse = await response.json();
                        toast.warning(errorResponse.message || "Delete failed");
                    }
                } catch (error) {
                    console.error("Error deleting loan payment rows:", error);
                    toast.error("Error deleting loan payment data: " + error.message);
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
            return {
                "Payment ID": row.payment_id || "",
                "Loan Request ID": row.loan_request_id || "",
                "Payment Date": row.payment_date || "",
                "Paid Amount": row.paid_amount || "",
                "Payment Method": row.payment_method || "",
                "Payroll Reference": row.payroll_reference || "",
            };
        });
    };

    const handleExportToExcel = () => {
        if (!rowData || rowData.length === 0) {
            toast.warning("There is no data to export.");
            return;
        }

        const screenName = "Loan Payment Search Report";
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
        XLSX.utils.book_append_sheet(workbook, worksheet, "Loan Payment");

        XLSX.writeFile(workbook, "Loan_Payment_Search_Report.xlsx");
    };

    const handleReloadAdd = () => {
        clearInputsAdd([]);
    };

    const clearInputsAdd = () => {
        setPaymentId('');
        setSelectedLoanReqId('');
        setLoanReqId('');
        setPaymentDate('');
        setPaymentAmount('');
        setSelectedPayment('');
        setPayment('');
    };

    return (
        <div class="container-fluid Topnav-screen ">
            {loading && <LoadingScreen />}
            <ToastContainer position="top-right" className="toast-design" theme="colored" />
            <div className="shadow-lg p-1 bg-light rounded main-header-box">
                <div className="header-flex">
                    <h1 className="page-title">Loan Payment</h1>
                    <div className="action-wrapper desktop-actions">
                        {['add', 'all permission'].some(permission => loanPaymentPermissions.includes(permission)) && (
                            <div onClick={handleSave} className="action-icon add">
                                <span className="tooltip">Save</span>
                                <i class="fa-solid fa-floppy-disk"></i>
                            </div>
                        )}
                        <div className="action-icon print" onClick={handleReloadAdd}>
                            <span className="tooltip">Reload</span>
                            <i className="fa-solid fa-arrow-rotate-right"></i>
                        </div>
                    </div>

                    {/* Mobile Dropdown */}
                    <div className="dropdown mobile-actions">
                        <button
                            className="btn btn-primary dropdown-toggle p-0"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <i className="fa-solid fa-ellipsis-vertical"></i>
                        </button>

                        <ul className="dropdown-menu dropdown-menu-end text-center">
                            {['add', 'all permission'].some(p => loanPaymentPermissions.includes(p)) && (
                                <li>
                                    <button className="dropdown-item" onClick={handleSave}>
                                        <i className="fa-solid fa-floppy-disk add fs-4"></i>
                                    </button>
                                </li>
                            )}
                            <li>
                                <button className="dropdown-item" onClick={handleReloadAdd}>
                                    <i className="fa-solid fa-arrow-rotate-right text-dark fs-4"></i>
                                </button>
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
                                id="fdate"
                                class="exp-input-field form-control"
                                type="text"
                                placeholder=""
                                maxLength={15}
                                inputMode="numeric"
                                pattern="[0-9]*"
                                required
                                autoComplete="off"
                                value={paymentId}
                                title="Please enter the Payment ID"
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "");
                                    setPaymentId(value);
                                }}
                            />
                            <label for="sname" className={`exp-form-labels ${error && !paymentId ? 'text-danger' : ''}`}>Payment ID<span className="text-danger">*</span></label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div
                            className={`inputGroup selectGroup 
                            ${selectedLoanReqId ? "has-value" : ""} 
                            ${isSelectedLoanReqId ? "is-focused" : ""}`}
                            title="Please select the Loan Request ID"
                        >
                            <Select
                                id="department"
                                placeholder=" "
                                onFocus={() => setIsSelectedLoanReqId(true)}
                                onBlur={() => setIsSelectedLoanReqId(false)}
                                classNamePrefix="react-select"
                                isClearable
                                type="text"
                                value={selectedLoanReqId}
                                onChange={handleChangeLoanReqId}
                                options={filteredOptionLoanReqId}
                            />
                            <label htmlFor="selecteddpt" className={`floating-label ${error && !loanReqId ? 'text-danger' : ''}`}>
                                Loan Request ID<span className="text-danger">*</span>
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
                                autoComplete="off"
                                value={paymentDate}
                                title="Please select the Loan Payment Date"
                                onChange={(e) => setPaymentDate((e.target.value))}
                            />
                            <label for="sname" className={`exp-form-labels ${error && !paymentDate ? 'text-danger' : ''}`}>Payment Date<span className="text-danger">*</span></label>
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
                                autoComplete="off"
                                value={paymentAmount}
                                title="Please enter the Paid Amount"
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "");
                                    setPaymentAmount(value);
                                }}
                            />
                            <label for="sname" className={`exp-form-labels ${error && !paymentAmount ? 'text-danger' : ''}`}>Paid Amount<span className="text-danger">*</span></label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div
                            className={`inputGroup selectGroup 
                            ${selectedPayment ? "has-value" : ""} 
                            ${isSelectedPayment ? "is-focused" : ""}`}
                            title="Please select the Payment Method"
                        >
                            <Select
                                id="country"
                                type="text"
                                classNamePrefix="react-select"
                                placeholder=""
                                onFocus={() => setIsSelectedPayment(true)}
                                onBlur={() => setIsSelectedPayment(false)}
                                isClearable
                                value={selectedPayment}
                                onChange={handleChangePayment}
                                options={filteredOptionPayment}
                            />
                            <label for="sname" className={`floating-label  ${error && !payment ? 'text-danger' : ''}`}>Payment Method<span className="text-danger">*</span></label>
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
                                autoComplete="off"
                                value={paymentIdSc}
                                title="Please enter the Payment ID"
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "");
                                    setPaymentIdSc(value);
                                }}
                            />
                            <label for="sname" className={`exp-form-labels`}>Payment ID</label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div
                            className={`inputGroup selectGroup 
                            ${selectedLoanReqIdSc ? "has-value" : ""} 
                            ${isSelectedLoanReqIdSc ? "is-focused" : ""}`}
                            title="Please select the Loan Request ID"
                        >
                            <Select
                                id="department"
                                placeholder=" "
                                onFocus={() => setIsSelectedLoanReqIdSc(true)}
                                onBlur={() => setIsSelectedLoanReqIdSc(false)}
                                classNamePrefix="react-select"
                                isClearable
                                type="text"
                                value={selectedLoanReqIdSc}
                                onChange={handleChangeLoanReqIdSc}
                                options={filteredOptionLoanReqIdSc}
                            />
                            <label htmlFor="selecteddpt" className={`floating-label`}>
                                Loan Request ID
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
                                autoComplete="off"
                                value={fromDate}
                                title="Please select the Loan Payment From Date"
                                onChange={(e) => setFromDate((e.target.value))}
                            />
                            <label for="sname" className={`exp-form-labels`}>Payment From</label>
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
                                autoComplete="off"
                                value={toDate}
                                title="Please select the Loan Payment To Date"
                                onChange={(e) => setToDate((e.target.value))}
                            />
                            <label for="sname" className={`exp-form-labels`}>Payment To</label>
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
                                autoComplete="off"
                                value={paymentAmountSc}
                                title="Please enter the Paid Amount"
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "");
                                    setPaymentAmountSc(value);
                                }}
                            />
                            <label for="sname" className={`exp-form-labels`}>Paid Amount</label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div
                            className={`inputGroup selectGroup 
                            ${selectedPaymentSc ? "has-value" : ""} 
                            ${isSelectedPaymentSc ? "is-focused" : ""}`}
                            title="Please select the Payment Method"
                        >
                            <Select
                                id="country"
                                type="text"
                                classNamePrefix="react-select"
                                placeholder=""
                                onFocus={() => setIsSelectedPaymentSc(true)}
                                onBlur={() => setIsSelectedPaymentSc(false)}
                                isClearable
                                value={selectedPaymentSc}
                                onChange={handleChangePaymentSc}
                                options={filteredOptionPaymentSc}
                            />
                            <label for="sname" className={`floating-label`}>Payment Method</label>
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
export default LoanPayment;