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
    const [effectiveFromDate, setEffectiveFromDate] = useState("");
    const [effectiveToDate, setEffectiveToDate] = useState("");
    const [curShiftDropSc, setCurShiftDropSc] = useState([]);
    const [reqShiftDropSc, setReqShiftDropSc] = useState([]);
    const [empStatusDropSc, setEmpStatusDropSc] = useState([]);
    const [manStatusDropSc, setManStatusDropSc] = useState([]);
    const [curShiftSc, setCurShiftSc] = useState("");
    const [reqShiftSc, setReqShiftSc] = useState("");
    const [empStatusSc, setEmpStatusSc] = useState("");
    const [manStatusSc, setManStatusSc] = useState("");
    const [selectedCurShiftSc, setSelectedCurShiftSc] = useState("");
    const [selectedReqShiftSc, setSelectedReqShiftSc] = useState("");
    const [selectedEmpStatusSc, setSelectedEmpStatusSc] = useState("");
    const [selectedManStatusSc, setSelectedManStatusSc] = useState("");
    const [isSelectedCurShiftSc, setIsSelectedCurShiftSc] = useState(false);
    const [isSelectedReqShiftSc, setIsSelectedReqShiftSc] = useState(false);
    const [isSelectedEmpStatusSc, setIsSelectedEmpStatusSc] = useState(false);
    const [isSelectedManStatusSc, setIsSelectedManStatusSc] = useState(false);
    const gridRef = useRef()

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [rempShiftRowData, setEmpShiftRowData] = useState([]);

    const [employeeIdDropGrid, setEmployeeIdDropGrid] = useState([]);
    const [shiftIdDropGrid, setShiftIdDropGrid] = useState([]);
    const [departmentDrop, setDepartmentDrop] = useState([]);
    const [shiftPatternIdDropGrid, setShiftPatternIdDropGrid] = useState([]);

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
            body: JSON.stringify({ Company_Code, Location_Code }),
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
            body: JSON.stringify({ company_code, Location_Code })
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

    useEffect(() => {
        const company_code = sessionStorage.getItem("selectedCompanyCode");

        fetch(`${config.apiBaseUrl}/ShiftMasterDropDown`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ company_code, Location_Code }),
        })
            .then((data) => data.json())
            .then((val) => setCurShiftDropSc(val))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    useEffect(() => {
        const company_code = sessionStorage.getItem("selectedCompanyCode");

        fetch(`${config.apiBaseUrl}/ShiftMasterDropDown`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ company_code, Location_Code }),
        })
            .then((data) => data.json())
            .then((val) => setReqShiftDropSc(val))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    useEffect(() => {
        fetch(`${config.apiBaseUrl}/getLeaveStatus`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                company_code: sessionStorage.getItem("selectedCompanyCode"),
            }),
        })
            .then((data) => data.json())
            .then((val) => setEmpStatusDropSc(val))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    useEffect(() => {
        fetch(`${config.apiBaseUrl}/getLeaveStatus`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                company_code: sessionStorage.getItem("selectedCompanyCode"),
            }),
        })
            .then((data) => data.json())
            .then((val) => setManStatusDropSc(val))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    const filteredOptionCurrentShift = [{ value: 'All', label: 'All' }, ...curShiftDropSc.map((option) => ({
        value: option.Shift_Code,
        label: `${option.Shift_Code} - ${option.Shift_Name}`,
    }))];

    const filteredOptionRequestShift = [{ value: 'All', label: 'All' }, ...reqShiftDropSc.map((option) => ({
        value: option.Shift_Code,
        label: `${option.Shift_Code} - ${option.Shift_Name}`,
    }))];

    const filterOptionEmployeeStatus = [{ value: 'All', label: 'All' }, ...empStatusDropSc.map((option) => ({
        value: option.attributedetails_name,
        label: option.attributedetails_name,
    }))];

    const filterOptionManagerStatus = [{ value: 'All', label: 'All' }, ...manStatusDropSc.map((option) => ({
        value: option.attributedetails_name,
        label: option.attributedetails_name,
    }))];

    const handleChangeCurShiftSc = (selectedCurShiftSc) => {
        setSelectedCurShiftSc(selectedCurShiftSc);
        setCurShiftSc(selectedCurShiftSc ? selectedCurShiftSc.value : '');
    };

    const handleChangeReqShiftSc = (SelectedReqShiftSc) => {
        setSelectedReqShiftSc(SelectedReqShiftSc);
        setReqShiftSc(SelectedReqShiftSc ? SelectedReqShiftSc.value : '');
    };

    const handleChangeEmpStatusSc = (selectedEmpStatusSc) => {
        setSelectedEmpStatusSc(selectedEmpStatusSc);
        setEmpStatusSc(selectedEmpStatusSc ? selectedEmpStatusSc.value : '');
    };

    const handleChangeManStatusSc = (selectedManStatusSc) => {
        setSelectedManStatusSc(selectedManStatusSc);
        setManStatusSc(selectedManStatusSc ? selectedManStatusSc.value : '');
    };

    const leaveColumnDefs = [
        {
          headerName: "S.No",
          field: "S.No",
          valueGetter: (params) => params.node.rowIndex + 1,
          width: 80,
        },
        {
            headerName: "Date",
            field: "effective_date",
            editable: false,
        },
        {
            headerName: "Current Shift Code",
            field: "current_shift_id",
            editable: false,
            cellEditorParams: {
                values: shiftIdDropGrid.map(d => d.value),
            },
            valueFormatter: (params) => {
                const dept = shiftIdDropGrid.find(d => d.value === params.value);
                return dept ? dept.label : params.value;
            },
        },
        {
            headerName: "Requested Shift Code",
            field: "requested_shift_id",
            editable: false,
            cellEditorParams: {
                values: shiftIdDropGrid.map(d => d.value),
            },
            valueFormatter: (params) => {
                const dept = shiftIdDropGrid.find(d => d.value === params.value);
                return dept ? dept.label : params.value;
            },
        },
        {
            headerName: "Swap Employe ID",
            field: "swap_employee_id",
            editable: false,
            cellEditorParams: {
                values: employeeIdDropGrid.map(d => d.value),
            },
            valueFormatter: (params) => {
                const dept = employeeIdDropGrid.find(d => d.value === params.value);
                return dept ? dept.label : params.value;
            },
        },
        {
            headerName: "Employee Approval Status",
            field: "is_swap_request",
            editable: false,
        },
        {
            headerName: "Priority",
            field: "priority",
            editable: false,
        },
        {
            headerName: "Reporting Manager",
            field: "RepManager",
            editable: false,
        },
        {
            headerName: "Manager Approval Status",
            field: "request_status",
            editable: false,
        },
    ];

    const defaultColDef = {
        resizable: true,
    };

  const onFirstDataRendered = (params) => {
  const allColumnIds = params.columnApi
    .getColumns()
    .map((col) => col.getId());

  params.columnApi.autoSizeColumns(allColumnIds);
};

    const handleShiftRequestSearch = async () => {
        const from = new Date(effectiveFromDate);
        const to = new Date(effectiveToDate);

        if (from > to) {
            toast.warning("From Date should not be greater than To Date");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${config.apiBaseUrl}/shiftChangeRequestSearch`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    company_code: sessionStorage.getItem('selectedCompanyCode'),
                    Location_Code: sessionStorage.getItem('selectedLocationCode'),
                    employee_id: sessionStorage.getItem('selectedUserCode'),
                    shift_from_date: effectiveFromDate ? effectiveFromDate : null,
                    shift_to_date: effectiveToDate ? effectiveToDate : null,
                    current_shift_id: setCurShiftSc,
                    requested_shift_id: setReqShiftSc,
                    is_swap_request: empStatusSc,
                    request_status: manStatusSc,
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
        setEffectiveFromDate('');
        setEffectiveToDate('');
        setCurShiftSc('');
        setReqShiftSc('');
        setEmpStatusSc('');
        setManStatusSc('');
        setSelectedCurShiftSc('');
        setSelectedReqShiftSc('');
        setSelectedEmpStatusSc('');
        setSelectedManStatusSc('');
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
                    From_Date: fromDate || FromDate,
                    To_Date: toDate || ToDate,
                    Employee_ID: sessionStorage.getItem('selectedUserCode'),
                    company_code: sessionStorage.getItem('selectedCompanyCode'),
                    Location_Code
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
          headerName: "S.No",
          field: "S.No",
          valueGetter: (params) => params.node.rowIndex + 1,
          width: 80,
        },
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

    const reloadGridData = () => {
   window.location.reload();
};

    return (
        <div className="container-fluid Topnav-screen">
            <ToastContainer position="top-right" className="toast-design" theme="colored" />
            <div className="shadow-lg p-1 bg-light rounded main-header-box">
                <div className="header-flex">
                    <h1 className="page-title">Shift Change Request</h1>
                    <div className="action-wrapper desktop-actions">
                        <div className="icon-btn reload"  >
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
                                onFirstDataRendered={onFirstDataRendered}
                            />
                            <ShiftRequestModal
                                isOpen={isModalOpen}
                                onClose={() => setIsModalOpen(false)}
                                rowData={selectedRow}
                                screenType="Employee"
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
                                value={effectiveFromDate}
                                onChange={(e) => setEffectiveFromDate(e.target.value)}
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
                                value={effectiveToDate}
                                onChange={(e) => setEffectiveToDate(e.target.value)}
                                placeholder=" "
                                autoComplete="off"
                            />
                            <label className={`exp-form-labels`}>
                                To Date
                            </label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div
                            className={`inputGroup selectGroup 
                            ${selectedCurShiftSc ? "has-value" : ""} 
                            ${isSelectedCurShiftSc ? "is-focused" : ""}`}
                            title="Please select the Current Shift Code"
                        >
                            <Select
                                id="Select_slots"
                                value={selectedCurShiftSc}
                                placeholder=" "
                                options={filteredOptionCurrentShift}
                                onChange={handleChangeCurShiftSc}
                                onFocus={() => setIsSelectedCurShiftSc(true)}
                                onBlur={() => setIsSelectedCurShiftSc(false)}
                                classNamePrefix="react-select"
                                isClearable
                            />
                            <label className="floating-label">Current Shift Code</label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div
                            className={`inputGroup selectGroup 
                            ${selectedReqShiftSc ? "has-value" : ""} 
                            ${isSelectedReqShiftSc ? "is-focused" : ""}`}
                            title="Please select the Request Shift Code"
                        >
                            <Select
                                id="Select_slots"
                                value={selectedReqShiftSc}
                                placeholder=" "
                                options={filteredOptionRequestShift}
                                onChange={handleChangeReqShiftSc}
                                onFocus={() => setIsSelectedReqShiftSc(true)}
                                onBlur={() => setIsSelectedReqShiftSc(false)}
                                classNamePrefix="react-select"
                                isClearable
                            />
                            <label className="floating-label">Request Shift Code</label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div
                            className={`inputGroup selectGroup 
                            ${selectedEmpStatusSc ? "has-value" : ""} 
                            ${isSelectedEmpStatusSc ? "is-focused" : ""}`}
                            title="Please select the Employee Approval Status"
                        >
                            <Select
                                id="Select_slots"
                                value={selectedEmpStatusSc}
                                placeholder=" "
                                options={filterOptionEmployeeStatus}
                                onChange={handleChangeEmpStatusSc}
                                onFocus={() => setIsSelectedEmpStatusSc(true)}
                                onBlur={() => setIsSelectedEmpStatusSc(false)}
                                classNamePrefix="react-select"
                                isClearable
                            />
                            <label className="floating-label">Employee Approval Status</label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div
                            className={`inputGroup selectGroup 
                            ${selectedManStatusSc ? "has-value" : ""} 
                            ${isSelectedManStatusSc ? "is-focused" : ""}`}
                            title="Please select the Manager Approval Status"
                        >
                            <Select
                                id="Select_slots"
                                value={selectedManStatusSc}
                                placeholder=" "
                                options={filterOptionManagerStatus}
                                onChange={handleChangeManStatusSc}
                                onFocus={() => setIsSelectedManStatusSc(true)}
                                onBlur={() => setIsSelectedManStatusSc(false)}
                                classNamePrefix="react-select"
                                isClearable
                            />
                            <label className="floating-label">Manager Approval Status</label>
                        </div>
                    </div>

                    <div className="search-btn-wrapper">
                        <div className="icon-btn search" onClick={handleShiftRequestSearch}>
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
                                onFirstDataRendered={onFirstDataRendered}
                                rowSelection="single"
                                ref={gridRef}
                                pagination={true}
                                paginationAutoPageSize={true}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ShiftChangeRequest