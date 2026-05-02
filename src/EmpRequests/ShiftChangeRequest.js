import { useState, useEffect, useRef } from "react";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Select from 'react-select';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import LoadingScreen from '../Loading';
import { format } from 'date-fns';
import { XCircle } from 'lucide-react';
import { showConfirmationToast } from '../ToastConfirmation';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import ShiftRequestModal from "../ESSDashboard/ShiftRequestModal";
const config = require('../Apiconfig');

const ShiftChangeRequest = () => {
    const [FromDate, setFromDate] = useState("");
    const [ToDate, setToDate] = useState("");
    const [loading, setLoading] = useState(false);

    const [leaveRowData, setLeaveRowData] = useState([]);
    const [holidayFromDate, setHolidayFromDate] = useState("");
    const [holidayToDate, setHolidayToDate] = useState("");
    const [holidayName, setHolidayName] = useState("");
    const [statusDropSc, setstatusDropSc] = useState([]);
    const [statusSc, setStatusSc] = useState("");
    const [selectedStatusSc, setSelectedStatusSc] = useState("");
    const [isSelectedStatusSc, setIsSelectedStatusSc] = useState(false);
    const gridRef = useRef()

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [rempShiftRowData, setEmpShiftRowData] = useState([]);

    const [employeeIdDropGrid, setEmployeeIdDropGrid] = useState([]);
    const [shiftIdDropGrid, setShiftIdDropGrid] = useState([]);
    const [departmentDrop, setDepartmentDrop] = useState([]);
    const [shiftPatternIdDropGrid, setShiftPatternIdDropGrid] = useState([]);

    useEffect(() => {
        const company_code = sessionStorage.getItem("selectedCompanyCode");
        fetch(`${config.apiBaseUrl}/getEmployeeId`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ company_code }),
        })
            .then((response) => response.json())
            .then((data) => {
                const employeeIdOption = data.map((option) => ({
                    value: option.EmployeeId,
                    label: `${option.EmployeeId} - ${option.First_Name}`,
                }));
                setEmployeeIdDropGrid(employeeIdOption);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    useEffect(() => {
        const company_code = sessionStorage.getItem("selectedCompanyCode");

        fetch(`${config.apiBaseUrl}/getDepartment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ company_code }),
        })
            .then((response) => response.json())
            .then((data) => {
                const deptOptions = data.map((option) => ({
                    value: option.dept_id,
                    label: `${option.dept_id} - ${option.dept_name}`,
                }));
                setDepartmentDrop(deptOptions);
            })
            // .then((val) => setDPTdrop(val))
            .catch((error) =>
                console.error("Error fetching department data:", error)
            );
    }, []);

    useEffect(() => {
        const Company_Code = sessionStorage.getItem("selectedCompanyCode");
        fetch(`${config.apiBaseUrl}/ShiftPatternMasterDropDown`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ Company_Code }),
        })
            .then((response) => response.json())
            .then((data) => {
                const shiftPatternIdOption = data.map((option) => ({
                    value: option.Pattern_Code,
                    label: `${option.Pattern_Code} - ${option.Pattern_Name}`,
                }));
                setShiftPatternIdDropGrid(shiftPatternIdOption);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    useEffect(() => {
        const company_code = sessionStorage.getItem('selectedCompanyCode');
        fetch(`${config.apiBaseUrl}/ShiftMasterDropDown`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ company_code })
        })
            .then((response) => response.json())
            .then((data) => {
                const shiftOption = data.map((option) => ({
                    value: option.Shift_Code,
                    label: `${option.Shift_Code} - ${option.Shift_Name}`,
                }));
                setShiftIdDropGrid(shiftOption);
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    const handleFromDate = (e) => {
        const selectedDate = e.target.value;
        setFromDate(selectedDate);
    };

    const handleToDateChange = (e) => {
        const selectedDate = e.target.value;
        setToDate(selectedDate);
    };

    const filterOptionStatusSc = [{ value: 'All', label: 'All' }, ...statusDropSc.map((option) => ({
        value: option.attributedetails_name,
        label: option.attributedetails_name,
    }))];

    const handleChangeStatusSc = (SelectedStatusSc) => {
        setSelectedStatusSc(SelectedStatusSc);
        setStatusSc(SelectedStatusSc ? SelectedStatusSc.value : '');
    };

    const leaveColumnDefs = [
        {
            headerName: "Date",
            field: "effective_date",
            editable: false,
            cellStyle: { textAlign: "center" },
        },
        {
            headerName: "Current Shift Code",
            field: "HolidayName",
            editable: false,
            cellStyle: { textAlign: "center" },
        },
        {
            headerName: "Requested Shift Code",
            field: "LeaveFromDate",
            editable: false,
            cellStyle: { textAlign: "center" },
        },
        {
            headerName: "To Date",
            field: "LeaveToDate",
            editable: false,
            cellStyle: { textAlign: "center" },
        },
        {
            headerName: "Status",
            field: "Status",
            editable: false,
            cellStyle: { textAlign: "center" },
        },
    ];

    const defaultColDef = {
        resizable: true,
        wrapText: true,
    };

    const handleCompOffSearch = async () => {
        const from = new Date(holidayFromDate);
        const to = new Date(holidayToDate);

        if (from > to) {
            toast.warning("From Date should not be greater than To Date");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${config.apiBaseUrl}/compOffSearchCriteria`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    CompanyCode: sessionStorage.getItem('selectedCompanyCode'),
                    EmployeeId: sessionStorage.getItem('selectedUserCode'),
                    FromDate: holidayFromDate,
                    ToDate: holidayToDate,
                    Status: statusSc,
                    HolidayName: holidayName,
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

    const handleReloadSearch = () => {
        clearInputsSearch([])
        setLeaveRowData([])
    };

    const clearInputsSearch = () => {
        setHolidayFromDate('');
        setHolidayToDate('');
        setHolidayName('');
        setStatusSc('');
        setSelectedStatusSc('');
    };

    useEffect(() => {
        const today = new Date();

        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        };

        const from = formatDate(firstDay);
        const to = formatDate(lastDay);

        setFromDate(from);
        setToDate(to);

        handleEmpShiftReportSearch(from, to);

    }, []);

    const handleEmpShiftReportSearch = async (fromDate, toDate) => {
        try {
            const response = await fetch(`${config.apiBaseUrl}/getEmpShiftReport`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    From_Date: fromDate || ToDate,
                    To_Date: toDate || ToDate,
                    Employee_ID: sessionStorage.getItem('selectedUserCode'),
                    company_code: sessionStorage.getItem('selectedCompanyCode')
                }),
            });

            if (response.ok) {
                const searchData = await response.json();
                setEmpShiftRowData(searchData);
            } else if (response.status === 404) {
                setEmpShiftRowData([]);
                toast.warning("Data not found");
            } else {
                const errorResponse = await response.json();
                toast.warning(errorResponse.message || "Failed to fetch data");
                setEmpShiftRowData([]);
            }
        } catch (error) {
            console.error("Error fetching search data:", error);
            toast.error("Error fetching search data: " + error.message);
        }
    };

    const empShiftCols = [
        {
            headerName: "Date",
            field: "Date",
            minWidth: 130
        },
        {
            headerName: "Shift",
            field: "Shift_Code",
            minWidth: 130,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: shiftIdDropGrid.map(d => d.value),
            },
            valueFormatter: (params) => {
                const dept = shiftIdDropGrid.find(d => d.value === params.value);
                return dept ? dept.label : params.value;
            },
        },
        {
            headerName: "Employee ID",
            field: "Employee_ID",
            minWidth: 130,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: employeeIdDropGrid.map(d => d.value),
            },
            valueFormatter: (params) => {
                const dept = employeeIdDropGrid.find(d => d.value === params.value);
                return dept ? dept.label : params.value;
            },
        },
        {
            headerName: "Department",
            field: "dept_id",
            minWidth: 130,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: departmentDrop.map(d => d.value),
            },
            valueFormatter: (params) => {
                const dept = departmentDrop.find(d => d.value === params.value);
                return dept ? dept.label : params.value;
            },
        },
        {
            headerName: "Designation",
            field: "desgination_id",
            minWidth: 130
        },
        {
            headerName: "Shift Pattern",
            field: "Shift_Pattern_ID",
            minWidth: 130,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: shiftPatternIdDropGrid.map(d => d.value),
            },
            valueFormatter: (params) => {
                const dept = shiftPatternIdDropGrid.find(d => d.value === params.value);
                return dept ? dept.label : params.value;
            },
        },
        {
            headerName: "Start Time",
            field: "Start_Time",
            minWidth: 100
        },
        {
            headerName: "End Time",
            field: "End_Time",
            minWidth: 100
        },
        {
            headerName: "Action",
            field: "action",
            minWidth: 200,
            maxWidth: 200,
            cellClass: "d-flex align-items-center justify-content-center",
            cellRenderer: (params) => {
                const canRequest = params.data.Can_Request === 1;

                return (
                    <button
                        className={`shift-action-btn ${canRequest ? 'active-btn' : 'locked-btn'}`}
                        disabled={!canRequest}
                        title={`${canRequest ? "Request Shift Change" : "Locked"}`}
                        onClick={() => handleShiftRequest(params.data)}
                    >
                        <span className="btn-icon">
                            {canRequest ? (
                                <i className="bi bi-arrow-left-right"></i>
                            ) : (
                                <i className="bi bi-lock-fill"></i>
                            )}
                        </span>
                        <span className="btn-text">
                            {canRequest ? "Request Shift Change" : "Locked"}
                        </span>
                    </button>
                );
            }
        }
    ];

    const handleShiftRequest = (rowData) => {
        if (!rowData) return;
        setSelectedRow(rowData);
        setIsModalOpen(true);
    };

    return (
        <div className="container-fluid Topnav-screen">
            <ToastContainer position="top-right" className="toast-design" theme="colored" />
            <div className="shadow-lg p-1 bg-light rounded main-header-box">
                <div className="header-flex">
                    <h1 className="page-title">Shift Change Request</h1>
                    <div className="action-wrapper desktop-actions">
                        <div className="action-icon reload">
                            <span className="tooltip">Reload</span>
                            <i className="fa-solid fa-rotate-right"></i>
                        </div>
                    </div>
                </div>
            </div>
            {loading && <LoadingScreen />}
            <div className="shadow-lg p-3 bg-light rounded mt-2 container-form-box">
                <div className="row g-3">

                    <div className="col-md-2">
                        <div className="inputGroup">
                            <input
                                type="date"
                                className="exp-input-field form-control"
                                title="Please select the From Date"
                                value={FromDate}
                                onChange={handleFromDate}
                                placeholder=" "
                                autoComplete="off"
                            />
                            <label className={`exp-form-labels`}>
                                From Date
                            </label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div className="inputGroup">
                            <input
                                type="date"
                                className="exp-input-field form-control"
                                value={ToDate}
                                title="To Date will be same as From Date, Comp Off allows only single day"
                                onChange={handleToDateChange}
                                placeholder=" "
                                autoComplete="off"
                            />
                            <label className={`exp-form-labels`}>
                                To Date
                            </label>
                        </div>
                    </div>

                    <button
                        className="btn btn-sm btn-primary mt-2"
                        onClick={() => handleEmpShiftReportSearch()}
                        style={{ height: "30px", width: "40px" }}
                        title="Search"
                    >
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </button>

                    <div className="col-12 mt-2">
                        <div className="ag-theme-alpine" style={{ height: '350px', width: '100%' }}>
                            <AgGridReact
                                columnDefs={empShiftCols}
                                rowData={rempShiftRowData}
                                rowHeight={30}
                                pagination={true}
                                paginationAutoPageSize={true}
                            />
                            <ShiftRequestModal
                                isOpen={isModalOpen}
                                onClose={() => setIsModalOpen(false)}
                                rowData={selectedRow}
                                onSuccess={() => {
                                    handleEmpShiftReportSearch();
                                }}
                            />
                        </div>
                    </div>

                </div>
            </div>

            <div className="shadow-lg p-3 bg-light rounded mt-2 container-form-box">
                <h5>Search Criteria :</h5>

                <div className="row g-3">
                    <div className="col-md-2">
                        <div className="inputGroup">
                            <input
                                type="date"
                                className="exp-input-field form-control"
                                title="Please select the Holiday From Date"
                                value={holidayFromDate}
                                onChange={(e) => setHolidayFromDate(e.target.value)}
                                placeholder=" "
                                autoComplete="off"
                            />
                            <label className={`exp-form-labels`}>
                                From Date
                            </label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div className="inputGroup">
                            <input
                                type="date"
                                className="exp-input-field form-control"
                                title="Please select the Holiday To Date"
                                value={holidayToDate}
                                onChange={(e) => setHolidayToDate(e.target.value)}
                                placeholder=" "
                                autoComplete="off"
                            />
                            <label className={`exp-form-labels`}>
                                To Date
                            </label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div className="inputGroup">
                            <input
                                type="text"
                                className="exp-input-field form-control"
                                title="Please enter the Holiday Name"
                                value={holidayName}
                                onChange={(e) => setHolidayName(e.target.value)}
                                placeholder=" "
                                autoComplete="off"
                            />
                            <label className={`exp-form-labels`}>
                                Holiday Name
                            </label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div
                            className={`inputGroup selectGroup 
                            ${selectedStatusSc ? "has-value" : ""} 
                            ${isSelectedStatusSc ? "is-focused" : ""}`}
                            title="Please select the Leave Status"
                        >
                            <Select
                                id="Select_slots"
                                value={selectedStatusSc}
                                onChange={handleChangeStatusSc}
                                options={filterOptionStatusSc}
                                placeholder=" "
                                onFocus={() => setIsSelectedStatusSc(true)}
                                onBlur={() => setIsSelectedStatusSc(false)}
                                classNamePrefix="react-select"
                                isClearable
                            />
                            <label className="floating-label">Leave Status</label>
                        </div>
                    </div>

                    <div className="search-btn-wrapper">
                        <div className="icon-btn search" onClick={handleCompOffSearch}>
                            <span className="tooltip">Search</span>
                            <i className="fa-solid fa-magnifying-glass"></i>
                        </div>

                        <div className="icon-btn reload" onClick={handleReloadSearch}>
                            <span className="tooltip">Reload</span>
                            <i className="fa-solid fa-rotate-right"></i>
                        </div>
                    </div>

                    <div className="col-12 mt-2">
                        <div className="ag-theme-alpine" style={{ height: '350px', width: '100%' }}>
                            <AgGridReact
                                rowData={leaveRowData}
                                columnDefs={leaveColumnDefs}
                                defaultColDef={defaultColDef}
                                rowSelection="single"
                                ref={gridRef}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ShiftChangeRequest