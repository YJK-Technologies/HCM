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

function LoanSchedule({ }) {

    const [rowData, setRowData] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [scheduleId, setScheduleId] = useState('');
    const [loanReqIdDrop, setLoanReqIdDrop] = useState([]);
    const [loanReqId, setLoanReqId] = useState('');
    const [selectedLoanReqId, setSelectedLoanReqId] = useState('');
    const [installmentNo, setIntallmentNo] = useState('');
    const [installmentDate, setIntallmentDate] = useState('');
    const [principleAmount, setPrincipleAmount] = useState('');
    const [interestAmount, setInterestAmount] = useState('');
    const [totalInstallment, setTotalInstallment] = useState('');
    const [paymentStatusDrop, setPaymentStatusDrop] = useState([]);
    const [paymentStatus, setPaymentStatus] = useState('');
    const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('');

    const [scheduleIdSc, setScheduleIdSc] = useState('');
    const [loanReqIdDropSc, setLoanReqIdDropSc] = useState([]);
    const [loanReqIdSc, setLoanReqIdSc] = useState('');
    const [selectedLoanReqIdSc, setSelectedLoanReqIdSc] = useState('');
    const [installmentNoSc, setIntallmentNoSc] = useState('');
    const [principleAmountSc, setPrincipleAmountSc] = useState('');
    const [interestAmountSc, setInterestAmountSc] = useState('');
    const [totalInstallmentSc, setTotalInstallmentSc] = useState('');
    const [paymentStatusDropSc, setPaymentStatusDropSc] = useState([]);
    const [paymentStatusSc, setPaymentStatusSc] = useState('');
    const [selectedPaymentStatusSc, setSelectedPaymentStatusSc] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    const [loanReqIdDropGrid, setLoanReqIdDropGrid] = useState([]);
    const [paymentStatusDropGrid, setPaymentStatusDropGrid] = useState([]);

    const [isSelectedLoanReqId, setIsSelectedLoanReqId] = useState('');
    const [isSelectedPaymentStatus, setIsSelectedPaymentStatus] = useState('');

    const [isSelectedLoanReqIdSc, setIsSelectedLoanReqIdSc] = useState('');
    const [isSelectedPaymentStatusSc, setIsSelectedPaymentStatusSc] = useState('');


    useEffect(() => {
        const company_code = sessionStorage.getItem("selectedCompanyCode");

        fetch(`${config.apiBaseUrl}/getLoanRequest`, {
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
        fetch(`${config.apiBaseUrl}/getPaymentStatus`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ company_code })
        })
            .then((data) => data.json())
            .then((val) => setPaymentStatusDrop(val))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);


    const filteredOptionLoanReqId = loanReqIdDrop.map((option) => ({
        value: option.loan_request_id,
        label: option.loan_request_id,
    }));

    const filteredOptionPaymentStatus = paymentStatusDrop.map((option) => ({
        value: option.attributedetails_name,
        label: option.attributedetails_name,
    }));


    const handleChangeLoanReqId = (selectedLoanReqId) => {
        setSelectedLoanReqId(selectedLoanReqId);
        setLoanReqId(selectedLoanReqId ? selectedLoanReqId.value : "");
    };

    const handleChangePaymentStatus = (selectedPaymentStatus) => {
        setSelectedPaymentStatus(selectedPaymentStatus);
        setPaymentStatus(selectedPaymentStatus ? selectedPaymentStatus.value : "");
    };

    useEffect(() => {
        const company_code = sessionStorage.getItem("selectedCompanyCode");

        fetch(`${config.apiBaseUrl}/getLoanRequest`, {
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
        fetch(`${config.apiBaseUrl}/getPaymentStatus`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ company_code })
        })
            .then((data) => data.json())
            .then((val) => setPaymentStatusDropSc(val))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    const filteredOptionLoanReqIdSc = loanReqIdDropSc.map((option) => ({
        value: option.loan_request_id,
        label: option.loan_request_id,
    }));

    const filteredOptionPaymentStatusSc = paymentStatusDropSc.map((option) => ({
        value: option.attributedetails_name,
        label: option.attributedetails_name,
    }));

    const handleChangeLoanReqIdSc = (selectedLoanReqIdSc) => {
        setSelectedLoanReqIdSc(selectedLoanReqIdSc);
        setLoanReqIdSc(selectedLoanReqIdSc ? selectedLoanReqIdSc.value : "");
    };

    const handleChangePaymentStatusSc = (selectedPaymentStatusSc) => {
        setSelectedPaymentStatusSc(selectedPaymentStatusSc);
        setPaymentStatusSc(selectedPaymentStatusSc ? selectedPaymentStatusSc.value : "");
    };

    useEffect(() => {
        const company_code = sessionStorage.getItem('selectedCompanyCode');
        fetch(`${config.apiBaseUrl}/getLoanRequest`, {
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
        fetch(`${config.apiBaseUrl}/getPaymentStatus`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ company_code })
        })
            .then((data) => data.json())
            .then((val) => {
                const payment = val.map(option => option.attributedetails_name);
                setPaymentStatusDropGrid(payment);
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    const searchClearInputFields = () => {
        setScheduleIdSc("");
        setLoanReqIdSc("");
        setSelectedLoanReqIdSc("");
        setIntallmentNoSc("");
        setPrincipleAmountSc("");
        setInterestAmountSc("");
        setTotalInstallmentSc("");
        setPaymentStatusSc("");
        setSelectedPaymentStatusSc("");
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
                                    style={{ cursor: 'pointer' }}
                                >
                                    <i className="fa-regular fa-floppy-disk"></i>
                                </span>

                                <span
                                    className="icon mx-2"
                                    onClick={() => handleDelete(params.data)}
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
            headerName: "Schedule ID",
            field: "schedule_id",
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
            headerName: "Installment No",
            field: "installment_number",
            editable: true
        },
        {
            headerName: "Installment Date",
            field: "installment_date",
            editable: true
        },
        {
            headerName: "Principle Amount",
            field: "principal_amount",
            editable: true
        },
        {
            headerName: "Interest Amount",
            field: "interest_amount",
            editable: true
        },
        {
            headerName: "Total Installment",
            field: "total_installment",
            editable: true
        },
        {
            headerName: "Payment Status",
            field: "payment_status",
            editable: true,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: paymentStatusDropGrid,
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
        if (!scheduleId ||
            !loanReqId ||
            !installmentNo ||
            !installmentDate ||
            !principleAmount ||
            !interestAmount ||
            !totalInstallment ||
            !paymentStatus
        ) {
            setError(" ");
            toast.warning("Error: Missing required fields");
            return;
        }

        setLoading(true);

        try {
            const Header = {
                schedule_id: scheduleId,
                loan_request_id: loanReqId,
                installment_number: installmentNo,
                installment_date: installmentDate,
                principal_amount: principleAmount,
                interest_amount: interestAmount,
                total_installment: totalInstallment,
                payment_status: paymentStatus,
                company_code: sessionStorage.getItem('selectedCompanyCode'),
                created_by: sessionStorage.getItem('selectedUserCode')
            };
            const response = await fetch(`${config.apiBaseUrl}/loan_repayment_scheduleInsert`, {
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
                schedule_id: scheduleIdSc,
                loan_request_id: loanReqIdSc,
                installment_number: installmentNoSc,
                principal_amount: principleAmountSc ? principleAmountSc : 0,
                interest_amount: interestAmountSc ? interestAmountSc : 0,
                total_installment: totalInstallmentSc ? totalInstallmentSc : 0,
                FromDate: fromDate,
                ToDate: toDate,
                payment_status: paymentStatusSc,
                company_code: sessionStorage.getItem('selectedCompanyCode'),
            };

            const response = await fetch(`${config.apiBaseUrl}/loanScheduleSearch`, {
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
            "Are you sure you want to update the selected loan schedule data?",
            async () => {
                try {
                    setLoading(true);
                    const company_code = sessionStorage.getItem("selectedCompanyCode");
                    const modified_by = sessionStorage.getItem("selectedUserCode");

                    const dataToSend = {
                        loan_repayment_scheduleData: Array.isArray(rowData)
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

                    const response = await fetch(`${config.apiBaseUrl}/loan_repayment_scheduleLoopUpdate`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(dataToSend),
                        },
                    );

                    if (response.ok) {
                        toast.success("loan schedule updated successfully", {
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
            "Are you sure you want to delete the selected loan schedule data?",
            async () => {
                try {
                    setLoading(true);
                    const company_code = sessionStorage.getItem("selectedCompanyCode");

                    const dataToSend = {
                        loan_repayment_scheduleData: Array.isArray(rowData)
                            ? rowData.map((row) => ({
                                ...row,
                                company_code,
                            }))
                            : [
                                {
                                    ...rowData,
                                    company_code,
                                },
                            ],
                    };

                    const response = await fetch(`${config.apiBaseUrl}/loan_repayment_scheduleLoopDelete`,
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
                        toast.success("loan schedule deleted successfully", {
                            onClose: () => handleSearch(), // refresh data
                        });
                    } else {
                        const errorResponse = await response.json();
                        toast.warning(errorResponse.message || "Delete failed");
                    }
                } catch (error) {
                    console.error("Error deleting loan schedule rows:", error);
                    toast.error("Error deleting loan schedule data: " + error.message);
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
                "Schedule ID": row.schedule_id || "",
                "Loan Request ID": row.loan_request_id || "",
                "Installment No": row.installment_number || "",
                "Installment Date": row.installment_date || "",
                "Principle Amount": row.principal_amount || "",
                "Interest Amount": row.interest_amount || "",
                "Total Installment": row.total_installment || "",
                "Payment Status": row.payment_status || "",
            };
        });
    };

    const handleExportToExcel = () => {
        if (!rowData || rowData.length === 0) {
            toast.warning("There is no data to export.");
            return;
        }

        const screenName = "Loan Repayment Schedule Search Report";
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
        XLSX.utils.book_append_sheet(workbook, worksheet, "Loan Repayment Schedule");

        XLSX.writeFile(workbook, "Loan_Repayment_Schedule_Search_Report.xlsx");
    };

    return (
        <div class="container-fluid Topnav-screen ">
            {loading && <LoadingScreen />}
            <ToastContainer position="top-right" className="toast-design" theme="colored" />
            <div className="shadow-lg p-1 bg-light rounded main-header-box">
                <div className="header-flex">
                    {/* <h1 className="page-title">Loan Repayment Schedule</h1> */}
                    <h1 className="page-title">Loan Repayment Schedule</h1>
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

                    <div className="col-md-2">
                        <div className="inputGroup">
                            <input
                                id="fdate"
                                class="exp-input-field form-control"
                                type="number"
                                placeholder=""
                                required
                                autoComplete="off"
                                value={scheduleId}
                                onChange={(e) => setScheduleId((e.target.value))}
                            />
                            <label for="sname" className={`exp-form-labels ${error && !scheduleId ? 'text-danger' : ''}`}>Schedule ID<span className="text-danger">*</span></label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div
                            className={`inputGroup selectGroup 
                            ${selectedLoanReqId ? "has-value" : ""} 
                            ${isSelectedLoanReqId ? "is-focused" : ""}`}
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
                                type="number"
                                placeholder=""
                                required title="Please Enter the Annual Bonus"
                                autoComplete="off"
                                value={installmentNo}
                                onChange={(e) => setIntallmentNo((e.target.value))}
                            />
                            <label for="sname" className={`exp-form-labels ${error && !installmentNo ? 'text-danger' : ''}`}>Installment No<span className="text-danger">*</span></label>
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
                                value={installmentDate}
                                onChange={(e) => setIntallmentDate((e.target.value))}
                            />
                            <label for="sname" className={`exp-form-labels ${error && !installmentDate ? 'text-danger' : ''}`}>Payment Date<span className="text-danger">*</span></label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div className="inputGroup">
                            <input
                                id="fdate"
                                class="exp-input-field form-control"
                                type="number"
                                placeholder=""
                                required title="Please Enter the Annual Bonus"
                                autoComplete="off"
                                value={principleAmount}
                                onChange={(e) => setPrincipleAmount((e.target.value))}
                            />
                            <label for="sname" className={`exp-form-labels ${error && !principleAmount ? 'text-danger' : ''}`}>Principle Amount<span className="text-danger">*</span></label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div className="inputGroup">
                            <input
                                id="fdate"
                                class="exp-input-field form-control"
                                type="number"
                                placeholder=""
                                required title="Please Enter the Annual Bonus"
                                autoComplete="off"
                                value={interestAmount}
                                onChange={(e) => setInterestAmount((e.target.value))}
                            />
                            <label for="sname" className={`exp-form-labels ${error && !interestAmount ? 'text-danger' : ''}`}>Interest Amount<span className="text-danger">*</span></label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div className="inputGroup">
                            <input
                                id="fdate"
                                class="exp-input-field form-control"
                                type="number"
                                placeholder=""
                                required title="Please Enter the Annual Bonus"
                                autoComplete="off"
                                value={totalInstallment}
                                onChange={(e) => setTotalInstallment((e.target.value))}
                            />
                            <label for="sname" className={`exp-form-labels ${error && !totalInstallment ? 'text-danger' : ''}`}>Total Installment<span className="text-danger">*</span></label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div
                            className={`inputGroup selectGroup 
                            ${selectedPaymentStatus ? "has-value" : ""} 
                            ${isSelectedPaymentStatus ? "is-focused" : ""}`}
                        >
                            <Select
                                id="country"
                                type="text"
                                classNamePrefix="react-select"
                                placeholder=""
                                onFocus={() => setIsSelectedPaymentStatus(true)}
                                onBlur={() => setIsSelectedPaymentStatus(false)}
                                isClearable
                                value={selectedPaymentStatus}
                                onChange={handleChangePaymentStatus}
                                options={filteredOptionPaymentStatus}
                            />
                            <label for="sname" className={`floating-label  ${error && !paymentStatus ? 'text-danger' : ''}`}>Payment Status<span className="text-danger">*</span></label>
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
                                type="number"
                                placeholder=""
                                required
                                autoComplete="off"
                                value={scheduleIdSc}
                                onChange={(e) => setScheduleIdSc((e.target.value))}
                            />
                            <label for="sname" className={`exp-form-labels`}>Schedule ID</label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div
                            className={`inputGroup selectGroup 
                            ${selectedLoanReqIdSc ? "has-value" : ""} 
                            ${isSelectedLoanReqIdSc ? "is-focused" : ""}`}
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
                                type="number"
                                placeholder=""
                                required title="Please Enter the Annual Bonus"
                                autoComplete="off"
                                value={installmentNoSc}
                                onChange={(e) => setIntallmentNoSc((e.target.value))}
                            />
                            <label for="sname" className={`exp-form-labels`}>Installment No</label>
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
                                value={fromDate}
                                onChange={(e) => setFromDate((e.target.value))}
                            />
                            <label for="sname" className={`exp-form-labels`}>Installment From</label>
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
                                value={toDate}
                                onChange={(e) => setToDate((e.target.value))}
                            />
                            <label for="sname" className={`exp-form-labels`}>Installment To</label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div className="inputGroup">
                            <input
                                id="fdate"
                                class="exp-input-field form-control"
                                type="number"
                                placeholder=""
                                required title="Please Enter the Annual Bonus"
                                autoComplete="off"
                                value={principleAmountSc}
                                onChange={(e) => setPrincipleAmountSc((e.target.value))}
                            />
                            <label for="sname" className={`exp-form-labels`}>Principle Amount</label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div className="inputGroup">
                            <input
                                id="fdate"
                                class="exp-input-field form-control"
                                type="number"
                                placeholder=""
                                required title="Please Enter the Annual Bonus"
                                autoComplete="off"
                                value={interestAmountSc}
                                onChange={(e) => setInterestAmountSc((e.target.value))}
                            />
                            <label for="sname" className={`exp-form-labels`}>Interest Amount</label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div className="inputGroup">
                            <input
                                id="fdate"
                                class="exp-input-field form-control"
                                type="number"
                                placeholder=""
                                required title="Please Enter the Annual Bonus"
                                autoComplete="off"
                                value={totalInstallmentSc}
                                onChange={(e) => setTotalInstallmentSc((e.target.value))}
                            />
                            <label for="sname" className={`exp-form-labels`}>Total Installment</label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div
                            className={`inputGroup selectGroup 
                            ${selectedPaymentStatusSc ? "has-value" : ""} 
                            ${isSelectedPaymentStatusSc ? "is-focused" : ""}`}
                        >
                            <Select
                                id="country"
                                type="text"
                                classNamePrefix="react-select"
                                placeholder=""
                                onFocus={() => setIsSelectedPaymentStatusSc(true)}
                                onBlur={() => setIsSelectedPaymentStatusSc(false)}
                                isClearable
                                value={selectedPaymentStatusSc}
                                onChange={handleChangePaymentStatusSc}
                                options={filteredOptionPaymentStatusSc}
                            />
                            <label for="sname" className={`floating-label`}>Payment Status</label>
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
export default LoanSchedule;